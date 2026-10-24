import React, { useState, useMemo } from 'react';
import { Star, Plus, SlidersHorizontal, Search, RotateCcw } from 'lucide-react';
import { Product, ProductVariant } from '../types';
import { useCart } from '../context/CartContext';

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
  const { addToCart } = useCart();
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
    <div className="container" style={{ paddingTop: '2rem', paddingBottom: '4rem' }}>
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

      {/* Header & Controls */}
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#111827', letterSpacing: '-0.02em' }}>
          All Custom Tees & Drops
        </h1>
        <p style={{ fontSize: '0.875rem', color: '#6B7280', marginTop: '0.25rem' }}>
          Showing {filteredProducts.length} verified print-on-demand designs
        </p>

        {/* Filter & Search Bar Controls */}
        <div
          style={{
            marginTop: '1.5rem',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1rem'
          }}
        >
          {/* Category Pills */}
          <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', scrollbarWidth: 'none', maxWidth: '100%' }}>
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

          {/* Sort Dropdown */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#6B7280' }}>Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              style={{
                width: 'auto',
                minHeight: '40px',
                padding: '0.375rem 1rem',
                fontSize: '0.8125rem',
                fontWeight: 600
              }}
            >
              <option value="featured">Featured Drops</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
          </div>
        </div>

        {/* Search Active Indicator */}
        {searchQuery && (
          <div
            style={{
              marginTop: '1rem',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.375rem 0.875rem',
              backgroundColor: '#F3F4F6',
              borderRadius: '9999px',
              fontSize: '0.8125rem',
              color: '#374151'
            }}
          >
            <span>Search: "{searchQuery}"</span>
            <button onClick={() => onSearchChange('')} style={{ fontWeight: 700 }}>
              ✕
            </button>
          </div>
        )}
      </div>

      {/* Empty State */}
      {filteredProducts.length === 0 ? (
        <div
          style={{
            textAlign: 'center',
            padding: '4rem 1rem',
            backgroundColor: '#F9FAFB',
            borderRadius: '1.25rem',
            border: '1px dashed #E5E7EB'
          }}
        >
          <Search size={36} style={{ color: '#9CA3AF', margin: '0 auto 1rem' }} />
          <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: '#111827' }}>
            No Matching T-Shirts Found
          </h3>
          <p style={{ fontSize: '0.875rem', color: '#6B7280', marginTop: '0.25rem' }}>
            Try clearing filters or search for another keyword like "Oversized" or "Tokyo".
          </p>
          <button
            onClick={() => {
              setSelectedCategory('All');
              onSearchChange('');
            }}
            className="btn-secondary"
            style={{ marginTop: '1.25rem' }}
          >
            <RotateCcw size={16} />
            <span>Reset All Filters</span>
          </button>
        </div>
      ) : (
        /* Product Cards Grid — Mobile-first 2 columns, tablet 3, desktop 4 */
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
      )}
    </div>
  );
};
