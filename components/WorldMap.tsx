'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Info, Users, Compass, Globe } from 'lucide-react';

interface City {
  name: string;
  flag: string;
  matches: number;
  country: 'USA' | 'Canada' | 'Mexico';
  stadium: string;
  capacity: string;
  bbox: string;
  lat: number;
  lon: number;
}

const CITIES: City[] = [
  { name: 'Vancouver', flag: '🇨🇦', matches: 7, country: 'Canada', stadium: 'BC Place', capacity: '54,500', bbox: '-123.16%2C49.24%2C-123.06%2C49.31', lat: 49.276, lon: -123.111 },
  { name: 'Seattle', flag: '🇺🇸', matches: 6, country: 'USA', stadium: 'Lumen Field', capacity: '69,000', bbox: '-122.38%2C47.56%2C-122.28%2C47.63', lat: 47.595, lon: -122.332 },
  { name: 'San Francisco', flag: '🇺🇸', matches: 6, country: 'USA', stadium: "Levi's Stadium", capacity: '71,000', bbox: '-122.02%2C37.37%2C-121.92%2C37.44', lat: 37.403, lon: -121.970 },
  { name: 'Los Angeles', flag: '🇺🇸', matches: 8, country: 'USA', stadium: 'SoFi Stadium', capacity: '70,240', bbox: '-118.39%2C33.92%2C-118.29%2C33.99', lat: 33.953, lon: -118.339 },
  { name: 'Kansas City', flag: '🇺🇸', matches: 6, country: 'USA', stadium: 'Arrowhead Stadium', capacity: '76,416', bbox: '-94.53%2C39.01%2C-94.43%2C39.09', lat: 39.049, lon: -94.484 },
  { name: 'Dallas', flag: '🇺🇸', matches: 9, country: 'USA', stadium: 'AT&T Stadium', capacity: '80,000', bbox: '-97.14%2C32.71%2C-97.04%2C32.78', lat: 32.747, lon: -97.093 },
  { name: 'Houston', flag: '🇺🇸', matches: 7, country: 'USA', stadium: 'NRG Stadium', capacity: '72,220', bbox: '-95.46%2C29.65%2C-95.36%2C29.72', lat: 29.684, lon: -95.408 },
  { name: 'Atlanta', flag: '🇺🇸', matches: 8, country: 'USA', stadium: 'Mercedes-Benz Stadium', capacity: '71,000', bbox: '-84.45%2C33.72%2C-84.35%2C33.79', lat: 33.758, lon: -84.401 },
  { name: 'Miami', flag: '🇺🇸', matches: 7, country: 'USA', stadium: 'Hard Rock Stadium', capacity: '64,767', bbox: '-80.29%2C25.92%2C-80.19%2C26.00', lat: 25.958, lon: -80.239 },
  { name: 'Philadelphia', flag: '🇺🇸', matches: 6, country: 'USA', stadium: 'Lincoln Financial Field', capacity: '69,796', bbox: '-75.22%2C39.87%2C-75.11%2C39.94', lat: 39.901, lon: -75.168 },
  { name: 'Boston', flag: '🇺🇸', matches: 7, country: 'USA', stadium: 'Gillette Stadium', capacity: '65,878', bbox: '-71.31%2C42.06%2C-71.21%2C42.13', lat: 42.091, lon: -71.264 },
  { name: 'Toronto', flag: '🇨🇦', matches: 6, country: 'Canada', stadium: 'BMO Field', capacity: '45,000', bbox: '-79.42%2C43.60%2C-79.32%2C43.67', lat: 43.633, lon: -79.373 },
  { name: 'New York/NJ', flag: '🇺🇸', matches: 8, country: 'USA', stadium: 'MetLife Stadium', capacity: '82,500', bbox: '-74.12%2C40.78%2C-74.02%2C40.85', lat: 40.813, lon: -74.074 },
  { name: 'Mexico City', flag: '🇲🇽', matches: 5, country: 'Mexico', stadium: 'Estadio Azteca', capacity: '87,523', bbox: '-99.20%2C19.27%2C-99.10%2C19.34', lat: 19.303, lon: -99.151 },
  { name: 'Monterrey', flag: '🇲🇽', matches: 4, country: 'Mexico', stadium: 'Estadio BBVA', capacity: '53,500', bbox: '-100.29%2C25.63%2C-100.19%2C25.71', lat: 25.669, lon: -100.244 },
  { name: 'Guadalajara', flag: '🇲🇽', matches: 4, country: 'Mexico', stadium: 'Estadio Akron', capacity: '48,070', bbox: '-103.51%2C20.65%2C-103.40%2C20.72', lat: 20.682, lon: -103.456 },
];

