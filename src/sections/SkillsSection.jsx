import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Code, Server, Wrench, Palette, Cpu } from 'lucide-react';

export default function SkillsSection() {
  const [sectionRef, sectionInView] = useInView({ triggerOnce: true, threshold: 0.1 });

  // 5 Categories Skill Set Data Array Matrix
  const skillsDataset = [
    {
      category: "Frontend Dev",
      icon: <Code className="w-5 h-5 text-primary" />,
      skills: [
        { name: "React 18 / Next.js", level: 90 },
        { name: "Tailwind CSS", level: 95 },
        { name: "Framer Motion & GSAP", level: 85 },
        { name: "Three.js / WebGL", level: 70 }
      ]
    },
    {
      category: "Backend / Database",
      icon: <Server className="w-5 h-5 text-secondary" />,
      skills: [
        { name: "Node.js / Express", level: 78 },
        { name: "RESTful APIs / GraphQL", level: 82 },
        { name: "MongoDB & PostgreSQL", level: 75 }
      ]
    },
    {
      category: "Tools / Environment",
      icon: <Wrench className="w-5 h-5 text-emerald-400" />,
      skills: [
        { name: "Vite / Webpack", level: 88 },
        { name: "Git / GitHub Actions", level: 92 },
        { name: "Docker Frameworks", level: 65 }
      ]
    },
    {
      category: "Design Systems",
      icon: <Palette className="w-5 h-5 text-amber-400" />,
      skills: [
        { name: "Figma UI Engineering", level: 85 },
        { name: "Adobe Creative Suite", level: 80 },
        { name: "Generative Procedural Art", level: 75 }
      ]
    },
    {
      category: "Other Foundations",
      icon: <Cpu className="w-5 h-5 text-rose-400" />,
      skills: [
        { name: "System Architecture Design", level: 80 },
        { name: "Data Structures & Algorithms", level: 72 },
        { name: "Agile Project Paradigms", level: 85 }
      ]
    }
  ];

  // Animation variants setup schema mapping
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } }
  };

  const progressLineVariants = {
    hidden: { scaleX: 0 },
    visible: (customLevel) => ({
      scaleX: customLevel / 100,
      transition: { duration: 1.2, ease: "easeOut", delay: 0.2 }
    })
  };

  return (
    <section id="skills" ref={sectionRef} className="py-24 max-w-7xl mx-auto px-6 md:px-12 relative">
      
      {/* Structural Title Section Blocks */}
      <div className="space-y-4 mb-16 text-left">
        <div className="flex items-center gap-2">
          <div className="h-[1px] w-8 bg-primary" />
          <span className="text-xs font-mono uppercase tracking-widest text-primary font-medium">Core Toolkit Capabilities</span>
        </div>
        <h2 className="font-display text-3xl md:text-5xl font-bold tracking-tight">
          Technical <span className="text-gradient">Ecosystem</span>
        </h2>
      </div>

      {/* Grid wrapper ecosystem assembly layout maps */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate={sectionInView ? "visible" : "hidden"}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {skillsDataset.map((cat, catIndex) => (
          <motion.div 
            key={catIndex} 
            variants={cardVariants}
            className="glass-card p-6 rounded-2xl flex flex-col justify-between"
          >
            <div className="space-y-6">
              {/* Card Group Header Profile Box Layout */}
              <div className="flex items-center gap-3 pb-4 border-b border-white/5">
                <div className="p-2 rounded-xl bg-white/5 border border-white/10 shrink-0">
                  {cat.icon}
                </div>
                <h3 className="font-display font-bold text-base text-white tracking-wide">{cat.category}</h3>
              </div>

              {/* Action Performance Metric Skills Loop Rendering Box */}
              <div className="space-y-4">
                {cat.skills.map((skill, skillIndex) => (
                  <div key={skillIndex} className="space-y-1.5">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-gray-300 font-medium">{skill.name}</span>
                      <span className="text-gray-500 font-mono">{skill.level}%</span>
                    </div>
                    
                    {/* Underlying Vector Line Element context wrapping tracking bar fill elements */}
                    <div className="w-full h-[3px] bg-white/5 rounded-full overflow-hidden relative">
                      <motion.div 
                        custom={skill.level}
                        variants={progressLineVariants}
                        className="absolute top-0 left-0 bottom-0 right-0 bg-gradient-to-r from-primary to-secondary origin-left rounded-full"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}