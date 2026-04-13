'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { motion, useScroll, useTransform, AnimatePresence } from 'motion/react';
import { 
  Volume2, 
  Settings, 
  ArrowRight, 
  Maximize2, 
  Waves, 
  Sparkles, 
  Cloud, 
  Moon, 
  Globe, 
  Star 
} from 'lucide-react';
import InteractiveExperience from '@/components/InteractiveExperience';

export default function CelestialPage() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [selectedItem, setSelectedItem] = useState<{ title: string; description: string } | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isExperienceActive, setIsExperienceActive] = useState(false);
  const { scrollYProgress } = useScroll();
  
  useEffect(() => {
    if (isExperienceActive) return;

    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [isExperienceActive]);

  const handleCloseExperience = useCallback(() => {
    setIsExperienceActive(false);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="relative min-h-screen selection:bg-primary/30 selection:text-primary scroll-smooth">
      {/* Background Orbs */}
      <div className="floating-orb w-[600px] h-[600px] bg-secondary top-[-10%] left-[-5%]" />
      <div className="floating-orb w-[800px] h-[800px] bg-primary bottom-[-20%] right-[-5%]" />
      <div className="floating-orb w-[500px] h-[500px] bg-tertiary top-[30%] right-[5%]" />

      {/* Top Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-slate-900/40 backdrop-blur-xl border-b border-white/5">
        <div className="flex justify-between items-center px-6 md:px-10 py-6 max-w-[1728px] mx-auto">
          <div className="text-2xl md:text-3xl font-black text-primary tracking-tighter font-headline cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>CELESTIAL</div>
          <div className="hidden md:flex items-center gap-12 font-body text-[10px] uppercase tracking-[0.2em]">
            <button onClick={() => scrollToSection('gallery')} className="text-primary border-b-2 border-primary pb-1 hover:opacity-80 transition-opacity">Gallery</button>
            <button onClick={() => scrollToSection('sensory')} className="text-on-surface-variant hover:text-on-surface transition-colors">Sensory</button>
            <button onClick={() => scrollToSection('pulse')} className="text-on-surface-variant hover:text-on-surface transition-colors">Pulse</button>
            <button onClick={() => scrollToSection('about')} className="text-on-surface-variant hover:text-on-surface transition-colors">About</button>
          </div>
          <div className="flex items-center gap-4 md:gap-6 text-primary">
            <button 
              onClick={() => setIsMuted(!isMuted)}
              className="p-2 md:p-3 rounded-full hover:bg-primary/10 transition-colors active:scale-90"
            >
              {isMuted ? <Volume2 className="opacity-40" size={20} /> : <Volume2 size={20} />}
            </button>
            <button className="p-2 md:p-3 rounded-full hover:bg-primary/10 transition-colors active:scale-90">
              <Settings size={20} />
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center pt-20 px-6 md:px-8 overflow-hidden">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-[1728px] w-full flex flex-col items-center text-center"
        >
          <div className="inline-block px-6 py-2 mb-10 rounded-full border border-primary/20 bg-primary/5 text-primary text-[10px] font-body uppercase tracking-[0.3em]">
            Immersive Digital Experience
          </div>
          <h1 className="font-headline text-[3.5rem] md:text-[8rem] font-extrabold leading-[0.9] tracking-tighter text-on-surface mb-10">
            Explore the <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-secondary to-tertiary">Unexplored</span>
          </h1>
          <p className="max-w-4xl text-lg md:text-2xl text-on-surface-variant leading-relaxed mb-16 opacity-90">
            A sensory journey through light, sound, and digital matter. <br className="hidden lg:block"/>
            Feel the cosmic fluidity expanded in high definition.
          </p>
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => scrollToSection('gallery')}
            className="group relative flex items-center justify-center p-1 rounded-full bg-gradient-to-br from-primary to-secondary neon-glow-cyan"
          >
            <span className="px-10 md:px-16 py-4 md:py-6 rounded-full bg-surface text-primary font-bold text-lg md:text-xl uppercase tracking-widest flex items-center gap-4">
              Start Journey
              <ArrowRight className="group-hover:translate-x-2 transition-transform" />
            </span>
          </motion.button>
        </motion.div>
      </section>

      {/* Particle Gallery */}
      <section id="gallery" className="py-20 md:py-40 px-6 md:px-10 max-w-[1728px] mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 md:mb-24 gap-8 md:gap-12">
          <div className="max-w-3xl">
            <h2 className="font-headline text-4xl md:text-7xl font-bold text-on-surface mb-6 md:mb-8 tracking-tight">Particle Gallery</h2>
            <p className="text-lg md:text-xl text-on-surface-variant leading-relaxed">
              Visual experiments that react to your touch. Manipulate gravitational fields and chromatic flows in real-time within a cinematic visualization environment.
            </p>
          </div>
          <div className="font-body text-xs tracking-[0.4em] uppercase text-primary border-b border-primary/30 pb-4">
            01 — Visual Experiments
          </div>
        </div>

        <div className="asymmetric-grid">
          {/* Large Feature Card */}
          <motion.div 
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            onClick={() => setSelectedItem({ 
              title: 'Singularity Void', 
              description: 'A deep dive into the heart of a galactic singularity. Manipulate a localized black hole that consumes surrounding stars and bends the fabric of space-time.' 
            })}
            className="col-span-12 lg:col-span-8 group relative overflow-hidden rounded-2xl bg-surface-container-low aspect-video border border-outline-variant/10 hover:border-primary/30 transition-all duration-700 shadow-2xl cursor-pointer"
          >
            <Image 
              src="https://images.unsplash.com/photo-1462331940025-496dfbfc7564?auto=format&fit=crop&q=80&w=2000"
              alt="Singularity Void"
              fill
              className="object-cover opacity-70 group-hover:scale-110 transition-transform duration-1000"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-surface via-transparent to-transparent opacity-90" />
            <div className="absolute bottom-0 left-0 p-8 md:p-16 w-full">
              <span className="text-xs font-body uppercase tracking-[0.3em] text-primary mb-4 md:mb-6 block">Interactive Singularity</span>
              <h3 className="text-3xl md:text-5xl font-bold text-on-surface mb-4 md:mb-6">Singularity Void</h3>
              <button className="flex items-center gap-3 text-primary font-body text-xs uppercase tracking-widest hover:gap-5 transition-all group-hover:text-white">
                Enter the Void <Maximize2 size={18} />
              </button>
            </div>
          </motion.div>

          {/* Side Cards */}
          <div className="col-span-12 lg:col-span-4 flex flex-col gap-8 md:gap-10">
            <motion.div 
              whileHover={{ y: -8 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setSelectedItem({ 
                title: 'Pulse Waves', 
                description: 'Experience the visualization of sound. Every frequency is mapped to a specific geometric transformation, creating a living bridge between audio and visual.' 
              })}
              className="flex-1 glass-panel rounded-2xl p-8 md:p-12 flex flex-col justify-between group hover:bg-surface-bright transition-all duration-500 cursor-pointer"
            >
              <div className="w-16 md:w-20 h-16 md:h-20 rounded-full bg-secondary/20 flex items-center justify-center text-secondary mb-8 md:mb-10 group-hover:scale-110 transition-transform">
                <Waves size={32} />
              </div>
              <div>
                <h4 className="text-2xl md:text-3xl font-bold text-on-surface mb-4">Pulse Waves</h4>
                <p className="text-on-surface-variant text-base md:text-lg leading-relaxed">Sound frequencies translated into immersive liquid geometry.</p>
              </div>
            </motion.div>

            <motion.div 
              whileHover={{ y: -8 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setSelectedItem({ 
                title: 'Stellar Mist', 
                description: 'A cloud of a million particles reacting to your presence. The mist follows your cursor, creating trails of light that slowly dissipate into the void.' 
              })}
              className="flex-1 glass-panel rounded-2xl p-8 md:p-12 flex flex-col justify-between group hover:bg-surface-bright transition-all duration-500 cursor-pointer"
            >
              <div className="w-16 md:w-20 h-16 md:h-20 rounded-full bg-tertiary/20 flex items-center justify-center text-tertiary mb-8 md:mb-10 group-hover:scale-110 transition-transform">
                <Sparkles size={32} />
              </div>
              <div>
                <h4 className="text-2xl md:text-3xl font-bold text-on-surface mb-4">Stellar Mist</h4>
                <p className="text-on-surface-variant text-base md:text-lg leading-relaxed">Microscopic particles that react dynamically to your cursor.</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Relaxation Zone */}
      <section id="sensory" className="py-20 md:py-40 relative overflow-hidden">
        <div className="absolute top-1/4 left-[5%] w-72 h-72 border border-primary/20 rounded-full animate-pulse" />
        <div className="absolute bottom-1/4 right-[10%] w-64 h-64 bg-secondary/10 rounded-xl rotate-45" />
        
        <div className="max-w-[1728px] mx-auto px-6 md:px-10 flex flex-col lg:flex-row gap-16 md:gap-32 items-center">
          <div className="w-full lg:w-3/5 relative">
            <div className="aspect-video glass-panel rounded-3xl p-4 md:p-6 neon-glow-magenta relative z-10 overflow-hidden">
              <div className="w-full h-full rounded-2xl overflow-hidden relative">
                <Image 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuAHFZN92X8fqrzN3Mja7jETprInF0JeIMvLYUVReu8nLcU1oi3jnq8BXrn5q3N0-zMyeB3lOqNsa4P58VmtqibtYHE1CkvgvWGcwGc9RBpn7lMHetVy4Ujok33rGYsFa36CZcwtCI8tTCCjS8QZ42uYU1JvXT-LjUzs7VLuvBjVIabCVptgsr3-SrKyAAgFmgO5BQXJHxj4OivhC4xjkouHR9TgSMYw8n8Iol3P06-wRX_87FnAE_9U7wGfRKEfHmm_KBjiaGX0C0Tc"
                  alt="Relaxation Zone"
                  fill
                  className="object-cover opacity-80"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-secondary/20 mix-blend-overlay" />
              </div>
            </div>
            <motion.div 
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -top-6 md:-top-12 -right-6 md:-right-12 w-32 md:w-48 h-32 md:h-48 glass-panel rounded-3xl p-6 md:p-8 z-20 flex flex-col justify-center items-center text-center shadow-2xl"
            >
              <span className="text-3xl md:text-4xl font-bold text-secondary">60</span>
              <span className="text-[10px] font-body uppercase tracking-widest text-on-surface-variant mt-2">BPM Pulse</span>
            </motion.div>
          </div>

          <div className="w-full lg:w-2/5">
            <div className="font-body text-xs tracking-[0.4em] uppercase text-tertiary mb-6 md:mb-8">02 — Ambient Experience</div>
            <h2 className="font-headline text-4xl md:text-7xl font-bold text-on-surface mb-8 md:mb-10 tracking-tight">Relaxation Zone</h2>
            <div className="space-y-6 md:space-y-8 text-lg md:text-xl text-on-surface-variant leading-relaxed opacity-90">
              <p>Slow down time. Enter a flow state where geometry moves in biological rhythms, syncing with your breathing.</p>
              <p>We use deep relaxation algorithms to create visual landscapes that reduce cognitive noise and promote total mental clarity.</p>
            </div>
            
            <div className="mt-12 md:mt-16 grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
              <motion.div 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSelectedItem({ 
                  title: 'Guided Breathing', 
                  description: 'A rhythmic light sequence designed to synchronize with your respiratory cycle. Inhale as the light expands, exhale as it contracts. Perfect for reducing immediate stress.' 
                })}
                className="flex items-center gap-6 p-6 rounded-2xl bg-surface-container-low hover:bg-surface-container-high transition-all group cursor-pointer border border-outline-variant/10 hover:border-primary/40 shadow-lg"
              >
                <div className="w-14 h-14 rounded-full bg-surface-container-high flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                  <Cloud size={24} />
                </div>
                <div>
                  <span className="block text-on-surface font-bold text-lg">Breathe</span>
                  <span className="text-[10px] text-on-surface-variant uppercase tracking-wider">Guided Light</span>
                </div>
              </motion.div>
              <motion.div 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSelectedItem({ 
                  title: 'Infinite Fractals', 
                  description: 'Lose yourself in the mathematical beauty of infinite recursion. These fractals are generated in real-time based on your heart rate, creating a unique visual fingerprint of your calm.' 
                })}
                className="flex items-center gap-6 p-6 rounded-2xl bg-surface-container-low hover:bg-surface-container-high transition-all group cursor-pointer border border-outline-variant/10 hover:border-secondary/40 shadow-lg"
              >
                <div className="w-14 h-14 rounded-full bg-surface-container-high flex items-center justify-center text-secondary group-hover:scale-110 transition-transform">
                  <Moon size={24} />
                </div>
                <div>
                  <span className="block text-on-surface font-bold text-lg">Drift</span>
                  <span className="text-[10px] text-on-surface-variant uppercase tracking-wider">Infinite Fractals</span>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Pulse Section Placeholder */}
      <section id="pulse" className="py-20 md:py-40 px-6 md:px-10 max-w-[1728px] mx-auto text-center">
        <div className="font-body text-xs tracking-[0.4em] uppercase text-secondary mb-8">03 — Pulse Sync</div>
        <h2 className="font-headline text-4xl md:text-7xl font-bold text-on-surface mb-8 tracking-tight">Real-time Synchronization</h2>
        <p className="max-w-2xl mx-auto text-lg md:text-xl text-on-surface-variant leading-relaxed opacity-80">
          Connect your device to synchronize the visual flow with your heart rate and movement.
        </p>
      </section>

      {/* About Section Placeholder */}
      <section id="about" className="py-20 md:py-40 px-6 md:px-10 max-w-[1728px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div>
            <div className="font-body text-xs tracking-[0.4em] uppercase text-primary mb-8">04 — The Vision</div>
            <h2 className="font-headline text-4xl md:text-7xl font-bold text-on-surface mb-8 tracking-tight">Beyond the Digital</h2>
            <p className="text-lg md:text-xl text-on-surface-variant leading-relaxed opacity-90">
              Celestial is more than a website; it&apos;s a digital sanctuary designed to explore the boundaries of human-computer interaction through sensory aesthetics.
            </p>
          </div>
          <div className="aspect-square glass-panel rounded-full flex items-center justify-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-secondary/20 to-tertiary/20 animate-pulse" />
            <Globe size={120} className="text-primary relative z-10" />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full py-16 md:py-20 border-t border-white/5 bg-surface/80 backdrop-blur-md mt-20 md:mt-40">
        <div className="flex flex-col md:flex-row justify-between items-center px-6 md:px-12 gap-12 max-w-[1728px] mx-auto">
          <div className="flex flex-col gap-4 text-center md:text-left">
            <div className="text-3xl font-black text-primary font-headline tracking-tighter">CELESTIAL</div>
            <div className="font-body text-[10px] tracking-[0.3em] uppercase text-on-surface-variant">
              © 2024 COSMIC FLUIDITY. <br className="md:hidden"/> DESIGNED FOR IMMERSIVE ENVIRONMENTS.
            </div>
          </div>
          
          <div className="flex flex-wrap justify-center gap-8 md:gap-16 font-body text-[10px] tracking-[0.2em] uppercase">
            <a className="text-on-surface-variant hover:text-primary transition-colors" href="#">Privacy Policy</a>
            <a className="text-on-surface-variant hover:text-primary transition-colors" href="#">Terms of Play</a>
            <a className="text-on-surface-variant hover:text-primary transition-colors" href="#">Contact Us</a>
          </div>
          
          <div className="flex gap-4 md:gap-6">
            <a className="w-12 md:w-14 h-12 md:h-14 flex items-center justify-center rounded-full glass-panel hover:text-primary hover:border-primary/50 transition-all" href="#">
              <Globe size={20} />
            </a>
            <a className="w-12 md:w-14 h-12 md:h-14 flex items-center justify-center rounded-full glass-panel hover:text-secondary hover:border-secondary/50 transition-all" href="#">
              <Star size={20} />
            </a>
          </div>
        </div>
      </footer>

      {/* Modal / Overlay for Selected Item */}
      {selectedItem && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-6 md:p-12 bg-surface/90 backdrop-blur-2xl"
        >
          <motion.div 
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            className="max-w-4xl w-full glass-panel rounded-[2rem] p-10 md:p-20 relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-primary via-secondary to-tertiary" />
            <button 
              onClick={() => setSelectedItem(null)}
              className="absolute top-8 right-8 p-4 rounded-full bg-white/5 hover:bg-white/10 transition-colors text-on-surface"
            >
              <ArrowRight className="rotate-180" size={24} />
            </button>
            
            <span className="text-xs font-body uppercase tracking-[0.4em] text-primary mb-8 block">Project Detail</span>
            <h2 className="font-headline text-4xl md:text-7xl font-bold text-on-surface mb-10 tracking-tighter">{selectedItem.title}</h2>
            <p className="text-xl md:text-2xl text-on-surface-variant leading-relaxed mb-16 opacity-90">
              {selectedItem.description}
            </p>
            
            <div className="flex flex-wrap gap-6">
              {selectedItem.title === 'Singularity Void' && (
                <button 
                  onClick={() => setIsExperienceActive(true)}
                  className="px-10 py-5 rounded-full bg-primary text-surface font-bold uppercase tracking-widest hover:scale-105 transition-transform active:scale-95"
                >
                  Launch Experience
                </button>
              )}
              <button 
                onClick={() => setSelectedItem(null)}
                className="px-10 py-5 rounded-full border border-outline-variant/30 text-on-surface font-bold uppercase tracking-widest hover:bg-white/5 transition-colors"
              >
                Close
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Interactive Cursor Orb */}
      <motion.div 
        className="fixed pointer-events-none w-10 h-10 rounded-full border border-primary/40 bg-primary/10 blur-[2px] z-[9999]"
        animate={{ 
          x: mousePos.x - 20, 
          y: mousePos.y - 20,
        }}
        transition={{ type: "spring", damping: 30, stiffness: 200, mass: 0.5 }}
      />

      {/* Full-screen Interactive Experience */}
      <AnimatePresence>
        {isExperienceActive && (
          <InteractiveExperience onClose={handleCloseExperience} />
        )}
      </AnimatePresence>
    </div>
  );
}
