import React, { useState, useMemo } from 'react';
import { Search, RotateCcw, Sparkles, ArrowUpDown } from 'lucide-react';
import { Product, ProductVariant } from '../types';
import { ProductCard } from '../components/ProductCard';
import { ScrollReveal } from '../components/Motion/ScrollReveal';

interface ShopPageProps {
  products: Product[];
  variants?: ProductVariant[];
  initialCategory?: string;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onSelectProduct: (product: Product) => void;
}

const CATEGORIES = ['All', 'Graphic Tees', 'Minimalist', 'Oversized', 'Typography'];

export const ShopPage: React.FC<ShopPageProps> = ({
  products,
  variants = [],
  initialCategory = 'All',
  searchQuery,
  onSearchChange,
  onSelectProduct
}) => {
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [sortBy, setSortBy] = useState<'featured' | 'price-low' | 'price-high'>('featured');
  const [addedNotice, setAddedNotice] = useState<string | null>(null);

  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        const matchesCategory =
          selectedCategory === 'All' || p.category.toLowerCase() === selectedCategory.toLowerCase();
        const matchesSearch =
          !searchQuery ||
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.category.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
      })
      .sort((a, b) => {
        if (sortBy === 'price-low') return a.selling_price - b.selling_price;
        if (sortBy === 'price-high') return b.selling_price - a.selling_price;
        return 0; // featured default
      });
  }, [products, selectedCategory, searchQuery, sortBy]);

  return (
    <div style={{ backgroundColor: '#FFFFFF', minHeight: '100vh', paddingTop: '2.5rem', paddingBottom: '6rem' }}>
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

      <div className="container">
        {/* Editorial Catalog Header */}
        <ScrollReveal>
          <div style={{ marginBottom: '2.5rem' }}>
            <span className="editorial-eyebrow">
              <Sparkles size={14} />
              The Complete Archive
            </span>
            <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginTop: '0.5rem' }}>
              <h1
                style={{
                  fontSize: 'clamp(2rem, 4vw, 3rem)',
                  fontWeight: 800,
                  color: '#0B0C10',
                  letterSpacing: '-0.03em',
                  lineHeight: '1.1'
                }}
              >
                All Atelier Drops
              </h1>
              <span
                style={{
                  fontSize: '0.8125rem',
                  fontWeight: 600,
                  color: '#6B7280',
                  letterSpacing: '0.04em'
                }}
              >
                {filteredProducts.length} {filteredProducts.length === 1 ? 'Design' : 'Designs'} Available
              </span>
            </div>
            <p style={{ fontSize: '0.9375rem', color: '#4B5563', marginTop: '0.5rem', maxWidth: '580px' }}>
              Heavyweight 240 GSM combed cotton blanks with organic pigment DTG printing. Zero minimums, printed on-demand and shipped via Qikink.
            </p>

            {/* Filter and Sort Toolbar */}
            <div
              style={{
                marginTop: '2rem',
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '1rem',
                padding: '1rem',
                backgroundColor: '#FBFBFA',
                borderRadius: '1.25rem',
                border: '1px solid #E8E8E2'
              }}
            >
              {/* Category Filter Pills */}
              <div
                style={{
                  display: 'flex',
                  gap: '0.5rem',
                  overflowX: 'auto',
                  scrollbarWidth: 'none',
                  maxWidth: '100%'
                }}
              >
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`filter-chip ${selectedCategory === cat ? 'active' : ''}`}
                    style={{
                      borderRadius: '9999px',
                      padding: '0.5rem 1.125rem',
                      fontSize: '0.8125rem',
                      fontWeight: selectedCategory === cat ? 700 : 500
                    }}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Sort Selector */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', marginLeft: 'auto' }}>
                <ArrowUpDown size={15} color="#6B7280" />
                <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#6B7280' }}>Sort:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  style={{
                    width: 'auto',
                    minHeight: '38px',
                    padding: '0.375rem 1rem',
                    fontSize: '0.8125rem',
                    fontWeight: 600,
                    backgroundColor: '#FFFFFF',
                    borderColor: '#E8E8E2',
                    borderRadius: '9999px',
                    color: '#0B0C10'
                  }}
                >
                  <option value="featured">Featured Drops</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                </select>
              </div>
            </div>

            {/* Active Search Query Tag */}
            {searchQuery && (
              <div
                style={{
                  marginTop: '1rem',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.375rem 1rem',
                  backgroundColor: '#F4F4F0',
                  borderRadius: '9999px',
                  fontSize: '0.8125rem',
                  color: '#0B0C10',
                  border: '1px solid #E8E8E2'
                }}
              >
                <span>Searching: <strong>"{searchQuery}"</strong></span>
                <button
                  onClick={() => onSearchChange('')}
                  style={{
                    marginLeft: '0.25rem',
                    fontWeight: 700,
                    color: '#6B7280',
                    cursor: 'pointer'
                  }}
                  aria-label="Clear search"
                >
                  ✕
                </button>
              </div>
            )}
          </div>
        </ScrollReveal>

        {/* Empty State vs Products Grid */}
        {filteredProducts.length === 0 ? (
          <ScrollReveal>
            <div
              style={{
                textAlign: 'center',
                padding: '5rem 1.5rem',
                backgroundColor: '#FBFBFA',
                borderRadius: '1.5rem',
                border: '1px dashed #E8E8E2',
                maxWidth: '600px',
                margin: '2rem auto'
              }}
            >
              <div
                style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '9999px',
                  backgroundColor: '#FFFFFF',
                  border: '1px solid #E8E8E2',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#9CA3AF',
                  marginBottom: '1.25rem'
                }}
              >
                <Search size={24} />
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0B0C10' }}>
                No Matching Atelier Drops Found
              </h3>
              <p style={{ fontSize: '0.875rem', color: '#6B7280', marginTop: '0.5rem', lineHeight: 1.6 }}>
                We couldn't find any garments matching your current filter criteria.
                Try resetting your filters or exploring our curated graphic and oversized collections.
              </p>
              <button
                onClick={() => {
                  setSelectedCategory('All');
                  onSearchChange('');
                }}
                className="btn-luxury-primary"
                style={{ marginTop: '1.75rem' }}
              >
                <RotateCcw size={16} />
                <span>Reset All Filters</span>
              </button>
            </div>
          </ScrollReveal>
        ) : (
          <div className="product-grid">
            {filteredProducts.map((product, idx) => (
              <ScrollReveal key={product.id} delay={Math.min(idx * 50, 300)}>
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
        )}
      </div>
    </div>
  );
};
