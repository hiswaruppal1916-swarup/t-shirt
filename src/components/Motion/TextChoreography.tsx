import React, { useEffect, useState, useRef } from 'react';

interface TextChoreographyProps {
  text: string;
  as?: 'h1' | 'h2' | 'h3' | 'p' | 'span';
  className?: string;
  delay?: number;
  highlightWords?: string[];
  highlightClass?: string;
  style?: React.CSSProperties;
}

export const TextChoreography: React.FC<TextChoreographyProps> = ({
  text,
  as = 'h1',
  className = '',
  delay = 0,
  highlightWords = [],
  highlightClass = 'text-gold',
  style = {}
}) => {
  const containerRef = useRef<any>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            if (containerRef.current) {
              observer.unobserve(containerRef.current);
            }
          }
        });
      },
      { threshold: 0.1 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      if (containerRef.current) observer.unobserve(containerRef.current);
    };
  }, []);

  const words = text.split(' ');
  const Component: any = as;

  return (
    <Component
      ref={containerRef}
      className={`text-choreography ${className}`}
      style={{
        overflow: 'hidden',
        display: 'inline-block',
        ...style
      }}
    >
      {words.map((word, idx) => {
        const isHighlighted = highlightWords.some(
          (hw) => word.toLowerCase().includes(hw.toLowerCase())
        );

        return (
          <span
            key={idx}
            style={{
              display: 'inline-block',
              overflow: 'hidden',
              marginRight: '0.28em',
              verticalAlign: 'top'
            }}
          >
            <span
              style={{
                display: 'inline-block',
                transform: isVisible ? 'translateY(0)' : 'translateY(115%)',
                opacity: isVisible ? 1 : 0,
                transition: `transform 0.8s cubic-bezier(0.16, 1, 0.3, 1) ${delay + idx * 45}ms, opacity 0.8s ease ${delay + idx * 45}ms`,
                color: isHighlighted ? 'var(--accent-gold)' : undefined,
                fontFamily: isHighlighted ? 'var(--font-serif)' : undefined,
                fontStyle: isHighlighted ? 'italic' : undefined,
                fontWeight: isHighlighted ? 600 : undefined
              }}
              className={isHighlighted ? highlightClass : ''}
            >
              {word}
            </span>
          </span>
        );
      })}
    </Component>
  );
};
