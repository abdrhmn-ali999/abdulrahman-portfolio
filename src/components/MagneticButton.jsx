import React, { useRef } from 'react';
import { motion, useSpring } from 'framer-motion';

/**
 * MagneticButton — pulls toward cursor when within `radius` pixels.
 * Physics: maps cursor distance → translation using a linear interpolation,
 * then feeds into a spring for organic deceleration.
 */
export default function MagneticButton({ children, className = '', radius = 80, strength = 0.4, ...props }) {
  const ref = useRef(null);

  // Spring config: low stiffness + damping for elastic feel
  const x = useSpring(0, { stiffness: 150, damping: 15, mass: 0.1 });
  const y = useSpring(0, { stiffness: 150, damping: 15, mass: 0.1 });

  const handleMouseMove = (e) => {
    const rect = ref.current.getBoundingClientRect();
    // Center of the button in viewport coords
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    // Delta from cursor to button center
    const dx = e.clientX - cx;
    const dy = e.clientY - cy;
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist < radius) {
      // Pull strength scales with proximity: closer = stronger pull
      const pull = (1 - dist / radius) * strength;
      x.set(dx * pull);
      y.set(dy * pull);
    }
  };

  const handleMouseLeave = () => {
    // Spring back to origin
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      style={{ x, y, display: 'inline-block' }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}