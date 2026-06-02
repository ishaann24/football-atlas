'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Award, Sparkles } from 'lucide-react';

interface BracketMatch {
  id: string;
  round: 'R16' | 'QF' | 'SF' | 'F';
  t1: string;
  t2: string;
  s1?: string;
  s2?: string;
  winner?: string;
}

const BRACKET: BracketMatch[] = [
  // Round of 16 (Sample Nodes)
  { id: '1', round: 'R16', t1: 'Argentina', t2: 'Poland', s1: '2', s2: '0', winner: 'Argentina' },
  { id: '2', round: 'R16', t1: 'Netherlands', t2: 'USA', s1: '3', s2: '1', winner: 'Netherlands' },
  { id: '3', round: 'R16', t1: 'Spain', t2: 'Morocco', s1: '0(3)', s2: '0(1)', winner: 'Spain' },
  { id: '4', round: 'R16', t1: 'England', t2: 'Senegal', s1: '3', s2: '0', winner: 'England' },

  // Quarter Finals
  { id: '5', round: 'QF', t1: 'Argentina', t2: 'Netherlands', s1: '2(4)', s2: '2(3)', winner: 'Argentina' },
  { id: '6', round: 'QF', t1: 'Spain', t2: 'England', s1: '1', s2: '2', winner: 'England' },

  // Semi Final
  { id: '7', round: 'SF', t1: 'Argentina', t2: 'England', winner: 'TBD' },

  // Final
  { id: '8', round: 'F', t1: 'Winner SF1', t2: 'Winner SF2', winner: 'TBD' },
];

export default function RoadToGlory() {
  const getRoundMatches = (roundName: 'R16' | 'QF' | 'SF' | 'F') =>
    BRACKET.filter((m) => m.round === roundName);

  return (
    <div className="bg-slate-950/40 border border-slate-900 rounded-3xl p-6 md:p-8 backdrop-blur-2xl shadow-2xl relative overflow-hidden">
      
      {/* Background spotlights */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_70%,rgba(16,185,129,0.04)_0%,transparent_60%)] pointer-events-none" />

      {/* Header section */}
      <div className="text-center max-w-xl mx-auto mb-12">
        <div className="inline-flex items-center space-x-2 bg-emerald-950/60 border border-emerald-500/20 rounded-full px-3.5 py-1 text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-4">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Championship Path</span>
        </div>
        <h2 className="text-3xl font-black text-white uppercase tracking-tight">
          Road To Glory
        </h2>
        <p className="text-xs text-slate-500 mt-2 leading-relaxed">
          Follow the knockout stages from the Round of 16 to the final showdown at MetLife Stadium.
        </p>
      </div>

      {/* Bracket flex Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-center relative z-10">
        
        {/* ROUND OF 16 */}
        <div className="space-y-4">
          <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest border-b border-slate-900 pb-2 mb-4">Round of 16</h3>
          {getRoundMatches('R16').map((m) => (
            <motion.div
              key={m.id}
              whileHover={{ x: 4 }}
              className="bg-slate-900/60 border border-slate-850 rounded-xl p-3 shadow-md space-y-2 text-xs"
            >
              <div className="flex justify-between items-center">
                <span className={`font-semibold ${m.winner === m.t1 ? 'text-emerald-400 font-bold' : 'text-slate-300'}`}>{m.t1}</span>
                <span className="font-mono font-bold text-slate-400">{m.s1 || '-'}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className={`font-semibold ${m.winner === m.t2 ? 'text-emerald-400 font-bold' : 'text-slate-300'}`}>{m.t2}</span>
                <span className="font-mono font-bold text-slate-400">{m.s2 || '-'}</span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* QUARTER FINALS */}
        <div className="space-y-6">
          <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest border-b border-slate-900 pb-2 mb-4">Quarter Finals</h3>
          {getRoundMatches('QF').map((m) => (
            <motion.div
              key={m.id}
              whileHover={{ x: 4 }}
              className="bg-slate-900/60 border border-slate-850 rounded-xl p-3.5 shadow-md space-y-2 text-xs"
            >
              <div className="flex justify-between items-center">
                <span className={`font-semibold ${m.winner === m.t1 ? 'text-emerald-400 font-bold' : 'text-slate-300'}`}>{m.t1}</span>
                <span className="font-mono font-bold text-slate-400">{m.s1 || '-'}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className={`font-semibold ${m.winner === m.t2 ? 'text-emerald-400 font-bold' : 'text-slate-300'}`}>{m.t2}</span>
                <span className="font-mono font-bold text-slate-400">{m.s2 || '-'}</span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* SEMI FINALS */}
        <div className="space-y-12">
          <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest border-b border-slate-900 pb-2 mb-4">Semi Finals</h3>
          {getRoundMatches('SF').map((m) => (
            <motion.div
              key={m.id}
              whileHover={{ x: 4 }}
              className="bg-slate-900/60 border border-emerald-500/20 rounded-2xl p-4 shadow-xl space-y-2.5 text-xs relative overflow-hidden"
            >
              {/* Highlight bar */}
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-emerald-500/40" />
              <div className="flex justify-between items-center">
                <span className="font-bold text-slate-200">{m.t1}</span>
                <span className="font-mono text-slate-400">-</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-bold text-slate-200">{m.t2}</span>
                <span className="font-mono text-slate-400">-</span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CHAMPIONSHIP FINAL */}
        <div>
          <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest border-b border-slate-900 pb-2 mb-4">Final Showdown</h3>
          {getRoundMatches('F').map((m) => (
            <motion.div
              key={m.id}
              whileHover={{ scale: 1.02 }}
              className="bg-gradient-to-br from-emerald-500/10 via-slate-900/90 to-slate-950/90 border border-emerald-500/40 rounded-2xl p-5 shadow-2xl relative overflow-hidden text-center space-y-4"
            >
              {/* Gold light shine */}
              <div className="absolute -left-12 -top-12 w-24 h-24 bg-yellow-500/10 rounded-full blur-xl animate-pulse" />
              
              <div className="flex justify-center mb-1">
                <Award className="w-8 h-8 text-yellow-500 stroke-[2] animate-bounce" />
              </div>

              <div className="space-y-2 text-xs">
                <span className="block font-black text-slate-300 uppercase tracking-wide">{m.t1}</span>
                <span className="block text-[10px] font-extrabold text-emerald-400 uppercase tracking-widest">VS</span>
                <span className="block font-black text-slate-300 uppercase tracking-wide">{m.t2}</span>
              </div>

              <span className="block text-[9px] font-bold text-slate-500 uppercase tracking-wider bg-slate-950/80 py-1.5 rounded-lg border border-slate-900">
                July 19, 2026 @ MetLife
              </span>
            </motion.div>
          ))}
        </div>

      </div>
    </div>
  );
}
