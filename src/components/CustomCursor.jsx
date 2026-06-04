import React, { useEffect } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

export default function CustomCursor() {
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  // Outer ring: slow spring for trailing lag
  const ringX = useSpring(cursorX, { damping: 28, stiffness: 200, mass: 0.5 });
  const ringY = useSpring(cursorY, { damping: 28, stiffness: 200, mass: 0.5 });

  // Inner dot: instant follow
  const dotX = useSpring(cursorX, { damping: 10, stiffness: 800 });
  const dotY = useSpring(cursorY, { damping: 10, stiffness: 800 });

  useEffect(() => {
    const move = (e) => {
      cursorX.set(e.clientX - 20);
      cursorY.set(e.clientY - 20);
    };
    window.addEventListener('mousemove', move);
    return () => window.removeEventListener('mousemove', move);
  }, [cursorX, cursorY]);

  return (
    <>
      {/* 
        mix-blend-mode: difference inverts the color beneath the cursor.
        White circle on dark bg = white. White circle on white text = black.
        This creates a dynamic color inversion effect with zero JS overhead.
      */}
      <motion.div
        className="fixed top-0 left-0 w-10 h-10 rounded-full pointer-events-none z-[9999] hidden md:block"
        style={{
          x: ringX,
          y: ringY,
          backgroundColor: '#ffffff',
          mixBlendMode: 'difference',
        }}
      />
      <motion.div
        className="fixed top-0 left-0 w-1.5 h-1.5 rounded-full pointer-events-none z-[9999] hidden md:block bg-white"
        style={{
          x: dotX,
          y: dotY,
          translateX: '12.5px',
          translateY: '12.5px',
          mixBlendMode: 'difference',
        }}
      />
    </>
  );
}