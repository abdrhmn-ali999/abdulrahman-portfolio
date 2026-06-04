import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

/**
 * CurtainTransition — intercepts all hash-anchor clicks and plays a
 * full-screen curtain wipe before scrolling to the target section.
 *
 * Animation sequence:
 *   1. Curtain slides DOWN from top (covers screen) — 0.55s
 *   2. Page scrolls to target section (instant, hidden under curtain)
 *   3. Curtain slides UP and out — 0.55s
 *
 * Two panels (primary + secondary) stagger slightly for a layered feel.
 */
export default function CurtainTransition() {
  const panel1Ref = useRef(null); // Back panel — secondary color
  const panel2Ref = useRef(null); // Front panel — primary color

  useEffect(() => {
    // Set initial state: both panels hidden above viewport
    gsap.set([panel1Ref.current, panel2Ref.current], { yPercent: -100 });

    const handleClick = (e) => {
      const anchor = e.target.closest('a[href^="#"]');
      if (!anchor) return;
      e.preventDefault();

      const targetId = anchor.getAttribute('href');
      const targetEl = document.querySelector(targetId);
      if (!targetEl) return;

      const tl = gsap.timeline();

      // ── Phase 1: Curtain slides DOWN ─────────────────────────────
      tl.to(panel1Ref.current, {
        yPercent: 0,
        duration: 0.5,
        ease: 'power3.inOut',
      })
        .to(
          panel2Ref.current,
          {
            yPercent: 0,
            duration: 0.5,
            ease: 'power3.inOut',
          },
          '-=0.4' // slightly staggered
        )
        // ── Phase 2: Scroll while hidden ──────────────────────────
        .add(() => {
          targetEl.scrollIntoView({ behavior: 'instant' });
        })
        // ── Phase 3: Curtain slides UP ────────────────────────────
        .to(panel2Ref.current, {
          yPercent: 100,
          duration: 0.55,
          ease: 'power3.inOut',
          delay: 0.05,
        })
        .to(
          panel1Ref.current,
          {
            yPercent: 100,
            duration: 0.55,
            ease: 'power3.inOut',
          },
          '-=0.4'
        )
        // Reset panels above viewport for next use
        .set([panel1Ref.current, panel2Ref.current], { yPercent: -100 });
    };

    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, []);

  return (
    <>
      {/* Back panel — secondary (purple) */}
      <div
        ref={panel1Ref}
        className="fixed inset-0 z-[9995] pointer-events-none"
        style={{ backgroundColor: '#7b2fff' }}
      />
      {/* Front panel — primary (cyan) */}
      <div
        ref={panel2Ref}
        className="fixed inset-0 z-[9996] pointer-events-none flex items-center justify-center"
        style={{ backgroundColor: '#0a0a0f' }}
      >
        {/* Logo flash during transition */}
        <span
          className="font-display font-black text-5xl tracking-tight select-none"
          style={{
            background: 'linear-gradient(135deg, #00d4ff, #7b2fff)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          AR.
        </span>
      </div>
    </>
  );
}