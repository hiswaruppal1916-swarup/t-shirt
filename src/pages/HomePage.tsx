import React, { useState } from 'react';
import { ArrowRight, Star, Plus, Sparkles, SlidersHorizontal } from 'lucide-react';
import { Product, ProductVariant } from '../types';
import { useCart } from '../context/CartContext';

interface HomePageProps {
  products: Product[];
  variants?: ProductVariant[];
  onNavigate: (view: string, param?: string) => void;
  onSelectProduct: (product: Product) => void;
}

const CATEGORIES = ['All', 'Graphic Tees', 'Minimalist', 'Oversized', 'Typography'];

export const HomePage: React.FC<HomePageProps> = ({ products, variants = [], onNavigate, onSelectProduct }) => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const { addToCart } = useCart();
  const [addedNotice, setAddedNotice] = useState<string | null>(null);

  const filteredProducts =
    selectedCategory === 'All'
      ? products
      : products.filter((p) => p.category.toLowerCase() === selectedCategory.toLowerCase());

  const handleQuickAdd = (product: Product, e: React.MouseEvent) => {
    e.stopPropagation();
    const matchedVariant = variants.find((v) => v.product_id === product.id && v.size === 'L') ||
      variants.find((v) => v.product_id === product.id) || {
        id: crypto.randomUUID(),
        qikink_sku: 'QIK-TS-BLK-L',
        variant_name: 'Phantom Black / L',
        size: 'L',
        color: 'Phantom Black'
      };

    addToCart({
      productId: product.id,
      productName: product.name,
      productSlug: product.slug,
      variantId: matchedVariant.id,
      variantName: matchedVariant.variant_name || 'Phantom Black / L',
      size: matchedVariant.size || 'L',
      color: matchedVariant.color || 'Phantom Black',
      qikinkSku: matchedVariant.qikink_sku,
      unitPrice: product.selling_price,
      quantity: 1,
      imageUrl: product.main_image_url
    });

    setAddedNotice(`Added "${product.name}" (Size L) to cart!`);
    setTimeout(() => setAddedNotice(null), 3000);
  };

  return (
    <div style={{ paddingBottom: '3rem' }}>
      {/* Toast Notice */}
      {addedNotice && (
        <div
          style={{
            position: 'fixed',
            top: '5rem',
            right: '1.5rem',
            backgroundColor: '#111827',
            color: '#FFFFFF',
            padding: '0.75rem 1.25rem',
            borderRadius: '9999px',
            fontSize: '0.875rem',
            fontWeight: 600,
            zIndex: 100,
            boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)'
          }}
        >
          {addedNotice}
        </div>
      )}

      {/* Hero Banner — Monochrome Atelier */}
      <section style={{ backgroundColor: '#F9FAFB', borderBottom: '1px solid #E5E7EB', padding: 'clamp(2rem, 5vw, 3.5rem) 0' }}>
        <div className="container" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))', gap: '2rem', alignItems: 'center' }}>
          <div>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.375rem',
                padding: '0.375rem 0.875rem',
                backgroundColor: '#FFFFFF',
                border: '1px solid #E5E7EB',
                borderRadius: '9999px',
                fontSize: '0.6875rem',
                fontWeight: 700,
                letterSpacing: '0.04em',
                textTransform: 'uppercase',
                color: '#111827',
                marginBottom: '1rem'
              }}
            >
              <Sparkles size={14} />
              <span>Print on Demand • Zero Minimums</span>
            </div>

            <h1 style={{ fontSize: 'clamp(1.75rem, 5vw + 0.5rem, 3.25rem)', fontWeight: 800, letterSpacing: '-0.03em', lineHeight: '1.1', color: '#111827' }}>
              Wear Your Vision In Heavyweight Cotton.
            </h1>

            <p style={{ fontSize: 'clamp(0.875rem, 1vw + 0.5rem, 1rem)', color: '#4B5563', marginTop: '1rem', lineHeight: '1.6', maxWidth: '480px' }}>
              Crafted from 240 GSM combed ring-spun cotton. Ultra-crisp DTG printing with organic pigments and bio-wash treatment. Fulfilled directly through Qikink.
            </p>

            <div style={{ marginTop: '1.75rem', display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
              <button
                onClick={() => onNavigate('shop')}
                className="btn-primary"
                style={{ padding: '0.75rem 1.75rem', flex: '1 1 auto', minWidth: '140px' }}
              >
                <span>Explore Drops</span>
                <ArrowRight size={18} />
              </button>
              <button
                onClick={() => onNavigate('shop', 'Oversized')}
                className="btn-secondary"
                style={{ padding: '0.75rem 1.5rem', flex: '1 1 auto', minWidth: '140px' }}
              >
                <span>Oversized Fits</span>
              </button>
            </div>
          </div>

          {/* Hero Visual Mockup */}
          <div style={{ position: 'relative' }}>
            <div
              style={{
                borderRadius: '1.5rem',
                overflow: 'hidden',
                aspectRatio: '4 / 4',
                backgroundColor: '#FFFFFF',
                border: '1px solid #E5E7EB',
                boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.05)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '1.5rem'
              }}
            >
              <img
                src="https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1000&q=80"
                alt="Tokyo Monolith Graphic Heavyweight T-Shirt"
                style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '1rem' }}
              />
            </div>
            {/* Editorial Badge */}
            <div
              style={{
                position: 'absolute',
                bottom: '1rem',
                left: '1rem',
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(8px)',
                padding: '0.625rem 1rem',
                borderRadius: '0.75rem',
                border: '1px solid #E5E7EB',
                boxShadow: '0 4px 12px rgba(0,0,0,0.06)'
              }}
            >
              <span style={{ display: 'block', fontSize: '0.6875rem', fontWeight: 700, textTransform: 'uppercase', color: '#6B7280' }}>
                Featured Drop
              </span>
              <span style={{ fontSize: '0.875rem', fontWeight: 800, color: '#111827' }}>
                Tokyo Monolith Heavyweight • ₹899
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <div className="container" style={{ marginTop: '3rem' }}>
        {/* Section Header & Category Pills */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginBottom: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
            <div>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#6B7280' }}>
                Curated Drops
              </span>
              <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#111827', marginTop: '0.25rem' }}>
                Trending T-Shirts
              </h2>
            </div>
            <button
              onClick={() => onNavigate('shop')}
              style={{ fontSize: '0.875rem', fontWeight: 600, color: '#111827', display: 'flex', alignItems: 'center', gap: '0.25rem' }}
            >
              <span>View All</span>
              <ArrowRight size={16} />
            </button>
          </div>

          {/* Horizontal Scrollable Category Filter Pills */}
          <div
            style={{
              display: 'flex',
              gap: '0.5rem',
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
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Product Cards Grid — Mobile-first 2 columns, tablet 3, desktop 4 */}
        <div className="product-grid">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="product-card"
              onClick={() => onSelectProduct(product)}
              style={{ cursor: 'pointer' }}
            >
              <div className="product-image-container">
                <img src={product.main_image_url} alt={product.name} loading="lazy" />
                <span className="product-badge">{product.fabric_gsm || '240 GSM'}</span>
                {/* Floating Quick Add */}
                <button
                  onClick={(e) => handleQuickAdd(product, e)}
                  title="Quick Add Size L"
                  style={{
                    position: 'absolute',
                    bottom: '0.625rem',
                    right: '0.625rem',
                    width: '44px',
                    height: '44px',
                    borderRadius: '9999px',
                    backgroundColor: '#111827',
                    color: '#FFFFFF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 4px 10px rgba(0,0,0,0.15)',
                    transition: 'transform 0.15s ease'
                  }}
                >
                  <Plus size={20} />
                </button>
              </div>

              <div style={{ padding: '0.875rem', display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'space-between' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', marginBottom: '0.375rem' }}>
                    <Star size={13} fill="#111827" color="#111827" />
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#111827' }}>4.9</span>
                    <span style={{ fontSize: '0.75rem', color: '#9CA3AF' }}>(180+)</span>
                  </div>
                  <h3 style={{ fontSize: '0.9375rem', fontWeight: 700, color: '#111827', lineHeight: '1.3' }}>
                    {product.name}
                  </h3>
                  <p style={{ fontSize: '0.75rem', color: '#6B7280', marginTop: '0.25rem' }}>
                    {product.category}
                  </p>
                </div>

                <div style={{ marginTop: '0.875rem', display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
                  <span style={{ fontSize: '1.125rem', fontWeight: 800, color: '#111827' }}>
                    ₹{product.selling_price}
                  </span>
                  {product.compare_price && (
                    <span style={{ fontSize: '0.8125rem', color: '#9CA3AF', textDecoration: 'line-through' }}>
                      ₹{product.compare_price}
                    </span>
                  )}
                  {product.compare_price && (
                    <span style={{ fontSize: '0.6875rem', fontWeight: 700, color: '#10B981', marginLeft: 'auto' }}>
                      {Math.round(((product.compare_price - product.selling_price) / product.compare_price) * 100)}% OFF
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
