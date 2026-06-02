'use client';

import React, { useState, useMemo } from 'react';
import rawMatches from '@/data/matches.json';
import TimezoneSelector from '@/components/TimezoneSelector';
import MatchCard from '@/components/MatchCard';
import RegisterForm from '@/components/RegisterForm';
import { Search, Trophy, Calendar, Bell, ChevronRight, Activity } from 'lucide-react';

export default function Home() {
  const [selectedTimezone, setSelectedTimezone] = useState('Asia/Kolkata'); // Default to IST
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTeam, setSelectedTeam] = useState('All');
  const [selectedStage, setSelectedStage] = useState('All');

  // Parse matches from json
  const matches = useMemo(() => rawMatches, []);

  // Dynamically extract unique team names for the filter list
  const uniqueTeams = useMemo(() => {
    const teamsSet = new Set<string>();
    matches.forEach((m) => {
      // Exclude placeholder knockout teams from filter list
      const isPlaceholder = (t: string) =>
        t.includes('Winner') || t.includes('Runner-up') || t.includes('Loser') || t === 'TBD';

      if (!isPlaceholder(m.homeTeam)) teamsSet.add(m.homeTeam);
      if (!isPlaceholder(m.awayTeam)) teamsSet.add(m.awayTeam);
    });
    return Array.from(teamsSet).sort();
  }, [matches]);

  // Filters logic
  const filteredMatches = useMemo(() => {
    return matches.filter((match) => {
      // Team filter
      const matchesTeam =
        selectedTeam === 'All' ||
        match.homeTeam.toLowerCase() === selectedTeam.toLowerCase() ||
        match.awayTeam.toLowerCase() === selectedTeam.toLowerCase();

      // Search term filter (searches team names or venue)
      const matchesSearch =
        searchTerm === '' ||
        match.homeTeam.toLowerCase().includes(searchTerm.toLowerCase()) ||
        match.awayTeam.toLowerCase().includes(searchTerm.toLowerCase()) ||
        match.venue.toLowerCase().includes(searchTerm.toLowerCase()) ||
        match.group.toLowerCase().includes(searchTerm.toLowerCase()) ||
        match.stage.toLowerCase().includes(searchTerm.toLowerCase());

      // Stage filter
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
      {/* Dynamic Aesthetic Background Gradients */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-[800px] right-1/4 w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-[140px] pointer-events-none" />

      {/* Modern Header Banner */}
      <header className="border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-xl sticky top-0 z-50 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-transform duration-300">
              <Trophy className="w-5 h-5 text-slate-950 stroke-[2.5]" />
            </div>
            <div>
              <h1 className="text-lg font-extrabold text-white tracking-tight uppercase">
                FIFA World Cup <span className="text-emerald-400">2026</span>
              </h1>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-none mt-0.5">
                Fan Hub & Alerts
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
      <section className="relative py-12 md:py-20 px-4 max-w-7xl mx-auto md:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center space-x-2 bg-emerald-950/60 border border-emerald-500/20 rounded-full px-3 py-1 text-xs text-emerald-400 font-bold tracking-wide uppercase">
              <Activity className="w-3.5 h-3.5 animate-pulse" />
              <span>United 2026 • USA, Canada & Mexico</span>
            </div>

            <h1 className="text-4xl md:text-6xl font-black text-white leading-tight tracking-tight">
              Track the Match, <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-blue-400">
                Never Miss a Goal.
              </span>
            </h1>

            <p className="text-slate-400 text-sm md:text-base max-w-xl leading-relaxed">
              Experience the largest World Cup in history. Access the complete schedule of all 104 matches instantly converted to your timezone, view customized live streaming channels, and configure automatic WhatsApp and email goal alerts.
            </p>

            {/* Quick Stats Banner */}
            <div className="grid grid-cols-3 gap-4 max-w-md bg-slate-900/40 border border-slate-800/60 p-4 rounded-2xl backdrop-blur-md">
              <div>
                <span className="block text-2xl font-black text-white">104</span>
                <span className="text-[10px] uppercase font-bold text-slate-500">Matches</span>
              </div>
              <div className="border-l border-slate-800/80 pl-4">
                <span className="block text-2xl font-black text-white">48</span>
                <span className="text-[10px] uppercase font-bold text-slate-500">Teams</span>
              </div>
              <div className="border-l border-slate-800/80 pl-4">
                <span className="block text-2xl font-black text-white">16</span>
                <span className="text-[10px] uppercase font-bold text-slate-500">Host Cities</span>
              </div>
            </div>
          </div>

          <div id="alert-signup" className="lg:col-span-5 w-full">
            <RegisterForm />
          </div>
        </div>
      </section>

      {/* Live Match Alert Mock Promo */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 mb-12">
        <div className="bg-gradient-to-r from-emerald-950/20 via-slate-900/60 to-blue-950/20 border border-slate-800/80 rounded-2xl p-5 md:p-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center flex-shrink-0">
              <Bell className="w-6 h-6 text-blue-400 animate-bounce" />
            </div>
            <div>
              <h3 className="text-sm md:text-base font-bold text-white">Interactive Goal Alerts Testing</h3>
              <p className="text-xs text-slate-400">
                You can trigger simulated live goals instantly in development mode. No real API keys needed to test!
              </p>
            </div>
          </div>
          <a
            href="/api/cron"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-1 py-2 px-4 bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 border border-slate-700 rounded-xl transition-all"
          >
            <span>Trigger Mock Goal Cron</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </a>
        </div>
      </section>

      {/* Main Schedule Workspace */}
      <section className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="flex items-center space-x-2.5 mb-6">
          <div className="w-1.5 h-6 bg-emerald-500 rounded-full" />
          <h2 className="text-xl md:text-2xl font-black text-white uppercase tracking-wider">
            Match Schedule
          </h2>
        </div>

        {/* Filter Controls Panel */}
        <div className="bg-slate-900/30 border border-slate-800/60 p-4 rounded-2xl mb-8 flex flex-col md:flex-row gap-4 items-center justify-between shadow-lg">
          {/* Search Box */}
          <div className="relative w-full md:max-w-xs">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type="text"
              placeholder="Search team, venue, stage..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-950/80 border border-slate-800 hover:border-slate-700 focus:border-emerald-500/60 text-white rounded-xl py-2.5 pl-10 pr-4 text-xs font-medium outline-none transition-colors"
            />
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            {/* Team Dropdown Filter */}
            <select
              value={selectedTeam}
              onChange={(e) => setSelectedTeam(e.target.value)}
              className="bg-slate-950/80 border border-slate-800 hover:border-slate-700 text-slate-300 text-xs font-bold rounded-xl py-2.5 px-4 outline-none focus:border-emerald-500 cursor-pointer min-w-[140px]"
            >
              <option value="All">All Teams</option>
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
              className="bg-slate-950/80 border border-slate-800 hover:border-slate-700 text-slate-300 text-xs font-bold rounded-xl py-2.5 px-4 outline-none focus:border-emerald-500 cursor-pointer min-w-[140px]"
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

        {/* Matches Grid */}
        {filteredMatches.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMatches.map((match) => (
              <MatchCard
                key={match.id}
                match={match}
                timezone={selectedTimezone}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-slate-900/20 border border-slate-800/40 rounded-3xl">
            <span className="block text-4xl mb-4">⚽</span>
            <h3 className="text-base font-bold text-white mb-1">No Matches Found</h3>
            <p className="text-xs text-slate-400 max-w-xs mx-auto">
              We couldn't find any matches matching your search criteria. Try modifying your filters or search term!
            </p>
          </div>
        )}
      </section>

      {/* Footer */}
      <footer className="mt-24 border-t border-slate-800/80 pt-8 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4">
          <p>© {new Date().getFullYear()} FIFA World Cup 2026 Fan Website. Built for live scores and timezone tracking.</p>
          <p className="mt-1 text-[10px] text-slate-600">
            This site is a fan creation and is not officially affiliated with FIFA or any national football associations.
          </p>
        </div>
      </footer>
    </main>
  );
}
