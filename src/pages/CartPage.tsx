import React from 'react';
import { Trash2, ArrowRight, ShoppingBag, ShieldCheck } from 'lucide-react';
import { useCart } from '../context/CartContext';

interface CartPageProps {
  onNavigate: (view: string) => void;
}

export const CartPage: React.FC<CartPageProps> = ({ onNavigate }) => {
  const { items, updateQuantity, removeFromCart, subtotal, itemCount } = useCart();

  if (items.length === 0) {
    return (
      <div className="container" style={{ padding: '6rem 1rem', textAlign: 'center' }}>
        <div
          style={{
            width: '64px',
            height: '64px',
            borderRadius: '9999px',
            backgroundColor: '#F3F4F6',
            border: '1px solid #E5E7EB',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#6B7280',
            marginBottom: '1.25rem'
          }}
        >
          <ShoppingBag size={28} />
        </div>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#111827' }}>
          Your Bag is Empty
        </h2>
        <p style={{ fontSize: '0.875rem', color: '#6B7280', marginTop: '0.5rem', maxWidth: '360px', margin: '0.5rem auto 1.5rem' }}>
          Explore our latest heavyweight custom drops printed on-demand with zero minimums.
        </p>
        <button onClick={() => onNavigate('shop')} className="btn-primary" style={{ padding: '0.875rem 2rem' }}>
          <span>Browse All T-Shirts</span>
          <ArrowRight size={18} />
        </button>
      </div>
    );
  }

  return (
    <div className="container" style={{ paddingTop: '2rem', paddingBottom: '6rem' }}>
      <h1 style={{ fontSize: '1.875rem', fontWeight: 800, color: '#111827', letterSpacing: '-0.02em', marginBottom: '0.5rem' }}>
        Shopping Bag ({itemCount} {itemCount === 1 ? 'item' : 'items'})
      </h1>
      <p style={{ fontSize: '0.875rem', color: '#6B7280', marginBottom: '2rem' }}>
        Review your selected sizes and print placements before continuing to checkout.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))', gap: '2rem', alignItems: 'start' }}>
        {/* Cart Items List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {items.map((item) => (
            <div
              key={item.variantId}
              style={{
                display: 'flex',
                gap: 'clamp(0.75rem, 3vw, 1.25rem)',
                padding: 'clamp(0.875rem, 2vw, 1.25rem)',
                backgroundColor: '#FFFFFF',
                borderRadius: '1rem',
                border: '1px solid #E5E7EB',
                boxShadow: '0 1px 3px rgba(0,0,0,0.03)'
              }}
            >
              {/* Product Thumbnail */}
              <div
                style={{
                  width: 'clamp(72px, 18vw, 90px)',
                  height: 'clamp(88px, 22vw, 110px)',
                  borderRadius: '0.75rem',
                  overflow: 'hidden',
                  backgroundColor: '#F9FAFB',
                  border: '1px solid #F3F4F6',
                  flexShrink: 0
                }}
              >
                <img
                  src={item.imageUrl}
                  alt={item.productName}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>

              {/* Item Info & Actions */}
              <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', flex: 1, minWidth: 0 }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.5rem' }}>
                    <h3 style={{ fontSize: 'clamp(0.875rem, 1vw + 0.5rem, 1rem)', fontWeight: 700, color: '#111827', lineHeight: '1.3' }}>
                      {item.productName}
                    </h3>
                    <button
                      onClick={() => removeFromCart(item.variantId)}
                      title="Remove item"
                      style={{ color: '#9CA3AF', width: '44px', height: '44px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}
                      aria-label="Remove item from bag"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>

                  <div style={{ display: 'flex', gap: '0.375rem', marginTop: '0.375rem', flexWrap: 'wrap' }}>
                    <span style={{ fontSize: '0.75rem', padding: '0.125rem 0.5rem', backgroundColor: '#F3F4F6', borderRadius: '0.25rem', color: '#4B5563', fontWeight: 600 }}>
                      Size: {item.size}
                    </span>
                    <span style={{ fontSize: '0.75rem', padding: '0.125rem 0.5rem', backgroundColor: '#F3F4F6', borderRadius: '0.25rem', color: '#4B5563', fontWeight: 600 }}>
                      Color: {item.color}
                    </span>
                  </div>

                  <div style={{ fontSize: '0.6875rem', color: '#9CA3AF', marginTop: '0.25rem' }}>
                    SKU: <code>{item.qikinkSku}</code>
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.875rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                  {/* Quantity Stepper */}
                  <div style={{ display: 'inline-flex', alignItems: 'center', border: '1px solid #E5E7EB', borderRadius: '9999px', backgroundColor: '#F9FAFB' }}>
                    <button
                      onClick={() => updateQuantity(item.variantId, item.quantity - 1)}
                      style={{ width: '44px', height: '44px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '1.125rem' }}
                      aria-label="Decrease quantity"
                    >
                      -
                    </button>
                    <span style={{ minWidth: '32px', textAlign: 'center', fontSize: '0.875rem', fontWeight: 700 }}>
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.variantId, item.quantity + 1)}
                      style={{ width: '44px', height: '44px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '1.125rem' }}
                      aria-label="Increase quantity"
                    >
                      +
                    </button>
                  </div>

                  <span style={{ fontSize: '1.125rem', fontWeight: 800, color: '#111827' }}>
                    ₹{item.unitPrice * item.quantity}
                  </span>
                </div>
              </div>
            </div>
          ))}

          <button
            onClick={() => onNavigate('shop')}
            style={{
              alignSelf: 'flex-start',
              fontSize: '0.875rem',
              fontWeight: 600,
              color: '#4B5563',
              padding: '0.5rem 0',
              marginTop: '0.5rem'
            }}
          >
            ← Continue Shopping
          </button>
        </div>

        {/* Order Summary Box */}
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
            Order Summary
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.875rem', paddingBottom: '1.25rem', borderBottom: '1px solid #E5E7EB' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#4B5563' }}>
              <span>Items Subtotal</span>
              <span style={{ fontWeight: 600, color: '#111827' }}>₹{subtotal}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#4B5563' }}>
              <span>Estimated Shipping (Qikink Courier)</span>
              <span style={{ fontWeight: 700, color: '#10B981' }}>FREE</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#4B5563' }}>
              <span>Taxes</span>
              <span style={{ fontSize: '0.75rem', color: '#6B7280' }}>Included in price</span>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', margin: '1.25rem 0' }}>
            <span style={{ fontSize: '1rem', fontWeight: 700, color: '#111827' }}>Total Payable</span>
            <span style={{ fontSize: '1.75rem', fontWeight: 800, color: '#111827' }}>₹{subtotal}</span>
          </div>

          <button
            onClick={() => onNavigate('checkout')}
            className="btn-primary"
            style={{ width: '100%', minHeight: '52px', fontSize: '1rem' }}
          >
            <span>Proceed to Checkout</span>
            <ArrowRight size={18} />
          </button>

          <div style={{ marginTop: '1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', fontSize: '0.75rem', color: '#6B7280' }}>
            <ShieldCheck size={16} />
            <span>Encrypted Checkout • Sandbox Verified</span>
          </div>
        </div>
      </div>
    </div>
  );
};
