import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { CheckCircle2, ExternalLink, ArrowRight } from 'lucide-react';
import { Order } from '../types';
import { mapQikinkStatus } from '../services/qikinkService';

interface OrderConfirmationPageProps {
  order: Order | null;
  onNavigate: (view: string) => void;
}

export const OrderConfirmationPage: React.FC<OrderConfirmationPageProps> = ({ order, onNavigate }) => {
  useEffect(() => {
    // Trigger confetti celebration on order placement
    try {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 }
      });
    } catch {
      // Ignore if confetti not supported
    }
  }, []);

  if (!order) {
    return (
      <div className="container" style={{ padding: '6rem 1rem', textAlign: 'center' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700 }}>No Order Found</h2>
        <button onClick={() => onNavigate('shop')} className="btn-primary" style={{ marginTop: '1.5rem' }}>
          Browse Catalog
        </button>
      </div>
    );
  }

  const qikinkStatusInfo = mapQikinkStatus(order.qikink_status || 'Live');

  const TIMELINE_STEPS = [
    { title: 'Order Confirmed', desc: 'Validated & paid', status: 'Live' },
    { title: 'Print Prep & Picklist', desc: 'Garment queued at Qikink', status: 'To be Printed' },
    { title: 'Printing & Quality Check', desc: 'DTG organic pigment printing', status: 'Printed' },
    { title: 'Packed & Manifested', desc: 'Handed over to courier partner', status: 'Manifested' },
    { title: 'Shipped & In-Transit', desc: 'On its way to delivery address', status: 'In-Transit' },
    { title: 'Delivered', desc: 'Delivered to your doorstep', status: 'Delivered' }
  ];

  return (
    <div className="container" style={{ paddingTop: '2.5rem', paddingBottom: '6rem', maxWidth: '780px' }}>
      {/* Confirmation Header */}
      <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
        <div
          style={{
            width: '64px',
            height: '64px',
            borderRadius: '9999px',
            backgroundColor: '#ECFDF5',
            border: '2px solid #10B981',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#10B981',
            marginBottom: '1rem'
          }}
        >
          <CheckCircle2 size={36} />
        </div>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#111827', letterSpacing: '-0.02em' }}>
          Thank You, Order Placed!
        </h1>
        <p style={{ fontSize: '0.9375rem', color: '#4B5563', marginTop: '0.375rem' }}>
          Order <strong>#{order.order_number}</strong> is confirmed and submitted to Qikink Sandbox for printing.
        </p>
      </div>

      {/* Qikink Fulfillment Card */}
      <div
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '1.25rem',
          border: '1px solid #E5E7EB',
          padding: '1.75rem',
          marginBottom: '2rem',
          boxShadow: '0 4px 20px -2px rgba(17, 24, 39, 0.05)'
        }}
      >
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', paddingBottom: '1.25rem', borderBottom: '1px solid #E5E7EB' }}>
          <div>
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#6B7280', textTransform: 'uppercase' }}>
              Qikink Fulfillment Reference
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.25rem' }}>
              <span style={{ fontSize: '1.125rem', fontWeight: 800, color: '#111827' }}>
                {order.qikink_order_id || 'QK-PENDING'}
              </span>
              <span
                style={{
                  fontSize: '0.6875rem',
                  fontWeight: 700,
                  padding: '0.25rem 0.5rem',
                  borderRadius: '9999px',
                  backgroundColor: '#ECFDF5',
                  color: '#065F46',
                  border: '1px solid #A7F3D0'
                }}
              >
                {qikinkStatusInfo.label}
              </span>
            </div>
          </div>

          {order.awb_number && (
            <div style={{ textAlign: 'right' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#6B7280' }}>
                {order.courier_name || 'Courier'} Tracking
              </span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.25rem' }}>
                <code style={{ fontSize: '0.875rem', fontWeight: 700, backgroundColor: '#F3F4F6', padding: '0.25rem 0.5rem', borderRadius: '0.25rem' }}>
                  {order.awb_number}
                </code>
                {order.tracking_link && (
                  <a
                    href={order.tracking_link}
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.25rem',
                      fontSize: '0.8125rem',
                      fontWeight: 700,
                      color: '#111827',
                      textDecoration: 'underline'
                    }}
                  >
                    <span>Track</span>
                    <ExternalLink size={13} />
                  </a>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Vertical Delivery Timeline */}
        <div style={{ marginTop: '1.75rem' }}>
          <h3 style={{ fontSize: '0.9375rem', fontWeight: 700, color: '#111827', marginBottom: '1.25rem' }}>
            Live Fulfillment Timeline
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', position: 'relative', paddingLeft: '1.5rem' }}>
            <div
              style={{
                position: 'absolute',
                top: '8px',
                bottom: '12px',
                left: '7px',
                width: '2px',
                backgroundColor: '#E5E7EB'
              }}
            />

            {TIMELINE_STEPS.map((step, idx) => {
              const isPast = idx < qikinkStatusInfo.stepIndex;
              const isCurrent = idx === qikinkStatusInfo.stepIndex - 1;

              return (
                <div key={step.title} style={{ position: 'relative', display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                  <div
                    style={{
                      position: 'absolute',
                      left: '-1.5rem',
                      width: '16px',
                      height: '16px',
                      borderRadius: '9999px',
                      backgroundColor: isPast || isCurrent ? '#111827' : '#FFFFFF',
                      border: isPast || isCurrent ? '2px solid #111827' : '2px solid #D1D5DB',
                      zIndex: 2,
                      marginTop: '3px'
                    }}
                  />
                  <div>
                    <h4 style={{ fontSize: '0.875rem', fontWeight: 700, color: isCurrent || isPast ? '#111827' : '#9CA3AF' }}>
                      {step.title}
                    </h4>
                    <p style={{ fontSize: '0.75rem', color: isCurrent ? '#4B5563' : '#9CA3AF' }}>
                      {step.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Ordered Items & Address Card */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 260px), 1fr))', gap: '1.25rem', marginBottom: '2rem' }}>
        {/* Ordered Items */}
        <div style={{ backgroundColor: '#F9FAFB', padding: 'clamp(1rem, 2.5vw, 1.5rem)', borderRadius: '1rem', border: '1px solid #E5E7EB' }}>
          <h3 style={{ fontSize: '0.9375rem', fontWeight: 700, color: '#111827', marginBottom: '1rem' }}>
            Items Ordered
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {order.items?.map((it, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8125rem' }}>
                <div>
                  <strong style={{ color: '#111827' }}>{it.product_name}</strong>
                  <p style={{ color: '#6B7280' }}>
                    {it.size} • {it.color} • Qty: {it.quantity}
                  </p>
                </div>
                <span style={{ fontWeight: 700, color: '#111827' }}>
                  ₹{it.unit_price * it.quantity}
                </span>
              </div>
            ))}
          </div>

          <div style={{ marginTop: '1rem', paddingTop: '0.75rem', borderTop: '1px solid #E5E7EB', display: 'flex', justifyContent: 'space-between', fontWeight: 800, fontSize: '0.9375rem' }}>
            <span>Total Paid</span>
            <span>₹{order.total_amount}</span>
          </div>
        </div>

        {/* Shipping Address */}
        <div style={{ backgroundColor: '#F9FAFB', padding: 'clamp(1rem, 2.5vw, 1.5rem)', borderRadius: '1rem', border: '1px solid #E5E7EB' }}>
          <h3 style={{ fontSize: '0.9375rem', fontWeight: 700, color: '#111827', marginBottom: '1rem' }}>
            Delivery Address
          </h3>
          <p style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#111827' }}>
            {order.shipping_address.firstName} {order.shipping_address.lastName}
          </p>
          <p style={{ fontSize: '0.8125rem', color: '#4B5563', marginTop: '0.25rem', lineHeight: '1.5' }}>
            {order.shipping_address.addressLine1}
            {order.shipping_address.addressLine2 ? `, ${order.shipping_address.addressLine2}` : ''}
            <br />
            {order.shipping_address.city}, {order.shipping_address.state} - {order.shipping_address.postalCode}
          </p>
          <p style={{ fontSize: '0.8125rem', color: '#6B7280', marginTop: '0.5rem' }}>
            Phone: {order.shipping_address.phone}
          </p>
          <p style={{ fontSize: '0.8125rem', color: '#6B7280' }}>
            Email: {order.shipping_address.email}
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
        <button onClick={() => onNavigate('shop')} className="btn-secondary" style={{ padding: '0.75rem 1.5rem', flex: '1 1 auto', minWidth: '140px' }}>
          Continue Shopping
        </button>
        <button onClick={() => onNavigate('account')} className="btn-primary" style={{ padding: '0.75rem 1.5rem', flex: '1 1 auto', minWidth: '140px' }}>
          <span>View in My Orders</span>
          <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
};
