import React from 'react';
import { ArrowRight, Sparkles, Feather, ShieldCheck } from 'lucide-react';

interface CardStackItem {
  id: string;
  tag: string;
  title: string;
  subtitle: string;
  description: string;
  badge: string;
  image: string;
  statNumber: string;
  statLabel: string;
}

const STORY_CARDS: CardStackItem[] = [
  {
    id: 'craft-1',
    tag: 'THE ARCHITECTURE OF FABRIC',
    title: '240 GSM Combed Ring-Spun Cotton',
    subtitle: 'Zero compromises on drape, weight, and hand-feel.',
    description:
      'Engineered with premium long-staple cotton fibers subjected to a specialized bio-wash finish. Resists pilling, retains tailored boxy silhouette, and softens with every wear while maintaining heavy streetwear drape.',
    badge: 'Heavyweight Spec',
    image: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=900&q=80',
    statNumber: '240',
    statLabel: 'Grams per Sq. Metre'
  },
  {
    id: 'craft-2',
    tag: 'ORGANIC COLOR FIDELITY',
    title: 'Ultra-Crisp DTG Inks with Precision Curing',
    subtitle: '1200 DPI archival reproduction with zero plastic feel.',
    description:
      'Utilizing Oeko-Tex certified non-toxic water-based pigment inks, printed directly into cotton fibers rather than sitting on top. Colors remain vibrant and breathable through 50+ wash cycles without cracking.',
    badge: 'Direct-to-Garment',
    image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=900&q=80',
    statNumber: '1200',
    statLabel: 'DPI Resolution'
  },
  {
    id: 'craft-3',
    tag: 'THE QIKINK DISPATCH NETWORK',
    title: 'On-Demand Printing, Rapid Global Courier Pipeline',
    subtitle: 'Zero dead inventory. Dispatched in 48-72 hours.',
    description:
      'Each piece is crafted upon your command through our automated Qikink integration. From automated pre-treatment and thermal curing to barcode inspection and courier pickup, quality is logged at every milestone.',
    badge: 'Zero Minimums',
    image: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=900&q=80',
    statNumber: '48h',
    statLabel: 'Average Dispatch'
  }
];

interface CardStackProps {
  onExplore?: () => void;
}

export const CardStack: React.FC<CardStackProps> = ({ onExplore }) => {
  return (
    <section style={{ padding: 'clamp(3rem, 6vw, 6rem) 0', backgroundColor: '#FBFBFA' }}>
      <div className="container">
        {/* Section Header */}
        <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 3.5rem' }}>
          <span className="editorial-eyebrow">
            <Sparkles size={14} />
            The Atelier Standard
          </span>
          <h2
            style={{
              fontSize: 'clamp(1.75rem, 3.5vw, 2.75rem)',
              fontWeight: 800,
              letterSpacing: '-0.03em',
              color: '#0B0C10',
              marginTop: '0.5rem',
              lineHeight: 1.15
            }}
          >
            Crafted for Longevity. <br />
            <span style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontWeight: 400 }}>
              Engineered with Precision.
            </span>
          </h2>
          <p style={{ color: '#4B5563', marginTop: '1rem', fontSize: '0.9375rem', lineHeight: 1.6 }}>
            Explore the three foundational pillars that define our custom streetwear production.
          </p>
        </div>

        {/* Sticky Card Stack Container */}
        <div style={{ position: 'relative', maxWidth: '1080px', margin: '0 auto' }}>
          {STORY_CARDS.map((card, idx) => {
            const isDark = idx === 2;

            return (
              <div
                key={card.id}
                style={{
                  position: 'sticky',
                  top: `calc(90px + ${idx * 24}px)`,
                  backgroundColor: isDark ? '#0B0C10' : '#FFFFFF',
                  color: isDark ? '#FFFFFF' : '#0B0C10',
                  borderRadius: '1.5rem',
                  border: isDark ? '1px solid rgba(255, 255, 255, 0.12)' : '1px solid #E8E8E2',
                  boxShadow: '0 20px 40px -10px rgba(11, 12, 16, 0.08)',
                  padding: 'clamp(1.5rem, 4vw, 3rem)',
                  marginBottom: '2.5rem',
                  zIndex: idx + 1,
                  transition: 'transform 0.3s ease'
                }}
              >
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 320px), 1fr))',
                    gap: 'clamp(1.5rem, 4vw, 3rem)',
                    alignItems: 'center'
                  }}
                >
                  {/* Left Column: Narrative Copy */}
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                      <span
                        style={{
                          fontSize: '0.6875rem',
                          fontWeight: 700,
                          letterSpacing: '0.14em',
                          color: isDark ? '#C5A059' : '#8B6B23',
                          textTransform: 'uppercase'
                        }}
                      >
                        {card.tag}
                      </span>
                      <span
                        style={{
                          fontSize: '0.6875rem',
                          fontWeight: 700,
                          padding: '0.2rem 0.5rem',
                          borderRadius: '9999px',
                          backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : '#F3F4F6',
                          color: isDark ? '#E5E7EB' : '#4B5563'
                        }}
                      >
                        {card.badge}
                      </span>
                    </div>

                    <h3
                      style={{
                        fontSize: 'clamp(1.35rem, 2.5vw, 1.875rem)',
                        fontWeight: 800,
                        letterSpacing: '-0.02em',
                        lineHeight: 1.25,
                        color: isDark ? '#FFFFFF' : '#0B0C10'
                      }}
                    >
                      {card.title}
                    </h3>

                    <p
                      style={{
                        fontSize: '0.9375rem',
                        fontWeight: 600,
                        color: isDark ? '#D1D5DB' : '#374151',
                        marginTop: '0.5rem',
                        lineHeight: 1.5
                      }}
                    >
                      {card.subtitle}
                    </p>

                    <p
                      style={{
                        fontSize: '0.875rem',
                        color: isDark ? '#9CA3AF' : '#6B7280',
                        marginTop: '0.75rem',
                        lineHeight: 1.6
                      }}
                    >
                      {card.description}
                    </p>

                    {/* Stat Highlight Row */}
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'baseline',
                        gap: '0.75rem',
                        marginTop: '1.75rem',
                        paddingTop: '1.25rem',
                        borderTop: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid #F3F4F6'
                      }}
                    >
                      <span
                        style={{
                          fontSize: '2rem',
                          fontWeight: 800,
                          color: isDark ? '#C5A059' : '#0B0C10',
                          letterSpacing: '-0.03em'
                        }}
                      >
                        {card.statNumber}
                      </span>
                      <span
                        style={{
                          fontSize: '0.75rem',
                          fontWeight: 600,
                          color: isDark ? '#9CA3AF' : '#6B7280',
                          textTransform: 'uppercase',
                          letterSpacing: '0.05em'
                        }}
                      >
                        {card.statLabel}
                      </span>
                    </div>
                  </div>

                  {/* Right Column: Editorial Visual */}
                  <div
                    style={{
                      borderRadius: '1.25rem',
                      overflow: 'hidden',
                      aspectRatio: '4 / 3',
                      border: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid #E8E8E2',
                      boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
                    }}
                  >
                    <img
                      src={card.image}
                      alt={card.title}
                      loading="lazy"
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        filter: isDark ? 'brightness(0.95)' : 'none'
                      }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {onExplore && (
          <div style={{ textAlign: 'center', marginTop: '2.5rem' }}>
            <button onClick={onExplore} className="btn-luxury-primary">
              <span>Explore The Current Collection</span>
              <ArrowRight size={16} />
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

