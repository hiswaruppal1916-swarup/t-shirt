import React, { useState } from 'react';
import { Star, Truck, ShieldCheck, RefreshCw, Check, ArrowLeft, Heart, Share2 } from 'lucide-react';
import { Product, ProductVariant } from '../types';
import { useCart } from '../context/CartContext';

interface ProductDetailPageProps {
  product: Product;
  variants: ProductVariant[];
  onNavigate: (view: string) => void;
}

export const ProductDetailPage: React.FC<ProductDetailPageProps> = ({
  product,
  variants,
  onNavigate
}) => {
  const { addToCart } = useCart();
  const [selectedSize, setSelectedSize] = useState<string>('L');
  const [selectedColor, setSelectedColor] = useState<string>('Phantom Black');
  const [quantity, setQuantity] = useState<number>(1);
  const [activeImageIndex, setActiveImageIndex] = useState<number>(0);
  const [validationError, setValidationError] = useState<string>('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Gallery images list
  const galleryImages = [
    product.main_image_url,
    product.mockup_url || product.main_image_url,
    'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=800&q=80'
  ].filter(Boolean);

  // Unique sizes and colors from available variants
  const availableSizes = ['S', 'M', 'L', 'XL', '2XL'];
  const availableColors = [
    { name: 'Phantom Black', hex: '#111827' },
    { name: 'Pure White', hex: '#FFFFFF' },
    { name: 'Olive Sand', hex: '#78716C' },
    { name: 'Natural Beige', hex: '#E7E5E4' }
  ];

  // Find exact matching variant
  const currentVariant = variants.find(
    (v) => v.product_id === product.id && v.size === selectedSize && v.color === selectedColor
  ) || {
    id: `${product.id}-${selectedSize}-${selectedColor}`,
    qikink_sku: `QIK-TS-${selectedColor.substring(0, 3).toUpperCase()}-${selectedSize}`,
    variant_name: `${selectedColor} / ${selectedSize}`,
    inventory_count: 50
  };

  const handleAddToCart = () => {
    if (!selectedSize || !selectedColor) {
      setValidationError('Please select both a size and color.');
      return;
    }
    setValidationError('');

    addToCart({
      productId: product.id,
      productName: product.name,
      productSlug: product.slug,
      variantId: currentVariant.id || `${product.id}-${selectedSize}-${selectedColor}`,
      variantName: `${selectedColor} / ${selectedSize}`,
      size: selectedSize,
      color: selectedColor,
      qikinkSku: currentVariant.qikink_sku,
      unitPrice: product.selling_price,
      quantity: quantity,
      imageUrl: galleryImages[activeImageIndex] || product.main_image_url
    });

    setToastMessage(`Added ${quantity} × ${product.name} (${selectedSize}) to bag!`);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleBuyNow = () => {
    if (!selectedSize || !selectedColor) {
      setValidationError('Please select both a size and color before checking out.');
      return;
    }
    setValidationError('');
    handleAddToCart();
    onNavigate('checkout');
  };

  return (
    <div className="container" style={{ paddingTop: '1.5rem', paddingBottom: '7rem' }}>
      {/* Toast Notice */}
      {toastMessage && (
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
          {toastMessage}
        </div>
      )}

      {/* Back button breadcrumb */}
      <div style={{ marginBottom: '1.25rem' }}>
        <button
          onClick={() => onNavigate('shop')}
          style={{ display: 'inline-flex', alignItems: 'center', gap: '0.375rem', fontSize: '0.8125rem', fontWeight: 600, color: '#4B5563' }}
        >
          <ArrowLeft size={16} />
          <span>Back to Catalog</span>
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))', gap: 'clamp(1.5rem, 3vw, 2.5rem)' }}>
        {/* Gallery Section */}
        <div>
          <div
            style={{
              position: 'relative',
              borderRadius: '1.25rem',
              overflow: 'hidden',
              backgroundColor: '#F9FAFB',
              border: '1px solid #E5E7EB',
              aspectRatio: '3 / 4'
            }}
          >
            <img
              src={galleryImages[activeImageIndex]}
              alt={product.name}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
            <span className="product-badge">{product.fabric_gsm || '240 GSM'}</span>
          </div>

          {/* Thumbnails Row */}
          <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem', overflowX: 'auto' }}>
            {galleryImages.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setActiveImageIndex(idx)}
                style={{
                  width: '72px',
                  height: '84px',
                  borderRadius: '0.5rem',
                  overflow: 'hidden',
                  border: activeImageIndex === idx ? '2px solid #111827' : '1px solid #E5E7EB',
                  opacity: activeImageIndex === idx ? 1 : 0.7,
                  flexShrink: 0,
                  transition: 'all 0.15s ease'
                }}
              >
                <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </button>
            ))}
          </div>
        </div>

        {/* Product Meta & Controls Section */}
        <div>
          {/* Header & Title */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                <Star size={14} fill="#111827" color="#111827" />
                <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#111827' }}>4.9</span>
              </div>
              <span style={{ fontSize: '0.8125rem', color: '#9CA3AF' }}>• 184 Verified Reviews</span>
              <span
                style={{
                  marginLeft: 'auto',
                  fontSize: '0.6875rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  padding: '0.25rem 0.5rem',
                  borderRadius: '9999px',
                  backgroundColor: '#ECFDF5',
                  color: '#065F46',
                  border: '1px solid #A7F3D0'
                }}
              >
                In Stock & Ready to Print
              </span>
            </div>

            <h1 style={{ fontSize: '1.875rem', fontWeight: 800, color: '#111827', letterSpacing: '-0.02em', lineHeight: '1.2' }}>
              {product.name}
            </h1>

            <p style={{ fontSize: '0.875rem', color: '#4B5563', marginTop: '0.75rem', lineHeight: '1.6' }}>
              {product.description}
            </p>
          </div>

          {/* Pricing */}
          <div style={{ marginTop: '1.5rem', padding: '1rem', backgroundColor: '#F9FAFB', borderRadius: '0.875rem', border: '1px solid #E5E7EB', display: 'flex', alignItems: 'baseline', gap: '0.75rem' }}>
            <span style={{ fontSize: '1.875rem', fontWeight: 800, color: '#111827' }}>
              ₹{product.selling_price}
            </span>
            {product.compare_price && (
              <span style={{ fontSize: '1.125rem', color: '#9CA3AF', textDecoration: 'line-through' }}>
                ₹{product.compare_price}
              </span>
            )}
            {product.compare_price && (
              <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#10B981', padding: '0.25rem 0.5rem', backgroundColor: '#ECFDF5', borderRadius: '9999px' }}>
                SAVE ₹{product.compare_price - product.selling_price} (40% OFF)
              </span>
            )}
          </div>

          {/* Color Selection */}
          <div style={{ marginTop: '1.75rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.625rem' }}>
              <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#111827' }}>
                Color: <span style={{ fontWeight: 500, color: '#4B5563' }}>{selectedColor}</span>
              </span>
            </div>
            <div style={{ display: 'flex', gap: '0.875rem', flexWrap: 'wrap' }}>
              {availableColors.map((col) => (
                <button
                  key={col.name}
                  onClick={() => setSelectedColor(col.name)}
                  title={col.name}
                  style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: '9999px',
                    backgroundColor: col.hex,
                    border: col.hex === '#FFFFFF' ? '1px solid #D1D5DB' : 'none',
                    boxShadow: selectedColor === col.name ? '0 0 0 2px #FFFFFF, 0 0 0 4px #111827' : 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.15s ease'
                  }}
                >
                  {selectedColor === col.name && (
                    <Check size={18} color={col.hex === '#FFFFFF' ? '#111827' : '#FFFFFF'} />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Size Selection */}
          <div style={{ marginTop: '1.75rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.625rem', flexWrap: 'wrap', gap: '0.25rem' }}>
              <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#111827' }}>
                Size: <span style={{ fontWeight: 500, color: '#4B5563' }}>{selectedSize}</span>
              </span>
              <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#6B7280', textDecoration: 'underline', cursor: 'pointer' }}>
                Standard Unisex Fit Guide
              </span>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              {availableSizes.map((sz) => (
                <button
                  key={sz}
                  onClick={() => setSelectedSize(sz)}
                  className={`filter-chip ${selectedSize === sz ? 'active' : ''}`}
                  style={{ minWidth: '56px', minHeight: '44px', justifyContent: 'center' }}
                >
                  {sz}
                </button>
              ))}
            </div>
          </div>

          {/* Verified Qikink SKU Badge */}
          <div style={{ marginTop: '1rem', fontSize: '0.75rem', color: '#6B7280', display: 'flex', alignItems: 'center', gap: '0.375rem', flexWrap: 'wrap' }}>
            <span>Verified Qikink SKU:</span>
            <code style={{ backgroundColor: '#F3F4F6', padding: '0.125rem 0.375rem', borderRadius: '0.25rem', fontWeight: 600, color: '#111827' }}>
              {currentVariant.qikink_sku}
            </code>
          </div>

          {/* Quantity Controls */}
          <div style={{ marginTop: '1.75rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#111827' }}>Quantity:</span>
            <div style={{ display: 'inline-flex', alignItems: 'center', border: '1px solid #E5E7EB', borderRadius: '9999px', backgroundColor: '#F9FAFB' }}>
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                style={{ width: '44px', height: '44px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '1.125rem' }}
                aria-label="Decrease quantity"
              >
                -
              </button>
              <span style={{ minWidth: '36px', textAlign: 'center', fontSize: '0.9375rem', fontWeight: 700 }}>
                {quantity}
              </span>
              <button
                onClick={() => setQuantity((q) => q + 1)}
                style={{ width: '44px', height: '44px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '1.125rem' }}
                aria-label="Increase quantity"
              >
                +
              </button>
            </div>
          </div>

          {/* Validation Notice */}
          {validationError && (
            <div style={{ marginTop: '1rem', padding: '0.75rem 1rem', backgroundColor: '#FEF2F2', border: '1px solid #FCA5A5', borderRadius: '0.5rem', color: '#B91C1C', fontSize: '0.8125rem' }}>
              {validationError}
            </div>
          )}

          {/* Desktop Direct Buttons */}
          <div className="hidden md:flex" style={{ marginTop: '2rem', gap: '1rem' }}>
            <button
              onClick={handleAddToCart}
              className="btn-secondary"
              style={{ flex: 1, minHeight: '52px' }}
            >
              Add to Bag
            </button>
            <button
              onClick={handleBuyNow}
              className="btn-primary"
              style={{ flex: 1, minHeight: '52px' }}
            >
              Buy Now (₹{product.selling_price * quantity})
            </button>
          </div>

          {/* Print on Demand Specification Card */}
          <div style={{ marginTop: '2.5rem', padding: '1.25rem', border: '1px solid #E5E7EB', borderRadius: '1rem', backgroundColor: '#FAFAFA' }}>
            <h4 style={{ fontSize: '0.875rem', fontWeight: 700, color: '#111827', marginBottom: '0.75rem' }}>
              Technical Print Specifications
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.75rem', fontSize: '0.8125rem' }}>
              <div>
                <span style={{ color: '#6B7280', display: 'block' }}>Fabric Weight</span>
                <strong style={{ color: '#111827' }}>240 GSM Combed Cotton</strong>
              </div>
              <div>
                <span style={{ color: '#6B7280', display: 'block' }}>Print Method</span>
                <strong style={{ color: '#111827' }}>DTG Ultra-HD Inkjet</strong>
              </div>
              <div>
                <span style={{ color: '#6B7280', display: 'block' }}>Placement</span>
                <strong style={{ color: '#111827' }}>Chest Front (12" × 16")</strong>
              </div>
              <div>
                <span style={{ color: '#6B7280', display: 'block' }}>Fulfillment</span>
                <strong style={{ color: '#111827' }}>Qikink POD Network</strong>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sticky Bottom Action Bar for Mobile Viewport */}
      <div className="sticky-action-bar md:hidden">
        <div style={{ flexShrink: 0 }}>
          <span style={{ display: 'block', fontSize: '0.6875rem', color: '#6B7280' }}>Total Payable</span>
          <span style={{ fontSize: '1.125rem', fontWeight: 800, color: '#111827' }}>
            ₹{product.selling_price * quantity}
          </span>
        </div>
        <button
          onClick={handleAddToCart}
          className="btn-secondary"
          style={{ flex: 1, padding: '0.625rem 0.875rem', minHeight: '48px', fontSize: '0.875rem' }}
        >
          Add to Bag
        </button>
        <button
          onClick={handleBuyNow}
          className="btn-primary"
          style={{ flex: 1.2, padding: '0.625rem 0.875rem', minHeight: '48px', fontSize: '0.875rem' }}
        >
          Buy Now
        </button>
      </div>
    </div>
  );
};
