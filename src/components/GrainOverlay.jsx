import React, { useEffect, useRef } from 'react';

/**
 * GrainOverlay — animated film grain using Canvas 2D.
 * Technique: each frame, fill a small canvas with random pixel brightness,
 * then scale it up with CSS to cover the viewport. The random seed changes
 * every frame (via requestAnimationFrame) to create the "dancing grain" effect.
 * Opacity is kept very low (0.035) so it's felt more than seen.
 */
export default function GrainOverlay({ opacity = 0.04, fps = 24 }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    // Small canvas — CSS scales it up for performance
    const SIZE = 200;
    canvas.width = SIZE;
    canvas.height = SIZE;

    let animId;
    let lastTime = 0;
    const interval = 1000 / fps; // throttle to target fps

    const drawGrain = (timestamp) => {
      animId = requestAnimationFrame(drawGrain);
      if (timestamp - lastTime < interval) return;
      lastTime = timestamp;

      // Create ImageData and fill with random monochrome noise
      const imageData = ctx.createImageData(SIZE, SIZE);
      const data = imageData.data;

      for (let i = 0; i < data.length; i += 4) {
        // Random brightness: 0 (black) or 255 (white)
        const val = Math.random() > 0.5 ? 255 : 0;
        data[i] = val;     // R
        data[i + 1] = val; // G
        data[i + 2] = val; // B
        data[i + 3] = 255; // A (fully opaque — CSS opacity handles global alpha)
      }

      ctx.putImageData(imageData, 0, 0);
    };

    animId = requestAnimationFrame(drawGrain);
    return () => cancelAnimationFrame(animId);
  }, [fps]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-[9990] pointer-events-none w-full h-full"
      style={{
        opacity,
        mixBlendMode: 'overlay',
        // Scale up the 200px canvas to fill screen — blurring is intentional
        imageRendering: 'pixelated',
      }}
    />
  );
}