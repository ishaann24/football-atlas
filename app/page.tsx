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
import TrophyShowcase from '@/components/TrophyShowcase';
import LenisProvider from '@/components/LenisProvider';
import { motion, useScroll, useSpring, useTransform } from 'framer-motion';
import { Search, Trophy, Calendar, ChevronDown, ChevronRight, Activity, Globe, Sparkles } from 'lucide-react';

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

// IntersectionObserver helper for scroll-triggered fade-ins
function ScrollFadeIn({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target); // trigger animation only once
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`transition-all duration-1000 ease-out transform ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}
    >
      {children}
    </div>
  );
}

export default function Home() {
  const [selectedTimezone, setSelectedTimezone] = useState('Asia/Kolkata'); // Default to IST
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTeam, setSelectedTeam] = useState('All');
  const [selectedStage, setSelectedStage] = useState('All');

  // Track absolute window scroll coordinate
  const { scrollY, scrollYProgress } = useScroll();

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

  // Parallax zoom for MetLife Stadium background
  const heroBgScale = useTransform(smoothScrollProgress, [0, 0.3], [1, 1.15]);
  const heroBgOpacity = useTransform(smoothScrollProgress, [0.15, 0.32], [1, 0]);

  // Text reveals based on scroll progress
  const heroTextOpacity = useTransform(smoothScrollProgress, [0, 0.25], [1, 0]);
  const heroTextY = useTransform(smoothScrollProgress, [0, 0.25], [0, -85]);

  const lightsTextOpacity = useTransform(smoothScrollProgress, [0.18, 0.35, 0.48], [0, 1, 0]);
  const lightsTextY = useTransform(smoothScrollProgress, [0.18, 0.35, 0.48], [50, 0, -50]);

  const trophyTextOpacity = useTransform(smoothScrollProgress, [0.42, 0.58, 0.72], [0, 1, 0]);
  const trophyTextY = useTransform(smoothScrollProgress, [0.42, 0.58, 0.72], [50, 0, -50]);

  // Football scroll animation values
  const ballY = useTransform(scrollY, (y) => y * 0.3);
  const ballRotate = useTransform(scrollY, (y) => y * 0.5);
  const ballOpacity = useTransform(scrollYProgress, [0.88, 0.95], [1, 0]);

  const [isKicked, setIsKicked] = useState(false);
  const handleBallClick = () => {
    if (isKicked) return;
    setIsKicked(true);
    setTimeout(() => setIsKicked(false), 600);
  };

  return (
    <LenisProvider>
      <div className="relative min-h-[500vh] bg-[#020617] text-slate-100 selection:bg-emerald-500 selection:text-slate-900 overflow-x-hidden">
        
        {/* Fixed Background 3D WebGL Canvas mapping camera paths to page scrolls */}
        <div className="fixed inset-0 w-screen h-screen z-0 pointer-events-none">
          <WorldCupScene />
        </div>

        {/* Floating Football Scroll Parallax Wrapper */}
        <motion.div
          style={{
            y: ballY,
            opacity: ballOpacity,
            top: '15%',
          }}
          className="fixed right-6 z-40 w-9 h-9 md:w-[52px] md:h-[52px] pointer-events-auto select-none"
        >
          {/* Inner animation container handles rotation + kick effect */}
          <motion.div
            onClick={handleBallClick}
            style={{ rotate: ballRotate }}
            animate={isKicked ? { x: -60, y: -20, rotate: 360, scale: 0.8 } : { x: 0, y: 0, scale: 1 }}
            transition={{ duration: 0.6, ease: [0.175, 0.885, 0.32, 1.275] }}
            className="w-full h-full cursor-pointer"
          >
            {/* Realistic Detailed SVG Football */}
            <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[0_8px_16px_rgba(0,0,0,0.5)]">
              <defs>
                <radialGradient id="ball-shading" cx="30%" cy="30%" r="70%">
                  <stop offset="0%" stopColor="#ffffff" />
                  <stop offset="60%" stopColor="#f1f5f9" />
                  <stop offset="100%" stopColor="#94a3b8" />
                </radialGradient>
              </defs>
              {/* White base sphere */}
              <circle cx="50" cy="50" r="47" fill="url(#ball-shading)" stroke="#0f172a" strokeWidth="2" />
              
              {/* Pentagonal center panel */}
              <polygon points="50,38 61,46 57,59 43,59 39,46" fill="#0f172a" />
              
              {/* Seam lines radiating from center */}
              <line x1="50" y1="38" x2="50" y2="20" stroke="#0f172a" strokeWidth="2" />
              <line x1="61" y1="46" x2="77" y2="42" stroke="#0f172a" strokeWidth="2" />
              <line x1="57" y1="59" x2="68" y2="74" stroke="#0f172a" strokeWidth="2" />
              <line x1="43" y1="59" x2="32" y2="74" stroke="#0f172a" strokeWidth="2" />
              <line x1="39" y1="46" x2="23" y2="42" stroke="#0f172a" strokeWidth="2" />
              
              {/* Outer edge pentagonal panels */}
              <polygon points="50,20 37,15 39,3 50,0 61,3 63,15" fill="#0f172a" />
              <polygon points="77,42 87,31 96,37 97,49 89,56 78,52" fill="#0f172a" />
              <polygon points="68,74 65,87 74,96 85,92 84,79 74,72" fill="#0f172a" />
              <polygon points="32,74 35,87 26,96 15,92 16,79 26,72" fill="#0f172a" />
              <polygon points="23,42 13,31 4,37 3,49 11,56 22,52" fill="#0f172a" />
              
              {/* Outer boundary connecting seams */}
              <line x1="37" y1="15" x2="39" y2="46" stroke="#0f172a" strokeWidth="2" />
              <line x1="63" y1="15" x2="61" y2="46" stroke="#0f172a" strokeWidth="2" />
              <line x1="78" y1="52" x2="57" y2="59" stroke="#0f172a" strokeWidth="2" />
              <line x1="74" y1="72" x2="68" y2="74" stroke="#0f172a" strokeWidth="2" />
              <line x1="26" y1="72" x2="32" y2="74" stroke="#0f172a" strokeWidth="2" />
              <line x1="22" y1="52" x2="43" y2="59" stroke="#0f172a" strokeWidth="2" />
            </svg>
          </motion.div>
        </motion.div>

        {/* Global sticky header */}
        <header className="fixed top-0 left-0 right-0 border-b border-slate-900/60 bg-slate-950/70 backdrop-blur-xl z-50">
          <div className="max-w-7xl mx-auto px-4 md:px-8 py-3.5 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center space-x-3 group cursor-pointer">
              {/* Official FIFA 2026 emblem SVG replaces legacy Trophy icon */}
              <img
                src="https://upload.wikimedia.org/wikipedia/en/d/d0/2026_FIFA_World_Cup_emblem.svg"
                alt="FIFA World Cup 2026 Emblem"
                className="h-8 w-auto object-contain"
              />
              <div>
                <h1 className="text-lg font-black text-white tracking-tight uppercase leading-none">
                  FIFA World Cup <span className="text-[#FFD700]">2026</span>
                </h1>
                <p className="text-[9px] text-[#FFD700] font-black uppercase tracking-widest leading-none mt-1">
                  Official Fan Hub
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

        {/* FIX 2: CINEMATIC HERO — METLIFE SCROLL ZOOM (ScrollHeight: 100vh) */}
        <section className="relative h-screen w-full flex flex-col items-center justify-center text-center px-4 z-10 select-none overflow-hidden bg-black">
          
          {/* Zooming background container */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1.0, opacity: 1 }}
            transition={{ duration: 1.2, ease: 'easeOut' }}
            className="absolute inset-0 w-full h-full overflow-hidden"
          >
            <motion.div
              style={{
                scale: heroBgScale,
                opacity: heroBgOpacity,
                backgroundImage: `url('https://upload.wikimedia.org/wikipedia/commons/thumb/4/47/MetLife_Stadium_aerial.jpg/1280px-MetLife_Stadium_aerial.jpg')`,
              }}
              className="w-full h-full bg-cover bg-center"
            />
          </motion.div>

          {/* Dark Overlay Gradient (bottom 60% -> black) */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-[#020617]/70 to-[#020617]/10 pointer-events-none z-10" />

          {/* Fade-out Hero Text content */}
          <motion.div 
            style={{ opacity: heroTextOpacity, y: heroTextY }} 
            className="space-y-6 max-w-4xl z-20"
          >
            <div className="inline-flex items-center space-x-2 bg-slate-950/80 border border-slate-900 rounded-full px-4 py-1.5 text-xs text-slate-400 font-bold tracking-widest uppercase shadow-xl">
              <Globe className="w-4 h-4 text-[#FFD700] animate-spin" style={{ animationDuration: '8s' }} />
              <span>MetLife Arena Opening Kickoff</span>
            </div>
            
            <h1 className="text-5xl md:text-8xl font-black text-white uppercase tracking-tighter leading-none">
              UNITED <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-100 via-[#FFD700] to-amber-500">2026</span>
            </h1>
            
            <p className="text-slate-300 font-mono text-xs md:text-sm uppercase tracking-widest max-w-md mx-auto leading-relaxed">
              48 Nations. 104 Matches. One Champion.
            </p>
          </motion.div>

          {/* Bouncing Scroll Indicator */}
          <motion.div 
            style={{ opacity: heroTextOpacity }}
            className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center space-y-1.5 z-20 pointer-events-none"
          >
            <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest leading-none">
              Scroll to Explore
            </span>
            <div className="w-5 h-5 flex items-center justify-center rounded-full bg-slate-950/60 border border-slate-900 animate-bounce">
              <ChevronDown className="w-3.5 h-3.5 text-[#FFD700]" />
            </div>
          </motion.div>
        </section>

        {/* SECTION 2: Floodlights Reveal (ScrollHeight: 100vh) */}
        <section className="relative h-screen w-full flex items-center justify-center text-center px-4 z-10 pointer-events-none">
          <motion.div style={{ opacity: lightsTextOpacity, y: lightsTextY }} className="space-y-4 max-w-2xl">
            <h2 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tight leading-tight">
              Spotlights Activated.
            </h2>
            <p className="text-slate-400 text-xs md:text-sm leading-relaxed max-w-md mx-auto">
              Step onto the pitch. Volumetric spotlights illuminate the grand arena as the crowd roars.
            </p>
          </motion.div>
        </section>

        {/* SECTION 3: Golden Trophy Focus (ScrollHeight: 100vh) */}
        <section className="relative h-screen w-full flex items-center justify-center text-center px-4 z-10 pointer-events-none">
          <motion.div style={{ opacity: trophyTextOpacity, y: trophyTextY }} className="space-y-4 max-w-xl">
            <h2 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tight leading-tight">
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
              <span className="inline-flex items-center space-x-2 bg-amber-950/30 border border-[#FFD700]/25 rounded-full px-3.5 py-1 text-xs text-[#FFD700] font-bold uppercase tracking-wide">
                <Sparkles className="w-3.5 h-3.5 animate-pulse" />
                <span>Campaign Countdown</span>
              </span>
              <h2 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tight leading-none">
                The Clock <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-100 via-[#FFD700] to-yellow-500">Is Ticking.</span>
              </h2>
              <p className="text-xs text-slate-400 leading-relaxed max-w-md">
                Days away from the historic opening kickoff. Register for goal alerts below to follow every match event instantly.
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
                    className="bg-slate-950/80 border border-slate-900 hover:border-[#FFD700]/30 p-5 rounded-2xl flex flex-col items-center justify-center text-center shadow-xl backdrop-blur-md transition-colors"
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
        <div className="relative bg-gradient-to-b from-[#020617]/0 via-[#020617]/95 to-[#020617] pt-20 pb-12 z-10 space-y-24">
          
          {/* Fan Signup block */}
          <ScrollFadeIn>
            <div className="max-w-4xl mx-auto px-4 md:px-8">
              <RegisterForm />
            </div>
          </ScrollFadeIn>

          {/* Interactive OSM map of Host Cities */}
          <ScrollFadeIn>
            <div className="max-w-7xl mx-auto px-4 md:px-8">
              <WorldMap />
            </div>
          </ScrollFadeIn>

          {/* Schedule Filter Feeds */}
          <ScrollFadeIn>
            <div id="schedules" className="max-w-7xl mx-auto px-4 md:px-8 scroll-mt-24">
              <div className="flex items-center space-x-2.5 mb-8">
                <div className="w-1.5 h-6 bg-[#FFD700] rounded-full" />
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
                    placeholder="Search team, stadium, stage..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-slate-900/60 border border-slate-800 hover:border-slate-700 focus:border-[#FFD700]/60 text-white rounded-xl py-2.5 pl-10 pr-4 text-xs font-bold outline-none transition-colors"
                  />
                </div>

                <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
                  <select
                    value={selectedTeam}
                    onChange={(e) => setSelectedTeam(e.target.value)}
                    className="bg-slate-900/60 border border-slate-800 hover:border-slate-700 text-slate-300 text-xs font-black rounded-xl py-2.5 px-4 outline-none focus:border-[#FFD700] cursor-pointer min-w-[140px]"
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
                    className="bg-slate-900/60 border border-slate-800 hover:border-slate-700 text-slate-300 text-xs font-black rounded-xl py-2.5 px-4 outline-none focus:border-[#FFD700] cursor-pointer min-w-[140px]"
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
                      className="text-xs text-[#FFD700] font-bold hover:text-[#FFD700]/80 transition-colors py-2 px-3"
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
          </ScrollFadeIn>

          {/* FIX 4: Dedicated Trophy Showcase Section */}
          <ScrollFadeIn>
            <TrophyShowcase />
          </ScrollFadeIn>

          {/* Road to Glory bracket */}
          <ScrollFadeIn>
            <div className="max-w-7xl mx-auto px-4 md:px-8">
              <RoadToGlory />
            </div>
          </ScrollFadeIn>

        </div>

        {/* Footer */}
        <footer className="relative border-t border-slate-900/60 pt-8 text-center text-xs text-slate-500 z-10 bg-slate-950/40 pb-10">
          <div className="max-w-7xl mx-auto px-4">
            <p>© {new Date().getFullYear()} FIFA World Cup 2026 Fan Website. Powered by Next.js & WebGL.</p>
            <p className="mt-2 text-[10px] text-slate-650 leading-relaxed max-w-md mx-auto">
              The FIFA World Cup Trophy has been awarded since 1974. This is a fan site, not affiliated with FIFA.
            </p>
          </div>
        </footer>

      </div>
    </LenisProvider>
  );
}
