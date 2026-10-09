'use client';

import React, { useEffect, useState } from 'react';

const TARGET_DATE = '2026-06-11T18:00:00Z'; // Kickoff time

export default function Countdown() {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);

    function updateTimer() {
      const difference = +new Date(TARGET_DATE) - +new Date();
      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      }
    }

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, []);

  if (!isClient) return null;

  return (
    <div className="flex space-x-3 md:space-x-4 justify-center items-center">
      {Object.entries(timeLeft).map(([label, value]) => (
        <div key={label} className="flex flex-col items-center">
          <div className="relative overflow-hidden w-16 h-20 md:w-20 md:h-24 bg-slate-900/80 backdrop-blur-md border border-slate-800 rounded-2xl flex items-center justify-center shadow-2xl">
            {/* Glossy overlay effect */}
            <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent pointer-events-none" />
            <div className="absolute top-0 bottom-1/2 left-0 right-0 border-b border-slate-950/60" />

            <span className="text-3xl md:text-4xl font-extrabold text-white select-none z-10 font-mono tracking-tight transition-all duration-300">
              {String(value).padStart(2, '0')}
            </span>
          </div>
          <span className="text-[10px] md:text-xs font-bold text-slate-500 uppercase tracking-widest mt-2">
            {label}
          </span>
        </div>
      ))}
    </div>
  );
}
