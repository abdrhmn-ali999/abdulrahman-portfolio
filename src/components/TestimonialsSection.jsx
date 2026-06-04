import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Quote } from 'lucide-react';
import { portfolioContent } from '../data/content';

export default function TestimonialsSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const items = portfolioContent.testimonials;

  const handleNext = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % items.length);
  }, [items.length]);

  useEffect(() => {
    const timer = setInterval(handleNext, 3000);
    return () => clearInterval(timer);
  }, [handleNext]);

  return (
    <section id="testimonials" className="py-24 px-4 max-w-4xl mx-auto relative overflow-hidden">
      <div className="mb-12 text-center">
        <p className="text-primary font-mono tracking-[0.25em] text-xs uppercase mb-2">// NETWORKS REVIEWS</p>
        <h2 className="text-4xl md:text-5xl font-black uppercase text-white tracking-tight">
          Client <span className="text-gradient">Telemetry</span>
        </h2>
      </div>

      <div className="relative min-h-[240px] flex items-center justify-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeIndex}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="glass-card rounded-2xl p-8 md:p-10 w-full relative border-secondary/20"
          >
            <Quote className="absolute top-6 right-8 text-white/5 w-20 h-20 pointer-events-none transform rotate-180" />
            <p className="text-gray-300 text-base md:text-lg italic leading-relaxed relative z-10 mb-8">
              "{items[activeIndex].quote}"
            </p>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-secondary to-primary p-[2px]">
                <div className="w-full h-full rounded-full bg-dark flex items-center justify-center font-mono font-bold text-white text-sm uppercase">
                  {items[activeIndex].name.slice(0, 2)}
                </div>
              </div>
              <div>
                <h4 className="text-white font-bold tracking-wide text-sm">{items[activeIndex].name}</h4>
                <p className="text-primary font-mono text-xs">{items[activeIndex].role}</p>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="flex justify-center gap-2.5 mt-8">
        {items.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setActiveIndex(idx)}
            className={`h-2 rounded-full transition-all duration-300 ${
              activeIndex === idx ? 'w-8 bg-primary' : 'w-2 bg-white/20 hover:bg-white/40'
            }`}
            aria-label={`Slide ${idx + 1}`}
          />
        ))}
      </div>
    </section>
  );
}