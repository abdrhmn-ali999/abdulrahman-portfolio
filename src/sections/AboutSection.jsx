import React, { useEffect } from 'react';
import { motion, useAnimation, animate } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Calendar, Award, BookOpen, Briefcase } from 'lucide-react';

function StatCounter({ value, suffix = "", title }) {
  const controls = useAnimation();
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.5 });
  const nodeRef = React.useRef(null);

  useEffect(() => {
    if (inView) {
      const animation = animate(0, value, {
        duration: 2,
        ease: "easeOut",
        onUpdate(value) {
          if (nodeRef.current) {
            nodeRef.current.textContent = Math.floor(value);
          }
        }
      });
      return () => animation.stop();
    }
  }, [inView, value]);

  return (
    <div ref={ref} className="glass-card p-6 rounded-2xl text-center">
      <h3 className="font-display text-3xl md:text-4xl font-bold text-primary mb-1">
        <span ref={nodeRef}>0</span>{suffix}
      </h3>
      <p className="text-xs text-gray-400 uppercase tracking-wider font-medium">{title}</p>
    </div>
  );
}

export default function AboutSection() {
  const [sectionRef, sectionInView] = useInView({ triggerOnce: true, threshold: 0.1 });

  const timelineData = [
    { icon: <BookOpen />, year: "2023 - Present", title: "System Analysis Studies", desc: "Acquiring architectural foundation patterns, logical processing matrices and structural modeling strategies." },
    { icon: <Briefcase />, year: "2022 - Present", title: "Freelance Full-Stack Developer", desc: "Constructing fast modular interfaces for diverse clients utilizing modern software technology loops." },
    { icon: <Award />, year: "2021", title: "Digital Arts Explorations", desc: "Synthesizing fine visual dimensions with technical vector compositions and 3D digital artifacts." }
  ];

  const sectionVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut", staggerChildren: 0.2 } }
  };

  return (
    <section id="about" ref={sectionRef} className="py-24 max-w-7xl mx-auto px-6 md:px-12 relative">
      <motion.div variants={sectionVariants} initial="hidden" animate={sectionInView ? "visible" : "hidden"} className="space-y-16">
        
        <div className="text-center max-w-xl mx-auto space-y-3">
          <h2 className="font-display text-3xl md:text-5xl font-bold tracking-tight">
            About <span className="text-gradient">Myself</span>
          </h2>
          <div className="w-12 h-1 bg-gradient-to-r from-primary to-secondary mx-auto rounded-full" />
          <p className="text-sm text-gray-400">Bridging the paradigm between advanced systems engineering and artistic visualization layers.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          <div className="lg:col-span-5 space-y-6 text-gray-300 leading-relaxed text-base">
            <p>
              I am <strong className="text-white">Abdulrahman Ali Hussein</strong>, an adaptable creator located in Basra, Iraq. Operating at the unique nexus of technical execution and abstract concept composition.
            </p>
            <p>
              As a dedicated student specializing in System Analysis, I ground creative interface iterations inside rigorous backend methodologies, maintaining operational consistency alongside fluid user expression profiles.
            </p>
            <p>
              My background as a Digital Artist allows me to bring spatial balance, precise color orchestration, and distinct aesthetic parameters to every web workspace I craft.
            </p>
          </div>

          <div className="lg:col-span-7 space-y-8 relative before:absolute before:top-2 before:bottom-2 before:left-[23px] before:w-[2px] before:bg-white/5">
            {timelineData.map((item, index) => (
              <motion.div 
                key={index}
                variants={{ hidden: { opacity: 0, x: 20 }, visible: { opacity: 1, x: 0 } }}
                className="flex items-start gap-6 relative group"
              >
                <div className="w-12 h-12 rounded-xl glass border border-white/10 flex items-center justify-center text-primary group-hover:text-secondary group-hover:border-secondary/50 transition-colors duration-300 bg-dark z-10 shrink-0">
                  {item.icon}
                </div>
                <div className="glass-card p-5 rounded-2xl flex-1 space-y-2">
                  <span className="font-mono text-xs text-primary/80 font-medium flex items-center gap-1">
                    <Calendar className="w-3 h-3" /> {item.year}
                  </span>
                  <h4 className="font-display text-base font-bold text-white">{item.title}</h4>
                  <p className="text-xs text-gray-400 font-normal leading-relaxed">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>

        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 pt-8">
          <StatCounter value={3} suffix="+" title="Years Experience" />
          <StatCounter value={24} suffix="+" title="Projects Deployed" />
          <StatCounter value={12} suffix="+" title="Digital Art Pieces" />
          <StatCounter value={99} suffix="%" title="Client Satisfaction" />
        </div>

      </motion.div>
    </section>
  );
}