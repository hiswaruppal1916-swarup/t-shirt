import React, { useState, useEffect } from 'react';
import { Phone, Check, AlertCircle, Sparkles, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const PhoneOnboardingModal: React.FC = () => {
  const { needsPhoneOnboarding, savePhoneNumber, dismissPhoneOnboarding, user, customerProfile } = useAuth();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [marketingConsent, setMarketingConsent] = useState(false);
  const [validationError, setValidationError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Pre-fill from customerProfile or localStorage if available
  useEffect(() => {
    if (customerProfile?.phone) {
      setPhoneNumber(customerProfile.phone.replace(/\D/g, ''));
    } else {
      const email = customerProfile?.email || user?.email;
      if (email) {
        const cached = localStorage.getItem('atelier_customer_phone_' + email);
        if (cached) setPhoneNumber(cached);
      }
    }
  }, [customerProfile, user]);

  // Handle escape key to dismiss
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && needsPhoneOnboarding) {
        dismissPhoneOnboarding();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [needsPhoneOnboarding, dismissPhoneOnboarding]);

  if (!needsPhoneOnboarding) {
    return null;
  }

  const handlePhoneSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError('');

    // Remove any formatting spaces, dashes, or non-digits
    const cleaned = phoneNumber.replace(/\D/g, '');

    // Validate 10-digit mobile number format
    if (cleaned.length < 10) {
      setValidationError('Please enter a valid 10-digit mobile phone number.');
      return;
    }

    setIsSubmitting(true);
    try {
      await savePhoneNumber(cleaned, marketingConsent);
    } catch (err: any) {
      setValidationError(err.message || 'Failed to save phone number. Please retry.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(11, 12, 16, 0.75)',
        backdropFilter: 'blur(8px)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.25rem',
        animation: 'fadeInSoft 0.25s ease'
      }}
      onClick={(e) => {
        // Dismiss if clicking outer backdrop
        if (e.target === e.currentTarget) {
          dismissPhoneOnboarding();
        }
      }}
    >
      <div
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '1.5rem',
          maxWidth: '480px',
          width: '100%',
          padding: '2.25rem',
          boxShadow: '0 25px 60px -15px rgba(11, 12, 16, 0.4)',
          position: 'relative',
          border: '1px solid #E8E8E2'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Right Dismiss Button */}
        <button
          type="button"
          onClick={dismissPhoneOnboarding}
          title="Dismiss"
          aria-label="Close modal"
          style={{
            position: 'absolute',
            top: '1.25rem',
            right: '1.25rem',
            width: '36px',
            height: '36px',
            borderRadius: '9999px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#F4F4F0',
            color: '#6B7280',
            transition: 'all 0.15s ease'
          }}
        >
          <X size={18} />
        </button>

        <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
          <div
            style={{
              width: '58px',
              height: '58px',
              borderRadius: '9999px',
              backgroundColor: '#FBFBFA',
              border: '1px solid rgba(197, 160, 89, 0.35)',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#C5A059',
              marginBottom: '1rem',
              boxShadow: '0 4px 15px rgba(0,0,0,0.05)'
            }}
          >
            <Phone size={24} />
          </div>
          <span className="editorial-eyebrow" style={{ display: 'block', marginBottom: '0.375rem' }}>
            <Sparkles size={13} />
            Member Registration
          </span>
          <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0B0C10', letterSpacing: '-0.02em' }}>
            Courier Contact Details
          </h3>
          <p style={{ fontSize: '0.875rem', color: '#6B7280', marginTop: '0.5rem', lineHeight: '1.55' }}>
            Welcome, <strong>{customerProfile?.name || user?.user_metadata?.full_name || user?.email}</strong>. A valid phone number is required to receive automated courier airway bill tracking from Qikink.
          </p>
        </div>

        <form onSubmit={handlePhoneSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: '#374151', marginBottom: '0.5rem' }}>
              Mobile / WhatsApp Number <span style={{ color: '#E11D48' }}>*</span>
            </label>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <span
                style={{
                  position: 'absolute',
                  left: '1rem',
                  fontSize: '0.9375rem',
                  fontWeight: 700,
                  color: '#6B7280',
                  pointerEvents: 'none'
                }}
              >
                +91
              </span>
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => {
                  setPhoneNumber(e.target.value);
                  if (validationError) setValidationError('');
                }}
                placeholder="98765 43210"
                style={{ paddingLeft: '3.5rem', backgroundColor: '#FBFBFA', borderColor: '#E8E8E2' }}
                maxLength={14}
                required
                autoFocus
              />
            </div>
            <p style={{ fontSize: '0.75rem', color: '#9CA3AF', marginTop: '0.375rem' }}>
              Used exclusively for BlueDart / Delhivery courier delivery updates.
            </p>
          </div>

          {/* Explicit Marketing Consent Preference */}
          <label
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '0.75rem',
              cursor: 'pointer',
              fontSize: '0.8125rem',
              color: '#4B5563',
              lineHeight: '1.45'
            }}
          >
            <input
              type="checkbox"
              checked={marketingConsent}
              onChange={(e) => setMarketingConsent(e.target.checked)}
              style={{
                width: '18px',
                height: '18px',
                minHeight: '18px',
                accentColor: '#0B0C10',
                marginTop: '2px',
                flexShrink: 0
              }}
            />
            <span>
              I consent to receive occasional WhatsApp notifications regarding new limited drops, customizer designs, and atelier previews.
            </span>
          </label>

          {validationError && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.75rem 1rem',
                backgroundColor: '#FFF1F2',
                border: '1px solid #FECDD3',
                borderRadius: '0.75rem',
                color: '#BE123C',
                fontSize: '0.8125rem'
              }}
            >
              <AlertCircle size={16} style={{ flexShrink: 0 }} />
              <span>{validationError}</span>
            </div>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '0.25rem' }}>
            <button
              type="submit"
              disabled={isSubmitting || !phoneNumber}
              className="btn-luxury-primary"
              style={{ width: '100%', minHeight: '50px' }}
            >
              {isSubmitting ? 'Saving Coordinates...' : 'Save & Continue to Atelier'}
            </button>

            <button
              type="button"
              onClick={dismissPhoneOnboarding}
              style={{
                fontSize: '0.8125rem',
                color: '#6B7280',
                textDecoration: 'underline',
                padding: '0.375rem 0',
                textAlign: 'center',
                background: 'none',
                border: 'none',
                cursor: 'pointer'
              }}
            >
              Skip for now (I'll enter during checkout)
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
