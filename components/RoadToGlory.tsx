'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Award, Trophy, ShieldAlert, Sparkles, Calendar } from 'lucide-react';

interface BracketMatch {
  id: string;
  matchNumber: number;
  homeTeam: string | null;
  awayTeam: string | null;
  stage: string;
  score: string | null;
  winner: string | null;
}

interface BracketStages {
  r32: BracketMatch[];
  r16: BracketMatch[];
  qf: BracketMatch[];
  sf: BracketMatch[];
  final: BracketMatch[];
}

export default function RoadToGlory() {
  const [stages, setStages] = useState<BracketStages | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchBracket() {
      try {
        const res = await fetch('/api/bracket');
        if (!res.ok) throw new Error('Failed to load bracket data');
        const data = await res.json();
        if (data.success && data.stages) {
          setStages(data.stages);
        } else {
          throw new Error(data.error || 'Invalid API response');
        }
      } catch (err: any) {
        setError(err.message || 'Failed to fetch bracket data');
      } finally {
        setLoading(false);
      }
    }
    fetchBracket();
  }, []);

  const renderTeamRow = (teamName: string | null, score: string | null, isWinner: boolean) => {
    const isEmpty = !teamName;
    return (
      <div className={`flex justify-between items-center py-2 px-3 rounded-lg transition-colors ${
        isWinner ? 'bg-emerald-950/20 text-emerald-400 font-bold border-l-2 border-emerald-500' : 'text-slate-300'
      }`}>
        <span className={`truncate text-xs tracking-wide ${isEmpty ? 'text-slate-600 italic' : ''}`}>
          {isEmpty ? 'TBD' : teamName}
        </span>
        {!isEmpty && score && (
          <span className="font-mono text-xs font-bold bg-slate-900 px-1.5 py-0.5 rounded border border-slate-800">
            {score}
          </span>
        )}
      </div>
    );
  };

  const renderRoundColumn = (title: string, subtitle: string, matches: BracketMatch[], isFinalRound = false) => {
    return (
      <div className="flex flex-col min-w-[260px] md:min-w-0 md:flex-1 space-y-4">
        <div className="border-b border-slate-900 pb-3">
          <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-none">
            {title}
          </h3>
          <span className="text-[9px] text-slate-600 font-bold uppercase mt-1 block">
            {subtitle}
          </span>
        </div>
        <div className="flex flex-col justify-around h-full space-y-4 py-2">
          {matches.map((m) => {
            const hasHomeWinner = m.winner ? m.winner === m.homeTeam : false;
            const hasAwayWinner = m.winner ? m.winner === m.awayTeam : false;

            const homeScore = m.score ? m.score.split('-')[0] : null;
            const awayScore = m.score ? m.score.split('-')[1] : null;

            return (
              <motion.div
                key={m.id}
                whileHover={{ y: -2 }}
                className={`bg-slate-950/80 border p-3 rounded-2xl shadow-xl flex flex-col space-y-2 relative overflow-hidden transition-all ${
                  isFinalRound
                    ? 'border-[#FFD700] ring-1 ring-[#FFD700]/30 shadow-[#FFD700]/5 bg-gradient-to-br from-amber-500/5 via-slate-950 to-slate-950'
                    : 'border-slate-900/60 hover:border-slate-800/80'
                }`}
              >
                {/* Gold Highlight Ring on Final */}
                {isFinalRound && (
                  <div className="absolute -right-8 -top-8 w-16 h-16 bg-[#FFD700]/10 rounded-full blur-xl animate-pulse" />
                )}

                <div className="text-[9px] font-mono text-slate-500 flex justify-between">
                  <span>MATCH #{m.matchNumber}</span>
                  {isFinalRound && (
                    <span className="text-[#FFD700] font-black tracking-wider flex items-center space-x-0.5">
                      <Trophy className="w-2.5 h-2.5 stroke-[2.5]" />
                      <span>THE FINALS</span>
                    </span>
                  )}
                </div>

                <div className="space-y-1">
                  {renderTeamRow(m.homeTeam, homeScore, hasHomeWinner)}
                  {renderTeamRow(m.awayTeam, awayScore, hasAwayWinner)}
                </div>

                {isFinalRound && (
                  <div className="pt-2 border-t border-slate-900 flex items-center space-x-1.5 text-[9px] font-black text-slate-400 uppercase tracking-tight">
                    <Calendar className="w-3 h-3 text-[#FFD700]" />
                    <span>July 19, 2026 · MetLife Stadium, East Rutherford, NJ</span>
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="bg-slate-950/40 border border-slate-900 rounded-3xl p-6 md:p-8 backdrop-blur-2xl shadow-2xl relative overflow-hidden">
      {/* Background spotlights */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_70%,rgba(255,215,0,0.02)_0%,transparent_60%)] pointer-events-none" />

      {/* Header section */}
      <div className="text-center max-w-xl mx-auto mb-10">
        <div className="inline-flex items-center space-x-2 bg-amber-950/40 border border-[#FFD700]/20 rounded-full px-3.5 py-1 text-[10px] font-black text-[#FFD700] uppercase tracking-widest mb-4">
          <Sparkles className="w-3.5 h-3.5" />
          <span>FIFA Tournament Grid</span>
        </div>
        <h2 className="text-3xl font-black text-white uppercase tracking-tight">
          Road To Glory
        </h2>
        <p className="text-xs text-slate-400 mt-2 leading-relaxed">
          Track the live championship path. Bracket slots activate only when official qualification data is resolved by the football-data.org API.
        </p>
      </div>

      {loading && (
        <div className="flex flex-col items-center justify-center py-20 space-y-3">
          <div className="w-8 h-8 rounded-full border-2 border-[#FFD700] border-t-transparent animate-spin" />
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest animate-pulse">
            Analyzing Championship Brackets...
          </span>
        </div>
      )}

      {error && (
        <div className="flex flex-col items-center justify-center py-12 text-center space-y-3 bg-red-950/10 border border-red-500/20 rounded-2xl">
          <ShieldAlert className="w-8 h-8 text-red-400" />
          <span className="text-xs text-red-300 font-medium">
            Could not fetch real-time bracket data.
          </span>
          <p className="text-[10px] text-slate-500 max-w-xs">{error}</p>
        </div>
      )}

      {!loading && !error && stages && (
        /* Horizontal scrolling on mobile, full grid on desktop */
        <div className="flex md:grid md:grid-cols-5 gap-6 overflow-x-auto pb-4 md:pb-0 scrollbar-thin relative z-10">
          {renderRoundColumn('Round of 32', '16 Matches', stages.r32)}
          {renderRoundColumn('Round of 16', '8 Matches', stages.r16)}
          {renderRoundColumn('Quarter-Finals', '4 Matches', stages.qf)}
          {renderRoundColumn('Semi-Finals', '2 Matches', stages.sf)}
          {renderRoundColumn('Championship Final', '1 Match', stages.final, true)}
        </div>
      )}
    </div>
  );
}
