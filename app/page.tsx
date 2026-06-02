'use client';

import React, { useState, useMemo } from 'react';
import rawMatches from '@/data/matches.json';
import TimezoneSelector from '@/components/TimezoneSelector';
import MatchCard from '@/components/MatchCard';
import RegisterForm from '@/components/RegisterForm';
import Countdown from '@/components/Countdown';
import Trophy3D from '@/components/Trophy3D';
import WorldMap from '@/components/WorldMap';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Trophy, Calendar, Bell, ChevronRight, Activity, Globe, Play, Sparkles } from 'lucide-react';

const FLOATING_FLAGS = ['🇺🇸', '🇲🇽', '🇨🇦', '⚽', '🏆', '⭐'];

export default function Home() {
  const [selectedTimezone, setSelectedTimezone] = useState('Asia/Kolkata'); // Default to IST
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTeam, setSelectedTeam] = useState('All');
  const [selectedStage, setSelectedStage] = useState('All');

  const matches = useMemo(() => rawMatches, []);

  // Extract unique team names for the filter dropdown
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

  return (
    <main className="min-h-screen bg-[#020617] text-slate-100 selection:bg-emerald-500 selection:text-slate-900 pb-20 relative overflow-x-hidden">
      
      {/* Stadium floodlight beams overlay */}
      <div className="stadium-light-beam" />
      <div className="stadium-light-beam-reverse" />

      {/* Floating Parallax Flags Background decor */}
      {FLOATING_FLAGS.map((flag, idx) => (
        <motion.div
          key={idx}
          initial={{ y: '110vh', x: `${idx * 16 + 5}vw`, opacity: 0.1 }}
          animate={{
            y: '-10vh',
            x: [
              `${idx * 16 + 5}vw`,
              `${idx * 16 + 10}vw`,
              `${idx * 16 + 2}vw`,
              `${idx * 16 + 5}vw`
            ]
          }}
          transition={{
            duration: 20 + idx * 4,
            repeat: Infinity,
            ease: 'linear'
          }}
          className="absolute text-3xl select-none pointer-events-none z-0 hidden md:block"
        >
          {flag}
        </motion.div>
      ))}

      {/* Header Banner */}
      <header className="border-b border-slate-900/60 bg-slate-950/70 backdrop-blur-xl sticky top-0 z-50 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-3 group cursor-pointer">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center shadow-lg shadow-emerald-500/10 group-hover:scale-105 transition-transform duration-300">
              <Trophy className="w-5 h-5 text-slate-950 stroke-[2.5]" />
            </div>
            <div>
              <h1 className="text-lg font-black text-white tracking-tight uppercase">
                FIFA World Cup <span className="text-emerald-400">2026</span>
              </h1>
              <p className="text-[9px] text-slate-500 font-black uppercase tracking-widest leading-none mt-0.5">
                Premium Fan Experience
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

      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center py-12 md:py-24 px-4 max-w-7xl mx-auto md:px-8 z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center w-full">
          
          {/* Main Hero texts (7 Cols) */}
          <div className="lg:col-span-7 space-y-8 text-center lg:text-left">
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center space-x-2 bg-emerald-950/40 border border-emerald-500/20 rounded-full px-4 py-1.5 text-xs text-emerald-400 font-bold tracking-wider uppercase"
            >
              <Sparkles className="w-4 h-4 text-emerald-400 animate-spin" style={{ animationDuration: '4s' }} />
              <span>United 2026 • USA, Canada & Mexico</span>
            </motion.div>

            <motion.h1
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-5xl md:text-7xl font-black text-white leading-none tracking-tight"
            >
              The Greatest <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-blue-400">
                Spectacle On Earth.
              </span>
            </motion.h1>

            <motion.p
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-slate-400 text-sm md:text-base max-w-xl leading-relaxed mx-auto lg:mx-0"
            >
              Experience the FIFA World Cup 2026 redesigned for elite fans. Track all 104 matches, instantly convert times to your zone, view local broadcast streams, and receive goal alerts directly to your inbox.
            </motion.p>

            {/* Countdown block */}
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="py-2"
            >
              <Countdown />
            </motion.div>
          </div>

          {/* 3D Trophy Showcase (5 Cols) */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="lg:col-span-5 flex justify-center items-center relative"
          >
            <Trophy3D />
          </motion.div>
        </div>
      </section>

      {/* Interactive Host Cities Map Widget */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 mb-24 z-10 relative">
        <div className="flex items-center space-x-2.5 mb-8">
          <div className="w-1.5 h-6 bg-emerald-500 rounded-full" />
          <h2 className="text-xl md:text-2xl font-black text-white uppercase tracking-wider">
            Host Stadiums Vector Map
          </h2>
        </div>
        <WorldMap />
      </section>

      {/* Fan Signup Integration Drawer */}
      <section id="alerts" className="max-w-4xl mx-auto px-4 md:px-8 mb-24 z-10 relative">
        <RegisterForm />
      </section>

      {/* Mock alert triggers banner */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 mb-24 z-10 relative">
        <div className="bg-gradient-to-r from-emerald-950/20 via-slate-900/40 to-blue-950/20 border border-slate-900 rounded-3xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl">
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
      </section>

      {/* Live Schedule Feeds */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 z-10 relative">
        <div className="flex items-center space-x-2.5 mb-8">
          <div className="w-1.5 h-6 bg-emerald-500 rounded-full" />
          <h2 className="text-xl md:text-2xl font-black text-white uppercase tracking-wider">
            Match Schedules
          </h2>
        </div>

        {/* Filter Toolbar controls */}
        <div className="bg-slate-950/60 border border-slate-900 p-4 rounded-2xl mb-8 flex flex-col md:flex-row gap-4 items-center justify-between shadow-2xl backdrop-blur-md">
          {/* Search Box */}
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
            {/* Team Dropdown Filter */}
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

            {/* Stage Dropdown Filter */}
            <select
              value={selectedStage}
              onChange={(e) => setSelectedStage(e.target.value)}
              className="bg-slate-900/60 border border-slate-800 hover:border-slate-700 text-slate-300 text-xs font-black rounded-xl py-2.5 px-4 outline-none focus:border-emerald-500 cursor-pointer min-w-[140px]"
            >
              <option value="All">All Stages</option>
              <option value="Group Stage">Group Stage</option>
              <option value="Knockouts">Knockout Phase</option>
            </select>

            {/* Clear Button */}
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

        {/* Dynamic Matches Grids */}
        <AnimatePresence mode="popLayout">
          {filteredMatches.length > 0 ? (
            <motion.div
              layout
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {filteredMatches.map((match) => (
                <MatchCard
                  key={match.id}
                  match={match}
                  timezone={selectedTimezone}
                />
              ))}
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-20 bg-slate-950/20 border border-slate-900 rounded-3xl"
            >
              <span className="block text-4xl mb-4">⚽</span>
              <h3 className="text-base font-bold text-white mb-1">No Matches Found</h3>
              <p className="text-xs text-slate-500 max-w-xs mx-auto">
                No fixtures match your filters. Try clearing details to view schedules!
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* Footer */}
      <footer className="mt-24 border-t border-slate-900/60 pt-8 text-center text-xs text-slate-500 z-10 relative">
        <div className="max-w-7xl mx-auto px-4">
          <p>© {new Date().getFullYear()} FIFA World Cup 2026 Fan Website. Built with Next.js & Tailwind CSS.</p>
          <p className="mt-1.5 text-[9px] text-slate-650">
            This site is an unofficial fan demonstration and is not associated with FIFA.
          </p>
        </div>
      </footer>
    </main>
  );
}
