'use client';

import React, { useEffect, useState } from 'react';
import { Calendar, Share2, Tv, MapPin } from 'lucide-react';
import Link from 'next/link';
import MatchRating from './MatchRating';
import { TEAM_CODES } from '@/lib/team-codes';

interface Match {
  id: number;
  matchNumber: number;
  homeTeam: string | null;
  awayTeam: string | null;
  date: string;
  venue: string;
  group: string;
  stage: string;
  status: string;
  score: string | null;
  homeScore?: number | null;
  awayScore?: number | null;
  minute?: number | null;
}


function getFlag(teamName: string | null): string {
  if (!teamName) return '';
  const code = TEAM_CODES[teamName];
  if (!code) return '';
  return `https://flagcdn.com/64x48/${code}.png`;
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
  }, [match.id, match.status]);

  // Live status logic
  useEffect(() => {
    const matchDate = new Date(match.date);
    const now = new Date();
    const matchEndEstimate = new Date(
      matchDate.getTime() + 2 * 60 * 60 * 1000
    ); // 2 hours after kickoff

    const isActuallyLive = 
      match.status === 'IN_PLAY' || 
      match.status === 'PAUSED' ||
      match.status === 'live' ||
      match.status === 'in_play';

    // Only show LIVE if status says so AND 
    // we're within 2hr window of kickoff
    const withinLiveWindow = 
      now >= matchDate && now <= matchEndEstimate;

    setIsLive(isActuallyLive && withinLiveWindow);
  }, [match.date, match.status]);

  const isFinished = 
    match.status === 'FINISHED' || 
    match.status === 'finished' ||
    match.status === 'completed';

  const hasScore = match.homeScore !== undefined && match.homeScore !== null && 
    match.awayScore !== undefined && match.awayScore !== null;

  const winner = isFinished && hasScore
    ? match.homeScore! > match.awayScore!
      ? match.homeTeam
      : match.awayScore! > match.homeScore!
      ? match.awayTeam
      : 'Draw'
    : null;

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
      `SUMMARY:FIFA World Cup 2026: ${match.homeTeam || 'TBD'} vs ${match.awayTeam || 'TBD'}`,
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
🔥 ${match.homeTeam || 'TBD'} vs ${match.awayTeam || 'TBD'}
📅 Date: ${localDateStr}
⏰ Time: ${localTimeStr} (${timezone})
📍 Venue: ${match.venue}
🏆 Stage: ${match.stage}
Get live score alerts & chatbot support here: https://world-cup-fan-site.vercel.app`;

    const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div
      className="match-card relative overflow-hidden rounded-3xl border border-slate-800/80 bg-gradient-to-b from-slate-900/60 to-slate-950/80 backdrop-blur-xl p-6 shadow-2xl hover:border-fifa-green hover:-translate-y-1.5 transition-all duration-300 group"
    >
      {/* Stadium spotlight glow backdrop */}
      <div className="absolute -right-24 -top-24 w-48 h-48 bg-gradient-to-br from-fifa-green/10 to-transparent rounded-full blur-[60px] pointer-events-none group-hover:scale-125 transition-transform duration-500" />

      {/* Header Info */}
      <div className="flex justify-between items-center mb-4">
        <span className="text-[10px] uppercase font-bold tracking-widest text-fifa-green bg-fifa-green/10 border border-fifa-green/20 px-3 py-1 rounded-full">
          Match #{match.id}
        </span>
        <span className="text-xs font-bold text-slate-400">
          {match.group !== 'N/A' ? `${match.group}` : `${match.stage}`}
        </span>
      </div>

      {/* Live Badge */}
      {isLive && !isFinished && (
        <div className="absolute top-5 right-6 flex items-center space-x-1.5 bg-gradient-to-r from-fifa-red to-rose-600 text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-md animate-pulse">
          <span className="w-1.5 h-1.5 bg-white rounded-full" />
          <span>LIVE</span>
        </div>
      )}

      {/* Teams grid visualizer */}
      <div className="flex items-center justify-between my-5 py-4 border-y border-slate-800/30">
        {/* Home Team */}
        <div className="flex flex-col items-center flex-1 text-center">
          <div className="mb-3 group-hover:scale-105 transition-transform duration-300" style={{
            width: 72,
            height: 72,
            borderRadius: '50%',
            overflow: 'hidden',
            border: '2px solid rgba(255,255,255,0.1)',
            background: '#1a1a1a',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}>
            {match.homeTeam && getFlag(match.homeTeam) ? (
              <img
                src={getFlag(match.homeTeam)}
                alt={match.homeTeam}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  objectPosition: 'center',
                }}
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                  const parent = (e.target as HTMLImageElement).parentElement;
                  if (parent) {
                    parent.innerHTML = `<span style="font-size:11px;
                      font-weight:700;color:rgba(255,255,255,0.6);
                      text-align:center;padding:4px">
                      ${(match.homeTeam || 'TBD').slice(0,3).toUpperCase()}
                    </span>`;
                  }
                }}
              />
            ) : (
              <span style={{fontSize:11, fontWeight:700,
                color:'rgba(255,255,255,0.6)',textAlign:'center'}}>
                {(match.homeTeam || 'TBD').slice(0,3).toUpperCase()}
              </span>
            )}
          </div>
          <h3 className="match-teams text-sm font-bold text-slate-200 line-clamp-1">{match.homeTeam || 'TBD'}</h3>
        </div>

        {/* Versus Match score */}
        <div className="flex flex-col items-center px-4">
          {isFinished && hasScore ? (
            <div style={{textAlign:'center'}}>
              <div className="match-score" style={{
                fontFamily:"'Bebas Neue',sans-serif",
                fontSize:28, color:'#fff', letterSpacing:4
              }}>
                {match.homeScore} - {match.awayScore}
              </div>
              <div style={{
                fontSize:9, fontWeight:700,
                color:'rgba(255,255,255,0.3)',
                letterSpacing:2, marginTop:2
              }}>
                FULL TIME
              </div>
            </div>
          ) : isLive && hasScore ? (
            <div style={{textAlign:'center'}}>
              <div className="match-score" style={{
                fontFamily:"'Bebas Neue',sans-serif",
                fontSize:28, color:'#E61D25', letterSpacing:4
              }}>
                {match.homeScore} - {match.awayScore}
              </div>
              <div style={{
                background:'#E61D25', color:'#fff',
                fontSize:9, fontWeight:700,
                padding:'2px 8px', borderRadius:2,
                letterSpacing:1, display:'inline-block',
                marginTop:3,
                animation:'pdot 1.2s infinite'
              }}>
                LIVE {match.minute ? `${match.minute}'` : ''}
              </div>
            </div>
          ) : (
            <div style={{
              fontFamily:"'Bebas Neue',sans-serif",
              fontSize:18, color:'rgba(255,255,255,0.2)',
              letterSpacing:3
            }}>
              VS
            </div>
          )}
        </div>

        {/* Away Team */}
        <div className="flex flex-col items-center flex-1 text-center">
          <div className="mb-3 group-hover:scale-105 transition-transform duration-300" style={{
            width: 72,
            height: 72,
            borderRadius: '50%',
            overflow: 'hidden',
            border: '2px solid rgba(255,255,255,0.1)',
            background: '#1a1a1a',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}>
            {match.awayTeam && getFlag(match.awayTeam) ? (
              <img
                src={getFlag(match.awayTeam)}
                alt={match.awayTeam}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  objectPosition: 'center',
                }}
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                  const parent = (e.target as HTMLImageElement).parentElement;
                  if (parent) {
                    parent.innerHTML = `<span style="font-size:11px;
                      font-weight:700;color:rgba(255,255,255,0.6);
                      text-align:center;padding:4px">
                      ${(match.awayTeam || 'TBD').slice(0,3).toUpperCase()}
                    </span>`;
                  }
                }}
              />
            ) : (
              <span style={{fontSize:11, fontWeight:700,
                color:'rgba(255,255,255,0.6)',textAlign:'center'}}>
                {(match.awayTeam || 'TBD').slice(0,3).toUpperCase()}
              </span>
            )}
          </div>
          <h3 className="match-teams text-sm font-bold text-slate-200 line-clamp-1">{match.awayTeam || 'TBD'}</h3>
        </div>
      </div>

      {/* Fixture Venue and Local Timestamps */}
      <div className="space-y-2 mb-6">
        <div className="flex items-center text-xs text-slate-300 font-semibold">
          <Calendar className="w-4 h-4 text-fifa-green mr-2.5 flex-shrink-0" />
          <span>{localDateStr} @ {localTimeStr}</span>
        </div>
        <div className="flex items-center text-xs text-slate-400">
          <MapPin className="w-4 h-4 text-slate-500 mr-2.5 flex-shrink-0" />
          <span className="line-clamp-1">{match.venue}</span>
        </div>
      </div>

      {/* Action triggers */}
      <div className="pb-4 border-b border-slate-800/30">
        {isFinished ? (
          /* Finished: Share Match only */
          <button
            onClick={handleWhatsAppShare}
            className="w-full flex items-center justify-center space-x-1.5 py-3 px-3 bg-fifa-green/5 hover:bg-fifa-green/10 border border-fifa-green/10 hover:border-fifa-green/25 rounded-xl text-xs font-bold text-fifa-green transition-all active:scale-[0.98]"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Share Match</span>
          </button>
        ) : isLive ? (
          /* Live: Share Match only (no Calendar) */
          <button
            onClick={handleWhatsAppShare}
            className="w-full flex items-center justify-center space-x-1.5 py-3 px-3 bg-fifa-green/5 hover:bg-fifa-green/10 border border-fifa-green/10 hover:border-fifa-green/25 rounded-xl text-xs font-bold text-fifa-green transition-all active:scale-[0.98]"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Share Match</span>
          </button>
        ) : (
          /* Scheduled: Calendar + Share Match */
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={handleAddToCalendar}
              className="flex items-center justify-center space-x-1.5 py-3 px-3 bg-slate-900/60 hover:bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-xl text-xs font-bold text-slate-200 transition-all active:scale-[0.98]"
            >
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              <span>Add to Calendar</span>
            </button>

            <button
              onClick={handleWhatsAppShare}
              className="flex items-center justify-center space-x-1.5 py-3 px-3 bg-fifa-green/5 hover:bg-fifa-green/10 border border-fifa-green/10 hover:border-fifa-green/25 rounded-xl text-xs font-bold text-fifa-green transition-all active:scale-[0.98]"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Share Match</span>
            </button>
          </div>
        )}
      </div>

      {/* Stream Routing Action */}
      {!isFinished && (
        <a
          href={streamLink}
          target="_blank"
          rel="noopener noreferrer"
          className={`mt-4 w-full flex items-center justify-center space-x-2 py-3.5 px-4 font-bold text-xs rounded-xl shadow-lg transition-all duration-200 cursor-pointer ${
            isLive 
              ? 'bg-[#CF081F] hover:bg-[#b00618] text-white shadow-rose-600/10 hover:shadow-rose-600/20' 
              : 'bg-fifa-green hover:bg-opacity-90 text-white shadow-fifa-green/10 hover:shadow-fifa-green/20'
          }`}
        >
          <Tv className="w-4 h-4 fill-white" />
          <span>{streamLabel}</span>
        </a>
      )}

      <Link 
        href={`/match/${match.id}`}
        style={{
          display: 'block',
          textAlign: 'center',
          marginTop: '12px',
          fontSize: '12px',
          color: '#3CAC3B',
          fontWeight: 'bold',
          textDecoration: 'none'
        }}
        className="hover:underline"
      >
        View Match Stats →
      </Link>

      {isFinished && hasScore && (
        <div style={{
          textAlign:'center', marginTop:8
        }}>
          {match.homeScore === match.awayScore ? (
            <span style={{
              background:'rgba(255,255,255,0.06)',
              color:'rgba(255,255,255,0.5)',
              fontSize:10, fontWeight:700,
              padding:'3px 10px', borderRadius:4,
              letterSpacing:1
            }}>
              🤝 DRAW
            </span>
          ) : (
            <span style={{
              background:'rgba(60,172,59,0.12)',
              color:'#3CAC3B',
              fontSize:10, fontWeight:700,
              padding:'3px 10px', borderRadius:4,
              letterSpacing:1
            }}>
              🏆 {match.homeScore! > match.awayScore! 
                ? match.homeTeam : match.awayTeam} WON
            </span>
          )}
        </div>
      )}

      {isFinished && (
        <MatchRating 
          matchId={match.id}
          isFinished={isFinished}
        />
      )}
    </div>
  );
}
