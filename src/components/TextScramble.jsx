import React, { useEffect, useRef, useState } from 'react';
import { useInView } from 'react-intersection-observer';

const CHARS = '!<>-_\\/[]{}—=+*^?#abcdefghijklmnopqrstuvwxyz';

/**
 * TextScramble — "Cyberpunk Decoder" effect.
 * Algorithm: for each frame tick, every character has a probability of
 * being "resolved" (shows final char) or "scrambled" (shows random char).
 * The resolve probability increases over time, so chars settle left→right.
 */
function scramble(text, progress) {
  return text
    .split('')
    .map((char, i) => {
      // Whitespace always stays as-is
      if (char === ' ') return ' ';
      // Characters before the "wave front" are resolved
      if (i < Math.floor(progress * text.length)) return char;
      // Characters at/after wave front show random glyphs
      return CHARS[Math.floor(Math.random() * CHARS.length)];
    })
    .join('');
}

export default function TextScramble({ text, className = '', as: Tag = 'span', delay = 0 }) {
  const [displayed, setDisplayed] = useState(text);
  const frameRef = useRef(null);
  const startRef = useRef(null);
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.3 });

  useEffect(() => {
    if (!inView) return;

    const timeout = setTimeout(() => {
      const duration = 1200; // ms total scramble duration

      const tick = (timestamp) => {
        if (!startRef.current) startRef.current = timestamp;
        const elapsed = timestamp - startRef.current;
        const progress = Math.min(elapsed / duration, 1);

        setDisplayed(scramble(text, progress));

        if (progress < 1) {
          frameRef.current = requestAnimationFrame(tick);
        } else {
          setDisplayed(text); // Ensure final text is exact
        }
      };

      frameRef.current = requestAnimationFrame(tick);
    }, delay);

    return () => {
      clearTimeout(timeout);
      cancelAnimationFrame(frameRef.current);
      startRef.current = null;
    };
  }, [inView, text, delay]);

  return (
    <Tag ref={ref} className={`font-mono ${className}`}>
      {displayed}
    </Tag>
  );
}