import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Code, Server, Wrench, Palette, Brain, Cpu } from 'lucide-react';

export default function SkillsSection() {
  const [sectionRef, sectionInView] = useInView({ triggerOnce: true, threshold: 0.1 });

  const skillsDataset = [
    {
      category: "Web Development",
      icon: <Code className="w-5 h-5 text-primary" />,
      skills: [
        { name: "HTML & CSS", level: 92 },
        { name: "PHP", level: 85 },
        { name: "React & Vite", level: 80 },
        { name: "Tailwind CSS", level: 90 },
        { name: "JavaScript", level: 78 },
      ]
    },
    {
      category: "Backend & Database",
      icon: <Server className="w-5 h-5 text-secondary" />,
      skills: [
        { name: "MySQL", level: 88 },
        { name: "Database Design", level: 85 },
        { name: "RESTful APIs", level: 78 },
        { name: "AJAX", level: 75 },
      ]
    },
    {
      category: "AI & Prompt Engineering",
      icon: <Brain className="w-5 h-5 text-emerald-400" />,
      skills: [
        { name: "Prompt Engineering", level: 95 },
        { name: "Multi-AI Workflows", level: 92 },
        { name: "AI-Assisted Development", level: 90 },
        { name: "AI Code Integration", level: 88 },
      ]
    },
    {
      category: "Design & Creative",
      icon: <Palette className="w-5 h-5 text-amber-400" />,
      skills: [
        { name: "Adobe Photoshop", level: 82 },
        { name: "UI / UX Design", level: 75 },
        { name: "Figma", level: 70 },
        { name: "Digital Art", level: 85 },
      ]
    },
    {
      category: "Tools & Environment",
      icon: <Wrench className="w-5 h-5 text-rose-400" />,
      skills: [
        { name: "Git & GitHub", level: 75 },
        { name: "Microsoft Office", level: 90 },
        { name: "MS Project", level: 70 },
        { name: "Linux (Basic)", level: 55 },
      ]
    },
    {
      category: "System & Analysis",
      icon: <Cpu className="w-5 h-5 text-violet-400" />,
      skills: [
        { name: "System Analysis", level: 82 },
        { name: "Project Management", level: 78 },
        { name: "Data Structures", level: 72 },
        { name: "Problem Solving", level: 88 },
      ]
    }
  ];

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

      <div className="space-y-4 mb-16 text-left">
        <div className="flex items-center gap-2">
          <div className="h-[1px] w-8 bg-primary" />
          <span className="text-xs font-mono uppercase tracking-widest text-primary font-medium">Core Toolkit Capabilities</span>
        </div>
        <h2 className="font-display text-3xl md:text-5xl font-bold tracking-tight">
          Technical <span className="text-gradient">Ecosystem</span>
        </h2>
      </div>

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
              <div className="flex items-center gap-3 pb-4 border-b border-white/5">
                <div className="p-2 rounded-xl bg-white/5 border border-white/10 shrink-0">
                  {cat.icon}
                </div>
                <h3 className="font-display font-bold text-base text-white tracking-wide">{cat.category}</h3>
              </div>

              <div className="space-y-4">
                {cat.skills.map((skill, skillIndex) => (
                  <div key={skillIndex} className="space-y-1.5">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-gray-300 font-medium">{skill.name}</span>
                      <span className="text-gray-500 font-mono">{skill.level}%</span>
                    </div>
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