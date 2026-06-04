import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send, Github, Linkedin, Facebook, Instagram } from 'lucide-react';
import { portfolioContent } from '../data/content';

export default function ContactSection() {
  const { email, phone, location, socials } = portfolioContent.contactInfo;
  
  const [formState, setFormState] = useState({ name: '', email: '', subject: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionStatus, setSubmissionStatus] = useState({ success: false, error: null });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormState(prev => ({ ...prev, [name]: value }));
  };

  const handleFormSubmission = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmissionStatus({ success: false, error: null });

    try {
      // جلب رابط السيرفر المحلي من ملف الـ .env
      const apiUrl = import.meta.env.VITE_API_URL || '';
      
      const response = await fetch(`${apiUrl}/contact.php`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formState),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setSubmissionStatus({ success: true, error: null });
        setFormState({ name: '', email: '', subject: '', message: '' });
        
        // إخفاء رسالة النجاح بعد 4 ثوانٍ
        setTimeout(() => setSubmissionStatus(prev => ({ ...prev, success: false })), 4000);
      } else {
        throw new Error(data.message || 'TRANSMISSION FAILED // ROUTE_UNAVAILABLE');
      }
    } catch (error) {
      setSubmissionStatus({ success: false, error: error.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-24 px-4 max-w-7xl mx-auto relative">
      <div className="absolute top-1/2 left-0 w-[350px] h-[350px] bg-secondary/5 rounded-full filter blur-[130px] pointer-events-none" />

      <div className="mb-16 text-center lg:text-left">
        <p className="text-primary font-mono tracking-[0.25em] text-xs uppercase mb-2">// TERMINAL CONNECT</p>
        <h2 className="text-4xl md:text-5xl font-black uppercase text-white tracking-tight">
          Secure <span className="text-gradient">Gateway</span>
        </h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 relative z-10">
        
        <motion.div 
          className="lg:col-span-5 flex flex-col justify-between space-y-8"
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="space-y-4">
            <h3 className="text-2xl font-bold text-white uppercase tracking-wide">Direct Links</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Initiate transmission routines or query validation profiles directly via standard routing nodes.
            </p>
            
            <div className="space-y-4 pt-4">
              <div className="flex items-center gap-4 glass-card rounded-2xl p-4">
                <div className="text-primary shrink-0"><Mail size={20} /></div>
                <div>
                  <span className="block text-[10px] font-mono text-gray-500 uppercase">SMTP ENDPOINT</span>
                  <a href={`mailto:${email}`} className="text-white hover:text-primary transition-colors text-sm font-mono">{email}</a>
                </div>
              </div>

              <div className="flex items-center gap-4 glass-card rounded-2xl p-4">
                <div className="text-secondary shrink-0"><Phone size={20} /></div>
                <div>
                  <span className="block text-[10px] font-mono text-gray-500 uppercase">PSTN UPLINK</span>
                  <a href={`tel:${phone}`} className="text-white hover:text-secondary transition-colors text-sm font-mono">{phone}</a>
                </div>
              </div>

              <div className="flex items-center gap-4 glass-card rounded-2xl p-4">
                <div className="text-primary shrink-0"><MapPin size={20} /></div>
                <div>
                  <span className="block text-[10px] font-mono text-gray-500 uppercase">COORDINATES</span>
                  <span className="text-white text-sm tracking-wide">{location}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-white/5">
            <h4 className="text-xs font-mono text-gray-500 uppercase mb-4 tracking-widest">EXTERNAL_CHANNELS</h4>
            <div className="flex gap-4">
              <a href={socials.github} target="_blank" rel="noopener noreferrer" className="p-3 rounded-xl bg-white/5 border border-white/10 text-white hover:text-primary hover:border-primary/40 transition-all"><Github size={18} /></a>
              <a href={socials.linkedin} target="_blank" rel="noopener noreferrer" className="p-3 rounded-xl bg-white/5 border border-white/10 text-white hover:text-primary hover:border-primary/40 transition-all"><Linkedin size={18} /></a>
              <a href={socials.facebook} target="_blank" rel="noopener noreferrer" className="p-3 rounded-xl bg-white/5 border border-white/10 text-white hover:text-primary hover:border-primary/40 transition-all"><Facebook size={18} /></a>
              <a href={socials.instagram} target="_blank" rel="noopener noreferrer" className="p-3 rounded-xl bg-white/5 border border-white/10 text-white hover:text-primary hover:border-primary/40 transition-all"><Instagram size={18} /></a>
            </div>
          </div>
        </motion.div>

        <motion.div className="lg:col-span-7">
          <form onSubmit={handleFormSubmission} className="glass-card rounded-2xl p-8 space-y-6 relative overflow-hidden">
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-xs font-mono text-gray-400 uppercase tracking-wider">Identification</label>
                <input
                  type="text" name="name" required
                  value={formState.name} onChange={handleInputChange}
                  className="w-full bg-black/40 border border-white/10 focus:border-primary rounded-xl px-4 py-3 text-white text-sm outline-none transition-all font-mono"
                  placeholder="e.g. USER_01"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-xs font-mono text-gray-400 uppercase tracking-wider">Return Path</label>
                <input
                  type="email" name="email" required
                  value={formState.email} onChange={handleInputChange}
                  className="w-full bg-black/40 border border-white/10 focus:border-primary rounded-xl px-4 py-3 text-white text-sm outline-none transition-all font-mono"
                  placeholder="name@domain.com"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-mono text-gray-400 uppercase tracking-wider">Routing Header</label>
              <input
                type="text" name="subject" required
                value={formState.subject} onChange={handleInputChange}
                className="w-full bg-black/40 border border-white/10 focus:border-primary rounded-xl px-4 py-3 text-white text-sm outline-none transition-all font-mono"
                placeholder="Core Intent Matrix"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-mono text-gray-400 uppercase tracking-wider">Payload Data</label>
              <textarea
                name="message" required rows={5}
                value={formState.message} onChange={handleInputChange}
                className="w-full bg-black/40 border border-white/10 focus:border-primary rounded-xl px-4 py-3 text-white text-sm outline-none transition-all font-mono resize-none"
                placeholder="Type transmission logs here..."
              />
            </div>

            <button
              type="submit" disabled={isSubmitting}
              className={`w-full font-mono text-xs uppercase tracking-widest py-4 rounded-xl flex items-center justify-center gap-2 font-bold transition-all ${
                isSubmitting 
                  ? 'bg-white/10 text-gray-400 cursor-not-allowed' 
                  : 'bg-gradient-to-r from-primary to-secondary text-white hover:shadow-[0_0_25px_rgba(0,212,255,0.4)]'
              }`}
            >
              {isSubmitting ? (
                <><div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" /> Encrypting Payload...</>
              ) : (
                <><Send size={14} /> Commit Dispatch</>
              )}
            </button>

            {submissionStatus.success && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/40 text-emerald-400 text-center font-mono text-xs tracking-wide"
              >
                TRANSMISSION COMPLETE // LOGS ARCHIVED SUCCESSFULLY.
              </motion.div>
            )}

            {submissionStatus.error && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/40 text-rose-400 text-center font-mono text-xs tracking-wide"
              >
                CRITICAL ERROR // {submissionStatus.error}
              </motion.div>
            )}
          </form>
        </motion.div>
      </div>
    </section>
  );
}