'use client';

import React, { useRef, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Keyboard, MousePointer2 } from 'lucide-react';

interface Particle {
  x: number;
  y: number;
  z: number;
  vx: number;
  vy: number;
  vz: number;
  size: number;
  color: string;
  alpha: number;
}

export default function InteractiveExperience({ onClose }: { onClose: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const hueRef = useRef(200);
  const [showInstructions, setShowInstructions] = useState(true);
  const mouseRef = useRef({ x: 0, y: 0, active: false });
  const smoothedMouseRef = useRef({ x: 0, y: 0 });
  
  const particlesRef = useRef<Particle[]>([]);
  const starsRef = useRef<{ x: number, y: number, s: number }[]>([]);
  const ripplesRef = useRef<{ x: number, y: number, r: number, a: number }[]>([]);
  const planetsRef = useRef<{ x: number, y: number, z: number, size: number, color: string }[]>([]);
  const sunRef = useRef<{ x: number, y: number, z: number, size: number } | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => setShowInstructions(false), 5000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    const focalLength = 400;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      smoothedMouseRef.current = { x: canvas.width / 2, y: canvas.height / 2 };
      initStars();
      initScenery();
      if (particlesRef.current.length === 0) initParticles();
    };

    const initScenery = () => {
      // Initialize Sun (Static background element on the right)
      sunRef.current = {
        x: canvas.width * 0.4,
        y: -canvas.height * 0.1,
        z: 2000, // Very far back
        size: 400 // Much larger sun
      };

      // Initialize Saturn (Single planet)
      planetsRef.current = [{
        x: -canvas.width * 0.4,
        y: canvas.height * 0.2,
        z: 1500,
        size: 100,
        color: '#e6cc80' // Saturn sandy color
      }];
    };

    const initStars = () => {
      starsRef.current = [];
      for (let i = 0; i < 200; i++) {
        starsRef.current.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          s: Math.random() * 1.5
        });
      }
    };

    const initParticles = () => {
      particlesRef.current = [];
      const count = Math.min(window.innerWidth / 6, 250);
      for (let i = 0; i < count; i++) {
        particlesRef.current.push(createParticle());
      }
    };

    const createParticle = (x?: number, y?: number, burst = false): Particle => {
      const angle = Math.random() * Math.PI * 2;
      const speed = burst ? Math.random() * 5 + 2 : Math.random() * 0.5 + 0.1;
      return {
        x: x ?? (Math.random() - 0.5) * canvas.width * 2,
        y: y ?? (Math.random() - 0.5) * canvas.height * 2,
        z: Math.random() * 1000 + 200,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        vz: burst ? (Math.random() - 0.5) * 10 : -Math.random() * 1 - 0.5,
        size: Math.random() * 3 + 2, // Larger stars
        color: `hsla(${hueRef.current + Math.random() * 40 - 20}, 80%, 60%, `,
        alpha: Math.random() * 0.6 + 0.4, // Brighter base alpha
      };
    };

    const draw = () => {
      const currentHue = hueRef.current;
      // Deep space background
      ctx.fillStyle = '#010409';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Smooth mouse movement (easing)
      if (mouseRef.current.active) {
        // Follow mouse directly (1:1) but with even smoother easing (0.02)
        smoothedMouseRef.current.x += (mouseRef.current.x - smoothedMouseRef.current.x) * 0.02;
        smoothedMouseRef.current.y += (mouseRef.current.y - smoothedMouseRef.current.y) * 0.02;
      }

      // Draw static stars (background layer)
      ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
      starsRef.current.forEach(s => {
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.s, 0, Math.PI * 2);
        ctx.fill();
      });

      // Draw Sun (Scenery)
      if (sunRef.current) {
        const s = sunRef.current;
        const scale = focalLength / (focalLength + s.z);
        const sx = s.x * scale + canvas.width / 2;
        const sy = s.y * scale + canvas.height / 2;
        const sSize = s.size * scale;

        // Volumetric Light Rays (Light coming out of the sun)
        const rayCount = 12;
        const time = Date.now() * 0.0005;
        for (let i = 0; i < rayCount; i++) {
          const angle = (i / rayCount) * Math.PI * 2 + time;
          const length = sSize * (3 + Math.sin(time * 2 + i) * 0.5);
          const rayGradient = ctx.createLinearGradient(sx, sy, sx + Math.cos(angle) * length, sy + Math.sin(angle) * length);
          rayGradient.addColorStop(0, 'rgba(255, 200, 50, 0.3)');
          rayGradient.addColorStop(1, 'transparent');
          
          ctx.beginPath();
          ctx.moveTo(sx, sy);
          ctx.lineTo(sx + Math.cos(angle - 0.1) * length, sy + Math.sin(angle - 0.1) * length);
          ctx.lineTo(sx + Math.cos(angle + 0.1) * length, sy + Math.sin(angle + 0.1) * length);
          ctx.closePath();
          ctx.fillStyle = rayGradient;
          ctx.fill();
        }

        const sunGradient = ctx.createRadialGradient(sx, sy, sSize * 0.1, sx, sy, sSize);
        sunGradient.addColorStop(0, '#ffffff');
        sunGradient.addColorStop(0.2, '#fff5e6');
        sunGradient.addColorStop(0.4, '#ffcc00');
        sunGradient.addColorStop(0.7, '#ff6600');
        sunGradient.addColorStop(1, 'transparent');

        ctx.fillStyle = sunGradient;
        ctx.beginPath();
        ctx.arc(sx, sy, sSize, 0, Math.PI * 2);
        ctx.fill();

        // Layered Sun glow (Bloom effect)
        for (let i = 1; i <= 3; i++) {
          ctx.shadowBlur = (80 * i) * scale;
          ctx.shadowColor = `rgba(255, 100, 0, ${0.8 / i})`;
          ctx.beginPath();
          ctx.arc(sx, sy, sSize * 0.7, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.shadowBlur = 0;
      }

      // Draw Planets (Scenery)
      planetsRef.current.forEach(p => {
        const scale = focalLength / (focalLength + p.z);
        const px = p.x * scale + canvas.width / 2;
        const py = p.y * scale + canvas.height / 2;
        const pSize = p.size * scale;

        // Determine lighting direction from sun
        let lx = -0.3, ly = -0.3;
        if (sunRef.current) {
          const s = sunRef.current;
          const ss = focalLength / (focalLength + s.z);
          const sx = s.x * ss + canvas.width / 2;
          const sy = s.y * ss + canvas.height / 2;
          const dx = sx - px;
          const dy = sy - py;
          const dist = Math.sqrt(dx * dx + dy * dy);
          lx = (dx / dist) * 0.4;
          ly = (dy / dist) * 0.4;
        }

        // Planet shadow/lighting
        const planetGradient = ctx.createRadialGradient(
          px + pSize * lx, py + pSize * ly, pSize * 0.05,
          px, py, pSize
        );
        planetGradient.addColorStop(0, p.color);
        planetGradient.addColorStop(0.7, 'rgba(0,0,0,0.9)');
        planetGradient.addColorStop(1, '#000');

        ctx.fillStyle = planetGradient;
        ctx.beginPath();
        ctx.arc(px, py, pSize, 0, Math.PI * 2);
        ctx.fill();

        // Rim light (Light catching the edge)
        ctx.strokeStyle = `rgba(255, 255, 255, ${0.2 * scale})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(px, py, pSize, 0, Math.PI * 2);
        ctx.stroke();

        // Atmospheric glow
        ctx.shadowBlur = 15 * scale;
        ctx.shadowColor = p.color;
        ctx.strokeStyle = `${p.color}22`;
        ctx.beginPath();
        ctx.arc(px, py, pSize + 1, 0, Math.PI * 2);
        ctx.stroke();
        ctx.shadowBlur = 0;

        // Saturn's Rings
        const ringInner = pSize * 1.4;
        const ringOuter = pSize * 2.2;
        
        ctx.save();
        ctx.translate(px, py);
        ctx.rotate(Math.PI / 6); // Tilt the rings
        ctx.scale(1, 0.3); // Flatten into an ellipse
        
        const ringGradient = ctx.createRadialGradient(0, 0, ringInner, 0, 0, ringOuter);
        ringGradient.addColorStop(0, 'rgba(230, 204, 128, 0.1)');
        ringGradient.addColorStop(0.5, 'rgba(200, 180, 120, 0.4)');
        ringGradient.addColorStop(0.7, 'rgba(180, 160, 100, 0.2)');
        ringGradient.addColorStop(1, 'transparent');
        
        ctx.strokeStyle = ringGradient;
        ctx.lineWidth = ringOuter - ringInner;
        ctx.beginPath();
        ctx.arc(0, 0, (ringInner + ringOuter) / 2, 0, Math.PI * 2);
        ctx.stroke();
        
        // Add some ring texture/lines
        for (let j = 0; j < 3; j++) {
          ctx.strokeStyle = `rgba(255, 255, 255, ${0.1 * scale})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.arc(0, 0, ringInner + (ringOuter - ringInner) * (j / 3), 0, Math.PI * 2);
          ctx.stroke();
        }
        
        ctx.restore();
      });

      // Draw Black Hole Visual Effect
      if (mouseRef.current.active) {
        const mX = smoothedMouseRef.current.x;
        const mY = smoothedMouseRef.current.y;

        // Accretion Disk / Glow
        const gradient = ctx.createRadialGradient(mX, mY, 5, mX, mY, 80);
        gradient.addColorStop(0, 'rgba(0, 0, 0, 1)');
        gradient.addColorStop(0.2, 'rgba(10, 10, 20, 1)');
        gradient.addColorStop(0.4, `hsla(${currentHue}, 100%, 50%, 0.6)`);
        gradient.addColorStop(0.6, `hsla(${currentHue}, 100%, 30%, 0.2)`);
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(mX, mY, 80, 0, Math.PI * 2);
        ctx.fill();

        // Event Horizon (The dark center)
        ctx.fillStyle = '#000000';
        ctx.beginPath();
        ctx.arc(mX, mY, 18, 0, Math.PI * 2);
        ctx.fill();
        
        // Inner glow ring (Photon sphere)
        ctx.strokeStyle = `hsla(${currentHue}, 100%, 80%, 0.9)`;
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(mX, mY, 19, 0, Math.PI * 2);
        ctx.stroke();

        // Extra bloom for black hole
        ctx.shadowBlur = 40;
        ctx.shadowColor = `hsla(${currentHue}, 100%, 50%, 0.5)`;
        ctx.stroke();
        ctx.shadowBlur = 0;
      }

      // Draw ripples
      ripplesRef.current.forEach((r, i) => {
        ctx.beginPath();
        ctx.arc(r.x, r.y, r.r, 0, Math.PI * 2);
        ctx.strokeStyle = `hsla(${currentHue}, 80%, 60%, ${r.a})`;
        ctx.lineWidth = 2;
        ctx.stroke();
        r.r += 4;
        r.a *= 0.96;
        if (r.a < 0.01) ripplesRef.current.splice(i, 1);
      });

      // Sort particles by depth for basic 3D rendering
      particlesRef.current.sort((a, b) => b.z - a.z);

      particlesRef.current.forEach((p, i) => {
        // 3D Projection
        const scale = focalLength / (focalLength + p.z);
        const px = p.x * scale + canvas.width / 2;
        const py = p.y * scale + canvas.height / 2;
        const pSize = p.size * scale * 2;

        // Black Hole Gravitational Pull
        if (mouseRef.current.active) {
          const dx = smoothedMouseRef.current.x - px;
          const dy = smoothedMouseRef.current.y - py;
          const dist = Math.sqrt(dx * dx + dy * dy);
          
          if (dist < 600) {
            // Gravity force: much gentler sensitivity
            const gravity = (600 - dist) / 3000; // Even gentler
            const angle = Math.atan2(dy, dx);
            
            p.vx += Math.cos(angle) * gravity * (1 / scale);
            p.vy += Math.sin(angle) * gravity * (1 / scale);

            // Spiral effect
            p.vx += Math.cos(angle + Math.PI / 2) * gravity * 0.2;
            p.vy += Math.sin(angle + Math.PI / 2) * gravity * 0.2;

            // Consumption check
            if (dist < 20) {
              // Particle is sucked in!
              particlesRef.current[i] = createParticle();
              // Reset to far distance
              particlesRef.current[i].z = 1000;
              return;
            }
          }
        }

        // Movement
        p.x += p.vx;
        p.y += p.vy;
        p.z += p.vz;

        // Damping (Higher friction for slower movement)
        p.vx *= 0.94;
        p.vy *= 0.94;
        p.vz *= 0.99;

        // Recycling particles that go past the screen or too far
        if (p.z < -focalLength) {
          p.z = 1000;
          p.x = (Math.random() - 0.5) * canvas.width * 2;
          p.y = (Math.random() - 0.5) * canvas.height * 2;
        }
        if (p.z > 1200) p.z = -focalLength + 10;

        // Draw particle (Star)
        if (px > 0 && px < canvas.width && py > 0 && py < canvas.height) {
          // Draw glow first (faster than shadowBlur)
          if (scale > 0.5) {
            ctx.beginPath();
            ctx.arc(px, py, pSize * 2.5, 0, Math.PI * 2);
            ctx.fillStyle = `hsla(${currentHue}, 100%, 70%, ${p.alpha * scale * 0.15})`;
            ctx.fill();
          }

          ctx.beginPath();
          ctx.arc(px, py, pSize, 0, Math.PI * 2);
          // Maximum brightness
          ctx.fillStyle = `hsla(${currentHue + (p.z / 10)}, 100%, 98%, ${p.alpha * scale})`;
          ctx.fill();
        }
      });

      // Reset shadow effects to prevent leaking into other draw calls
      ctx.shadowBlur = 0;
      ctx.shadowColor = 'transparent';

      animationFrameId = requestAnimationFrame(draw);

      // Global Vignette and Shadow effect
      const vignette = ctx.createRadialGradient(canvas.width / 2, canvas.height / 2, canvas.width * 0.2, canvas.width / 2, canvas.height / 2, canvas.width * 0.8);
      vignette.addColorStop(0, 'transparent');
      vignette.addColorStop(1, 'rgba(0, 0, 0, 0.6)');
      ctx.fillStyle = vignette;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      
      // Visual bursts on key press
      const keys = ['a', 's', 'd', 'f', ' ', 'Enter'];
      if (keys.includes(e.key.toLowerCase())) {
        hueRef.current = (hueRef.current + 30) % 360;
        
        // Limit burst size and total particles for performance
        const burstCount = 15;
        for (let i = 0; i < burstCount; i++) {
          particlesRef.current.push(createParticle(Math.random() * canvas.width, Math.random() * canvas.height, true));
        }
        
        // Keep particle count manageable (max 600 instead of 1000)
        if (particlesRef.current.length > 600) {
          particlesRef.current.splice(0, particlesRef.current.length - 600);
        }
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY, active: true };
    };

    const handleMouseDown = (e: MouseEvent) => {
      ripplesRef.current.push({ x: e.clientX, y: e.clientY, r: 0, a: 1 });

      for (let i = 0; i < 50; i++) {
        particlesRef.current.push(createParticle(mouseRef.current.x, mouseRef.current.y, true));
      }
    };

    window.addEventListener('resize', resize);
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mousedown', handleMouseDown);
    
    resize();
    draw();

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      cancelAnimationFrame(animationFrameId);
    };
  }, [onClose]);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[200] bg-[#070e1b] overflow-hidden"
    >
      <canvas ref={canvasRef} className="w-full h-full" />
      
      <button 
        onClick={onClose}
        className="absolute top-8 right-8 p-4 rounded-full bg-white/10 hover:bg-white/20 transition-all text-white z-[210] group"
      >
        <X size={24} className="group-hover:rotate-90 transition-transform" />
      </button>

      <AnimatePresence>
        {showInstructions && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-6 text-white/60 pointer-events-none"
          >
            <div className="flex gap-12">
              <div className="flex items-center gap-3">
                <MousePointer2 size={20} />
                <span className="text-xs uppercase tracking-widest">Move & Click to Attract</span>
              </div>
              <div className="flex items-center gap-3">
                <Keyboard size={20} />
                <span className="text-xs uppercase tracking-widest">Press Keys for Bursts</span>
              </div>
            </div>
            <div className="text-[10px] uppercase tracking-[0.4em] text-primary animate-pulse">
              Immersive Mode Active
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="absolute top-12 left-12 pointer-events-none">
        <div className="text-2xl font-black text-primary tracking-tighter font-headline opacity-50 uppercase">Singularity Void</div>
        <div className="text-[10px] text-white/30 uppercase tracking-[0.3em] mt-2">Interactive Galactic Singularity v1.1</div>
      </div>
    </motion.div>
  );
}
