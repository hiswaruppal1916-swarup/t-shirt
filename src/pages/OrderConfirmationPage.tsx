import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { CheckCircle2, ExternalLink, ArrowRight, Sparkles, Package, Truck } from 'lucide-react';
import { Order } from '../types';
import { mapQikinkStatus } from '../services/qikinkService';
import { ScrollReveal } from '../components/Motion/ScrollReveal';

interface OrderConfirmationPageProps {
  order: Order | null;
  onNavigate: (view: string) => void;
}

export const OrderConfirmationPage: React.FC<OrderConfirmationPageProps> = ({ order, onNavigate }) => {
  useEffect(() => {
    try {
      confetti({
        particleCount: 90,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#0B0C10', '#C5A059', '#E8E8E2', '#059669']
      });
    } catch {
      // Ignore if confetti unavailable
    }
  }, []);

  if (!order) {
    return (
      <div style={{ backgroundColor: '#FFFFFF', minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="container" style={{ padding: '6rem 1rem', textAlign: 'center', maxWidth: '500px' }}>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0B0C10' }}>No Order Found</h2>
          <p style={{ color: '#6B7280', marginTop: '0.5rem' }}>You have not placed an active order in this session.</p>
          <button onClick={() => onNavigate('shop')} className="btn-luxury-primary" style={{ marginTop: '1.5rem' }}>
            Browse Catalog
          </button>
        </div>
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
    <div style={{ backgroundColor: '#FFFFFF', minHeight: '100vh', paddingTop: '3rem', paddingBottom: '7rem' }}>
      <div className="container" style={{ maxWidth: '820px' }}>
        {/* Confirmation Header */}
        <ScrollReveal>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <div
              style={{
                width: '72px',
                height: '72px',
                borderRadius: '9999px',
                backgroundColor: 'rgba(5, 150, 105, 0.08)',
                border: '2px solid rgba(5, 150, 105, 0.35)',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#059669',
                marginBottom: '1.25rem',
                boxShadow: '0 8px 25px rgba(5, 150, 105, 0.15)'
              }}
            >
              <CheckCircle2 size={40} />
            </div>
            <span className="editorial-eyebrow" style={{ display: 'block', marginBottom: '0.375rem' }}>
              <Sparkles size={14} />
              Atelier Order Placed
            </span>
            <h1 style={{ fontSize: 'clamp(2rem, 4vw, 2.75rem)', fontWeight: 800, color: '#0B0C10', letterSpacing: '-0.03em', lineHeight: '1.15' }}>
              Thank You, Your Order is Confirmed
            </h1>
            <p style={{ fontSize: '1rem', color: '#4B5563', marginTop: '0.625rem' }}>
              Order <strong>#{order.order_number}</strong> is confirmed and queued for direct printing at Qikink.
            </p>
          </div>
        </ScrollReveal>

        {/* Qikink Fulfillment Card */}
        <ScrollReveal delay={100}>
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '1.5rem',
              border: '1px solid #E8E8E2',
              padding: 'clamp(1.5rem, 4vw, 2.25rem)',
              marginBottom: '2rem',
              boxShadow: '0 10px 30px -5px rgba(11, 12, 16, 0.05)'
            }}
          >
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', paddingBottom: '1.5rem', borderBottom: '1px solid #E8E8E2' }}>
              <div>
                <span style={{ fontSize: '0.6875rem', fontWeight: 700, color: '#8B6B23', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                  Qikink Fulfillment Pipeline
                </span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', marginTop: '0.375rem' }}>
                  <span style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0B0C10', letterSpacing: '-0.02em' }}>
                    {order.qikink_order_id || 'QK-PENDING'}
                  </span>
                  <span
                    style={{
                      fontSize: '0.6875rem',
                      fontWeight: 700,
                      padding: '0.25rem 0.625rem',
                      borderRadius: '9999px',
                      backgroundColor: 'rgba(5, 150, 105, 0.08)',
                      color: '#059669',
                      border: '1px solid rgba(5, 150, 105, 0.25)'
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
                    <code style={{ fontSize: '0.875rem', fontWeight: 700, backgroundColor: '#F4F4F0', padding: '0.25rem 0.5rem', borderRadius: '0.375rem', border: '1px solid #E8E8E2' }}>
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
                          color: '#0B0C10',
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
            <div style={{ marginTop: '2rem' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#0B0C10', marginBottom: '1.5rem', letterSpacing: '-0.01em' }}>
                Live Production & Fulfillment Milestones
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', position: 'relative', paddingLeft: '1.75rem' }}>
                <div
                  style={{
                    position: 'absolute',
                    top: '8px',
                    bottom: '12px',
                    left: '8px',
                    width: '2px',
                    backgroundColor: '#E8E8E2'
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
                          left: '-1.75rem',
                          width: '18px',
                          height: '18px',
                          borderRadius: '9999px',
                          backgroundColor: isCurrent ? '#C5A059' : isPast ? '#0B0C10' : '#FFFFFF',
                          border: isCurrent ? '3px solid #0B0C10' : isPast ? '2px solid #0B0C10' : '2px solid #D1D5DB',
                          boxShadow: isCurrent ? '0 0 0 4px rgba(197, 160, 89, 0.25)' : 'none',
                          zIndex: 2,
                          marginTop: '2px',
                          transition: 'all 0.3s ease'
                        }}
                      />
                      <div>
                        <h4 style={{ fontSize: '0.875rem', fontWeight: 700, color: isCurrent || isPast ? '#0B0C10' : '#9CA3AF' }}>
                          {step.title}
                        </h4>
                        <p style={{ fontSize: '0.75rem', color: isCurrent ? '#4B5563' : '#9CA3AF', marginTop: '0.125rem' }}>
                          {step.desc}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </ScrollReveal>

        {/* Ordered Items & Address Card */}
        <ScrollReveal delay={200}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))', gap: '1.5rem', marginBottom: '2.5rem' }}>
            {/* Ordered Items */}
            <div style={{ backgroundColor: '#FBFBFA', padding: '1.5rem', borderRadius: '1.25rem', border: '1px solid #E8E8E2' }}>
              <h3 style={{ fontSize: '0.9375rem', fontWeight: 800, color: '#0B0C10', marginBottom: '1rem' }}>
                Garments Ordered
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
                {order.items?.map((it, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8125rem' }}>
                    <div>
                      <strong style={{ color: '#0B0C10' }}>{it.product_name}</strong>
                      <p style={{ color: '#6B7280', marginTop: '0.125rem' }}>
                        {it.size} • {it.color} • Qty: {it.quantity}
                      </p>
                    </div>
                    <span style={{ fontWeight: 700, color: '#0B0C10' }}>
                      ₹{it.unit_price * it.quantity}
                    </span>
                  </div>
                ))}
              </div>

              <div style={{ marginTop: '1.25rem', paddingTop: '0.875rem', borderTop: '1px solid #E8E8E2', display: 'flex', justifyContent: 'space-between', fontWeight: 800, fontSize: '0.9375rem', color: '#0B0C10' }}>
                <span>Total Paid</span>
                <span>₹{order.total_amount}</span>
              </div>
            </div>

            {/* Shipping Address */}
            <div style={{ backgroundColor: '#FBFBFA', padding: '1.5rem', borderRadius: '1.25rem', border: '1px solid #E8E8E2' }}>
              <h3 style={{ fontSize: '0.9375rem', fontWeight: 800, color: '#0B0C10', marginBottom: '1rem' }}>
                Delivery Destination
              </h3>
              <p style={{ fontSize: '0.875rem', fontWeight: 700, color: '#0B0C10' }}>
                {order.shipping_address.firstName} {order.shipping_address.lastName}
              </p>
              <p style={{ fontSize: '0.8125rem', color: '#4B5563', marginTop: '0.25rem', lineHeight: '1.6' }}>
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
        </ScrollReveal>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button onClick={() => onNavigate('shop')} className="btn-luxury-secondary" style={{ padding: '0.875rem 2rem', minWidth: '160px' }}>
            <span>Continue Shopping</span>
          </button>
          <button onClick={() => onNavigate('account')} className="btn-luxury-primary" style={{ padding: '0.875rem 2rem', minWidth: '160px' }}>
            <span>View in My Orders</span>
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};
