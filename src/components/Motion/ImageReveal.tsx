import React, { useState, useRef, useEffect } from 'react';

interface ImageRevealProps {
  src: string;
  alt: string;
  aspectRatio?: string;
  className?: string;
  delay?: number;
  priority?: boolean;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}

export const ImageReveal: React.FC<ImageRevealProps> = ({
  src,
  alt,
  aspectRatio = '3 / 4',
  className = '',
  delay = 0,
  priority = false,
  style = {},
  children
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(priority);

  useEffect(() => {
    if (priority) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true);
            if (containerRef.current) observer.unobserve(containerRef.current);
          }
        });
      },
      { threshold: 0.15 }
    );

    if (containerRef.current) observer.observe(containerRef.current);

    return () => {
      if (containerRef.current) observer.unobserve(containerRef.current);
    };
  }, [priority]);

  return (
    <div
      ref={containerRef}
      className={`image-reveal-container ${className}`}
      style={{
        position: 'relative',
        width: '100%',
        aspectRatio,
        overflow: 'hidden',
        backgroundColor: 'var(--bg-surface-subtle)',
        borderRadius: 'var(--radius-xl)',
        ...style
      }}
    >
      {/* Background Mask Curtain */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundColor: '#0b0c10',
          transform: isInView && isLoaded ? 'scaleY(0)' : 'scaleY(1)',
          transformOrigin: 'top',
          transition: `transform 0.85s cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms`,
          zIndex: 2,
          pointerEvents: 'none'
        }}
      />

      {/* Image with scale transition */}
      {isInView && (
        <img
          src={src}
          alt={alt}
          loading={priority ? 'eager' : 'lazy'}
          decoding="async"
          onLoad={() => setIsLoaded(true)}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            display: 'block',
            transform: isLoaded ? 'scale(1)' : 'scale(1.08)',
            opacity: isLoaded ? 1 : 0,
            transition: `transform 1.2s cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms, opacity 0.8s ease ${delay}ms`
          }}
        />
      )}

      {/* Child Overlay Badge / Elements */}
      {children}
    </div>
  );
};

