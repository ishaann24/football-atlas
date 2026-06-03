'use client';

import React from 'react';
import { Shield, Sparkles, Award, Star, Compass, UserCheck } from 'lucide-react';

export default function TrophyShowcase() {
  const facts = [
    { icon: <Award className="w-5 h-5 text-[#FFD700]" />, label: 'Height', value: '36.8 cm (14.5 in)' },
    { icon: <Star className="w-5 h-5 text-[#FFD700]" />, label: 'Weight', value: '6,175 g (13.6 lb)' },
    { icon: <Compass className="w-5 h-5 text-[#FFD700]" />, label: 'Material', value: '18-carat gold (75%) with malachite bands' },
    { icon: <Sparkles className="w-5 h-5 text-[#FFD700]" />, label: 'Awarded Since', value: '1974' },
    { icon: <UserCheck className="w-5 h-5 text-[#FFD700]" />, label: 'Presented By', value: 'FIFA President at MetLife Stadium, July 19, 2026' },
  ];

  return (
    <section className="relative w-full bg-[#0a0a0a] py-20 px-4 md:px-8 border-y border-slate-900 overflow-hidden">
      {/* Background radial gold glow */}
      <div className="absolute top-1/2 left-1/4 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#FFD700]/5 rounded-full blur-[100px] pointer-events-none" />
      
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-12 items-center relative z-10">
        
        {/* Left Side: Pulsing & Floating Image */}
        <div className="md:col-span-5 flex justify-center">
          <div className="relative group">
            {/* Pulsing Outer Glow */}
            <div className="absolute inset-0 rounded-3xl bg-[#FFD700]/10 blur-xl group-hover:bg-[#FFD700]/15 transition-colors duration-500 pointer-events-none" />
            
            <div className="animate-trophy-float">
              <img
                src="/images/trophy.png"
                alt="FIFA World Cup Trophy"
                className="w-48 h-72 md:w-64 md:h-96 object-cover rounded-2xl border border-[#FFD700]/40 shadow-2xl animate-trophy-pulse"
                style={{
                  objectPosition: 'center 20%',
                }}
              />
            </div>
          </div>
        </div>

        {/* Right Side: Trophy Facts */}
        <div className="md:col-span-7 space-y-6">
          <div className="space-y-2">
            <span className="text-[10px] font-black text-[#FFD700] uppercase tracking-widest leading-none flex items-center space-x-1.5">
              <Sparkles className="w-3.5 h-3.5 fill-[#FFD700]/20" />
              <span>THE ULTIMATE PRIZE</span>
            </span>
            <h2 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tight">
              The FIFA World Cup Trophy
            </h2>
          </div>

          <p className="text-slate-400 text-xs md:text-sm leading-relaxed max-w-xl">
            First introduced in 1974, it remains the most prestigious emblem in all of global sports. Sculpted by Italian artist Silvio Gazzaniga, it represents the pinnacle of athletic achievement.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
            {facts.map((fact, idx) => (
              <div 
                key={idx} 
                className="flex items-start space-x-3 bg-slate-950/60 border border-slate-900 p-4 rounded-xl backdrop-blur-md"
              >
                <div className="p-2 bg-slate-900 border border-slate-800 rounded-lg">
                  {fact.icon}
                </div>
                <div>
                  <span className="block text-[9px] font-bold text-slate-500 uppercase tracking-wider">
                    {fact.label}
                  </span>
                  <span className="block text-xs font-black text-slate-200 mt-1 leading-snug">
                    {fact.value}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Bottom Quote block */}
      <div className="max-w-3xl mx-auto mt-16 text-center border-t border-slate-900 pt-8 relative z-10">
        <blockquote className="text-sm md:text-base font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-100 via-[#FFD700] to-yellow-100 italic tracking-wide uppercase px-4">
          "Made from 18-carat gold, featuring two human figures holding up the globe"
        </blockquote>
        <span className="block text-[9px] font-mono text-slate-500 uppercase tracking-widest mt-2">
          - Silvio Gazzaniga, Trophy Designer
        </span>
      </div>
    </section>
  );
}
