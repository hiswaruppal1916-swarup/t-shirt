import React, { useState, useEffect } from 'react';
import { User, LogOut, Package, ExternalLink, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import { Order } from '../types';
import { mapQikinkStatus } from '../services/qikinkService';
import { ScrollReveal } from '../components/Motion/ScrollReveal';

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
    <div style={{ backgroundColor: '#FFFFFF', minHeight: '100vh', paddingTop: '2.5rem', paddingBottom: '7rem' }}>
      <div className="container" style={{ maxWidth: '960px' }}>
        <ScrollReveal>
          <div style={{ marginBottom: '2.5rem' }}>
            <span className="editorial-eyebrow">
              <Sparkles size={14} />
              Member Sanctuary
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
              Account & Fulfillment Archive
            </h1>
            <p style={{ fontSize: '0.9375rem', color: '#4B5563', marginTop: '0.5rem' }}>
              Review contact preferences, saved shipping coordinates, and real-time Qikink production statuses.
            </p>
          </div>
        </ScrollReveal>

        {/* Auth State Card */}
        {!user ? (
          <ScrollReveal delay={100}>
            <div
              style={{
                backgroundColor: '#FBFBFA',
                borderRadius: '1.5rem',
                border: '1px solid #E8E8E2',
                padding: '3rem 2rem',
                textAlign: 'center',
                marginBottom: '3.5rem',
                boxShadow: '0 8px 30px -4px rgba(11, 12, 16, 0.04)'
              }}
            >
              <div
                style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '9999px',
                  backgroundColor: '#FFFFFF',
                  border: '1px solid #E8E8E2',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#C5A059',
                  marginBottom: '1.25rem',
                  boxShadow: '0 4px 15px rgba(0,0,0,0.05)'
                }}
              >
                <User size={28} />
              </div>
              <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0B0C10', letterSpacing: '-0.02em' }}>
                Sign In with Google
              </h2>
              <p style={{ fontSize: '0.875rem', color: '#6B7280', maxWidth: '420px', margin: '0.5rem auto 1.75rem', lineHeight: 1.6 }}>
                Connect your verified Google account to view your bespoke print orders, courier airway bills, and live tracking links.
              </p>
              <button
                onClick={loginWithGoogle}
                className="btn-luxury-primary"
                style={{ padding: '0.875rem 2.25rem' }}
              >
                <span>Continue with Google</span>
              </button>
            </div>
          </ScrollReveal>
        ) : (
          /* Profile Header */
          <ScrollReveal delay={100}>
            <div
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '1.5rem',
                border: '1px solid #E8E8E2',
                padding: '2rem',
                marginBottom: '3.5rem',
                boxShadow: '0 8px 30px -4px rgba(11, 12, 16, 0.04)'
              }}
            >
              <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '1.25rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                  <div
                    style={{
                      width: '56px',
                      height: '56px',
                      borderRadius: '9999px',
                      backgroundColor: '#0B0C10',
                      color: '#C5A059',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 800,
                      fontSize: '1.35rem',
                      border: '1px solid rgba(197, 160, 89, 0.3)'
                    }}
                  >
                    {(customerProfile?.name || user.email)[0].toUpperCase()}
                  </div>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0B0C10', letterSpacing: '-0.02em' }}>
                        {customerProfile?.name || 'Atelier Patron'}
                      </h3>
                      <span
                        style={{
                          fontSize: '0.625rem',
                          fontWeight: 700,
                          padding: '0.2rem 0.5rem',
                          borderRadius: '9999px',
                          backgroundColor: 'rgba(197, 160, 89, 0.1)',
                          color: '#8B6B23',
                          border: '1px solid rgba(197, 160, 89, 0.3)',
                          textTransform: 'uppercase'
                        }}
                      >
                        Verified Member
                      </span>
                    </div>
                    <p style={{ fontSize: '0.8125rem', color: '#6B7280', marginTop: '0.125rem' }}>{user.email}</p>
                  </div>
                </div>

                <button onClick={logout} className="btn-luxury-secondary" style={{ padding: '0.5rem 1.25rem', fontSize: '0.8125rem' }}>
                  <LogOut size={14} />
                  <span>Sign Out</span>
                </button>
              </div>

              {/* Profile Metadata Strip */}
              <div style={{ marginTop: '1.75rem', paddingTop: '1.5rem', borderTop: '1px solid #E8E8E2', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 200px), 1fr))', gap: '1.25rem', fontSize: '0.8125rem' }}>
                <div>
                  <span style={{ color: '#6B7280', display: 'block', fontSize: '0.75rem' }}>Courier Dispatch Phone:</span>
                  {editingPhone ? (
                    <form onSubmit={handlePhoneSave} style={{ display: 'flex', gap: '0.5rem', marginTop: '0.375rem' }}>
                      <input
                        type="tel"
                        value={phoneInput}
                        onChange={(e) => setPhoneInput(e.target.value)}
                        style={{ minHeight: '36px', padding: '0.25rem 0.5rem', fontSize: '0.8125rem' }}
                        required
                      />
                      <button type="submit" className="btn-luxury-primary" style={{ minHeight: '36px', padding: '0.25rem 0.75rem', fontSize: '0.75rem' }}>
                        Save
                      </button>
                      <button type="button" onClick={() => setEditingPhone(false)} className="btn-luxury-secondary" style={{ minHeight: '36px', padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}>
                        Cancel
                      </button>
                    </form>
                  ) : (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.25rem' }}>
                      <strong style={{ color: '#0B0C10' }}>{customerProfile?.phone || 'Not Registered'}</strong>
                      <button
                        onClick={() => {
                          setPhoneInput(customerProfile?.phone || '');
                          setEditingPhone(true);
                        }}
                        style={{ fontSize: '0.75rem', color: '#8B6B23', textDecoration: 'underline' }}
                      >
                        Edit
                      </button>
                    </div>
                  )}
                </div>

                <div>
                  <span style={{ color: '#6B7280', display: 'block', fontSize: '0.75rem' }}>Dispatch Notifications:</span>
                  <strong style={{ color: '#0B0C10', marginTop: '0.25rem', display: 'block' }}>
                    {customerProfile?.marketing_consent ? '✓ WhatsApp & Email Active' : 'Standard Courier SMS'}
                  </strong>
                </div>

                <div>
                  <span style={{ color: '#6B7280', display: 'block', fontSize: '0.75rem' }}>Security Protocol:</span>
                  <strong style={{ color: '#059669', marginTop: '0.25rem', display: 'block' }}>
                    Supabase Auth with RLS Protection
                  </strong>
                </div>
              </div>
            </div>
          </ScrollReveal>
        )}

        {/* Orders Section */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0B0C10', letterSpacing: '-0.02em' }}>
              Order Archive ({orders.length})
            </h2>
            <button
              onClick={fetchOrders}
              style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#8B6B23', textDecoration: 'underline' }}
            >
              Sync Status
            </button>
          </div>

          {orders.length === 0 ? (
            <div
              style={{
                textAlign: 'center',
                padding: '4rem 1.5rem',
                backgroundColor: '#FBFBFA',
                borderRadius: '1.5rem',
                border: '1px dashed #E8E8E2'
              }}
            >
              <Package size={36} style={{ color: '#9CA3AF', margin: '0 auto 1rem' }} />
              <p style={{ fontSize: '1rem', fontWeight: 800, color: '#0B0C10' }}>No Active Orders Found</p>
              <p style={{ fontSize: '0.8125rem', color: '#6B7280', marginTop: '0.25rem', maxWidth: '360px', margin: '0.25rem auto 1.5rem' }}>
                Your print orders and tracking links will appear here immediately after placement.
              </p>
              <button onClick={() => onNavigate('shop')} className="btn-luxury-primary">
                <span>Browse The Collection</span>
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {orders.map((ord) => {
                const qikinkStatus = mapQikinkStatus(ord.qikink_status || 'Live');

                return (
                  <div
                    key={ord.id}
                    style={{
                      backgroundColor: '#FFFFFF',
                      borderRadius: '1.25rem',
                      border: '1px solid #E8E8E2',
                      padding: '1.5rem',
                      boxShadow: '0 4px 15px -3px rgba(11, 12, 16, 0.04)',
                      transition: 'border-color 0.2s ease'
                    }}
                  >
                    <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '0.75rem', paddingBottom: '1rem', borderBottom: '1px solid #F4F4F0' }}>
                      <div>
                        <span style={{ fontSize: '1rem', fontWeight: 800, color: '#0B0C10' }}>
                          #{ord.order_number}
                        </span>
                        <span style={{ fontSize: '0.75rem', color: '#6B7280', marginLeft: '0.75rem' }}>
                          {new Date(ord.created_at).toLocaleDateString()}
                        </span>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
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
                          Qikink: {qikinkStatus.label}
                        </span>
                        <span style={{ fontSize: '1rem', fontWeight: 800, color: '#0B0C10' }}>
                          ₹{ord.total_amount}
                        </span>
                      </div>
                    </div>

                    <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', marginTop: '1rem' }}>
                      <div style={{ fontSize: '0.8125rem', color: '#4B5563' }}>
                        <span>Ref ID: <strong>{ord.qikink_order_id || 'QK-PENDING'}</strong></span>
                        {ord.awb_number && (
                          <span style={{ marginLeft: '1.25rem' }}>
                            AWB: <strong>{ord.awb_number}</strong> ({ord.courier_name || 'BlueDart'})
                          </span>
                        )}
                      </div>

                      <div style={{ display: 'flex', gap: '0.625rem' }}>
                        {ord.tracking_link && (
                          <a
                            href={ord.tracking_link}
                            target="_blank"
                            rel="noreferrer"
                            className="btn-luxury-secondary"
                            style={{ padding: '0.375rem 0.875rem', fontSize: '0.75rem', minHeight: '36px' }}
                          >
                            <span>Live Tracking</span>
                            <ExternalLink size={12} />
                          </a>
                        )}
                        <button
                          onClick={() => setSelectedOrderDetails(ord)}
                          className="btn-luxury-secondary"
                          style={{ padding: '0.375rem 0.875rem', fontSize: '0.75rem', minHeight: '36px' }}
                        >
                          View Breakdown
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
              backgroundColor: 'rgba(11, 12, 16, 0.65)',
              backdropFilter: 'blur(8px)',
              zIndex: 100,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '1.25rem',
              animation: 'fadeInSoft 0.25s ease'
            }}
            onClick={() => setSelectedOrderDetails(null)}
          >
            <div
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '1.5rem',
                padding: 'clamp(1.25rem, 4vw, 2rem)',
                maxWidth: 'min(92vw, 540px)',
                width: '100%',
                maxHeight: '90vh',
                overflowY: 'auto',
                boxShadow: '0 25px 50px -12px rgba(11, 12, 16, 0.35)',
                border: '1px solid #E8E8E2'
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
                <div>
                  <span className="editorial-eyebrow">Order Archive</span>
                  <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0B0C10', marginTop: '0.25rem' }}>
                    #{selectedOrderDetails.order_number}
                  </h3>
                </div>
                <button
                  onClick={() => setSelectedOrderDetails(null)}
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '9999px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: '#F4F4F0',
                    color: '#0B0C10',
                    fontWeight: 700
                  }}
                >
                  ✕
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '0.8125rem' }}>
                <div style={{ padding: '1rem', backgroundColor: '#FBFBFA', borderRadius: '0.875rem', border: '1px solid #E8E8E2' }}>
                  <span style={{ color: '#6B7280', display: 'block', fontSize: '0.75rem' }}>Delivery Address:</span>
                  <strong style={{ color: '#0B0C10', display: 'block', marginTop: '0.25rem' }}>
                    {selectedOrderDetails.shipping_address.firstName} {selectedOrderDetails.shipping_address.lastName}
                  </strong>
                  <p style={{ color: '#4B5563', marginTop: '0.25rem', lineHeight: '1.5' }}>
                    {selectedOrderDetails.shipping_address.addressLine1}, {selectedOrderDetails.shipping_address.city}, {selectedOrderDetails.shipping_address.state} - {selectedOrderDetails.shipping_address.postalCode}
                  </p>
                  <p style={{ color: '#6B7280', marginTop: '0.375rem' }}>
                    Phone: {selectedOrderDetails.shipping_address.phone}
                  </p>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid #F4F4F0' }}>
                  <span style={{ color: '#6B7280' }}>Payment Method:</span>
                  <strong style={{ color: '#0B0C10' }}>{selectedOrderDetails.payment_method}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid #F4F4F0' }}>
                  <span style={{ color: '#6B7280' }}>Payment Status:</span>
                  <strong style={{ color: '#059669' }}>{selectedOrderDetails.payment_status}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0' }}>
                  <span style={{ color: '#6B7280' }}>Total Amount:</span>
                  <strong style={{ fontSize: '1rem', color: '#0B0C10' }}>₹{selectedOrderDetails.total_amount}</strong>
                </div>
              </div>

              <button
                onClick={() => setSelectedOrderDetails(null)}
                className="btn-luxury-primary"
                style={{ width: '100%', marginTop: '1.75rem', minHeight: '48px' }}
              >
                Close Archive View
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
