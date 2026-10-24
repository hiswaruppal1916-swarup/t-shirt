import React, { useState } from 'react';
import { ShieldCheck, ArrowLeft, AlertCircle, CreditCard, Banknote, RefreshCw } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import { paymentProvider } from '../services/paymentService';
import { submitOrderToQikinkSandbox } from '../services/qikinkService';
import { Order, OrderItem, ShippingAddress } from '../types';

interface CheckoutPageProps {
  onNavigate: (view: string, param?: string) => void;
  onOrderSuccess: (order: Order) => void;
}

const INDIAN_STATES = [
  'Andhra Pradesh', 'Assam', 'Bihar', 'Delhi', 'Goa', 'Gujarat', 'Haryana',
  'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Punjab', 'Rajasthan',
  'Tamil Nadu', 'Telangana', 'Uttar Pradesh', 'West Bengal'
];

export const CheckoutPage: React.FC<CheckoutPageProps> = ({ onNavigate, onOrderSuccess }) => {
  const { items, subtotal, clearCart } = useCart();
  const { user, customerProfile } = useAuth();

  // Form State
  const [formData, setFormData] = useState({
    firstName: customerProfile?.name?.split(' ')[0] || '',
    lastName: customerProfile?.name?.split(' ').slice(1).join(' ') || '',
    email: customerProfile?.email || user?.email || '',
    phone: customerProfile?.phone || '',
    addressLine1: '',
    addressLine2: '',
    city: 'Mumbai',
    state: 'Maharashtra',
    postalCode: '400001',
    country: 'India'
  });

  const [paymentMethod, setPaymentMethod] = useState<'PREPAID' | 'COD'>('PREPAID');
  const [testOutcome, setTestOutcome] = useState<'SUCCESS' | 'FAILURE' | 'CANCELLED'>('SUCCESS');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  if (items.length === 0) {
    return (
      <div className="container" style={{ padding: '6rem 1rem', textAlign: 'center' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700 }}>Your Bag is Empty</h2>
        <button onClick={() => onNavigate('shop')} className="btn-primary" style={{ marginTop: '1.5rem' }}>
          Browse Catalog
        </button>
      </div>
    );
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errorMessage) setErrorMessage('');
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    // Basic Validation
    if (!formData.firstName.trim()) {
      setErrorMessage('Please enter your first name.');
      return;
    }
    if (!formData.email.trim() || !formData.email.includes('@')) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }
    const cleanPhone = formData.phone.replace(/\D/g, '');
    if (cleanPhone.length < 10) {
      setErrorMessage('Please enter a valid 10-digit mobile phone number for courier updates.');
      return;
    }
    if (!formData.addressLine1.trim()) {
      setErrorMessage('Please enter your street address.');
      return;
    }
    if (!formData.city.trim() || !formData.postalCode.trim()) {
      setErrorMessage('Please provide complete city and postal code.');
      return;
    }

    setIsSubmitting(true);

    try {
      // 1. Generate unique local public order number
      const orderNumber = `ORD-${Date.now().toString().slice(-6)}-${Math.floor(100 + Math.random() * 900)}`;

      // 2. Process payment through Test Payment Provider abstraction
      const paymentResult = await paymentProvider.processPayment({
        orderNumber,
        amount: subtotal,
        currency: 'INR',
        customerEmail: formData.email,
        customerName: `${formData.firstName} ${formData.lastName}`.trim(),
        customerPhone: cleanPhone,
        method: paymentMethod === 'COD' ? 'COD' : 'CARD',
        simulateOutcome: testOutcome
      });

      if (!paymentResult.success) {
        throw new Error(paymentResult.message || 'Payment processing failed. Please retry.');
      }

      const shippingAddress: ShippingAddress = {
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        addressLine1: formData.addressLine1.trim(),
        addressLine2: formData.addressLine2.trim(),
        city: formData.city.trim(),
        state: formData.state,
        postalCode: formData.postalCode.trim(),
        country: 'India',
        phone: cleanPhone,
        email: formData.email.trim()
      };

      // 3. Prepare Order Object
      const newOrder: Order = {
        id: crypto.randomUUID(),
        order_number: orderNumber,
        customer_id: customerProfile?.id,
        auth_user_id: user?.id,
        customer_name: `${formData.firstName} ${formData.lastName}`.trim(),
        customer_email: formData.email.trim(),
        customer_phone: cleanPhone,
        shipping_address: shippingAddress,
        payment_method: paymentMethod,
        payment_status: paymentMethod === 'COD' ? 'PAYMENT_PENDING' : 'PAYMENT_SUCCESS',
        internal_status: 'PAYMENT_SUCCESS',
        subtotal: subtotal,
        shipping_amount: 0,
        discount_amount: 0,
        total_amount: subtotal,
        created_at: new Date().toISOString()
      };

      const orderItems: OrderItem[] = items.map((i) => ({
        product_id: i.productId,
        variant_id: i.variantId,
        qikink_sku: i.qikinkSku,
        product_name: i.productName,
        variant_name: i.variantName,
        size: i.size,
        color: i.color,
        quantity: i.quantity,
        unit_price: i.unitPrice
      }));

      // 4. Save Order and Items to Supabase
      const { error: orderError } = await supabase.from('orders').insert({
        id: newOrder.id,
        order_number: newOrder.order_number,
        customer_id: newOrder.customer_id,
        auth_user_id: newOrder.auth_user_id,
        customer_name: newOrder.customer_name,
        customer_email: newOrder.customer_email,
        customer_phone: newOrder.customer_phone,
        shipping_address: newOrder.shipping_address,
        payment_method: newOrder.payment_method,
        payment_status: newOrder.payment_status,
        internal_status: newOrder.internal_status,
        subtotal: newOrder.subtotal,
        shipping_amount: newOrder.shipping_amount,
        discount_amount: newOrder.discount_amount,
        total_amount: newOrder.total_amount
      });

      if (orderError) {
        console.error('Supabase order insert notice:', orderError);
      }

      // Insert order items with UUID validation
      const isUuid = (str?: string) =>
        Boolean(str && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(str));

      await supabase.from('order_items').insert(
        orderItems.map((item) => ({
          order_id: newOrder.id,
          product_id: isUuid(item.product_id) ? item.product_id : null,
          variant_id: isUuid(item.variant_id) ? item.variant_id : null,
          qikink_sku: item.qikink_sku,
          product_name: item.product_name,
          variant_name: item.variant_name,
          size: item.size,
          color: item.color,
          quantity: item.quantity,
          unit_price: item.unit_price
        }))
      );

      // 5. Submit to Qikink Sandbox Fulfillment
      const qikinkResponse = await submitOrderToQikinkSandbox(newOrder, orderItems);

      if (qikinkResponse.status && qikinkResponse.order_id) {
        newOrder.qikink_order_id = qikinkResponse.order_id;
        newOrder.qikink_status = 'Live';
        newOrder.awb_number = qikinkResponse.tracking_number;
        newOrder.courier_name = qikinkResponse.courier_name;
        newOrder.tracking_link = qikinkResponse.tracking_link;
        newOrder.internal_status = 'QIKINK_CONFIRMED';

        // Update Supabase with Qikink fulfillment data
        await supabase
          .from('orders')
          .update({
            qikink_order_id: qikinkResponse.order_id,
            qikink_order_number: orderNumber,
            qikink_status: 'Live',
            internal_status: 'QIKINK_CONFIRMED',
            awb_number: qikinkResponse.tracking_number,
            courier_name: qikinkResponse.courier_name,
            tracking_link: qikinkResponse.tracking_link,
            last_sync_at: new Date().toISOString()
          })
          .eq('id', newOrder.id);
      } else {
        newOrder.internal_status = 'QIKINK_SYNC_ERROR';
        newOrder.error_message = qikinkResponse.error || 'Qikink fulfillment queued for manual processing';
      }

      // 6. Record Payment record in Supabase
      await supabase.from('payments').insert({
        order_id: newOrder.id,
        provider: 'TEST_GATEWAY',
        provider_order_id: paymentResult.providerOrderId,
        provider_payment_id: paymentResult.providerPaymentId,
        amount: subtotal,
        currency: 'INR',
        status: paymentResult.success ? 'SUCCESS' : 'FAILED'
      });

      newOrder.items = orderItems;

      // 7. Clear shopping bag and trigger success
      clearCart();
      onOrderSuccess(newOrder);
      onNavigate('order-confirmation');
    } catch (err: any) {
      setErrorMessage(err.message || 'An error occurred while creating your order.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container" style={{ paddingTop: '2rem', paddingBottom: '6rem' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <button
          onClick={() => onNavigate('cart')}
          style={{ display: 'inline-flex', alignItems: 'center', gap: '0.375rem', fontSize: '0.8125rem', fontWeight: 600, color: '#4B5563' }}
        >
          <ArrowLeft size={16} />
          <span>Return to Shopping Bag</span>
        </button>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.875rem', fontWeight: 800, color: '#111827', letterSpacing: '-0.02em' }}>
          Secure Checkout
        </h1>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.375rem', padding: '0.25rem 0.625rem', backgroundColor: '#F3F4F6', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 600, color: '#4B5563' }}>
          <ShieldCheck size={14} />
          <span>256-bit Encrypted</span>
        </div>
      </div>

      <form onSubmit={handlePlaceOrder}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))', gap: 'clamp(1.5rem, 3vw, 2.5rem)', alignItems: 'start' }}>
          {/* Left Column: Customer & Shipping Details */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', minWidth: 0 }}>
            {/* Customer Contact */}
            <div style={{ backgroundColor: '#FFFFFF', padding: 'clamp(1rem, 3vw, 1.5rem)', borderRadius: '1rem', border: '1px solid #E5E7EB' }}>
              <h2 style={{ fontSize: '1.125rem', fontWeight: 700, color: '#111827', marginBottom: '1rem' }}>
                1. Customer & Courier Contact
              </h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 180px), 1fr))', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, marginBottom: '0.375rem' }}>
                    First Name <span style={{ color: '#EF4444' }}>*</span>
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    placeholder="Swarup"
                    autoComplete="given-name"
                    required
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, marginBottom: '0.375rem' }}>
                    Last Name
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    placeholder="Pal"
                    autoComplete="family-name"
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, marginBottom: '0.375rem' }}>
                    Email Address <span style={{ color: '#EF4444' }}>*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="swarup@example.com"
                    autoComplete="email"
                    required
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, marginBottom: '0.375rem' }}>
                    Mobile Phone (For Qikink Courier) <span style={{ color: '#EF4444' }}>*</span>
                  </label>
                  <input
                    type="tel"
                    inputMode="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="+91 98765 43210"
                    autoComplete="tel"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Delivery Address */}
            <div style={{ backgroundColor: '#FFFFFF', padding: '1.5rem', borderRadius: '1rem', border: '1px solid #E5E7EB' }}>
              <h2 style={{ fontSize: '1.125rem', fontWeight: 700, color: '#111827', marginBottom: '1rem' }}>
                2. Shipping Address
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, marginBottom: '0.375rem' }}>
                    House / Flat No., Building & Street <span style={{ color: '#EF4444' }}>*</span>
                  </label>
                  <input
                    type="text"
                    name="addressLine1"
                    value={formData.addressLine1}
                    onChange={handleInputChange}
                    placeholder="Flat 402, Highline Residency, Bandra West"
                    required
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, marginBottom: '0.375rem' }}>
                    Apartment / Landmark (Optional)
                  </label>
                  <input
                    type="text"
                    name="addressLine2"
                    value={formData.addressLine2}
                    onChange={handleInputChange}
                    placeholder="Near St. Andrew Church"
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 140px), 1fr))', gap: '0.875rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, marginBottom: '0.375rem' }}>
                      City <span style={{ color: '#EF4444' }}>*</span>
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      placeholder="Mumbai"
                      autoComplete="address-level2"
                      required
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, marginBottom: '0.375rem' }}>
                      State <span style={{ color: '#EF4444' }}>*</span>
                    </label>
                    <select
                      name="state"
                      value={formData.state}
                      onChange={handleInputChange}
                      autoComplete="address-level1"
                      required
                    >
                      {INDIAN_STATES.map((st) => (
                        <option key={st} value={st}>
                          {st}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, marginBottom: '0.375rem' }}>
                      PIN Code <span style={{ color: '#EF4444' }}>*</span>
                    </label>
                    <input
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      name="postalCode"
                      value={formData.postalCode}
                      onChange={handleInputChange}
                      placeholder="400050"
                      maxLength={6}
                      autoComplete="postal-code"
                      required
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Method Selection */}
            <div style={{ backgroundColor: '#FFFFFF', padding: 'clamp(1rem, 3vw, 1.5rem)', borderRadius: '1rem', border: '1px solid #E5E7EB' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                <h2 style={{ fontSize: '1.125rem', fontWeight: 700, color: '#111827' }}>
                  3. Payment Method
                </h2>
                <span style={{ fontSize: '0.6875rem', fontWeight: 700, padding: '0.25rem 0.5rem', backgroundColor: '#FEF3C7', color: '#92400E', borderRadius: '9999px' }}>
                  Test Gateway Mode
                </span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 180px), 1fr))', gap: '0.75rem', marginBottom: '1.25rem' }}>
                <label
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    padding: '1rem',
                    borderRadius: '0.75rem',
                    border: paymentMethod === 'PREPAID' ? '2px solid #111827' : '1px solid #E5E7EB',
                    backgroundColor: paymentMethod === 'PREPAID' ? '#F9FAFB' : '#FFFFFF',
                    cursor: 'pointer'
                  }}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    checked={paymentMethod === 'PREPAID'}
                    onChange={() => setPaymentMethod('PREPAID')}
                    style={{ width: '18px', height: '18px', accentColor: '#111827' }}
                  />
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', fontWeight: 700, fontSize: '0.875rem' }}>
                      <CreditCard size={16} />
                      <span>Prepaid (Test UPI / Card)</span>
                    </div>
                    <span style={{ fontSize: '0.75rem', color: '#6B7280' }}>
                      Simulated Instant Payment
                    </span>
                  </div>
                </label>

                <label
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    padding: '1rem',
                    borderRadius: '0.75rem',
                    border: paymentMethod === 'COD' ? '2px solid #111827' : '1px solid #E5E7EB',
                    backgroundColor: paymentMethod === 'COD' ? '#F9FAFB' : '#FFFFFF',
                    cursor: 'pointer'
                  }}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    checked={paymentMethod === 'COD'}
                    onChange={() => setPaymentMethod('COD')}
                    style={{ width: '18px', height: '18px', accentColor: '#111827' }}
                  />
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', fontWeight: 700, fontSize: '0.875rem' }}>
                      <Banknote size={16} />
                      <span>Cash on Delivery (COD)</span>
                    </div>
                    <span style={{ fontSize: '0.75rem', color: '#6B7280' }}>
                      Pay ₹{subtotal} on delivery
                    </span>
                  </div>
                </label>
              </div>

              {/* Developer Test Simulator Controls */}
              {paymentMethod === 'PREPAID' && (
                <div style={{ padding: '0.875rem', backgroundColor: '#F3F4F6', borderRadius: '0.75rem', fontSize: '0.8125rem' }}>
                  <span style={{ fontWeight: 700, display: 'block', marginBottom: '0.375rem', color: '#374151' }}>
                    Developer Gateway Simulation Switcher:
                  </span>
                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    <button
                      type="button"
                      onClick={() => setTestOutcome('SUCCESS')}
                      className={`filter-chip ${testOutcome === 'SUCCESS' ? 'active' : ''}`}
                      style={{ fontSize: '0.75rem', minHeight: '30px', padding: '0.25rem 0.625rem' }}
                    >
                      ✓ Simulate Success
                    </button>
                    <button
                      type="button"
                      onClick={() => setTestOutcome('FAILURE')}
                      className={`filter-chip ${testOutcome === 'FAILURE' ? 'active' : ''}`}
                      style={{ fontSize: '0.75rem', minHeight: '30px', padding: '0.25rem 0.625rem' }}
                    >
                      ✕ Simulate Bank Decline
                    </button>
                    <button
                      type="button"
                      onClick={() => setTestOutcome('CANCELLED')}
                      className={`filter-chip ${testOutcome === 'CANCELLED' ? 'active' : ''}`}
                      style={{ fontSize: '0.75rem', minHeight: '30px', padding: '0.25rem 0.625rem' }}
                    >
                      ⊘ Simulate Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Order Review & Submit */}
          <div
            style={{
              backgroundColor: '#F9FAFB',
              borderRadius: '1.25rem',
              border: '1px solid #E5E7EB',
              padding: '1.75rem',
              position: 'sticky',
              top: '5.5rem'
            }}
          >
            <h2 style={{ fontSize: '1.125rem', fontWeight: 800, color: '#111827', marginBottom: '1.25rem' }}>
              Items in Order ({items.length})
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem', maxHeight: '240px', overflowY: 'auto', marginBottom: '1.25rem', paddingRight: '0.25rem' }}>
              {items.map((item) => (
                <div key={item.variantId} style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                  <img
                    src={item.imageUrl}
                    alt=""
                    style={{ width: '48px', height: '58px', objectFit: 'cover', borderRadius: '0.5rem', backgroundColor: '#FFFFFF' }}
                  />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#111827', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {item.productName}
                    </p>
                    <p style={{ fontSize: '0.75rem', color: '#6B7280' }}>
                      {item.size} • {item.color} • Qty: {item.quantity}
                    </p>
                  </div>
                  <span style={{ fontSize: '0.875rem', fontWeight: 700, color: '#111827' }}>
                    ₹{item.unitPrice * item.quantity}
                  </span>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem', fontSize: '0.875rem', borderTop: '1px solid #E5E7EB', paddingTop: '1rem', borderBottom: '1px solid #E5E7EB', paddingBottom: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#4B5563' }}>
                <span>Subtotal</span>
                <span style={{ fontWeight: 600, color: '#111827' }}>₹{subtotal}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#4B5563' }}>
                <span>Fulfillment (Qikink Express)</span>
                <span style={{ fontWeight: 700, color: '#10B981' }}>FREE</span>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', margin: '1.25rem 0' }}>
              <span style={{ fontSize: '1rem', fontWeight: 700, color: '#111827' }}>Final Amount</span>
              <span style={{ fontSize: '1.75rem', fontWeight: 800, color: '#111827' }}>₹{subtotal}</span>
            </div>

            {errorMessage && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.75rem 1rem',
                  backgroundColor: '#FEF2F2',
                  border: '1px solid #FCA5A5',
                  borderRadius: '0.5rem',
                  color: '#B91C1C',
                  fontSize: '0.8125rem',
                  marginBottom: '1rem'
                }}
              >
                <AlertCircle size={16} flex-shrink="0" />
                <span>{errorMessage}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary"
              style={{ width: '100%', minHeight: '52px', fontSize: '1rem' }}
            >
              {isSubmitting ? (
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <RefreshCw size={18} className="animate-spin" />
                  <span>Processing Order & Qikink Sandbox...</span>
                </span>
              ) : (
                <span>Place Order (₹{subtotal})</span>
              )}
            </button>

            <p style={{ fontSize: '0.75rem', color: '#9CA3AF', textAlign: 'center', marginTop: '0.75rem' }}>
              Your order is validated on the backend and forwarded to Qikink Sandbox.
            </p>
          </div>
        </div>
      </form>
    </div>
  );
};
