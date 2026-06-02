'use client';

import React from 'react';
import { motion, useMotionValue, useTransform } from 'framer-motion';

export default function Trophy3D() {
  // Motion values to track mouse movements for interactive 3D parallax rotation
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Map mouse coordinate bounds to degrees of rotation
  const rotateX = useTransform(y, [-300, 300], [15, -15]);
  const rotateY = useTransform(x, [-300, 300], [-30, 30]);

  function handleMouseMove(event: React.MouseEvent) {
    const rect = event.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = event.clientX - rect.left - width / 2;
    const mouseY = event.clientY - rect.top - height / 2;
    x.set(mouseX);
    y.set(mouseY);
  }

  function handleMouseLeave() {
    x.set(0);
    y.set(0);
  }

  return (
    <div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative flex items-center justify-center cursor-grab active:cursor-grabbing select-none w-80 h-96 group perspective-1000"
    >
      {/* Glow highlight backdrop */}
      <div className="absolute inset-10 bg-emerald-500/20 rounded-full blur-[70px] group-hover:bg-emerald-500/35 transition-all duration-700 animate-pulse pointer-events-none" />

      {/* Rotating 3D Object Container */}
      <motion.div
        style={{
          rotateX,
          rotateY,
          transformStyle: 'preserve-3d',
        }}
        transition={{ type: 'spring', stiffness: 200, damping: 25 }}
        className="w-full h-full flex items-center justify-center animate-float-trophy pointer-events-none"
      >
        {/* Layered SVG representation of the gold FIFA World Cup Trophy */}
        <svg
          viewBox="0 0 200 300"
          className="w-64 h-80 drop-shadow-[0_25px_40px_rgba(234,179,8,0.25)] group-hover:drop-shadow-[0_30px_50px_rgba(234,179,8,0.4)] transition-all duration-300"
        >
          <defs>
            <radialGradient id="gold-radial" cx="50%" cy="40%" r="60%">
              <stop offset="0%" stopColor="#fef08a" />
              <stop offset="50%" stopColor="#eab308" />
              <stop offset="85%" stopColor="#854d0e" />
              <stop offset="100%" stopColor="#451a03" />
            </radialGradient>
            <linearGradient id="gold-linear" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#fef08a" />
              <stop offset="25%" stopColor="#facc15" />
              <stop offset="60%" stopColor="#ca8a04" />
              <stop offset="100%" stopColor="#713f12" />
            </linearGradient>
            <linearGradient id="emerald-band" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#064e3b" />
              <stop offset="50%" stopColor="#10b981" />
              <stop offset="100%" stopColor="#064e3b" />
            </linearGradient>
          </defs>

          {/* Background Highlight Beam inside Trophy SVG */}
          <ellipse cx="100" cy="150" rx="35" ry="100" fill="url(#gold-radial)" opacity="0.08" filter="blur(8px)" />

          {/* Base of the Trophy */}
          <path d="M60 270 C60 260, 140 260, 140 270 L135 290 C135 292, 65 292, 65 290 Z" fill="url(#gold-linear)" />
          {/* Base Rings (Green Malachite Bands) */}
          <ellipse cx="100" cy="275" rx="36" ry="6" fill="url(#emerald-band)" />
          <ellipse cx="100" cy="265" rx="34" ry="5" fill="url(#emerald-band)" />

          {/* Middle riser stem */}
          <path d="M85 220 Q100 240 85 260 L115 260 Q100 240 115 220 Z" fill="url(#gold-linear)" />

          {/* The two human figures supporting the globe */}
          <path
            d="M75 140 C75 170, 90 220, 90 220 L110 220 C110 220, 125 170, 125 140 Q100 160 75 140 Z"
            fill="url(#gold-radial)"
          />
          <path
            d="M60 145 C65 170, 85 190, 90 220 C85 210, 75 190, 58 175 Z"
            fill="url(#gold-linear)"
            opacity="0.95"
          />
          <path
            d="M140 145 C135 170, 115 190, 110 220 C115 210, 125 190, 142 175 Z"
            fill="url(#gold-linear)"
            opacity="0.95"
          />

          {/* Globe at the top */}
          <circle cx="100" cy="110" r="42" fill="url(#gold-radial)" />
          {/* Earth Continents details */}
          <path d="M72 105 Q85 92 100 100 Q105 105 120 95 Q135 98 128 115 Q115 110 105 125 Q90 120 72 105 Z" fill="#854d0e" opacity="0.6" />
          <path d="M90 80 Q100 70 110 78 Q100 85 90 80 Z" fill="#854d0e" opacity="0.6" />

          {/* Highlight overlays for realistic reflection */}
          <path d="M100 71 Q103 90 100 152" stroke="#ffffff" strokeWidth="1.5" opacity="0.3" fill="none" />
          <ellipse cx="100" cy="270" rx="35" ry="1.5" fill="#ffffff" opacity="0.4" />
        </svg>
      </motion.div>
    </div>
  );
}
