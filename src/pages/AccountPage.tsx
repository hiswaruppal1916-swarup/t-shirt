import React, { useState, useEffect } from 'react';
import { User, LogOut, Package, ExternalLink } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import { Order } from '../types';
import { mapQikinkStatus } from '../services/qikinkService';

interface AccountPageProps {
  onNavigate: (view: string) => void;
}

export const AccountPage: React.FC<AccountPageProps> = ({ onNavigate }) => {
  const { user, customerProfile, loginWithGoogle, logout, savePhoneNumber } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoadingOrders, setIsLoadingOrders] = useState(false);
  const [editingPhone, setEditingPhone] = useState(false);
  const [phoneInput, setPhoneInput] = useState(customerProfile?.phone || '');
  const [selectedOrderDetails, setSelectedOrderDetails] = useState<Order | null>(null);

  useEffect(() => {
    fetchOrders();
  }, [customerProfile?.email, user?.email]);

  const fetchOrders = async () => {
    const email = customerProfile?.email || user?.email;
    if (!email) {
      // Fetch recent local orders if unauthenticated
      const { data } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);
      if (data) setOrders(data as Order[]);
      return;
    }

    setIsLoadingOrders(true);
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .or(`customer_email.eq.${email},auth_user_id.eq.${user?.id}`)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching orders:', error);
      } else if (data) {
        setOrders(data as Order[]);
      }
    } finally {
      setIsLoadingOrders(false);
    }
  };

  const handlePhoneSave = async (e: React.FormEvent) => {
    e.preventDefault();
    await savePhoneNumber(phoneInput, customerProfile?.marketing_consent || false);
    setEditingPhone(false);
  };

  return (
    <div className="container" style={{ paddingTop: '2.5rem', paddingBottom: '6rem' }}>
      <h1 style={{ fontSize: '1.875rem', fontWeight: 800, color: '#111827', letterSpacing: '-0.02em', marginBottom: '0.5rem' }}>
        Customer Account & Orders
      </h1>
      <p style={{ fontSize: '0.875rem', color: '#6B7280', marginBottom: '2rem' }}>
        Manage your contact details and track print-on-demand fulfillment.
      </p>

      {/* Auth State Card */}
      {!user ? (
        <div
          style={{
            backgroundColor: '#F9FAFB',
            borderRadius: '1.25rem',
            border: '1px solid #E5E7EB',
            padding: '2.5rem 1.5rem',
            textAlign: 'center',
            marginBottom: '3rem'
          }}
        >
          <div
            style={{
              width: '56px',
              height: '56px',
              borderRadius: '9999px',
              backgroundColor: '#FFFFFF',
              border: '1px solid #E5E7EB',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#111827',
              marginBottom: '1rem'
            }}
          >
            <User size={24} />
          </div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#111827' }}>
            Sign In with Google
          </h2>
          <p style={{ fontSize: '0.875rem', color: '#6B7280', maxWidth: '400px', margin: '0.5rem auto 1.5rem' }}>
            Sign in with your Google account to access your full order history, saved addresses, and live courier tracking.
          </p>
          <button
            onClick={loginWithGoogle}
            className="btn-primary"
            style={{ padding: '0.75rem 2rem' }}
          >
            <span>Continue with Google</span>
          </button>
        </div>
      ) : (
        /* Profile Header */
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '1.25rem',
            border: '1px solid #E5E7EB',
            padding: '1.75rem',
            marginBottom: '3rem',
            boxShadow: '0 1px 3px rgba(0,0,0,0.03)'
          }}
        >
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div
                style={{
                  width: '52px',
                  height: '52px',
                  borderRadius: '9999px',
                  backgroundColor: '#111827',
                  color: '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 800,
                  fontSize: '1.25rem'
                }}
              >
                {(customerProfile?.name || user.email)[0].toUpperCase()}
              </div>
              <div>
                <h3 style={{ fontSize: '1.125rem', fontWeight: 800, color: '#111827' }}>
                  {customerProfile?.name || 'Customer'}
                </h3>
                <p style={{ fontSize: '0.8125rem', color: '#6B7280' }}>{user.email}</p>
              </div>
            </div>

            <button onClick={logout} className="btn-secondary" style={{ padding: '0.5rem 1rem', fontSize: '0.8125rem' }}>
              <LogOut size={16} />
              <span>Sign Out</span>
            </button>
          </div>

          {/* Profile Metadata Strip */}
          <div style={{ marginTop: '1.5rem', paddingTop: '1.25rem', borderTop: '1px solid #E5E7EB', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 180px), 1fr))', gap: '1rem', fontSize: '0.8125rem' }}>
            <div>
              <span style={{ color: '#6B7280', display: 'block' }}>Courier Mobile Number:</span>
              {editingPhone ? (
                <form onSubmit={handlePhoneSave} style={{ display: 'flex', gap: '0.5rem', marginTop: '0.25rem' }}>
                  <input
                    type="tel"
                    value={phoneInput}
                    onChange={(e) => setPhoneInput(e.target.value)}
                    style={{ minHeight: '36px', padding: '0.25rem 0.5rem', fontSize: '0.8125rem' }}
                    required
                  />
                  <button type="submit" className="btn-primary" style={{ minHeight: '36px', padding: '0.25rem 0.75rem', fontSize: '0.75rem' }}>
                    Save
                  </button>
                  <button type="button" onClick={() => setEditingPhone(false)} className="btn-secondary" style={{ minHeight: '36px', padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}>
                    Cancel
                  </button>
                </form>
              ) : (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.25rem' }}>
                  <strong style={{ color: '#111827' }}>{customerProfile?.phone || 'Not Set'}</strong>
                  <button
                    onClick={() => {
                      setPhoneInput(customerProfile?.phone || '');
                      setEditingPhone(true);
                    }}
                    style={{ fontSize: '0.75rem', color: '#4B5563', textDecoration: 'underline' }}
                  >
                    Edit
                  </button>
                </div>
              )}
            </div>

            <div>
              <span style={{ color: '#6B7280', display: 'block' }}>WhatsApp Drop Updates:</span>
              <strong style={{ color: '#111827', marginTop: '0.25rem', display: 'block' }}>
                {customerProfile?.marketing_consent ? '✓ Subscribed' : 'Not Subscribed'}
              </strong>
            </div>

            <div>
              <span style={{ color: '#6B7280', display: 'block' }}>Auth Provider:</span>
              <strong style={{ color: '#111827', marginTop: '0.25rem', display: 'block' }}>
                Supabase Auth (Google OAuth)
              </strong>
            </div>
          </div>
        </div>
      )}

      {/* Orders Section */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#111827' }}>
            My Orders ({orders.length})
          </h2>
          <button onClick={fetchOrders} style={{ fontSize: '0.8125rem', color: '#4B5563', textDecoration: 'underline' }}>
            Refresh Status
          </button>
        </div>

        {orders.length === 0 ? (
          <div
            style={{
              textAlign: 'center',
              padding: '3rem 1rem',
              backgroundColor: '#F9FAFB',
              borderRadius: '1rem',
              border: '1px dashed #E5E7EB'
            }}
          >
            <Package size={32} style={{ color: '#9CA3AF', margin: '0 auto 0.75rem' }} />
            <p style={{ fontSize: '0.875rem', fontWeight: 700, color: '#111827' }}>No Orders Found</p>
            <p style={{ fontSize: '0.8125rem', color: '#6B7280', marginTop: '0.25rem' }}>
              Your order history will appear here once you place an order.
            </p>
            <button onClick={() => onNavigate('shop')} className="btn-secondary" style={{ marginTop: '1rem' }}>
              Start Shopping
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {orders.map((ord) => {
              const qikinkStatus = mapQikinkStatus(ord.qikink_status || 'Live');

              return (
                <div
                  key={ord.id}
                  style={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: '1rem',
                    border: '1px solid #E5E7EB',
                    padding: '1.25rem',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.03)'
                  }}
                >
                  <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '0.75rem', paddingBottom: '0.75rem', borderBottom: '1px solid #F3F4F6' }}>
                    <div>
                      <span style={{ fontSize: '0.9375rem', fontWeight: 800, color: '#111827' }}>
                        #{ord.order_number}
                      </span>
                      <span style={{ fontSize: '0.75rem', color: '#6B7280', marginLeft: '0.5rem' }}>
                        {new Date(ord.created_at).toLocaleDateString()}
                      </span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
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
                        Qikink: {qikinkStatus.label}
                      </span>
                      <span style={{ fontSize: '0.9375rem', fontWeight: 800, color: '#111827' }}>
                        ₹{ord.total_amount}
                      </span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', marginTop: '0.75rem' }}>
                    <div style={{ fontSize: '0.8125rem', color: '#4B5563' }}>
                      <span>Qikink Ref: <strong>{ord.qikink_order_id || 'QK-PENDING'}</strong></span>
                      {ord.awb_number && (
                        <span style={{ marginLeft: '1rem' }}>
                          AWB: <strong>{ord.awb_number}</strong> ({ord.courier_name || 'BlueDart'})
                        </span>
                      )}
                    </div>

                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      {ord.tracking_link && (
                        <a
                          href={ord.tracking_link}
                          target="_blank"
                          rel="noreferrer"
                          className="btn-secondary"
                          style={{ padding: '0.375rem 0.75rem', fontSize: '0.75rem', minHeight: '34px' }}
                        >
                          <span>Track Courier</span>
                          <ExternalLink size={12} />
                        </a>
                      )}
                      <button
                        onClick={() => setSelectedOrderDetails(ord)}
                        className="btn-secondary"
                        style={{ padding: '0.375rem 0.75rem', fontSize: '0.75rem', minHeight: '34px' }}
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Order Details Modal */}
      {selectedOrderDetails && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            backdropFilter: 'blur(4px)',
            zIndex: 100,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem'
          }}
          onClick={() => setSelectedOrderDetails(null)}
        >
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '1.25rem',
              padding: 'clamp(1rem, 4vw, 1.75rem)',
              maxWidth: 'min(92vw, 520px)',
              width: '100%',
              maxHeight: '90vh',
              overflowY: 'auto',
              boxShadow: '0 20px 25px -5px rgba(0,0,0,0.15)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
              <div>
                <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#6B7280' }}>Order Details</span>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#111827' }}>
                  #{selectedOrderDetails.order_number}
                </h3>
              </div>
              <button onClick={() => setSelectedOrderDetails(null)} style={{ fontSize: '1.25rem', fontWeight: 700 }}>
                ✕
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '0.8125rem' }}>
              <div style={{ padding: '0.75rem', backgroundColor: '#F9FAFB', borderRadius: '0.5rem', border: '1px solid #E5E7EB' }}>
                <span style={{ color: '#6B7280', display: 'block' }}>Delivery Address:</span>
                <strong style={{ color: '#111827' }}>
                  {selectedOrderDetails.shipping_address.firstName} {selectedOrderDetails.shipping_address.lastName}
                </strong>
                <p style={{ color: '#4B5563', marginTop: '0.25rem' }}>
                  {selectedOrderDetails.shipping_address.addressLine1}, {selectedOrderDetails.shipping_address.city}, {selectedOrderDetails.shipping_address.state} - {selectedOrderDetails.shipping_address.postalCode}
                </p>
                <p style={{ color: '#6B7280', marginTop: '0.25rem' }}>
                  Phone: {selectedOrderDetails.shipping_address.phone}
                </p>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Payment Method:</span>
                <strong>{selectedOrderDetails.payment_method}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Payment Status:</span>
                <strong style={{ color: '#10B981' }}>{selectedOrderDetails.payment_status}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Total Amount:</span>
                <strong>₹{selectedOrderDetails.total_amount}</strong>
              </div>
            </div>

            <button
              onClick={() => setSelectedOrderDetails(null)}
              className="btn-primary"
              style={{ width: '100%', marginTop: '1.5rem', minHeight: '44px' }}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
