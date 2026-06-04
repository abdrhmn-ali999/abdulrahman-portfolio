import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink, Github, X } from 'lucide-react';
import { projectsData } from '../data/projects';

const ProjectCard = ({ project, onOpenModal }) => {
  const cardRef = useRef(null);

  const handleMouseMove = (e) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    card.style.transform = `perspective(1000px) rotateX(${-y / 12}deg) rotateY(${x / 12}deg) scale3d(1.02, 1.02, 1.02)`;
  };

  const handleMouseLeave = () => {
    const card = cardRef.current;
    if (!card) return;
    card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
  };

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={() => onOpenModal(project)}
      className="glass-card cursor-pointer overflow-hidden flex flex-col h-full transition-shadow duration-300 transform-gpu rounded-2xl"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className={`h-48 w-full bg-gradient-to-br ${project.gradient} opacity-80 relative flex items-center justify-center p-6 border-b border-white/10`}>
        <div className="absolute inset-0 bg-[radial-gradient(rgba(0,0,0,0.3)_1px,transparent_1px)] [background-size:16px_16px]" />
        <h3 className="text-2xl font-black text-white text-center tracking-wider uppercase drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)]">
          {project.title}
        </h3>
      </div>

      <div className="p-6 flex flex-col flex-grow justify-between">
        <div>
          <p className="text-gray-300 text-sm leading-relaxed line-clamp-3 mb-4">
            {project.shortDescription}
          </p>
          <div className="flex flex-wrap gap-2 mb-6">
            {project.technologies.map((tech, idx) => (
              <span key={idx} className="text-[11px] font-mono tracking-widest uppercase bg-black/40 border border-primary/30 text-primary px-2.5 py-1 rounded-md">
                {tech}
              </span>
            ))}
          </div>
        </div>

        <div className="flex gap-4" onClick={(e) => e.stopPropagation()}>
          <a href={project.demoUrl} target="_blank" rel="noopener noreferrer"
            className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-secondary to-primary hover:brightness-110 text-white font-mono text-xs tracking-wider uppercase py-2.5 px-4 rounded-xl transition-all font-bold">
            <ExternalLink size={14} /> Live Demo
          </a>
          <a href={project.githubUrl} target="_blank" rel="noopener noreferrer"
            className="flex items-center justify-center bg-white/5 border border-white/10 hover:bg-white/10 hover:border-primary/40 text-white px-4 rounded-xl transition-all"
            title="View Codebase">
            <Github size={16} />
          </a>
        </div>
      </div>
    </motion.div>
  );
};

export default function ProjectsSection() {
  const [activeProject, setActiveProject] = useState(null);

  return (
    <section id="projects" className="py-24 px-4 max-w-7xl mx-auto relative">
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-secondary/5 rounded-full filter blur-[120px] pointer-events-none" />

      <div className="mb-16 text-center md:text-left">
        <p className="text-primary font-mono tracking-[0.25em] text-xs uppercase mb-2">// CAPABILITIES COMPONENT</p>
        <h2 className="text-4xl md:text-5xl font-black uppercase text-white tracking-tight">
          Featured <span className="text-gradient">Deployments</span>
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
        {projectsData.map((project) => (
          <ProjectCard key={project.id} project={project} onOpenModal={setActiveProject} />
        ))}
      </div>

      <AnimatePresence>
        {activeProject && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveProject(null)}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 350 }}
              className="glass-card w-full max-w-2xl max-h-[85vh] overflow-y-auto relative z-10 border-primary/30 shadow-[0_0_50px_rgba(0,212,255,0.15)] flex flex-col rounded-2xl"
            >
              <button onClick={() => setActiveProject(null)}
                className="absolute top-4 right-4 z-20 p-2 rounded-full bg-black/40 border border-white/10 hover:border-primary text-white transition-colors">
                <X size={18} />
              </button>

              <div className={`h-40 w-full bg-gradient-to-r ${activeProject.gradient} opacity-90 relative shrink-0 p-8 flex items-end`}>
                <div className="absolute inset-0 bg-black/20" />
                <h3 className="text-3xl font-black text-white relative z-10 uppercase tracking-wide">
                  {activeProject.title}
                </h3>
              </div>

              <div className="p-8">
                <div className="flex flex-wrap gap-2 mb-6">
                  {activeProject.technologies.map((tech, idx) => (
                    <span key={idx} className="text-xs font-mono tracking-wider bg-primary/10 border border-primary/40 text-primary px-3 py-1 rounded-md">
                      {tech}
                    </span>
                  ))}
                </div>

                <h4 className="text-xs font-mono tracking-widest text-secondary uppercase mb-2">// ARCHITECTURAL OVERVIEW</h4>
                <p className="text-gray-300 text-sm leading-relaxed mb-8">{activeProject.longDescription}</p>

                <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-white/10">
                  <a href={activeProject.demoUrl} target="_blank" rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-dark font-mono font-bold text-xs tracking-widest uppercase py-3 px-6 rounded-xl transition-all">
                    <ExternalLink size={16} /> Live Demo
                  </a>
                  <a href={activeProject.githubUrl} target="_blank" rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center gap-2 bg-white/5 border border-white/10 hover:bg-white/10 text-white font-mono text-xs tracking-widest uppercase py-3 px-6 rounded-xl transition-all">
                    <Github size={16} /> View Code
                  </a>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}