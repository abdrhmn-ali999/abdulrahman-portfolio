import React from 'react';
import { motion } from 'framer-motion';
import { portfolioContent } from '../data/content';

const TimelineCard = ({ item, index }) => {
  const isEven = index % 2 === 0;
  return (
    <div className={`mb-12 md:mb-16 flex flex-col md:flex-row items-center w-full ${isEven ? 'md:flex-row-reverse' : ''}`}>
      <div className="w-full md:w-1/2" />
      
      <div className="relative z-10 flex items-center justify-center my-4 md:my-0">
        <motion.div 
          className="w-5 h-5 rounded-full bg-black border-2 border-primary shadow-[0_0_10px_rgba(0,212,255,0.8)]"
          initial={{ scale: 0.5, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.1 }}
        />
        <div className="absolute w-8 h-[2px] bg-primary/30 hidden md:block left-5" />
      </div>

      <motion.div 
        className="w-full md:w-1/2 px-0 md:px-8"
        initial={{ opacity: 0, x: isEven ? -40 : 40 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="glass-card rounded-2xl p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-secondary/10 to-transparent pointer-events-none" />
          
          <span className="inline-block px-3 py-1 text-[11px] font-mono tracking-widest text-primary bg-primary/10 border border-primary/20 rounded-md mb-3">
            {item.period}
          </span>
          
          <h3 className="text-xl font-bold text-white tracking-wide">{item.role}</h3>
          <h4 className="text-sm font-mono text-secondary mb-3">{item.organization}</h4>
          <p className="text-gray-400 text-sm leading-relaxed">{item.description}</p>
        </div>
      </motion.div>
    </div>
  );
};

export default function ExperienceSection() {
  return (
    <section id="experience" className="py-24 px-4 max-w-6xl mx-auto relative">
      <div className="mb-20 text-center">
        <p className="text-primary font-mono tracking-[0.25em] text-xs uppercase mb-2">// SECTOR LOGS</p>
        <h2 className="text-4xl md:text-5xl font-black uppercase text-white tracking-tight">
          Professional <span className="text-gradient">Timeline</span>
        </h2>
      </div>

      <div className="relative wrap overflow-hidden">
        <div className="absolute h-full border-r border-dashed border-white/10 left-[10px] md:left-1/2 top-0 transform -translate-x-1/2" />
        {portfolioContent.experience.map((item, index) => (
          <TimelineCard key={index} item={item} index={index} />
        ))}
      </div>
    </section>
  );
}