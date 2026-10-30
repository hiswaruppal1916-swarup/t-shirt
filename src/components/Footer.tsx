import React from 'react';
import { Truck, ShieldCheck, RefreshCw, Award } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer style={{ backgroundColor: '#0B0C10', color: '#FFFFFF', borderTop: '1px solid rgba(255,255,255,0.1)', marginTop: '5rem', padding: '4.5rem 0 6rem' }}>
      <div className="container">
        {/* Value Proposition Strip */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 220px), 1fr))',
            gap: '2rem',
            paddingBottom: '3rem',
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
            marginBottom: '3.5rem'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div
              style={{
                width: '46px',
                height: '46px',
                borderRadius: '9999px',
                backgroundColor: 'rgba(255, 255, 255, 0.06)',
                border: '1px solid rgba(197, 160, 89, 0.35)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#C5A059',
                flexShrink: 0
              }}
            >
              <Truck size={20} />
            </div>
            <div>
              <h4 style={{ fontSize: '0.875rem', fontWeight: 800, color: '#FFFFFF', letterSpacing: '-0.01em' }}>Fast Qikink Dispatch</h4>
              <p style={{ fontSize: '0.75rem', color: '#9CA3AF', marginTop: '0.125rem' }}>Printed and shipped within 48-72 hours</p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div
              style={{
                width: '46px',
                height: '46px',
                borderRadius: '9999px',
                backgroundColor: 'rgba(255, 255, 255, 0.06)',
                border: '1px solid rgba(197, 160, 89, 0.35)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#C5A059',
                flexShrink: 0
              }}
            >
              <Award size={20} />
            </div>
            <div>
              <h4 style={{ fontSize: '0.875rem', fontWeight: 800, color: '#FFFFFF', letterSpacing: '-0.01em' }}>240 GSM Combed Cotton</h4>
              <p style={{ fontSize: '0.75rem', color: '#9CA3AF', marginTop: '0.125rem' }}>Museum-grade bio-washed heavyweight drape</p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div
              style={{
                width: '46px',
                height: '46px',
                borderRadius: '9999px',
                backgroundColor: 'rgba(255, 255, 255, 0.06)',
                border: '1px solid rgba(197, 160, 89, 0.35)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#C5A059',
                flexShrink: 0
              }}
            >
              <ShieldCheck size={20} />
            </div>
            <div>
              <h4 style={{ fontSize: '0.875rem', fontWeight: 800, color: '#FFFFFF', letterSpacing: '-0.01em' }}>Direct Fulfillment</h4>
              <p style={{ fontSize: '0.75rem', color: '#9CA3AF', marginTop: '0.125rem' }}>Live tracking with BlueDart & Delhivery</p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div
              style={{
                width: '46px',
                height: '46px',
                borderRadius: '9999px',
                backgroundColor: 'rgba(255, 255, 255, 0.06)',
                border: '1px solid rgba(197, 160, 89, 0.35)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#C5A059',
                flexShrink: 0
              }}
            >
              <RefreshCw size={20} />
            </div>
            <div>
              <h4 style={{ fontSize: '0.875rem', fontWeight: 800, color: '#FFFFFF', letterSpacing: '-0.01em' }}>Quality Assurance</h4>
              <p style={{ fontSize: '0.75rem', color: '#9CA3AF', marginTop: '0.125rem' }}>Replacement guarantee for print discrepancies</p>
            </div>
          </div>
        </div>

        {/* Brand Summary & Policy Links */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 200px), 1fr))', gap: '2.5rem' }}>
          <div style={{ maxWidth: '340px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '1.25rem', fontWeight: 900, letterSpacing: '-0.03em', color: '#FFFFFF' }}>
                ATELIER
              </span>
              <span style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontSize: '1.25rem', color: '#C5A059' }}>
                Tees
              </span>
            </div>
            <p style={{ fontSize: '0.8125rem', color: '#9CA3AF', lineHeight: '1.65' }}>
              Bespoke print-on-demand streetwear crafted with zero minimums. Fulfilled in automated partnership with Qikink, providing high-fidelity DTG printing for discerning wearers.
            </p>
            <div style={{ marginTop: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.375rem', fontSize: '0.75rem', color: '#C5A059' }}>
              <span>• Qikink Sandbox Verified Integration</span>
              <span>• Supabase Cloud Database & Storage</span>
              <span>• Firebase Auth Architecture</span>
            </div>
          </div>

          <div>
            <h5 style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', color: '#C5A059', marginBottom: '1rem' }}>
              Atelier Archive
            </h5>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.625rem', fontSize: '0.8125rem', color: '#9CA3AF' }}>
              <li>Graphic Tees Series</li>
              <li>Minimalist Monoliths</li>
              <li>Oversized Streetwear</li>
              <li>Typography Series</li>
              <li>New Seasonal Drops</li>
            </ul>
          </div>

          <div>
            <h5 style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', color: '#C5A059', marginBottom: '1rem' }}>
              Fulfillment & Policies
            </h5>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.625rem', fontSize: '0.8125rem', color: '#9CA3AF' }}>
              <li>Qikink Courier Partners</li>
              <li>DTG Curing & Wash Care</li>
              <li>Unisex Size & Boxy Fit Guide</li>
              <li>Privacy & Terms</li>
              <li>Sandbox Test Modes</li>
            </ul>
          </div>

          <div>
            <h5 style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', color: '#C5A059', marginBottom: '1rem' }}>
              Direct Concierge
            </h5>
            <p style={{ fontSize: '0.8125rem', color: '#9CA3AF' }}>
              Inquiries regarding orders or custom prints:
            </p>
            <p style={{ fontSize: '0.9375rem', fontWeight: 800, color: '#FFFFFF', marginTop: '0.375rem' }}>
              concierge@ateliertees.com
            </p>
            <p style={{ fontSize: '0.75rem', color: '#6B7280', marginTop: '0.375rem' }}>
              Mon-Sat • 10:00 AM - 7:00 PM IST
            </p>
          </div>
        </div>

        <div style={{ marginTop: '3.5rem', paddingTop: '1.75rem', borderTop: '1px solid rgba(255, 255, 255, 0.1)', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', fontSize: '0.75rem', color: '#6B7280' }}>
          <p>© {new Date().getFullYear()} Atelier Tees. Luxury Print-on-Demand Studio.</p>
          <div style={{ display: 'flex', gap: '1.25rem' }}>
            <span>INR Currency (₹)</span>
            <span>All Prices Inclusive of Applicable GST</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
