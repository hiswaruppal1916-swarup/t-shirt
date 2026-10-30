import React, { useState } from 'react';
import { Star, Plus, Check } from 'lucide-react';
import { Product, ProductVariant } from '../types';
import { useCart } from '../context/CartContext';

interface ProductCardProps {
  product: Product;
  variants?: ProductVariant[];
  onSelectProduct: (product: Product) => void;
  index?: number;
  onAddedNotice?: (msg: string) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  variants = [],
  onSelectProduct,
  index = 0,
  onAddedNotice
}) => {
  const { addToCart } = useCart();
  const [isHovered, setIsHovered] = useState(false);
  const [justAdded, setJustAdded] = useState(false);

  const handleQuickAdd = (e: React.MouseEvent) => {
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

    setJustAdded(true);
    if (onAddedNotice) {
      onAddedNotice(`Added "${product.name}" (Size L) to bag`);
    }
    setTimeout(() => setJustAdded(false), 2000);
  };

  const discountPercent = product.compare_price
    ? Math.round(((product.compare_price - product.selling_price) / product.compare_price) * 100)
    : 0;

  return (
    <div
      onClick={() => onSelectProduct(product)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="luxury-card"
      style={{
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        transitionDelay: `${Math.min(index * 40, 300)}ms`
      }}
    >
      {/* Product Image Stage */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          aspectRatio: '3 / 4',
          overflow: 'hidden',
          backgroundColor: '#F7F7F5'
        }}
      >
        <img
          src={product.main_image_url}
          alt={product.name}
          loading="lazy"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transform: isHovered ? 'scale(1.05)' : 'scale(1)',
            transition: 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)'
          }}
        />

        {/* Subtle Vignette Gradient on Image bottom */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to top, rgba(11, 12, 16, 0.15) 0%, transparent 40%)',
            pointerEvents: 'none'
          }}
        />

        {/* GSM & Craft Badge */}
        <div
          style={{
            position: 'absolute',
            top: '0.75rem',
            left: '0.75rem',
            display: 'flex',
            gap: '0.375rem',
            flexWrap: 'wrap'
          }}
        >
          <span
            style={{
              padding: '0.25rem 0.5rem',
              fontSize: '0.625rem',
              fontWeight: 700,
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              borderRadius: '9999px',
              backgroundColor: 'rgba(255, 255, 255, 0.92)',
              backdropFilter: 'blur(8px)',
              color: '#0B0C10',
              border: '1px solid rgba(232, 232, 226, 0.8)',
              boxShadow: '0 2px 6px rgba(0,0,0,0.04)'
            }}
          >
            {product.fabric_gsm || '240 GSM'}
          </span>
          {discountPercent > 0 && (
            <span
              style={{
                padding: '0.25rem 0.5rem',
                fontSize: '0.625rem',
                fontWeight: 700,
                letterSpacing: '0.04em',
                borderRadius: '9999px',
                backgroundColor: 'rgba(5, 150, 105, 0.95)',
                color: '#FFFFFF'
              }}
            >
              -{discountPercent}%
            </span>
          )}
        </div>

        {/* Quick Add Button */}
        <button
          onClick={handleQuickAdd}
          title="Quick add size L to bag"
          aria-label={`Quick add ${product.name} to cart`}
          style={{
            position: 'absolute',
            bottom: '0.75rem',
            right: '0.75rem',
            width: '42px',
            height: '42px',
            borderRadius: '9999px',
            backgroundColor: justAdded ? '#059669' : '#0B0C10',
            color: '#FFFFFF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(11, 12, 16, 0.2)',
            transform: isHovered || justAdded ? 'scale(1.05)' : 'scale(0.96)',
            transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
            zIndex: 3
          }}
        >
          {justAdded ? <Check size={18} /> : <Plus size={18} />}
        </button>
      </div>

      {/* Product Details Section */}
      <div
        style={{
          padding: '1rem',
          display: 'flex',
          flexDirection: 'column',
          flex: 1,
          justifyContent: 'space-between',
          backgroundColor: '#FFFFFF'
        }}
      >
        <div>
          {/* Category Eyebrow & Rating */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.375rem' }}>
            <span
              style={{
                fontSize: '0.6875rem',
                fontWeight: 600,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                color: '#8B6B23'
              }}
            >
              {product.category}
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <Star size={12} fill="#C5A059" color="#C5A059" />
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#0B0C10' }}>4.9</span>
            </div>
          </div>

          {/* Product Title */}
          <h3
            style={{
              fontSize: '0.9375rem',
              fontWeight: 700,
              color: '#0B0C10',
              lineHeight: '1.35',
              letterSpacing: '-0.01em',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden'
            }}
          >
            {product.name}
          </h3>
        </div>

        {/* Pricing Row */}
        <div
          style={{
            marginTop: '1rem',
            paddingTop: '0.75rem',
            borderTop: '1px solid #F3F4F6',
            display: 'flex',
            alignItems: 'baseline',
            gap: '0.5rem'
          }}
        >
          <span style={{ fontSize: '1.125rem', fontWeight: 800, color: '#0B0C10', letterSpacing: '-0.02em' }}>
            ₹{product.selling_price}
          </span>
          {product.compare_price && (
            <span style={{ fontSize: '0.8125rem', color: '#9CA3AF', textDecoration: 'line-through' }}>
              ₹{product.compare_price}
            </span>
          )}
          <span style={{ marginLeft: 'auto', fontSize: '0.6875rem', fontWeight: 600, color: '#6B7280' }}>
            DTG Print
          </span>
        </div>
      </div>
    </div>
  );
};

