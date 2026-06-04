import React, { useRef } from 'react';

/**
 * SpotlightCard — gradient glow follows mouse strictly inside card bounds.
 * Technique: CSS custom properties (--x, --y) updated via onMouseMove,
 * read in an inline radial-gradient for zero-cost rendering.
 */
export default function SpotlightCard({ children, className = '' }) {
  const cardRef = useRef(null);

  const handleMouseMove = (e) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    // Position of cursor relative to card's top-left corner
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    card.style.setProperty('--x', `${x}px`);
    card.style.setProperty('--y', `${y}px`);
    card.style.setProperty('--opacity', '1');
  };

  const handleMouseLeave = () => {
    const card = cardRef.current;
    if (!card) return;
    card.style.setProperty('--opacity', '0');
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`relative overflow-hidden glass-card rounded-2xl ${className}`}
      style={{
        '--x': '50%',
        '--y': '50%',
        '--opacity': '0',
      }}
    >
      {/* Spotlight overlay — radial gradient anchored to cursor position */}
      <div
        className="pointer-events-none absolute inset-0 z-0 transition-opacity duration-300"
        style={{
          opacity: 'var(--opacity)',
          background: 'radial-gradient(600px circle at var(--x) var(--y), rgba(0, 212, 255, 0.08), transparent 50%)',
        }}
      />
      {/* Border glow on hover */}
      <div
        className="pointer-events-none absolute inset-0 z-0 rounded-2xl transition-opacity duration-300"
        style={{
          opacity: 'var(--opacity)',
          background: 'radial-gradient(400px circle at var(--x) var(--y), rgba(123, 47, 255, 0.15), transparent 60%)',
        }}
      />
      <div className="relative z-10">{children}</div>
    </div>
  );
}