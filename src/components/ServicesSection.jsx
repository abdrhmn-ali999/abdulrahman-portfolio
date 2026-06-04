import React from 'react';
import { motion } from 'framer-motion';
import * as Icons from 'lucide-react';
import { portfolioContent } from '../data/content';

const ServiceCard = ({ service, index }) => {
  const IconComponent = Icons[service.iconName] || Icons.HelpCircle;
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className="group relative rounded-2xl p-[1px] bg-white/10 overflow-hidden transition-all duration-300"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-transparent group-hover:from-primary/40 group-hover:to-secondary/40 transition-all duration-500 pointer-events-none" />
      
      <div className="glass-card p-8 h-full flex flex-col justify-between relative rounded-2xl transition-all duration-300 group-hover:shadow-[0_0_25px_rgba(0,212,255,0.15)]">
        <div>
          <div className="w-14 h-14 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center mb-6 text-primary group-hover:text-white group-hover:bg-gradient-to-br group-hover:from-secondary group-hover:to-primary group-hover:border-transparent transition-all duration-300 shadow-inner">
            <IconComponent size={24} strokeWidth={1.5} />
          </div>
          <h3 className="text-xl font-bold text-white tracking-wide uppercase mb-3 group-hover:text-primary transition-colors">
            {service.title}
          </h3>
          <p className="text-gray-400 text-sm leading-relaxed line-clamp-2">
            {service.description}
          </p>
        </div>
        <div className="mt-6 flex items-center justify-between border-t border-white/5 pt-4 text-[10px] font-mono tracking-widest text-white/20 group-hover:text-primary/40 transition-colors">
          <span>SERVICE_NODE // 0{index + 1}</span>
          <span>READY</span>
        </div>
      </div>
    </motion.div>
  );
};

export default function ServicesSection() {
  return (
    <section id="services" className="py-24 px-4 max-w-7xl mx-auto relative">
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-primary/5 rounded-full filter blur-[150px] pointer-events-none" />
      
      <div className="mb-16 text-center">
        <p className="text-primary font-mono tracking-[0.25em] text-xs uppercase mb-2">// TECHNICAL MATRIX</p>
        <h2 className="text-4xl md:text-5xl font-black uppercase text-white tracking-tight">
          Operational <span className="text-gradient">Capabilities</span>
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10">
        {portfolioContent.services.map((service, index) => (
          <ServiceCard key={service.id} service={service} index={index} />
        ))}
      </div>
    </section>
  );
}