export default function WorldMap() {
  const [activeCity, setActiveCity] = useState<City | null>(null);

  // Mapnik embed URL builder
  const mapUrl = activeCity
    ? `https://www.openstreetmap.org/export/embed.html?bbox=${activeCity.bbox}&layer=mapnik&marker=${activeCity.lat}%2C${activeCity.lon}`
    : 'https://www.openstreetmap.org/export/embed.html?bbox=-125.0%2C15.0%2C-65.0%2C55.0&layer=mapnik';

  return (
    <div className="bg-slate-950/40 border border-slate-900 rounded-3xl p-6 md:p-8 backdrop-blur-2xl shadow-2xl relative overflow-hidden space-y-6">
      {/* Background radial highlight */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(16,185,129,0.03)_0%,transparent_60%)] pointer-events-none" />

      {/* Title */}
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 border-b border-slate-900 pb-5">
        <div className="space-y-1">
          <div className="inline-flex items-center space-x-2 bg-slate-900/80 border border-slate-800 rounded-full px-3 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            <Compass className="w-3.5 h-3.5 text-emerald-400 animate-spin" style={{ animationDuration: '8s' }} />
            <span>Host Cities Arena Guide</span>
          </div>
          <h2 className="text-2xl font-black text-white uppercase tracking-tight mt-2">
            16 Cities. 3 Nations. One Pitch.
          </h2>
        </div>
        {activeCity && (
          <button
            onClick={() => setActiveCity(null)}
            className="self-start md:self-auto text-[10px] font-black uppercase tracking-widest text-[#FFD700] hover:text-[#FFD700]/80 transition-colors py-2 px-4 rounded-xl bg-slate-950 border border-slate-900 hover:border-[#FFD700]/30 shadow-md"
          >
            Reset View (North America)
          </button>
        )}
      </div>

      {/* Clickable Pill Badges Grid */}
      <div className="flex flex-wrap gap-2.5">
        {CITIES.map((city) => {
          const isActive = activeCity?.name === city.name;
          return (
            <button
              key={city.name}
              onClick={() => setActiveCity(city)}
              className={`flex items-center space-x-2 px-3.5 py-2 text-xs rounded-full border transition-all duration-200 ${
                isActive
                  ? 'border-[#FFD700] bg-[#FFD700]/10 text-white font-bold shadow-lg shadow-[#FFD700]/5 scale-[1.03]'
                  : 'bg-slate-900/60 hover:bg-slate-900 hover:border-slate-700 border-slate-850/80 text-slate-300'
              }`}
            >
              <span>{city.flag}</span>
              <span className="tracking-wide">{city.name}</span>
              <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ml-1 leading-none ${
                isActive 
                  ? 'bg-[#FFD700]/25 text-[#FFD700]' 
                  : 'bg-slate-950 text-slate-500 border border-slate-850'
              }`}>
                {city.matches} matches
              </span>
            </button>
          );
        })}
      </div>

      {/* Main Map + Info card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* OpenStreetMap iframe (8 Cols) */}
        <div className="lg:col-span-8 w-full aspect-[16/10] bg-slate-950 rounded-2xl border border-slate-900 overflow-hidden relative shadow-inner">
          <iframe
            title="FIFA World Cup 2026 Host Cities OpenStreetMap"
            width="100%"
            height="100%"
            src={mapUrl}
            className="border-0 opacity-85 hover:opacity-100 transition-opacity duration-300 filter invert contrast-[90%] hue-rotate-[180deg]"
          />
        </div>

        {/* Info card (4 Cols) */}
        <div className="lg:col-span-4 flex flex-col justify-between">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeCity ? activeCity.name : 'default'}
              initial={{ x: 15, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -15, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="h-full bg-slate-900/40 border border-slate-900 rounded-2xl p-5 backdrop-blur-md shadow-xl flex flex-col justify-between relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-3 opacity-5 pointer-events-none">
                <Globe className="w-24 h-24 text-white" />
              </div>

              {activeCity ? (
                <div className="space-y-6">
                  <div>
                    <span className={`inline-block text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full mb-3 border ${
                      activeCity.country === 'USA' 
                        ? 'bg-emerald-950/50 border-emerald-900/50 text-emerald-400' 
                        : activeCity.country === 'Canada' 
                        ? 'bg-blue-950/50 border-blue-900/50 text-blue-400' 
                        : 'bg-red-950/50 border-red-900/50 text-red-400'
                    }`}>
                      {activeCity.country}
                    </span>
                    <h3 className="text-xl font-black text-white tracking-tight">{activeCity.name}</h3>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-start text-xs text-slate-300">
                      <Info className="w-4 h-4 text-[#FFD700] mr-2.5 flex-shrink-0 mt-0.5" />
                      <div>
                        <span className="block text-[9px] uppercase font-bold text-slate-500 leading-none mb-0.5">Stadium</span>
                        <span className="font-semibold text-slate-200">{activeCity.stadium}</span>
                      </div>
                    </div>

                    <div className="flex items-start text-xs text-slate-300">
                      <Users className="w-4 h-4 text-blue-400 mr-2.5 flex-shrink-0 mt-0.5" />
                      <div>
                        <span className="block text-[9px] uppercase font-bold text-slate-500 leading-none mb-0.5">Arena Seating Capacity</span>
                        <span className="font-semibold text-slate-200">{activeCity.capacity} fans</span>
                      </div>
                    </div>

                    <div className="flex items-start text-xs text-slate-300">
                      <MapPin className="w-4 h-4 text-emerald-400 mr-2.5 flex-shrink-0 mt-0.5" />
                      <div>
                        <span className="block text-[9px] uppercase font-bold text-slate-500 leading-none mb-0.5">Match Load</span>
                        <span className="font-semibold text-slate-200">{activeCity.matches} matches scheduled</span>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center text-center h-full space-y-3 py-12">
                  <div className="w-12 h-12 rounded-full border border-slate-800 flex items-center justify-center text-slate-500 bg-slate-950/80">
                    <MapPin className="w-6 h-6 animate-pulse" />
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-slate-300 uppercase tracking-widest leading-none">Select a Host City</h4>
                    <p className="text-[10px] text-slate-500 max-w-xs mt-1.5 leading-relaxed">
                      Click any city pill badge above to snap the OpenStreetMap camera to the official stadium coords and display seat limits.
                    </p>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
