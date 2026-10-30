import React from 'react';
import { Trash2, ArrowRight, ShoppingBag, ShieldCheck, Sparkles, Truck } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { ScrollReveal } from '../components/Motion/ScrollReveal';

interface CartPageProps {
  onNavigate: (view: string) => void;
}

export const CartPage: React.FC<CartPageProps> = ({ onNavigate }) => {
  const { items, updateQuantity, removeFromCart, subtotal, itemCount } = useCart();

  if (items.length === 0) {
    return (
      <div style={{ backgroundColor: '#FFFFFF', minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="container" style={{ padding: '6rem 1rem', textAlign: 'center', maxWidth: '520px' }}>
          <div
            style={{
              width: '72px',
              height: '72px',
              borderRadius: '9999px',
              backgroundColor: '#FBFBFA',
              border: '1px solid #E8E8E2',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#8B6B23',
              marginBottom: '1.5rem',
              boxShadow: '0 8px 20px -4px rgba(11,12,16,0.06)'
            }}
          >
            <ShoppingBag size={30} />
          </div>
          <span className="editorial-eyebrow" style={{ marginBottom: '0.5rem' }}>
            Your Bag is Empty
          </span>
          <h2 style={{ fontSize: '1.875rem', fontWeight: 800, color: '#0B0C10', letterSpacing: '-0.02em', marginTop: '0.25rem' }}>
            No Garments Selected
          </h2>
          <p style={{ fontSize: '0.9375rem', color: '#6B7280', marginTop: '0.75rem', lineHeight: 1.6 }}>
            Explore our curated print-on-demand archive of 240 GSM combed cotton blanks and bespoke graphics.
          </p>
          <button
            onClick={() => onNavigate('shop')}
            className="btn-luxury-primary"
            style={{ marginTop: '2rem', padding: '0.875rem 2.25rem' }}
          >
            <span>Explore Drops Archive</span>
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: '#FFFFFF', minHeight: '100vh', paddingTop: '2.5rem', paddingBottom: '7rem' }}>
      <div className="container">
        {/* Header */}
        <ScrollReveal>
          <div style={{ marginBottom: '2.5rem' }}>
            <span className="editorial-eyebrow">
              <Sparkles size={14} />
              Shopping Bag
            </span>
            <h1
              style={{
                fontSize: 'clamp(2rem, 3.5vw, 2.75rem)',
                fontWeight: 800,
                color: '#0B0C10',
                letterSpacing: '-0.03em',
                lineHeight: '1.1',
                marginTop: '0.25rem'
              }}
            >
              Your Atelier Selection ({itemCount} {itemCount === 1 ? 'item' : 'items'})
            </h1>
            <p style={{ fontSize: '0.9375rem', color: '#4B5563', marginTop: '0.5rem' }}>
              Confirm your sizes and print configurations prior to checkout and Qikink dispatch.
            </p>

            {/* Free Shipping Progress Indicator */}
            <div
              style={{
                marginTop: '1.5rem',
                padding: '0.875rem 1.25rem',
                backgroundColor: '#FBFBFA',
                borderRadius: '0.875rem',
                border: '1px solid #E8E8E2',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem'
              }}
            >
              <Truck size={18} color="#059669" />
              <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#0B0C10' }}>
                Complimentary Express Shipping through Qikink Courier Network Applied to Your Bag
              </span>
            </div>
          </div>
        </ScrollReveal>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 320px), 1fr))', gap: '2.5rem', alignItems: 'start' }}>
          {/* Cart Items List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {items.map((item) => (
              <div
                key={item.variantId}
                style={{
                  display: 'flex',
                  gap: 'clamp(1rem, 3vw, 1.5rem)',
                  padding: '1.25rem',
                  backgroundColor: '#FFFFFF',
                  borderRadius: '1.25rem',
                  border: '1px solid #E8E8E2',
                  boxShadow: '0 4px 15px -3px rgba(11, 12, 16, 0.04)',
                  transition: 'border-color 0.2s ease'
                }}
              >
                {/* Product Thumbnail */}
                <div
                  style={{
                    width: 'clamp(80px, 20vw, 100px)',
                    height: 'clamp(100px, 25vw, 124px)',
                    borderRadius: '0.875rem',
                    overflow: 'hidden',
                    backgroundColor: '#F7F7F5',
                    border: '1px solid #E8E8E2',
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
                      <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#0B0C10', lineHeight: '1.3' }}>
                        {item.productName}
                      </h3>
                      <button
                        onClick={() => removeFromCart(item.variantId)}
                        title="Remove item"
                        style={{
                          color: '#9CA3AF',
                          width: '36px',
                          height: '36px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          borderRadius: '9999px',
                          transition: 'color 0.15s ease, background-color 0.15s ease'
                        }}
                        aria-label="Remove item from bag"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>

                    <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem', flexWrap: 'wrap' }}>
                      <span
                        style={{
                          fontSize: '0.75rem',
                          padding: '0.2rem 0.5rem',
                          backgroundColor: '#F4F4F0',
                          borderRadius: '0.375rem',
                          color: '#0B0C10',
                          fontWeight: 600,
                          border: '1px solid #E8E8E2'
                        }}
                      >
                        Size: {item.size}
                      </span>
                      <span
                        style={{
                          fontSize: '0.75rem',
                          padding: '0.2rem 0.5rem',
                          backgroundColor: '#F4F4F0',
                          borderRadius: '0.375rem',
                          color: '#0B0C10',
                          fontWeight: 600,
                          border: '1px solid #E8E8E2'
                        }}
                      >
                        Color: {item.color}
                      </span>
                    </div>

                    <div style={{ fontSize: '0.6875rem', color: '#6B7280', marginTop: '0.375rem' }}>
                      SKU: <code>{item.qikinkSku}</code>
                    </div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                    {/* Quantity Stepper */}
                    <div
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        border: '1px solid #E8E8E2',
                        borderRadius: '9999px',
                        backgroundColor: '#FBFBFA'
                      }}
                    >
                      <button
                        onClick={() => updateQuantity(item.variantId, item.quantity - 1)}
                        style={{ width: '38px', height: '38px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '1rem' }}
                        aria-label="Decrease quantity"
                      >
                        -
                      </button>
                      <span style={{ minWidth: '32px', textAlign: 'center', fontSize: '0.875rem', fontWeight: 700, color: '#0B0C10' }}>
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.variantId, item.quantity + 1)}
                        style={{ width: '38px', height: '38px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '1rem' }}
                        aria-label="Increase quantity"
                      >
                        +
                      </button>
                    </div>

                    <span style={{ fontSize: '1.125rem', fontWeight: 800, color: '#0B0C10' }}>
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
                marginTop: '0.5rem',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.375rem'
              }}
            >
              <span>← Continue Browsing Archive</span>
            </button>
          </div>

          {/* Order Summary Box */}
          <div
            style={{
              backgroundColor: '#FBFBFA',
              borderRadius: '1.5rem',
              border: '1px solid #E8E8E2',
              padding: '1.875rem',
              position: 'sticky',
              top: '5.5rem',
              boxShadow: '0 8px 30px -4px rgba(11, 12, 16, 0.05)'
            }}
          >
            <span className="editorial-eyebrow" style={{ marginBottom: '0.375rem' }}>
              Checkout Summary
            </span>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0B0C10', marginBottom: '1.5rem', letterSpacing: '-0.02em' }}>
              Order Breakdown
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem', fontSize: '0.875rem', paddingBottom: '1.25rem', borderBottom: '1px solid #E8E8E2' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#4B5563' }}>
                <span>Garments Subtotal</span>
                <span style={{ fontWeight: 600, color: '#0B0C10' }}>₹{subtotal}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#4B5563' }}>
                <span>Qikink Dispatch & Delivery</span>
                <span style={{ fontWeight: 700, color: '#059669' }}>FREE</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#4B5563' }}>
                <span>Taxes & DTG Pigment Curing</span>
                <span style={{ fontSize: '0.75rem', color: '#6B7280' }}>Included in price</span>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', margin: '1.5rem 0' }}>
              <span style={{ fontSize: '1rem', fontWeight: 700, color: '#0B0C10' }}>Total Amount</span>
              <span style={{ fontSize: '1.875rem', fontWeight: 800, color: '#0B0C10', letterSpacing: '-0.02em' }}>₹{subtotal}</span>
            </div>

            <button
              onClick={() => onNavigate('checkout')}
              className="btn-luxury-primary"
              style={{ width: '100%', minHeight: '52px', fontSize: '0.9375rem' }}
            >
              <span>Proceed to Checkout</span>
              <ArrowRight size={16} />
            </button>

            <div style={{ marginTop: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', fontSize: '0.75rem', color: '#6B7280' }}>
              <ShieldCheck size={16} color="#059669" />
              <span>Encrypted Checkout • Automated Qikink Logistics</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
