'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import dynamic from 'next/dynamic';
import rawMatches from '@/data/matches.json';
import TimezoneSelector from '@/components/TimezoneSelector';
import MatchCard from '@/components/MatchCard';
import RegisterForm from '@/components/RegisterForm';
import Countdown from '@/components/Countdown';
import WorldMap from '@/components/WorldMap';
import RoadToGlory from '@/components/RoadToGlory';
import LenisProvider from '@/components/LenisProvider';
import { motion, useScroll, useSpring, useTransform } from 'framer-motion';
import { Search, Trophy, Calendar, Bell, ChevronRight, Activity, Globe, Sparkles } from 'lucide-react';

// Bypassing Server-Side Rendering (SSR) for browser-only Three.js WebGL canvas
const WorldCupScene = dynamic(() => import('@/components/three/WorldCupScene'), {
  ssr: false,
  loading: () => (
    <div className="absolute inset-0 bg-slate-950 flex flex-col items-center justify-center space-y-4">
      <div className="w-12 h-12 rounded-full border-4 border-emerald-500 border-t-transparent animate-spin" />
      <span className="text-xs text-emerald-400 font-bold uppercase tracking-widest animate-pulse">
        Initializing 3D Stadium...
      </span>
    </div>
  ),
});

const TEAM_FLAGS = [
  { flag: '🇦🇷', name: 'Argentina' },
  { flag: '🇧🇷', name: 'Brazil' },
  { flag: '🇫🇷', name: 'France' },
  { flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', name: 'England' },
  { flag: '🇺🇸', name: 'USA' },
  { flag: '🇲🇽', name: 'Mexico' },
  { flag: '🇨🇦', name: 'Canada' },
  { flag: '🇩🇪', name: 'Germany' },
];

export default function Home() {
  const [selectedTimezone, setSelectedTimezone] = useState('Asia/Kolkata'); // Default to IST
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTeam, setSelectedTeam] = useState('All');
  const [selectedStage, setSelectedStage] = useState('All');

  // Track absolute window scroll coordinate
  const { scrollYProgress } = useScroll();

  // Apply spring damping to smooth out scroll coordinates for UI transforms
  const smoothScrollProgress = useSpring(scrollYProgress, {
    stiffness: 80,
    damping: 20,
    restDelta: 0.001,
  });

  const matches = useMemo(() => rawMatches, []);

  // Unique team list for filter
  const uniqueTeams = useMemo(() => {
    const teamsSet = new Set<string>();
    matches.forEach((m) => {
      const isPlaceholder = (t: string) =>
        t.includes('Winner') || t.includes('Runner-up') || t.includes('Loser') || t === 'TBD';

      if (!isPlaceholder(m.homeTeam)) teamsSet.add(m.homeTeam);
      if (!isPlaceholder(m.awayTeam)) teamsSet.add(m.awayTeam);
    });
    return Array.from(teamsSet).sort();
  }, [matches]);

  // Filtering engine
  const filteredMatches = useMemo(() => {
    return matches.filter((match) => {
      const matchesTeam =
        selectedTeam === 'All' ||
        match.homeTeam.toLowerCase() === selectedTeam.toLowerCase() ||
        match.awayTeam.toLowerCase() === selectedTeam.toLowerCase();

      const matchesSearch =
        searchTerm === '' ||
        match.homeTeam.toLowerCase().includes(searchTerm.toLowerCase()) ||
        match.awayTeam.toLowerCase().includes(searchTerm.toLowerCase()) ||
        match.venue.toLowerCase().includes(searchTerm.toLowerCase()) ||
        match.group.toLowerCase().includes(searchTerm.toLowerCase()) ||
        match.stage.toLowerCase().includes(searchTerm.toLowerCase());

      let matchesStage = true;
      if (selectedStage !== 'All') {
        if (selectedStage === 'Group Stage') {
          matchesStage = match.stage === 'Group Stage';
        } else if (selectedStage === 'Knockouts') {
          matchesStage = match.stage !== 'Group Stage';
        }
      }

      return matchesTeam && matchesSearch && matchesStage;
    });
  }, [matches, selectedTeam, searchTerm, selectedStage]);

  // Framer Motion transforms to drive text reveals based on scroll progress (smoothed via spring)
  const tunnelTextOpacity = useTransform(smoothScrollProgress, [0, 0.28], [1, 0]);
  const tunnelTextScale = useTransform(smoothScrollProgress, [0, 0.28], [1, 0.8]);

  const lightsTextOpacity = useTransform(smoothScrollProgress, [0.18, 0.35, 0.48], [0, 1, 0]);
  const lightsTextY = useTransform(smoothScrollProgress, [0.18, 0.35, 0.48], [50, 0, -50]);

  const trophyTextOpacity = useTransform(smoothScrollProgress, [0.42, 0.58, 0.72], [0, 1, 0]);
  const trophyTextY = useTransform(smoothScrollProgress, [0.42, 0.58, 0.72], [50, 0, -50]);

  return (
    <LenisProvider>
      <div className="relative min-h-[500vh] bg-[#020617] text-slate-100 selection:bg-emerald-500 selection:text-slate-900 overflow-x-hidden">
        
        {/* Fixed Background 3D WebGL Canvas mapping camera paths to page scrolls */}
        <div className="fixed inset-0 w-screen h-screen z-0 pointer-events-none">
          <WorldCupScene />
        </div>

        {/* Global sticky header */}
        <header className="fixed top-0 left-0 right-0 border-b border-slate-900/60 bg-slate-950/70 backdrop-blur-xl z-50">
          <div className="max-w-7xl mx-auto px-4 md:px-8 py-4 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center space-x-3 group cursor-pointer">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center shadow-lg shadow-emerald-500/10">
                <Trophy className="w-5 h-5 text-slate-950 stroke-[2.5]" />
              </div>
              <div>
                <h1 className="text-lg font-black text-white tracking-tight uppercase">
                  FIFA World Cup <span className="text-emerald-400">2026</span>
                </h1>
                <p className="text-[9px] text-slate-500 font-black uppercase tracking-widest leading-none mt-0.5">
                  Cinematic Hub
                </p>
              </div>
            </div>

            <div className="w-full md:w-auto">
              <TimezoneSelector
                selectedTimezone={selectedTimezone}
                onTimezoneChange={setSelectedTimezone}
              />
            </div>
          </div>
        </header>

        {/* ========================================================================= */}
        {/* SCROLL STORY SECTIONS */}
        {/* ========================================================================= */}

        {/* SECTION 1: Dark Stadium Tunnel Entrance (ScrollHeight: 100vh) */}
        <section className="relative h-screen w-full flex flex-col items-center justify-center text-center px-4 z-10 select-none">
          <motion.div style={{ opacity: tunnelTextOpacity, scale: tunnelTextScale }} className="space-y-6 max-w-3xl">
            <div className="inline-flex items-center space-x-2 bg-slate-900/80 border border-slate-800 rounded-full px-4 py-1.5 text-xs text-slate-400 font-bold tracking-widest uppercase">
              <Globe className="w-4 h-4 text-emerald-400 animate-spin" style={{ animationDuration: '8s' }} />
              <span>Entering SoFi Stadium Tunnel</span>
            </div>
            <h1 className="text-5xl md:text-8xl font-black text-white uppercase tracking-tighter leading-none">
              UNITED <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-emerald-600">2026</span>
            </h1>
            <p className="text-slate-400 font-mono text-xs md:text-sm uppercase tracking-widest">
              48 Nations. 104 Matches. One Champion.
            </p>
            <div className="pt-6 animate-bounce text-xs font-bold text-slate-500 uppercase tracking-widest">
              Scroll Down to Step Out
            </div>
          </motion.div>
        </section>

        {/* SECTION 2: Floodlights Reveal (ScrollHeight: 100vh) */}
        <section className="relative h-screen w-full flex items-center justify-center text-center px-4 z-10 pointer-events-none">
          <motion.div style={{ opacity: lightsTextOpacity, y: lightsTextY }} className="space-y-4 max-w-2xl">
            <h2 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tight">
              Floodlights Activated.
            </h2>
            <p className="text-slate-400 text-xs md:text-sm leading-relaxed max-w-md mx-auto">
              Step onto the pitch. Volumetric spotlights illuminate the grand arena as the crowd roars.
            </p>
          </motion.div>
        </section>

        {/* SECTION 3: Golden Trophy Focus (ScrollHeight: 100vh) */}
        <section className="relative h-screen w-full flex items-center justify-center text-center px-4 z-10 pointer-events-none">
          <motion.div style={{ opacity: trophyTextOpacity, y: trophyTextY }} className="space-y-4 max-w-xl">
            <h2 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tight">
              The Ultimate Glory.
            </h2>
            <p className="text-slate-400 text-xs md:text-sm leading-relaxed">
              Hover your cursor to reflect the lights off the gold. Built in high-performance WebGL.
            </p>
          </motion.div>
        </section>

        {/* SECTION 4: Floating Team Cards & Countdown (ScrollHeight: 100vh) */}
        <section className="relative min-h-screen w-full flex flex-col justify-center py-20 px-4 max-w-7xl mx-auto z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Column: Live Ticker */}
            <div className="lg:col-span-6 space-y-6 text-center lg:text-left">
              <span className="inline-flex items-center space-x-2 bg-emerald-950/60 border border-emerald-500/20 rounded-full px-3.5 py-1 text-xs text-emerald-400 font-bold uppercase tracking-wide">
                <Sparkles className="w-3.5 h-3.5 animate-pulse" />
                <span>Campaign Countdown</span>
              </span>
              <h2 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tight leading-none">
                The Clock <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-blue-400">Is Ticking.</span>
              </h2>
              <p className="text-xs text-slate-400 leading-relaxed max-w-md">
                Days away from the historic opening match. Ensure you register for goal alerts below to follow every match event instantly.
              </p>
              <div className="pt-2">
                <Countdown />
              </div>
            </div>

            {/* Right Column: Floating Team Selection Grids */}
            <div className="lg:col-span-6">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {TEAM_FLAGS.map((t, idx) => (
                  <motion.button
                    key={t.name}
                    whileHover={{ scale: 1.05, y: -4 }}
                    onClick={() => {
                      setSelectedTeam(t.name);
                      const scheduleEl = document.getElementById('schedules');
                      if (scheduleEl) scheduleEl.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="bg-slate-950/80 border border-slate-900 hover:border-emerald-500/35 p-5 rounded-2xl flex flex-col items-center justify-center text-center shadow-xl backdrop-blur-md transition-colors"
                  >
                    <span className="text-3xl mb-2">{t.flag}</span>
                    <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">{t.name}</span>
                  </motion.button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 5: Tournament Bracket, Stadium Map, and Fixtures Schedule */}
        <div className="relative bg-gradient-to-b from-[#020617]/0 via-[#020617]/95 to-[#020617] pt-20 pb-12 z-10">
          
          {/* Fan Signup block */}
          <div className="max-w-4xl mx-auto px-4 md:px-8 mb-24">
            <RegisterForm />
          </div>

          {/* Interactive World map of Host Cities */}
          <div className="max-w-7xl mx-auto px-4 md:px-8 mb-24">
            <div className="flex items-center space-x-2.5 mb-8">
              <div className="w-1.5 h-6 bg-emerald-500 rounded-full" />
              <h2 className="text-xl md:text-2xl font-black text-white uppercase tracking-wider">
                16 Host Cities Vector Showcase
              </h2>
            </div>
            <WorldMap />
          </div>

          {/* Road to Glory bracket */}
          <div className="max-w-7xl mx-auto px-4 md:px-8 mb-24">
            <RoadToGlory />
          </div>

          {/* Test Cron Banner */}
          <div className="max-w-7xl mx-auto px-4 md:px-8 mb-24">
            <div className="bg-gradient-to-r from-emerald-950/20 via-slate-900/60 to-blue-950/20 border border-slate-900 rounded-3xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl">
              <div className="flex items-center space-x-4">
                <div className="w-14 h-14 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center flex-shrink-0 shadow-lg">
                  <Bell className="w-6 h-6 text-blue-400 animate-bounce" />
                </div>
                <div>
                  <h3 className="text-base font-black text-white tracking-tight">Interactive Goal Alerts Testing Sandbox</h3>
                  <p className="text-xs text-slate-400 mt-1 max-w-lg">
                    Click this button to trigger a simulated match goal (e.g. USA vs Colombia). It checks the Database and dispatches your Welcome Email or Goal Alert instantly!
                  </p>
                </div>
              </div>
              <a
                href="/api/cron"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 py-3.5 px-6 bg-slate-900 hover:bg-slate-850 text-xs font-bold text-slate-200 border border-slate-800 rounded-xl transition-all hover:border-slate-700 shadow-xl"
              >
                <span>Trigger Simulated Goal Cron</span>
                <ChevronRight className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Schedule Filter Feeds */}
          <div id="schedules" className="max-w-7xl mx-auto px-4 md:px-8 scroll-mt-24">
            <div className="flex items-center space-x-2.5 mb-8">
              <div className="w-1.5 h-6 bg-emerald-500 rounded-full" />
              <h2 className="text-xl md:text-2xl font-black text-white uppercase tracking-wider">
                Match Schedules
              </h2>
            </div>

            {/* Filter toolbar */}
            <div className="bg-slate-950/60 border border-slate-900 p-4 rounded-2xl mb-8 flex flex-col md:flex-row gap-4 items-center justify-between shadow-2xl backdrop-blur-md">
              <div className="relative w-full md:max-w-xs">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="text"
                  placeholder="Search team, stadium, group..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-slate-900/60 border border-slate-800 hover:border-slate-700 focus:border-emerald-500/60 text-white rounded-xl py-2.5 pl-10 pr-4 text-xs font-bold outline-none transition-colors"
                />
              </div>

              <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
                <select
                  value={selectedTeam}
                  onChange={(e) => setSelectedTeam(e.target.value)}
                  className="bg-slate-900/60 border border-slate-800 hover:border-slate-700 text-slate-300 text-xs font-black rounded-xl py-2.5 px-4 outline-none focus:border-emerald-500 cursor-pointer min-w-[140px]"
                >
                  <option value="All">All Nations</option>
                  {uniqueTeams.map((team) => (
                    <option key={team} value={team}>
                      {team}
                    </option>
                  ))}
                </select>

                <select
                  value={selectedStage}
                  onChange={(e) => setSelectedStage(e.target.value)}
                  className="bg-slate-900/60 border border-slate-800 hover:border-slate-700 text-slate-300 text-xs font-black rounded-xl py-2.5 px-4 outline-none focus:border-emerald-500 cursor-pointer min-w-[140px]"
                >
                  <option value="All">All Stages</option>
                  <option value="Group Stage">Group Stage</option>
                  <option value="Knockouts">Knockout Phase</option>
                </select>

                {(searchTerm !== '' || selectedTeam !== 'All' || selectedStage !== 'All') && (
                  <button
                    onClick={() => {
                      setSearchTerm('');
                      setSelectedTeam('All');
                      setSelectedStage('All');
                    }}
                    className="text-xs text-emerald-400 font-bold hover:text-emerald-300 transition-colors py-2 px-3"
                  >
                    Clear Filters
                  </button>
                )}
              </div>
            </div>

            {/* Fixture cards grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredMatches.map((match) => (
                <MatchCard
                  key={match.id}
                  match={match}
                  timezone={selectedTimezone}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="relative border-t border-slate-900/60 pt-8 text-center text-xs text-slate-500 z-10 bg-slate-950/40">
          <div className="max-w-7xl mx-auto px-4 pb-8">
            <p>© {new Date().getFullYear()} FIFA World Cup 2026 Fan Website. Powered by Next.js & WebGL.</p>
            <p className="mt-1.5 text-[9px] text-slate-600">
              This site is an unofficial fan demonstration and is not associated with FIFA.
            </p>
          </div>
        </footer>

      </div>
    </LenisProvider>
  );
}
