import React, { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { useLenis } from './hooks/useLenis';
import CustomCursor from './components/CustomCursor';
import Loader from './components/Loader';
import Navbar from './components/Navbar';
import HeroSection from './sections/HeroSection';
import AboutSection from './sections/AboutSection';
import SkillsSection from './sections/SkillsSection';
import ProjectsSection from './components/ProjectsSection';
// الاستيراد الصحيح للأقسام بدون أي تكرار
import ContactSection from './components/ContactSection';

function App() {
  const [loading, setLoading] = useState(true);
  useLenis();

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <CustomCursor />
      <AnimatePresence mode="wait">
        {loading && <Loader key="loader" />}
      </AnimatePresence>
      {!loading && (
        <div className="relative min-h-screen bg-dark text-white font-sans antialiased selection:bg-primary/30 selection:text-primary">
          <div className="fixed inset-0 z-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />
          <Navbar />
          <main className="relative z-10">
            <HeroSection />
            <AboutSection />
            <SkillsSection />
            
            {/* عرض الأقسام في الصفحة وتفعيل روابط الـ Navbar */}
            <ProjectsSection />
            <ContactSection />
          </main>
          <footer className="py-8 text-center text-sm text-gray-500 border-t border-white/5 relative z-10">
            <p>© {new Date().getFullYear()} Abdulrahman Ali Hussein. All Rights Reserved.</p>
            <p className="text-xs mt-2 text-gray-600">Basra, Iraq</p>
          </footer>
        </div>
      )}
    </>
  );
}

export default App;