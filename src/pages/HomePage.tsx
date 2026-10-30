import React, { useState, useEffect } from 'react';
import { ArrowRight, Sparkles, Star, ShieldCheck, Feather, Truck, Award, Compass } from 'lucide-react';
import { Product, ProductVariant } from '../types';
import { ProductCard } from '../components/ProductCard';
import { CardStack } from '../components/Motion/CardStack';
import { ScrollReveal } from '../components/Motion/ScrollReveal';

interface HomePageProps {
  products: Product[];
  variants?: ProductVariant[];
  onNavigate: (view: string, param?: string) => void;
  onSelectProduct: (product: Product) => void;
}

const CATEGORIES = ['All', 'Graphic Tees', 'Minimalist', 'Oversized', 'Typography'];

export const HomePage: React.FC<HomePageProps> = ({
  products,
  variants = [],
  onNavigate,
  onSelectProduct
}) => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [addedNotice, setAddedNotice] = useState<string | null>(null);
  const [heroMounted, setHeroMounted] = useState(false);

  useEffect(() => {
    // Trigger choreographed hero entrance on mount
    const timer = setTimeout(() => setHeroMounted(true), 50);
    return () => clearTimeout(timer);
  }, []);

  const filteredProducts =
    selectedCategory === 'All'
      ? products
      : products.filter((p) => p.category.toLowerCase() === selectedCategory.toLowerCase());

  return (
    <div style={{ backgroundColor: '#FFFFFF', minHeight: '100vh', paddingBottom: '4rem' }}>
      {/* Toast Notification */}
      {addedNotice && (
        <div
          style={{
            position: 'fixed',
            top: '5.5rem',
            right: '1.5rem',
            backgroundColor: '#0B0C10',
            color: '#FFFFFF',
            padding: '0.875rem 1.5rem',
            borderRadius: '9999px',
            fontSize: '0.875rem',
            fontWeight: 600,
            zIndex: 100,
            boxShadow: '0 15px 35px -5px rgba(11,12,16,0.3)',
            border: '1px solid rgba(197, 160, 89, 0.4)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            animation: 'fadeInSoft 0.3s ease'
          }}
        >
          <Sparkles size={16} color="#C5A059" />
          <span>{addedNotice}</span>
        </div>
      )}

      {/* PHASE 3: ULTRA-PREMIUM CINEMATIC HERO SECTION */}
      <section
        style={{
          position: 'relative',
          backgroundColor: '#0B0C10',
          color: '#FFFFFF',
          overflow: 'hidden',
          padding: 'clamp(3.5rem, 8vw, 7rem) 0 clamp(3.5rem, 6vw, 6rem)'
        }}
      >
        {/* Subtle Luxury Ambient Radial Glow */}
        <div
          style={{
            position: 'absolute',
            top: '-20%',
            right: '-10%',
            width: '600px',
            height: '600px',
            background: 'radial-gradient(circle, rgba(197, 160, 89, 0.09) 0%, transparent 70%)',
            pointerEvents: 'none',
            zIndex: 0
          }}
        />

        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 340px), 1fr))',
              gap: 'clamp(2.5rem, 5vw, 4.5rem)',
              alignItems: 'center'
            }}
          >
            {/* Left Hero Column: Choreographed Typography & CTAs */}
            <div>
              {/* Step 4: Small introductory label */}
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.375rem 0.875rem',
                  backgroundColor: 'rgba(255, 255, 255, 0.06)',
                  border: '1px solid rgba(197, 160, 89, 0.35)',
                  borderRadius: '9999px',
                  fontSize: '0.6875rem',
                  fontWeight: 700,
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  color: '#C5A059',
                  marginBottom: '1.5rem',
                  opacity: heroMounted ? 1 : 0,
                  transform: heroMounted ? 'translateY(0)' : 'translateY(12px)',
                  transition: 'opacity 0.7s cubic-bezier(0.16, 1, 0.3, 1) 0.15s, transform 0.7s cubic-bezier(0.16, 1, 0.3, 1) 0.15s'
                }}
              >
                <Sparkles size={14} color="#C5A059" />
                <span>Atelier Print-on-Demand • 240 GSM</span>
              </div>

              {/* Step 5: Main headline revealed line by line */}
              <div
                style={{
                  opacity: heroMounted ? 1 : 0,
                  transform: heroMounted ? 'translateY(0)' : 'translateY(18px)',
                  transition: 'opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.3s, transform 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.3s'
                }}
              >
                <h1
                  style={{
                    fontSize: 'clamp(2rem, 5.5vw, 3.75rem)',
                    fontWeight: 800,
                    letterSpacing: '-0.035em',
                    lineHeight: '1.08',
                    color: '#FFFFFF'
                  }}
                >
                  Wear Your Vision in{' '}
                  <span
                    style={{
                      fontFamily: 'var(--font-serif)',
                      fontStyle: 'italic',
                      fontWeight: 400,
                      color: '#C5A059'
                    }}
                  >
                    Heavyweight Cotton.
                  </span>
                </h1>
              </div>

              {/* Step 6: Supporting description */}
              <p
                style={{
                  fontSize: 'clamp(0.9375rem, 1.2vw, 1.125rem)',
                  color: '#9CA3AF',
                  marginTop: '1.5rem',
                  lineHeight: '1.7',
                  maxWidth: '520px',
                  opacity: heroMounted ? 1 : 0,
                  transform: heroMounted ? 'translateY(0)' : 'translateY(16px)',
                  transition: 'opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.45s, transform 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.45s'
                }}
              >
                Sculpted from 240 GSM combed ring-spun cotton with an architectural boxy drape.
                Ultra-crisp organic pigment DTG printing, fulfilled on-demand through Qikink with zero minimums.
              </p>

              {/* Step 7 & 8: Primary and Secondary CTAs */}
              <div
                style={{
                  marginTop: '2.5rem',
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: '1rem',
                  opacity: heroMounted ? 1 : 0,
                  transform: heroMounted ? 'translateY(0)' : 'translateY(16px)',
                  transition: 'opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.6s, transform 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.6s'
                }}
              >
                <button
                  onClick={() => onNavigate('shop')}
                  className="btn-luxury-primary"
                  style={{
                    backgroundColor: '#FFFFFF',
                    color: '#0B0C10',
                    padding: '0.875rem 2.25rem',
                    boxShadow: '0 8px 24px rgba(255, 255, 255, 0.15)'
                  }}
                >
                  <span>Explore Drops</span>
                  <ArrowRight size={18} />
                </button>
                <button
                  onClick={() => onNavigate('shop', 'Oversized')}
                  className="btn-luxury-secondary"
                  style={{
                    color: '#FFFFFF',
                    borderColor: 'rgba(255, 255, 255, 0.25)',
                    padding: '0.875rem 2rem'
                  }}
                >
                  <span>Oversized Fits</span>
                </button>
              </div>

              {/* Step 9: Trust cues row */}
              <div
                style={{
                  marginTop: '2.5rem',
                  paddingTop: '2rem',
                  borderTop: '1px solid rgba(255, 255, 255, 0.1)',
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: '1.5rem',
                  opacity: heroMounted ? 1 : 0,
                  transition: 'opacity 0.9s cubic-bezier(0.16, 1, 0.3, 1) 0.75s'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Award size={16} color="#C5A059" />
                  <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#D1D5DB' }}>
                    240 GSM Bio-Washed
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Truck size={16} color="#C5A059" />
                  <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#D1D5DB' }}>
                    48h Qikink Dispatch
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <ShieldCheck size={16} color="#C5A059" />
                  <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#D1D5DB' }}>
                    Zero Inventory Waste
                  </span>
                </div>
              </div>
            </div>

            {/* Right Hero Column: Masked scale visual reveal */}
            <div
              style={{
                position: 'relative',
                opacity: heroMounted ? 1 : 0,
                transform: heroMounted ? 'scale(1)' : 'scale(1.05)',
                transition: 'opacity 1s cubic-bezier(0.16, 1, 0.3, 1) 0.2s, transform 1.2s cubic-bezier(0.16, 1, 0.3, 1) 0.2s'
              }}
            >
              <div
                style={{
                  borderRadius: '1.75rem',
                  overflow: 'hidden',
                  aspectRatio: '4 / 4.5',
                  backgroundColor: '#171923',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.5)',
                  position: 'relative'
                }}
              >
                <img
                  src="https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1200&q=85"
                  alt="Tokyo Monolith Heavyweight Graphic T-Shirt"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover'
                  }}
                />

                {/* Subtle Luxury Gradient Overlay */}
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(to top, rgba(11, 12, 16, 0.8) 0%, transparent 50%)',
                    pointerEvents: 'none'
                  }}
                />

                {/* Editorial Signature Badge */}
                <div
                  style={{
                    position: 'absolute',
                    bottom: '1.5rem',
                    left: '1.5rem',
                    right: '1.5rem',
                    padding: '1.25rem',
                    borderRadius: '1rem',
                    backgroundColor: 'rgba(11, 12, 16, 0.88)',
                    backdropFilter: 'blur(16px)',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    boxShadow: '0 8px 32px rgba(0,0,0,0.3)'
                  }}
                >
                  <div>
                    <span
                      style={{
                        display: 'block',
                        fontSize: '0.6875rem',
                        fontWeight: 700,
                        letterSpacing: '0.12em',
                        textTransform: 'uppercase',
                        color: '#C5A059'
                      }}
                    >
                      Featured Atelier Drop
                    </span>
                    <span
                      style={{
                        fontSize: '1rem',
                        fontWeight: 800,
                        color: '#FFFFFF',
                        letterSpacing: '-0.02em',
                        marginTop: '0.125rem',
                        display: 'block'
                      }}
                    >
                      Tokyo Monolith Heavyweight • ₹899
                    </span>
                  </div>

                  <button
                    onClick={() => {
                      const tokyoItem = products.find((p) => p.name.includes('Tokyo')) || products[0];
                      if (tokyoItem) onSelectProduct(tokyoItem);
                    }}
                    style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '9999px',
                      backgroundColor: '#FFFFFF',
                      color: '#0B0C10',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0
                    }}
                    title="View Tokyo Monolith"
                  >
                    <ArrowRight size={18} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PHASE 7: ADVANCED CARD STACK SCROLL EFFECT ("THE ATELIER STANDARD") */}
      <CardStack onExplore={() => onNavigate('shop')} />

      {/* PHASE 8: CURATED DROPS SECTION */}
      <div className="container" style={{ marginTop: '4rem' }}>
        {/* Section Header */}
        <ScrollReveal>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '1.5rem',
              marginBottom: '2.5rem'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <span className="editorial-eyebrow">
                  <Feather size={14} />
                  Curated Catalog
                </span>
                <h2
                  style={{
                    fontSize: 'clamp(1.75rem, 3.5vw, 2.5rem)',
                    fontWeight: 800,
                    color: '#0B0C10',
                    letterSpacing: '-0.03em',
                    marginTop: '0.25rem'
                  }}
                >
                  Featured T-Shirts
                </h2>
              </div>

              <button
                onClick={() => onNavigate('shop')}
                className="btn-luxury-secondary"
                style={{ padding: '0.625rem 1.25rem', fontSize: '0.8125rem' }}
              >
                <span>View Full Catalog ({products.length})</span>
                <ArrowRight size={14} />
              </button>
            </div>

            {/* Filter Pills with Luxury Indicator */}
            <div
              style={{
                display: 'flex',
                gap: '0.625rem',
                overflowX: 'auto',
                paddingBottom: '0.5rem',
                scrollbarWidth: 'none'
              }}
            >
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`filter-chip ${selectedCategory === cat ? 'active' : ''}`}
                  style={{
                    borderRadius: '9999px',
                    padding: '0.5rem 1.25rem',
                    fontSize: '0.8125rem',
                    fontWeight: selectedCategory === cat ? 700 : 500
                  }}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </ScrollReveal>

        {/* Product Grid with Staggered ProductCard Experience */}
        <div className="product-grid">
          {filteredProducts.map((product, idx) => (
            <ScrollReveal key={product.id} delay={Math.min(idx * 60, 300)}>
              <ProductCard
                product={product}
                variants={variants}
                onSelectProduct={onSelectProduct}
                index={idx}
                onAddedNotice={(msg) => {
                  setAddedNotice(msg);
                  setTimeout(() => setAddedNotice(null), 3000);
                }}
              />
            </ScrollReveal>
          ))}
        </div>
      </div>

      {/* EDITORIAL STORY / LOOKBOOK BANNER */}
      <section style={{ marginTop: '5rem', backgroundColor: '#FBFBFA', borderTop: '1px solid #E8E8E2', borderBottom: '1px solid #E8E8E2', padding: 'clamp(3rem, 6vw, 5rem) 0' }}>
        <div className="container">
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 320px), 1fr))',
              gap: 'clamp(2rem, 5vw, 4rem)',
              alignItems: 'center'
            }}
          >
            <div style={{ position: 'relative' }}>
              <div
                style={{
                  borderRadius: '1.5rem',
                  overflow: 'hidden',
                  aspectRatio: '4 / 3',
                  boxShadow: '0 20px 40px -10px rgba(11, 12, 16, 0.1)',
                  border: '1px solid #E8E8E2'
                }}
              >
                <img
                  src="https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=1000&q=80"
                  alt="Streetwear Lookbook"
                  loading="lazy"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>
            </div>

            <div>
              <span className="editorial-eyebrow">
                <Compass size={14} />
                The Lookbook
              </span>
              <h2
                style={{
                  fontSize: 'clamp(1.75rem, 3vw, 2.5rem)',
                  fontWeight: 800,
                  letterSpacing: '-0.025em',
                  color: '#0B0C10',
                  marginTop: '0.5rem',
                  lineHeight: 1.2
                }}
              >
                Understated Modernity. <br />
                <span style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontWeight: 400 }}>
                  Streetwear Without Excess.
                </span>
              </h2>
              <p style={{ color: '#4B5563', marginTop: '1.25rem', lineHeight: 1.7, fontSize: '0.9375rem' }}>
                Every design in our atelier is calibrated for exact print density and pigment balance.
                Whether you prefer subtle minimalist typography or bold graphic statements, the 240 GSM
                weight ensures consistent drape and form factor across all unisex silhouettes.
              </p>
              <div style={{ marginTop: '2rem' }}>
                <button onClick={() => onNavigate('shop')} className="btn-luxury-primary">
                  <span>Explore The Lookbook</span>
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
