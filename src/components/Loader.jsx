import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export default function Loader() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 4; // Increments to smooth fill within the 2.5s window
      });
    }, 80);
    return () => clearInterval(interval);
  }, []);

  // Framer Motion Animation Variants Pattern
  const containerVariants = {
    exit: {
      y: '-100%',
      transition: {
        duration: 0.8,
        ease: [0.76, 0, 0.24, 1], // Custom cubic bezier layout for clean curtain wipe
        delay: 0.2
      }
    }
  };

  const logoVariants = {
    initial: { opacity: 0, scale: 0.8 },
    animate: { 
      opacity: 1, 
      scale: 1,
      transition: { duration: 0.8, ease: "easeOut" }
    }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="initial"
      exit="exit"
      className="fixed inset-0 z-[10000] bg-dark flex flex-col justify-center items-center"
    >
      <div className="text-center space-y-6 max-w-xs w-full px-4">
        {/* Animated Logo Container */}
        <motion.div 
          variants={logoVariants}
          initial="initial"
          animate="animate"
          className="relative inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-white/5 border border-white/10"
        >
          <span className="font-display font-bold text-3xl text-primary">AA</span>
          <div className="absolute inset-0 border border-secondary rounded-2xl animate-spin-slow mask-radial" />
        </motion.div>

        {/* Brand Name Context */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="space-y-1"
        >
          <h2 className="font-display text-lg tracking-widest uppercase text-white font-medium">Abdulrahman</h2>
          <p className="text-xs text-primary/70 tracking-wider">Loading Digital Canvas</p>
        </motion.div>

        {/* Loading Progress Bar Layout */}
        <div className="w-full h-[2px] bg-white/10 rounded-full overflow-hidden relative">
          <motion.div 
            className="h-full bg-gradient-to-r from-primary to-secondary"
            animate={{ width: `${progress}%` }}
            transition={{ ease: "easeInOut" }}
          />
        </div>
        
        <div className="text-right">
          <span className="text-xs font-mono text-gray-500">{progress}%</span>
        </div>
      </div>
    </motion.div>
  );
}