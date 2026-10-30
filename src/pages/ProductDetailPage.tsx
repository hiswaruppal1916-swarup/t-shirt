import React, { useState } from 'react';
import { Star, Truck, ShieldCheck, RefreshCw, Check, ArrowLeft, Sparkles, Award, Layers } from 'lucide-react';
import { Product, ProductVariant } from '../types';
import { useCart } from '../context/CartContext';
import { ScrollReveal } from '../components/Motion/ScrollReveal';

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
    { name: 'Phantom Black', hex: '#0B0C10' },
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
    <div style={{ backgroundColor: '#FFFFFF', minHeight: '100vh', paddingTop: '2rem', paddingBottom: '7rem' }}>
      {/* Toast Notice */}
      {toastMessage && (
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
          <span>{toastMessage}</span>
        </div>
      )}

      <div className="container">
        {/* Back button breadcrumb */}
        <div style={{ marginBottom: '1.75rem' }}>
          <button
            onClick={() => onNavigate('shop')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontSize: '0.8125rem',
              fontWeight: 600,
              color: '#4B5563',
              letterSpacing: '0.02em',
              transition: 'color 0.15s ease'
            }}
          >
            <ArrowLeft size={16} />
            <span>Return to Catalog</span>
          </button>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 340px), 1fr))',
            gap: 'clamp(2rem, 5vw, 4rem)',
            alignItems: 'start'
          }}
        >
          {/* Gallery Section */}
          <ScrollReveal direction="none">
            <div>
              <div
                style={{
                  position: 'relative',
                  borderRadius: '1.5rem',
                  overflow: 'hidden',
                  backgroundColor: '#F7F7F5',
                  border: '1px solid #E8E8E2',
                  aspectRatio: '3 / 4',
                  boxShadow: '0 10px 30px -5px rgba(11, 12, 16, 0.05)'
                }}
              >
                <img
                  key={activeImageIndex}
                  src={galleryImages[activeImageIndex]}
                  alt={product.name}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    animation: 'fadeInSoft 0.4s ease'
                  }}
                />
                <span
                  style={{
                    position: 'absolute',
                    top: '1rem',
                    left: '1rem',
                    padding: '0.3125rem 0.625rem',
                    fontSize: '0.6875rem',
                    fontWeight: 700,
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    borderRadius: '9999px',
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    backdropFilter: 'blur(8px)',
                    color: '#0B0C10',
                    border: '1px solid rgba(232, 232, 226, 0.8)'
                  }}
                >
                  {product.fabric_gsm || '240 GSM'} Combed Cotton
                </span>
              </div>

              {/* Thumbnails Row */}
              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.25rem', overflowX: 'auto', paddingBottom: '0.25rem' }}>
                {galleryImages.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    style={{
                      width: '76px',
                      height: '92px',
                      borderRadius: '0.75rem',
                      overflow: 'hidden',
                      border: activeImageIndex === idx ? '2px solid #C5A059' : '1px solid #E8E8E2',
                      opacity: activeImageIndex === idx ? 1 : 0.65,
                      flexShrink: 0,
                      transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
                      transform: activeImageIndex === idx ? 'scale(1.02)' : 'scale(1)',
                      boxShadow: activeImageIndex === idx ? '0 4px 12px rgba(197, 160, 89, 0.25)' : 'none'
                    }}
                  >
                    <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </button>
                ))}
              </div>
            </div>
          </ScrollReveal>

          {/* Product Meta & Controls Section */}
          <ScrollReveal delay={100} direction="none">
            <div>
              {/* Header & Badges */}
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem', flexWrap: 'wrap' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    <Star size={15} fill="#C5A059" color="#C5A059" />
                    <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#0B0C10' }}>4.9</span>
                  </div>
                  <span style={{ fontSize: '0.8125rem', color: '#9CA3AF' }}>• 184 Verified Reviews</span>
                  <span
                    style={{
                      marginLeft: 'auto',
                      fontSize: '0.6875rem',
                      fontWeight: 700,
                      letterSpacing: '0.04em',
                      textTransform: 'uppercase',
                      padding: '0.25rem 0.625rem',
                      borderRadius: '9999px',
                      backgroundColor: 'rgba(5, 150, 105, 0.08)',
                      color: '#059669',
                      border: '1px solid rgba(5, 150, 105, 0.25)'
                    }}
                  >
                    In Stock • Printed On Demand
                  </span>
                </div>

                <span className="editorial-eyebrow" style={{ marginBottom: '0.375rem' }}>
                  {product.category}
                </span>

                <h1
                  style={{
                    fontSize: 'clamp(1.75rem, 3.5vw, 2.5rem)',
                    fontWeight: 800,
                    color: '#0B0C10',
                    letterSpacing: '-0.025em',
                    lineHeight: '1.15',
                    marginTop: '0.25rem'
                  }}
                >
                  {product.name}
                </h1>

                <p style={{ fontSize: '0.9375rem', color: '#4B5563', marginTop: '1rem', lineHeight: '1.65' }}>
                  {product.description}
                </p>
              </div>

              {/* Pricing Box */}
              <div
                style={{
                  marginTop: '1.75rem',
                  padding: '1.25rem',
                  backgroundColor: '#FBFBFA',
                  borderRadius: '1rem',
                  border: '1px solid #E8E8E2',
                  display: 'flex',
                  alignItems: 'baseline',
                  gap: '0.75rem',
                  flexWrap: 'wrap'
                }}
              >
                <span style={{ fontSize: '2rem', fontWeight: 800, color: '#0B0C10', letterSpacing: '-0.02em' }}>
                  ₹{product.selling_price}
                </span>
                {product.compare_price && (
                  <span style={{ fontSize: '1.125rem', color: '#9CA3AF', textDecoration: 'line-through' }}>
                    ₹{product.compare_price}
                  </span>
                )}
                {product.compare_price && (
                  <span
                    style={{
                      fontSize: '0.75rem',
                      fontWeight: 800,
                      color: '#059669',
                      padding: '0.25rem 0.625rem',
                      backgroundColor: 'rgba(5, 150, 105, 0.1)',
                      borderRadius: '9999px',
                      marginLeft: 'auto'
                    }}
                  >
                    SAVE ₹{product.compare_price - product.selling_price} (40% OFF)
                  </span>
                )}
              </div>

              {/* Color Selection */}
              <div style={{ marginTop: '2rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                  <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#0B0C10', letterSpacing: '0.02em' }}>
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
                        boxShadow:
                          selectedColor === col.name
                            ? '0 0 0 2px #FFFFFF, 0 0 0 4px #C5A059'
                            : '0 2px 5px rgba(0,0,0,0.1)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)'
                      }}
                    >
                      {selectedColor === col.name && (
                        <Check size={18} color={col.hex === '#FFFFFF' ? '#0B0C10' : '#FFFFFF'} />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Size Selection */}
              <div style={{ marginTop: '2rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                  <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#0B0C10', letterSpacing: '0.02em' }}>
                    Size: <span style={{ fontWeight: 500, color: '#4B5563' }}>{selectedSize}</span>
                  </span>
                  <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#8B6B23', textDecoration: 'underline', cursor: 'pointer' }}>
                    Unisex Boxy Fit Guide
                  </span>
                </div>
                <div style={{ display: 'flex', gap: '0.625rem', flexWrap: 'wrap' }}>
                  {availableSizes.map((sz) => (
                    <button
                      key={sz}
                      onClick={() => setSelectedSize(sz)}
                      className={`filter-chip ${selectedSize === sz ? 'active' : ''}`}
                      style={{
                        minWidth: '58px',
                        minHeight: '46px',
                        borderRadius: '0.75rem',
                        justifyContent: 'center',
                        fontWeight: selectedSize === sz ? 800 : 500
                      }}
                    >
                      {sz}
                    </button>
                  ))}
                </div>
              </div>

              {/* Verified Qikink SKU Badge */}
              <div
                style={{
                  marginTop: '1.25rem',
                  fontSize: '0.75rem',
                  color: '#6B7280',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  flexWrap: 'wrap'
                }}
              >
                <span>Qikink Direct Fulfillment SKU:</span>
                <code
                  style={{
                    backgroundColor: '#F4F4F0',
                    padding: '0.2rem 0.5rem',
                    borderRadius: '0.375rem',
                    fontWeight: 600,
                    color: '#0B0C10',
                    border: '1px solid #E8E8E2'
                  }}
                >
                  {currentVariant.qikink_sku}
                </code>
              </div>

              {/* Quantity Controls */}
              <div style={{ marginTop: '2rem', display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#0B0C10' }}>Quantity:</span>
                <div
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    border: '1px solid #E8E8E2',
                    borderRadius: '9999px',
                    backgroundColor: '#FBFBFA'
                  }}
                >
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    style={{ width: '42px', height: '42px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '1.125rem' }}
                    aria-label="Decrease quantity"
                  >
                    -
                  </button>
                  <span style={{ minWidth: '36px', textAlign: 'center', fontSize: '0.9375rem', fontWeight: 700, color: '#0B0C10' }}>
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity((q) => q + 1)}
                    style={{ width: '42px', height: '42px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '1.125rem' }}
                    aria-label="Increase quantity"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Validation Notice */}
              {validationError && (
                <div
                  style={{
                    marginTop: '1.25rem',
                    padding: '0.875rem 1rem',
                    backgroundColor: '#FFF1F2',
                    border: '1px solid #FECDD3',
                    borderRadius: '0.75rem',
                    color: '#BE123C',
                    fontSize: '0.8125rem'
                  }}
                >
                  {validationError}
                </div>
              )}

              {/* Desktop Direct Buttons */}
              <div className="hidden md:flex" style={{ marginTop: '2.5rem', gap: '1rem' }}>
                <button
                  onClick={handleAddToCart}
                  className="btn-luxury-secondary"
                  style={{ flex: 1, minHeight: '52px' }}
                >
                  <span>Add to Bag</span>
                </button>
                <button
                  onClick={handleBuyNow}
                  className="btn-luxury-primary"
                  style={{ flex: 1.2, minHeight: '52px' }}
                >
                  <span>Buy Now (₹{product.selling_price * quantity})</span>
                </button>
              </div>

              {/* Technical Specifications Grid */}
              <div
                style={{
                  marginTop: '3rem',
                  padding: '1.5rem',
                  border: '1px solid #E8E8E2',
                  borderRadius: '1.25rem',
                  backgroundColor: '#FBFBFA'
                }}
              >
                <h4 style={{ fontSize: '0.875rem', fontWeight: 800, color: '#0B0C10', marginBottom: '1rem', letterSpacing: '-0.01em' }}>
                  Technical Garment & Print Specifications
                </h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem', fontSize: '0.8125rem' }}>
                  <div>
                    <span style={{ color: '#6B7280', display: 'block', fontSize: '0.75rem' }}>Fabric Weight</span>
                    <strong style={{ color: '#0B0C10' }}>240 GSM Combed Cotton</strong>
                  </div>
                  <div>
                    <span style={{ color: '#6B7280', display: 'block', fontSize: '0.75rem' }}>Print Method</span>
                    <strong style={{ color: '#0B0C10' }}>Ultra-HD DTG Pigment</strong>
                  </div>
                  <div>
                    <span style={{ color: '#6B7280', display: 'block', fontSize: '0.75rem' }}>Wash Treatment</span>
                    <strong style={{ color: '#0B0C10' }}>Organic Bio-Wash finish</strong>
                  </div>
                  <div>
                    <span style={{ color: '#6B7280', display: 'block', fontSize: '0.75rem' }}>POD Fulfillment</span>
                    <strong style={{ color: '#0B0C10' }}>Automated Qikink Network</strong>
                  </div>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>

        {/* Sticky Bottom Action Bar for Mobile Viewport */}
        <div className="sticky-action-bar md:hidden">
          <div style={{ flexShrink: 0 }}>
            <span style={{ display: 'block', fontSize: '0.6875rem', color: '#6B7280' }}>Total</span>
            <span style={{ fontSize: '1.125rem', fontWeight: 800, color: '#0B0C10' }}>
              ₹{product.selling_price * quantity}
            </span>
          </div>
          <button
            onClick={handleAddToCart}
            className="btn-luxury-secondary"
            style={{ flex: 1, padding: '0.625rem 0.75rem', minHeight: '48px', fontSize: '0.8125rem' }}
          >
            Add to Bag
          </button>
          <button
            onClick={handleBuyNow}
            className="btn-luxury-primary"
            style={{ flex: 1.2, padding: '0.625rem 0.75rem', minHeight: '48px', fontSize: '0.8125rem' }}
          >
            Buy Now
          </button>
        </div>
      </div>
    </div>
  );
};
