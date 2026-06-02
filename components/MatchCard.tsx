'use client';

import React, { useEffect, useState } from 'react';
import { Calendar, Share2, Tv, MapPin, Award } from 'lucide-react';

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
        // Fetch from ipapi.co (which is HTTPS friendly) with fallback to ip-api.com
        let res = await fetch('https://ipapi.co/json/');
        if (!res.ok) {
          // If ipapi.co fails, use ip-api.com (HTTP only on free tier, will fallback on HTTPS block)
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
        // Fail silently and use FIFA+ default
        setStreamLink('https://www.fifa.com/fifaplus');
        setStreamLabel('Watch Live on FIFA+');
      }
    }
    detectStreamingRights();

    // Check if match is live (mock simulation or real live match)
    // Matches start June 11, 2026. For demonstration purposes, we will treat 101/102 as "LIVE" if time fits,
    // or just display live badge if status is LIVE
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
    const endDateStr = formatToIcsDate(new Date(new Date(match.date).getTime() + 2 * 60 * 60 * 1000).toISOString()); // 2 hours duration

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
Get live score alerts & chatbot support here: https://fifa-2026-fan-site.vercel.app`;

    const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/40 backdrop-blur-xl p-5 hover:border-emerald-500/50 hover:bg-slate-900/60 transition-all duration-300 shadow-xl group">
      {/* Visual Accent Gradient */}
      <div className="absolute -right-16 -top-16 w-32 h-32 bg-emerald-500/5 rounded-full blur-2xl group-hover:bg-emerald-500/10 transition-all duration-500 pointer-events-none" />

      {/* Header Info */}
      <div className="flex justify-between items-center mb-4">
        <span className="text-[10px] uppercase font-bold tracking-widest text-emerald-400 bg-emerald-950/60 px-2.5 py-1 rounded-full border border-emerald-900/40">
          Match {match.matchNumber}
        </span>
        <span className="text-[11px] font-semibold text-slate-400">
          {match.group !== 'N/A' ? `${match.group}` : `${match.stage}`}
        </span>
      </div>

      {/* Live Badge */}
      {isLive && (
        <div className="absolute top-4 right-4 flex items-center space-x-1.5 bg-red-600/90 text-white text-[10px] font-extrabold uppercase tracking-widest px-2.5 py-0.5 rounded-md animate-pulse">
          <span className="w-1.5 h-1.5 bg-white rounded-full" />
          <span>LIVE</span>
        </div>
      )}

      {/* Teams Grid */}
      <div className="flex flex-col items-center justify-center my-4 py-3 relative border-y border-slate-800/40">
        <div className="flex justify-between items-center w-full px-4">
          {/* Home Team */}
          <div className="flex flex-col items-center flex-1 text-center">
            <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center border border-slate-700 shadow-md mb-2 group-hover:scale-105 transition-transform duration-300">
              <span className="text-lg font-bold text-slate-100 uppercase">
                {match.homeTeam.substring(0, 3)}
              </span>
            </div>
            <h3 className="text-sm font-semibold text-slate-200 line-clamp-1">{match.homeTeam}</h3>
          </div>

          {/* Versus / Score */}
          <div className="flex flex-col items-center px-4">
            {match.score ? (
              <span className="text-2xl font-extrabold text-white tracking-widest bg-slate-800/60 px-3 py-1.5 rounded-lg border border-slate-700">
                {match.score}
              </span>
            ) : (
              <div className="flex flex-col items-center">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">VS</span>
                <span className="text-[10px] text-slate-400 font-medium mt-1">{localTimeStr}</span>
              </div>
            )}
          </div>

          {/* Away Team */}
          <div className="flex flex-col items-center flex-1 text-center">
            <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center border border-slate-700 shadow-md mb-2 group-hover:scale-105 transition-transform duration-300">
              <span className="text-lg font-bold text-slate-100 uppercase">
                {match.awayTeam.substring(0, 3)}
              </span>
            </div>
            <h3 className="text-sm font-semibold text-slate-200 line-clamp-1">{match.awayTeam}</h3>
          </div>
        </div>
      </div>

      {/* Date & Location Details */}
      <div className="space-y-2 mb-5">
        <div className="flex items-center text-xs text-slate-300 font-medium">
          <Calendar className="w-4 h-4 text-emerald-400 mr-2 flex-shrink-0" />
          <span>{localDateStr} @ {localTimeStr}</span>
        </div>
        <div className="flex items-center text-xs text-slate-400">
          <MapPin className="w-4 h-4 text-slate-500 mr-2 flex-shrink-0" />
          <span className="line-clamp-1">{match.venue}</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-2 mt-4 pt-4 border-t border-slate-800/30">
        <button
          onClick={handleAddToCalendar}
          className="flex items-center justify-center space-x-1.5 py-2.5 px-3 bg-slate-800/80 hover:bg-slate-800 border border-slate-700 hover:border-slate-600 rounded-xl text-xs font-semibold text-slate-200 transition-all active:scale-95"
        >
          <Calendar className="w-3.5 h-3.5" />
          <span>Add to Calendar</span>
        </button>

        <button
          onClick={handleWhatsAppShare}
          className="flex items-center justify-center space-x-1.5 py-2.5 px-3 bg-emerald-600/10 hover:bg-emerald-600/20 border border-emerald-500/20 hover:border-emerald-500/40 rounded-xl text-xs font-semibold text-emerald-400 transition-all active:scale-95"
        >
          <Share2 className="w-3.5 h-3.5" />
          <span>Share Match</span>
        </button>
      </div>

      {/* Watch Live Stream CTA */}
      <a
        href={streamLink}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-3 w-full flex items-center justify-center space-x-2 py-2.5 px-4 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl shadow-lg shadow-emerald-500/10 transition-all hover:-translate-y-0.5 hover:shadow-emerald-500/20 duration-200 cursor-pointer"
      >
        <Tv className="w-4 h-4 fill-slate-950" />
        <span>{streamLabel}</span>
      </a>
    </div>
  );
}
