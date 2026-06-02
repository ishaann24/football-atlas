'use client';

import React, { useEffect, useState } from 'react';
import { Calendar, Share2, Tv, MapPin, ChevronDown, ChevronUp, Play, ShieldAlert, Award } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Match {
  id: number;
  matchNumber: number;
  homeTeam: string;
  awayTeam: string;
  date: string;
  venue: string;
  group: string;
  stage: string;
  status: string;
  score: string | null;
}

interface MatchCardProps {
  match: Match;
  timezone: string;
}

export default function MatchCard({ match, timezone }: MatchCardProps) {
  const [localTimeStr, setLocalTimeStr] = useState('');
  const [localDateStr, setLocalDateStr] = useState('');
  const [streamLink, setStreamLink] = useState('https://www.fifa.com/fifaplus');
  const [streamLabel, setStreamLabel] = useState('Watch Live on FIFA+');
  const [isLive, setIsLive] = useState(false);
  const [showTimeline, setShowTimeline] = useState(false);

  // Formatting date/time in the selected timezone
  useEffect(() => {
    try {
      const matchDate = new Date(match.date);
      
      const timeFormatter = new Intl.DateTimeFormat('en-US', {
        timeZone: timezone,
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      });

      const dateFormatter = new Intl.DateTimeFormat('en-US', {
        timeZone: timezone,
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });

      setLocalTimeStr(timeFormatter.format(matchDate));
      setLocalDateStr(dateFormatter.format(matchDate));
    } catch (e) {
      console.error('Error formatting date for match:', match.id, e);
      setLocalTimeStr('TBD');
      setLocalDateStr('TBD');
    }
  }, [match.date, timezone]);

  // Geolocation lookup for streaming link
  useEffect(() => {
    async function detectStreamingRights() {
      try {
        let res = await fetch('https://ipapi.co/json/');
        if (!res.ok) {
          res = await fetch('http://ip-api.com/json');
        }
        const data = await res.json();
        const countryCode = (data.country_code || data.countryCode || '').toUpperCase();

        if (countryCode === 'IN') {
          setStreamLink('https://www.hotstar.com/sports/football');
          setStreamLabel('Watch Live on Disney+ Hotstar');
        } else if (countryCode === 'US') {
          setStreamLink('https://www.peacocktv.com/sports/soccer');
          setStreamLabel('Watch Live on Peacock / Fubo');
        } else if (countryCode === 'GB') {
          setStreamLink('https://www.bbc.co.uk/iplayer/categories/sport');
          setStreamLabel('Watch Live on BBC iPlayer');
        } else {
          setStreamLink('https://www.fifa.com/fifaplus');
          setStreamLabel('Watch Live on FIFA+');
        }
      } catch (err) {
        setStreamLink('https://www.fifa.com/fifaplus');
        setStreamLabel('Watch Live on FIFA+');
      }
    }
    detectStreamingRights();

    if (match.status === 'LIVE' || match.id === 101) {
      setIsLive(true);
    }
  }, [match.id, match.status]);

  // ICS calendar generation
  const handleAddToCalendar = () => {
    const pad = (n: number) => String(n).padStart(2, '0');
    const formatToIcsDate = (isoString: string) => {
      const d = new Date(isoString);
      const year = d.getUTCFullYear();
      const month = pad(d.getUTCMonth() + 1);
      const day = pad(d.getUTCDate());
      const hours = pad(d.getUTCHours());
      const minutes = pad(d.getUTCMinutes());
      const seconds = pad(d.getUTCSeconds());
      return `${year}${month}${day}T${hours}${minutes}${seconds}Z`;
    };

    const startDateStr = formatToIcsDate(match.date);
    const endDateStr = formatToIcsDate(new Date(new Date(match.date).getTime() + 2 * 60 * 60 * 1000).toISOString());

    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//FIFA World Cup 2026 Fan Website//EN',
      'BEGIN:VEVENT',
      `UID:match-${match.id}-2026@fifa2026fans.com`,
      `DTSTAMP:${formatToIcsDate(new Date().toISOString())}`,
      `DTSTART:${startDateStr}`,
      `DTEND:${endDateStr}`,
      `SUMMARY:FIFA World Cup 2026: ${match.homeTeam} vs ${match.awayTeam}`,
      `DESCRIPTION:FIFA World Cup 2026 Match ${match.matchNumber}\\nGroup/Stage: ${match.group !== 'N/A' ? match.group : match.stage}\\nVenue: ${match.venue}`,
      `LOCATION:${match.venue}`,
      'END:VEVENT',
      'END:VCALENDAR',
    ].join('\r\n');

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `FIFA_2026_Match_${match.matchNumber}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // WhatsApp share
  const handleWhatsAppShare = () => {
    const shareText = `⚽ Let's watch the FIFA World Cup 2026 Match ${match.matchNumber}!
🔥 ${match.homeTeam} vs ${match.awayTeam}
📅 Date: ${localDateStr}
⏰ Time: ${localTimeStr} (${timezone})
📍 Venue: ${match.venue}
🏆 Stage: ${match.stage}
Get live score alerts & chatbot support here: https://world-cup-fan-site.vercel.app`;

    const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`;
    window.open(whatsappUrl, '_blank');
  };

  // Mock match timeline details for premium dashboard engagement
  const mockTimeline = [
    { minute: 0, event: 'Kickoff whistle blown', type: 'system' },
    { minute: 23, event: `Yellow Card: ${match.homeTeam} Defender`, type: 'card' },
    { minute: 45, event: 'Half-time interval', type: 'system' },
    { minute: 58, event: `⚽ GOAL! Scored for ${match.homeTeam}`, type: 'goal' },
    { minute: 90, event: 'Full time whistle blown', type: 'system' },
  ];

  return (
    <motion.div
      layout
      whileHover={{ y: -6, transition: { duration: 0.2 } }}
      className="relative overflow-hidden rounded-3xl border border-slate-800/80 bg-gradient-to-b from-slate-900/60 to-slate-950/80 backdrop-blur-xl p-6 shadow-2xl hover:border-emerald-500/40 transition-all duration-300 group"
    >
      {/* Stadium spotlight glow backdrop */}
      <div className="absolute -right-24 -top-24 w-48 h-48 bg-gradient-to-br from-emerald-500/10 to-transparent rounded-full blur-[60px] pointer-events-none group-hover:scale-125 transition-transform duration-500" />

      {/* Header Info */}
      <div className="flex justify-between items-center mb-4">
        <span className="text-[10px] uppercase font-black tracking-widest text-emerald-400 bg-emerald-950/50 border border-emerald-900/50 px-3 py-1 rounded-full">
          Match {match.matchNumber}
        </span>
        <span className="text-xs font-bold text-slate-400">
          {match.group !== 'N/A' ? `${match.group}` : `${match.stage}`}
        </span>
      </div>

      {/* Live Badge */}
      {isLive && (
        <div className="absolute top-5 right-6 flex items-center space-x-1.5 bg-gradient-to-r from-red-600 to-rose-600 text-white text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-md animate-pulse">
          <span className="w-1.5 h-1.5 bg-white rounded-full" />
          <span>LIVE</span>
        </div>
      )}

      {/* Teams grid visualizer */}
      <div className="flex items-center justify-between my-5 py-4 border-y border-slate-800/30">
        {/* Home Team */}
        <div className="flex flex-col items-center flex-1 text-center">
          <div className="w-14 h-14 rounded-full bg-slate-950/80 flex items-center justify-center border border-slate-850 shadow-inner mb-3 group-hover:scale-105 transition-transform duration-300">
            <span className="text-xl font-black text-slate-200">
              {match.homeTeam.substring(0, 3).toUpperCase()}
            </span>
          </div>
          <h3 className="text-sm font-bold text-slate-200 line-clamp-1">{match.homeTeam}</h3>
        </div>

        {/* Versus Match score */}
        <div className="flex flex-col items-center px-4">
          {match.score ? (
            <span className="text-2xl font-black text-white tracking-widest bg-slate-950/80 px-4 py-2 rounded-xl border border-slate-800">
              {match.score}
            </span>
          ) : (
            <div className="flex flex-col items-center">
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">VS</span>
              <span className="text-[10px] text-emerald-400 font-bold bg-emerald-950/20 px-2 py-0.5 rounded-full border border-emerald-900/30 mt-2">
                {localTimeStr}
              </span>
            </div>
          )}
        </div>

        {/* Away Team */}
        <div className="flex flex-col items-center flex-1 text-center">
          <div className="w-14 h-14 rounded-full bg-slate-950/80 flex items-center justify-center border border-slate-850 shadow-inner mb-3 group-hover:scale-105 transition-transform duration-300">
            <span className="text-xl font-black text-slate-200">
              {match.awayTeam.substring(0, 3).toUpperCase()}
            </span>
          </div>
          <h3 className="text-sm font-bold text-slate-200 line-clamp-1">{match.awayTeam}</h3>
        </div>
      </div>

      {/* Fixture Venue and Local Timestamps */}
      <div className="space-y-2 mb-6">
        <div className="flex items-center text-xs text-slate-300 font-semibold">
          <Calendar className="w-4 h-4 text-emerald-400 mr-2.5 flex-shrink-0" />
          <span>{localDateStr} @ {localTimeStr}</span>
        </div>
        <div className="flex items-center text-xs text-slate-400">
          <MapPin className="w-4 h-4 text-slate-500 mr-2.5 flex-shrink-0" />
          <span className="line-clamp-1">{match.venue}</span>
        </div>
      </div>

      {/* Action triggers */}
      <div className="grid grid-cols-2 gap-2 pb-4 border-b border-slate-800/30">
        <button
          onClick={handleAddToCalendar}
          className="flex items-center justify-center space-x-1.5 py-3 px-3 bg-slate-900/60 hover:bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-xl text-xs font-bold text-slate-200 transition-all active:scale-[0.98]"
        >
          <Calendar className="w-3.5 h-3.5 text-slate-400" />
          <span>Add to Calendar</span>
        </button>

        <button
          onClick={handleWhatsAppShare}
          className="flex items-center justify-center space-x-1.5 py-3 px-3 bg-emerald-600/5 hover:bg-emerald-600/10 border border-emerald-500/10 hover:border-emerald-500/25 rounded-xl text-xs font-bold text-emerald-400 transition-all active:scale-[0.98]"
        >
          <Share2 className="w-3.5 h-3.5" />
          <span>Share Match</span>
        </button>
      </div>

      {/* Stream Routing Action */}
      <a
        href={streamLink}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-4 w-full flex items-center justify-center space-x-2 py-3.5 px-4 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs rounded-xl shadow-lg shadow-emerald-500/10 hover:shadow-emerald-500/20 active:translate-y-[1px] transition-all duration-200 cursor-pointer"
      >
        <Tv className="w-4 h-4 fill-slate-950" />
        <span>{streamLabel}</span>
      </a>

      {/* Interactive Expandable Timeline Widget */}
      <div className="mt-4">
        <button
          onClick={() => setShowTimeline(!showTimeline)}
          className="w-full flex items-center justify-center space-x-1.5 py-2 text-[10px] font-bold text-slate-500 hover:text-slate-300 transition-colors uppercase tracking-wider focus:outline-none"
        >
          <span>Match Events Timeline</span>
          {showTimeline ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
        </button>

        <AnimatePresence>
          {showTimeline && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden mt-3 pt-3 border-t border-slate-900 space-y-3"
            >
              {mockTimeline.map((item, index) => (
                <div key={index} className="flex items-start space-x-3 text-xs">
                  <div className="flex flex-col items-center">
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold ${
                      item.type === 'goal' 
                        ? 'bg-emerald-500 text-slate-950' 
                        : item.type === 'card' 
                        ? 'bg-yellow-500 text-slate-950' 
                        : 'bg-slate-800 text-slate-300'
                    }`}>
                      {item.minute}'
                    </div>
                    {index !== mockTimeline.length - 1 && (
                      <div className="w-[1px] h-5 bg-slate-850 mt-1" />
                    )}
                  </div>
                  <span className="text-slate-400 font-medium pt-0.5">{item.event}</span>
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
