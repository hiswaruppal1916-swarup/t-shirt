import React from 'react';
import { Truck, ShieldCheck, RefreshCw, Award } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer style={{ backgroundColor: '#F9FAFB', borderTop: '1px solid #E5E7EB', marginTop: '4rem', padding: '3.5rem 0 5rem' }}>
      <div className="container">
        {/* Value Proposition Strip */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 200px), 1fr))',
            gap: '1.5rem',
            paddingBottom: '2.5rem',
            borderBottom: '1px solid #E5E7EB',
            marginBottom: '2.5rem'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div
              style={{
                width: '44px',
                height: '44px',
                borderRadius: '9999px',
                backgroundColor: '#FFFFFF',
                border: '1px solid #E5E7EB',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#111827',
                flexShrink: 0
              }}
            >
              <Truck size={20} />
            </div>
            <div>
              <h4 style={{ fontSize: '0.875rem', fontWeight: 700, color: '#111827' }}>Fast Qikink Dispatch</h4>
              <p style={{ fontSize: '0.75rem', color: '#6B7280' }}>Printed and shipped within 48-72 hours</p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div
              style={{
                width: '44px',
                height: '44px',
                borderRadius: '9999px',
                backgroundColor: '#FFFFFF',
                border: '1px solid #E5E7EB',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#111827',
                flexShrink: 0
              }}
            >
              <Award size={20} />
            </div>
            <div>
              <h4 style={{ fontSize: '0.875rem', fontWeight: 700, color: '#111827' }}>240 GSM Combed Cotton</h4>
              <p style={{ fontSize: '0.75rem', color: '#6B7280' }}>Museum-grade heavyweight bio-washed tees</p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div
              style={{
                width: '44px',
                height: '44px',
                borderRadius: '9999px',
                backgroundColor: '#FFFFFF',
                border: '1px solid #E5E7EB',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#111827',
                flexShrink: 0
              }}
            >
              <ShieldCheck size={20} />
            </div>
            <div>
              <h4 style={{ fontSize: '0.875rem', fontWeight: 700, color: '#111827' }}>Direct Fulfillment</h4>
              <p style={{ fontSize: '0.75rem', color: '#6B7280' }}>Live tracking with BlueDart & Delhivery</p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div
              style={{
                width: '44px',
                height: '44px',
                borderRadius: '9999px',
                backgroundColor: '#FFFFFF',
                border: '1px solid #E5E7EB',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#111827',
                flexShrink: 0
              }}
            >
              <RefreshCw size={20} />
            </div>
            <div>
              <h4 style={{ fontSize: '0.875rem', fontWeight: 700, color: '#111827' }}>Hassle-Free Exchanges</h4>
              <p style={{ fontSize: '0.75rem', color: '#6B7280' }}>7-day replacement for manufacturing defects</p>
            </div>
          </div>
        </div>

        {/* Brand Summary & Policy Links */}
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', gap: '2rem' }}>
          <div style={{ maxWidth: '340px' }}>
            <span style={{ fontSize: '1.125rem', fontWeight: 800, letterSpacing: '-0.02em', color: '#111827' }}>
              ATELIER TEES
            </span>
            <p style={{ fontSize: '0.8125rem', color: '#6B7280', marginTop: '0.5rem', lineHeight: '1.6' }}>
              Custom print-on-demand streetwear crafted with zero minimums. Fulfilled in partnership with Qikink, providing high-fidelity DTG & screen printing for discerning creators.
            </p>
            <div style={{ marginTop: '1rem', display: 'flex', gap: '0.75rem', fontSize: '0.75rem', color: '#4B5563' }}>
              <span>• Qikink Sandbox Verified</span>
              <span>• Supabase Backend</span>
              <span>• Firebase Integrated</span>
            </div>
          </div>

          <div>
            <h5 style={{ fontSize: '0.8125rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.75rem' }}>
              Catalog
            </h5>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.8125rem', color: '#4B5563' }}>
              <li>Graphic Tees</li>
              <li>Minimalist Art</li>
              <li>Oversized Streetwear</li>
              <li>Typography Series</li>
              <li>New Drops</li>
            </ul>
          </div>

          <div>
            <h5 style={{ fontSize: '0.8125rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.75rem' }}>
              Fulfillment & Policies
            </h5>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.8125rem', color: '#4B5563' }}>
              <li>Qikink Courier Partners</li>
              <li>Print & Shipping Timelines</li>
              <li>Size & Fit Guide</li>
              <li>Privacy Policy</li>
              <li>Terms of Service</li>
            </ul>
          </div>

          <div>
            <h5 style={{ fontSize: '0.8125rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.75rem' }}>
              Customer Care
            </h5>
            <p style={{ fontSize: '0.8125rem', color: '#4B5563' }}>
              Questions about custom orders or tracking?
            </p>
            <p style={{ fontSize: '0.875rem', fontWeight: 700, color: '#111827', marginTop: '0.25rem' }}>
              support@ateliertees.com
            </p>
            <p style={{ fontSize: '0.75rem', color: '#6B7280', marginTop: '0.25rem' }}>
              Mon-Sat • 10:00 AM - 7:00 PM IST
            </p>
          </div>
        </div>

        <div style={{ marginTop: '2.5rem', paddingTop: '1.5rem', borderTop: '1px solid #E5E7EB', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', fontSize: '0.75rem', color: '#9CA3AF' }}>
          <p>© {new Date().getFullYear()} Atelier Tees. Custom Print-on-Demand E-Commerce Store.</p>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <span>INR Currency (₹)</span>
            <span>All Prices Inclusive of Taxes</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
