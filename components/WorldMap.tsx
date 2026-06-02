'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Info, Users, Compass } from 'lucide-react';

interface City {
  name: string;
  stadium: string;
  capacity: string;
  country: 'USA' | 'Canada' | 'Mexico';
  x: number; // Percent position on custom SVG background
  y: number;
}

const CITIES: City[] = [
  { name: 'Seattle', stadium: 'Lumen Field', capacity: '69,000', country: 'USA', x: 20, y: 25 },
  { name: 'San Francisco', stadium: "Levi's Stadium", capacity: '71,000', country: 'USA', x: 16, y: 44 },
  { name: 'Los Angeles', stadium: 'SoFi Stadium', capacity: '70,240', country: 'USA', x: 19, y: 55 },
  { name: 'Vancouver', stadium: 'BC Place', capacity: '54,500', country: 'Canada', x: 20, y: 17 },
  { name: 'Guadalajara', stadium: 'Estadio Akron', capacity: '48,070', country: 'Mexico', x: 38, y: 88 },
  { name: 'Mexico City', stadium: 'Estadio Azteca', capacity: '87,523', country: 'Mexico', x: 42, y: 92 },
  { name: 'Monterrey', stadium: 'Estadio BBVA', capacity: '53,500', country: 'Mexico', x: 41, y: 81 },
  { name: 'Dallas', stadium: 'AT&T Stadium', capacity: '80,000', country: 'USA', x: 44, y: 68 },
  { name: 'Houston', stadium: 'NRG Stadium', capacity: '72,220', country: 'USA', x: 46, y: 73 },
  { name: 'Kansas City', stadium: 'Arrowhead Stadium', capacity: '76,416', country: 'USA', x: 49, y: 48 },
  { name: 'Atlanta', stadium: 'Mercedes-Benz Stadium', capacity: '71,000', country: 'USA', x: 62, y: 64 },
  { name: 'Miami', stadium: 'Hard Rock Stadium', capacity: '64,767', country: 'USA', x: 70, y: 79 },
  { name: 'Toronto', stadium: 'BMO Field', capacity: '45,000', country: 'Canada', x: 72, y: 28 },
  { name: 'Boston', stadium: 'Gillette Stadium', capacity: '65,878', country: 'USA', x: 84, y: 26 },
  { name: 'New York/New Jersey', stadium: 'MetLife Stadium', capacity: '82,500', country: 'USA', x: 80, y: 32 },
  { name: 'Philadelphia', stadium: 'Lincoln Financial Field', capacity: '69,796', country: 'USA', x: 78, y: 35 },
];

