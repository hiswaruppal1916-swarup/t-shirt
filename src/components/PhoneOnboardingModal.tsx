import React, { useState } from 'react';
import { Phone, Check, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const PhoneOnboardingModal: React.FC = () => {
  const { needsPhoneOnboarding, savePhoneNumber, user, customerProfile } = useAuth();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [marketingConsent, setMarketingConsent] = useState(false);
  const [validationError, setValidationError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!needsPhoneOnboarding) {
    return null;
  }

  const handlePhoneSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError('');

    // Remove any formatting spaces or dashes
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
        backgroundColor: 'rgba(17, 24, 39, 0.65)',
        backdropFilter: 'blur(6px)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem'
      }}
    >
      <div
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '1.25rem',
          maxWidth: '460px',
          width: '100%',
          padding: '2rem',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          position: 'relative'
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <div
            style={{
              width: '56px',
              height: '56px',
              borderRadius: '9999px',
              backgroundColor: '#F3F4F6',
              border: '1px solid #E5E7EB',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#111827',
              marginBottom: '1rem'
            }}
          >
            <Phone size={24} />
          </div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#111827', letterSpacing: '-0.02em' }}>
            Complete Customer Profile
          </h3>
          <p style={{ fontSize: '0.875rem', color: '#6B7280', marginTop: '0.375rem' }}>
            Welcome, <strong>{customerProfile?.name || user?.email}</strong>. A valid phone number is required to receive real-time courier and print updates from Qikink.
          </p>
        </div>

        <form onSubmit={handlePhoneSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: '#374151', marginBottom: '0.5rem' }}>
              Mobile / WhatsApp Number <span style={{ color: '#EF4444' }}>*</span>
            </label>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <span
                style={{
                  position: 'absolute',
                  left: '1rem',
                  fontSize: '0.9375rem',
                  fontWeight: 600,
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
                style={{ paddingLeft: '3.25rem' }}
                maxLength={14}
                required
                autoFocus
              />
            </div>
            <p style={{ fontSize: '0.75rem', color: '#9CA3AF', marginTop: '0.375rem' }}>
              Note: Phone number is recorded for courier delivery notices (not OTP-verified).
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
              lineHeight: '1.4'
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
                accentColor: '#111827',
                marginTop: '2px',
                flexShrink: 0
              }}
            />
            <span>
              I explicitly consent to receive occasional WhatsApp alerts regarding new garment drops, customizer designs, and special discounts.
            </span>
          </label>

          {validationError && (
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
                fontSize: '0.8125rem'
              }}
            >
              <AlertCircle size={16} flex-shrink="0" />
              <span>{validationError}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting || !phoneNumber}
            className="btn-primary"
            style={{ width: '100%', minHeight: '50px' }}
          >
            {isSubmitting ? 'Saving Profile...' : 'Save & Continue Shopping'}
          </button>
        </form>
      </div>
    </div>
  );
};
