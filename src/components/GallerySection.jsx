import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { portfolioContent } from '../data/content';

const filterCategories = ["All", "Web Design", "Programming", "Digital Art"];

export default function GallerySection() {
  const [activeFilter, setActiveFilter] = useState("All");
  const filteredItems = portfolioContent.gallery.filter(item => 
    activeFilter === "All" || item.category === activeFilter
  );

  return (
    <section id="gallery" className="py-24 px-4 max-w-6xl mx-auto relative">
      <div className="mb-16 text-center flex flex-col items-center">
        <p className="text-primary font-mono tracking-[0.25em] text-xs uppercase mb-2">// VISUAL ARCHIVES</p>
        <h2 className="text-4xl md:text-5xl font-black uppercase text-white tracking-tight mb-8">
          Project <span className="text-gradient">Gallery</span>
        </h2>

        <div className="flex flex-wrap gap-2 bg-black/40 border border-white/10 p-1.5 rounded-xl backdrop-blur-md">
          {filterCategories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveFilter(category)}
              className={`px-4 py-2 rounded-lg text-xs font-mono font-bold uppercase tracking-wider transition-all relative ${
                activeFilter === category ? 'text-black' : 'text-gray-400 hover:text-white'
              }`}
            >
              {activeFilter === category && (
                <motion.div
                  layoutId="activeGalleryFilter"
                  className="absolute inset-0 bg-primary rounded-lg shadow-[0_0_15px_rgba(0,212,255,0.4)]"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
              <span className="relative z-10">{category}</span>
            </button>
          ))}
        </div>
      </div>

      {/* ✅ حذف space-y-4 */}
      <motion.div layout className="columns-1 sm:columns-2 lg:columns-3 gap-4 relative z-10">
        <AnimatePresence mode="popLayout">
          {filteredItems.map((item) => (
            <motion.div
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.4 }}
              key={item.id}
              className="break-inside-avoid glass-card overflow-hidden group relative flex flex-col cursor-pointer mb-4 rounded-2xl"
            >
              <div
                className={`w-full bg-gradient-to-br ${item.color} relative transition-transform duration-500 group-hover:scale-105`}
                style={{ height: item.id % 2 === 0 ? '260px' : '180px' }}
              >
                <div className="absolute inset-0 bg-black/30 opacity-60 group-hover:opacity-10 transition-opacity" />
                <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.85)_100%)]" />
              </div>
              <div className="p-5 absolute bottom-0 inset-x-0 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                <span className="text-[10px] font-mono uppercase tracking-widest text-primary bg-primary/10 border border-primary/30 px-2 py-0.5 rounded">
                  {item.category}
                </span>
                <h3 className="text-base font-bold text-white tracking-wide uppercase mt-2 drop-shadow-md">
                  {item.title}
                </h3>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </section>
  );
}