export default function WorldMap() {
  const [activeCity, setActiveCity] = useState<City | null>(CITIES[5]); // Default to Mexico City (Estadio Azteca)

  return (
    <div className="bg-slate-950/40 border border-slate-900 rounded-3xl p-6 md:p-8 backdrop-blur-2xl shadow-2xl relative overflow-hidden grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
      {/* Visual background lines */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(16,185,129,0.05)_0%,transparent_60%)] pointer-events-none" />

      {/* SVG Map (8 Cols) */}
      <div className="lg:col-span-8 relative w-full aspect-[16/10] bg-slate-900/30 rounded-2xl border border-slate-800/40 overflow-hidden select-none">
        {/* Decorative Grid Lines mapping North America boundaries */}
        <svg className="absolute inset-0 w-full h-full stroke-slate-800/20 stroke-[0.5]" fill="none">
          <line x1="0" y1="20%" x2="100%" y2="20%" />
          <line x1="0" y1="40%" x2="100%" y2="40%" />
          <line x1="0" y1="60%" x2="100%" y2="60%" />
          <line x1="0" y1="80%" x2="100%" y2="80%" />
          <line x1="20%" y1="0" x2="20%" y2="100%" />
          <line x1="40%" y1="0" x2="40%" y2="100%" />
          <line x1="60%" y1="0" x2="60%" y2="100%" />
          <line x1="80%" y1="0" x2="80%" y2="100%" />
        </svg>

        {/* Dynamic Map Country Borders Drawing */}
        <svg className="absolute inset-0 w-full h-full opacity-35" viewBox="0 0 100 100" fill="none">
          {/* Canada Border Representation */}
          <path d="M 10 5 L 90 5 L 85 25 L 70 23 L 65 30 L 15 30 Z" fill="rgba(59, 130, 246, 0.05)" stroke="#3b82f6" strokeWidth="0.5" />
          {/* USA Border Representation */}
          <path d="M 15 30 L 65 30 L 70 23 L 85 25 L 88 55 L 78 58 L 68 70 L 46 75 L 43 65 L 18 55 Z" fill="rgba(16, 185, 129, 0.05)" stroke="#10b981" strokeWidth="0.5" />
          {/* Mexico Border Representation */}
          <path d="M 18 55 L 43 65 L 46 75 L 49 85 L 43 95 L 36 90 L 30 75 Z" fill="rgba(239, 68, 68, 0.05)" stroke="#ef4444" strokeWidth="0.5" />
        </svg>

        {/* Host Cities Pins Overlay */}
        {CITIES.map((city) => (
          <button
            key={city.name}
            onClick={() => setActiveCity(city)}
            style={{ left: `${city.x}%`, top: `${city.y}%` }}
            className="absolute -translate-x-1/2 -translate-y-1/2 focus:outline-none z-20 group"
          >
            {/* Ping Pulse */}
            <span className={`absolute inline-flex h-6 w-6 rounded-full opacity-65 -left-1 -top-1 animate-ping transition-all duration-300 ${
              activeCity?.name === city.name ? 'bg-emerald-400' : 'bg-slate-500/40 group-hover:bg-emerald-500/20'
            }`} />
            {/* Pin Center */}
            <div className={`w-4 h-4 rounded-full border transition-all duration-300 flex items-center justify-center shadow-lg ${
              activeCity?.name === city.name 
                ? 'bg-emerald-500 border-white scale-125' 
                : 'bg-slate-900 border-slate-700 group-hover:border-emerald-400 group-hover:scale-110'
            }`}>
              <span className={`w-1.5 h-1.5 rounded-full ${activeCity?.name === city.name ? 'bg-slate-950' : 'bg-slate-400'}`} />
            </div>
            
            {/* Label Tooltip Hover */}
            <span className="absolute left-6 top-1/2 -translate-y-1/2 bg-slate-950/95 border border-slate-800 text-[10px] font-bold text-slate-200 px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-300 whitespace-nowrap shadow-xl">
              {city.name}
            </span>
          </button>
        ))}
      </div>

      {/* Info Card Drawer (4 Cols) */}
      <div className="lg:col-span-4 h-full flex flex-col justify-between">
        <div className="space-y-4">
          <div className="inline-flex items-center space-x-2 bg-slate-900/80 border border-slate-800 rounded-full px-3 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            <Compass className="w-3.5 h-3.5 text-emerald-400 animate-spin" style={{ animationDuration: '6s' }} />
            <span>Host Cities Guide</span>
          </div>

          <h2 className="text-2xl font-black text-white uppercase tracking-tight leading-tight">
            16 Cities. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-blue-400">
              3 Nations.
            </span>
          </h2>
          <p className="text-xs text-slate-400 leading-relaxed">
            The FIFA World Cup 2026 is hosted across North America. Select any city pinpointed on the interactive map to review its designated stadium details.
          </p>
        </div>

        <AnimatePresence mode="wait">
          {activeCity ? (
            <motion.div
              key={activeCity.name}
              initial={{ x: 15, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -15, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="mt-6 bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5 backdrop-blur-md shadow-xl relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-3 opacity-10 pointer-events-none">
                <MapPin className="w-20 h-20 text-white" />
              </div>

              <span className={`inline-block text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full mb-3 border ${
                activeCity.country === 'USA' 
                  ? 'bg-emerald-950/50 border-emerald-900/50 text-emerald-400' 
                  : activeCity.country === 'Canada' 
                  ? 'bg-blue-950/50 border-blue-900/50 text-blue-400' 
                  : 'bg-red-950/50 border-red-900/50 text-red-400'
              }`}>
                {activeCity.country}
              </span>

              <h3 className="text-lg font-black text-white tracking-tight">{activeCity.name}</h3>

              <div className="mt-4 space-y-3">
                <div className="flex items-center text-xs text-slate-300">
                  <Info className="w-4 h-4 text-emerald-400 mr-2.5 flex-shrink-0" />
                  <div>
                    <span className="block text-[9px] uppercase font-bold text-slate-500 leading-none mb-0.5">Stadium</span>
                    <span className="font-semibold text-slate-200">{activeCity.stadium}</span>
                  </div>
                </div>

                <div className="flex items-center text-xs text-slate-300">
                  <Users className="w-4 h-4 text-blue-400 mr-2.5 flex-shrink-0" />
                  <div>
                    <span className="block text-[9px] uppercase font-bold text-slate-500 leading-none mb-0.5">Total Capacity</span>
                    <span className="font-semibold text-slate-200">{activeCity.capacity} fans</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ) : (
            <div className="mt-6 py-12 text-center border border-dashed border-slate-800 rounded-2xl text-xs text-slate-500 font-medium">
              Select a city to display details
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
