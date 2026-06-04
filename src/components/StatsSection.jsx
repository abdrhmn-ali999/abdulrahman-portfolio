import React, { useState, useEffect, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { portfolioContent } from '../data/content';

const CounterItem = ({ targetNumber, suffix, label }) => {
  const [currentCount, setCurrentCount] = useState(0);
  const elementRef = useRef(null);
  const isElementInView = useInView(elementRef, { once: true, amount: 0.3 });

  useEffect(() => {
    if (!isElementInView) return;
    let startTime = null;
    const executionDuration = 2000;

    const processStep = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progressTime = timestamp - startTime;
      const progressPercentage = Math.min(progressTime / executionDuration, 1);
      const easedProgress = progressPercentage * (2 - progressPercentage);
      setCurrentCount(Math.floor(easedProgress * targetNumber));
      if (progressPercentage < 1) {
        requestAnimationFrame(processStep);
      } else {
        setCurrentCount(targetNumber);
      }
    };
    requestAnimationFrame(processStep);
  }, [isElementInView, targetNumber]);

  return (
    <div ref={elementRef} className="glass-card rounded-2xl p-6 text-center flex flex-col justify-center min-w-[160px]">
      <span className="text-4xl md:text-5xl font-black text-primary tracking-tight mb-2 block font-mono drop-shadow-[0_0_12px_rgba(0,212,255,0.4)]">
        {currentCount}{suffix}
      </span>
      <span className="text-xs font-mono uppercase tracking-widest text-gray-400 block">
        {label}
      </span>
    </div>
  );
};

export default function StatsSection() {
  return (
    <section className="py-16 px-4 max-w-6xl mx-auto relative z-10">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {portfolioContent.stats.map((stat, idx) => (
          <CounterItem
            key={idx}
            targetNumber={stat.targetNumber}
            suffix={stat.suffix}
            label={stat.label}
          />
        ))}
      </div>
    </section>
  );
}