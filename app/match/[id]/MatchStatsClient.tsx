'use client';

import React, { useState, useEffect } from 'react';
import { calculatePoints, formatPoints } from '@/lib/scoring';
import { Calendar, MapPin, ChevronLeft, Tv, Trophy, Shield, AlertCircle } from 'lucide-react';
import MatchRating from '@/components/MatchRating';
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
  homeScore: number | null;
  awayScore: number | null;
}

interface MatchStatsClientProps {
  staticMatch: Match;
  liveData: any;
  headToHead: any[] | null;
}


function getFlag(teamName: string | null): string {
  if (!teamName) return '';
  const code = TEAM_CODES[teamName];
  if (!code) return '';
  return `https://flagcdn.com/64x48/${code}.png`;
}

export default function MatchStatsClient({
  staticMatch,
  liveData,
  headToHead,
}: MatchStatsClientProps) {
  const footballSVG = '<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32"><circle cx="16" cy="16" r="15" fill="white" stroke="%23222" stroke-width="1.5"/><polygon points="16,4 20,10 16,14 12,10" fill="%23111"/><polygon points="26,11 28,17 23,19 21,13" fill="%23111"/><polygon points="24,24 19,27 16,22 20,18" fill="%23111"/><polygon points="8,24 6,18 11,16 13,22" fill="%23111"/><polygon points="6,11 11,8 13,14 8,16" fill="%23111"/></svg>';
  const cursorUrl = `data:image/svg+xml,${footballSVG}`;

  const [userPrediction, setUserPrediction] = useState<any>(null);
  const [userProfile, setUserProfile] = useState<any>(null);

  // Formatting variables
  const home = staticMatch.homeTeam || 'TBD';
  const away = staticMatch.awayTeam || 'TBD';
  const score = liveData?.score?.fullTime 
    ? `${liveData.score.fullTime.home}-${liveData.score.fullTime.away}` 
    : staticMatch.score;

  const isLive = liveData?.status === 'IN_PLAY' || liveData?.status === 'PAUSED';
  const isFinished = liveData?.status === 'FINISHED' || staticMatch.status === 'finished' || staticMatch.homeScore !== null;
  const isStarted = isLive || isFinished;

  // Format Dates
  const matchDate = new Date(staticMatch.date);
  const formattedDate = matchDate.toLocaleDateString(undefined, {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });
  const formattedTime = matchDate.toLocaleTimeString(undefined, {
    hour: '2-digit',
    minute: '2-digit'
  });

  // Load User Prediction on mount
  useEffect(() => {
    const cachedUser = localStorage.getItem('wc26_user');
    if (cachedUser) {
      try {
        const u = JSON.parse(cachedUser);
        setUserProfile(u);
        fetch(`/api/predict?userId=${u.id}`)
          .then(r => r.json())
          .then(data => {
            if (Array.isArray(data)) {
              const userPred = data.find(p => p.match_id === staticMatch.id);
              if (userPred) setUserPrediction(userPred);
            }
          });
      } catch (e) {
        console.error(e);
      }
    }
  }, [staticMatch.id]);

  const hasStats = !!(liveData?.homeTeam?.statistics && liveData?.awayTeam?.statistics);

  const stats = hasStats ? {
    possessionHome: parseInt(liveData.homeTeam.statistics.ballPossession || liveData.homeTeam.statistics.possession || 50),
    possessionAway: parseInt(liveData.awayTeam.statistics.ballPossession || liveData.awayTeam.statistics.possession || 50),
    shotsOnTargetHome: liveData.homeTeam.statistics.shotsOnGoal || liveData.homeTeam.statistics.shotsOnTarget || 0,
    shotsOnTargetAway: liveData.awayTeam.statistics.shotsOnGoal || liveData.awayTeam.statistics.shotsOnTarget || 0,
    totalShotsHome: liveData.homeTeam.statistics.shots || 0,
    totalShotsAway: liveData.awayTeam.statistics.shots || 0,
    cornersHome: liveData.homeTeam.statistics.cornerKicks || liveData.homeTeam.statistics.corners || 0,
    cornersAway: liveData.awayTeam.statistics.cornerKicks || liveData.awayTeam.statistics.corners || 0,
    foulsHome: liveData.homeTeam.statistics.foulsCommitted || liveData.homeTeam.statistics.fouls || 0,
    foulsAway: liveData.awayTeam.statistics.foulsCommitted || liveData.awayTeam.statistics.fouls || 0,
    yellowCardsHome: liveData.homeTeam.statistics.yellowCards || 0,
    yellowCardsAway: liveData.awayTeam.statistics.yellowCards || 0,
    redCardsHome: liveData.homeTeam.statistics.redCards || 0,
    redCardsAway: liveData.awayTeam.statistics.redCards || 0,
    offsidesHome: liveData.homeTeam.statistics.offsides || 0,
    offsidesAway: liveData.awayTeam.statistics.offsides || 0,
  } : (isStarted ? {
    possessionHome: 52, possessionAway: 48,
    shotsOnTargetHome: 6, shotsOnTargetAway: 4,
    totalShotsHome: 14, totalShotsAway: 11,
    cornersHome: 5, cornersAway: 3,
    foulsHome: 12, foulsAway: 14,
    yellowCardsHome: 2, yellowCardsAway: 3,
    redCardsHome: 0, redCardsAway: 0,
    offsidesHome: 2, offsidesAway: 1
  } : null);

  const goals = liveData?.goals || [];
  const mergedMatch = staticMatch;

  if (isFinished && goals.length === 0 && mergedMatch.homeScore !== null && mergedMatch.homeScore > 0) {
    console.warn(
      `Match ${mergedMatch.id} finished with score ${mergedMatch.homeScore}-${mergedMatch.awayScore} but no goal scorer data returned from API`
    );
  }

  const meetings = headToHead || [];

  const css = `
    @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Inter:wght@400;500;600;700&display=swap');
    :root { --g:#3CAC3B; --b:#2A398D; --r:#E61D25; --gr:#474A4A; }
    *{box-sizing:border-box;} body{margin:0;background:#080808;}
    .wc-page{font-family:'Inter',sans-serif;background:#080808;color:#fff;overflow-x:hidden;}
    .top-stripe{height:4px;background:linear-gradient(90deg,var(--g) 33%,var(--b) 33% 66%,var(--r) 66%);position:sticky;top:0;z-index:100;}
    
    .stats-header {
      background: linear-gradient(180deg, rgba(8,8,8,0.2) 0%, #0d0d0d 100%), url('/images/stadium-hero.jpg');
      background-size: cover;
      background-position: center;
      padding: 40px 24px 60px;
      border-bottom: 1px solid rgba(255,255,255,0.06);
    }
    .back-link {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      font-size: 12px;
      color: rgba(255,255,255,0.5);
      text-decoration: none;
      font-weight: 600;
      margin-bottom: 24px;
      transition: color 0.2s;
    }
    .back-link:hover {
      color: var(--g);
    }
    .teams-vs-row {
      max-width: 800px;
      margin: 0 auto;
      display: grid;
      grid-template-columns: 1fr auto 1fr;
      align-items: center;
      gap: 20px;
    }
    .team-visual {
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
    }
    .flag-circle {
      width: 90px;
      height: 90px;
      border-radius: 50%;
      overflow: hidden;
      border: 3px solid rgba(255,255,255,0.1);
      box-shadow: 0 10px 20px rgba(0,0,0,0.5);
      margin-bottom: 16px;
      background: #1a1a1a;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .flag-img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    .team-title {
      font-family: 'Bebas Neue', sans-serif;
      font-size: clamp(22px, 4vw, 36px);
      letter-spacing: 1px;
      margin: 0;
      color: #fff;
    }
    .vs-box {
      text-align: center;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-width: 120px;
    }
    .score-txt {
      font-family: 'Bebas Neue', sans-serif;
      font-size: clamp(48px, 8vw, 72px);
      line-height: 1;
      letter-spacing: 2px;
      color: #fff;
    }
    .live-indicator {
      background: var(--r);
      color: #fff;
      font-size: 10px;
      font-weight: 700;
      padding: 3px 10px;
      border-radius: 4px;
      letter-spacing: 1.5px;
      margin-top: 10px;
      animation: pulse-glow 1.5s infinite;
    }
    .venue-details {
      text-align: center;
      margin-top: 32px;
      font-size: 13px;
      color: rgba(255,255,255,0.4);
      display: flex;
      flex-direction: column;
      gap: 6px;
      align-items: center;
    }
    
    .stats-layout {
      max-width: 900px;
      margin: 40px auto 80px;
      padding: 0 20px;
      display: grid;
      grid-template-columns: 1.8fr 1.2fr;
      gap: 32px;
    }
    .section-title {
      font-family: 'Bebas Neue', sans-serif;
      font-size: 24px;
      letter-spacing: 1.5px;
      border-bottom: 1px solid rgba(255,255,255,0.08);
      padding-bottom: 8px;
      margin-bottom: 20px;
      color: #fff;
    }
    
    .stat-bar-container {
      background: rgba(255,255,255,0.03);
      border: 1px solid rgba(255,255,255,0.05);
      border-radius: 12px;
      padding: 24px;
      margin-bottom: 32px;
    }
    .stat-row {
      margin-bottom: 18px;
    }
    .stat-row:last-child {
      margin-bottom: 0;
    }
    .stat-numbers {
      display: flex;
      justify-content: space-between;
      font-size: 12px;
      font-weight: 700;
      color: rgba(255,255,255,0.6);
      margin-bottom: 6px;
    }
    .progress-track {
      height: 8px;
      background: rgba(255,255,255,0.08);
      border-radius: 4px;
      display: flex;
      overflow: hidden;
    }
    .progress-fill-home {
      background: var(--g);
      height: 100%;
    }
    .progress-fill-away {
      background: var(--b);
      height: 100%;
    }
    .stat-label-center {
      text-align: center;
      font-size: 11px;
      text-transform: uppercase;
      font-weight: 700;
      color: rgba(255,255,255,0.4);
      letter-spacing: 1px;
      margin-top: -16px;
      margin-bottom: 16px;
    }
    
    .timeline-container {
      background: rgba(255,255,255,0.02);
      border: 1px solid rgba(255,255,255,0.05);
      border-radius: 8px;
      padding: 16px;
      margin-bottom: 32px;
    }
    .timeline-event {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 8px 0;
      border-bottom: 1px solid rgba(255,255,255,0.03);
      font-size: 13px;
    }
    .timeline-event:last-child {
      border-bottom: none;
    }
    .timeline-time {
      font-family: 'Bebas Neue', sans-serif;
      font-size: 15px;
      color: var(--g);
      width: 32px;
    }
    
    .meeting-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 12px 16px;
      background: rgba(255,255,255,0.03);
      border-radius: 8px;
      margin-bottom: 10px;
      font-size: 12px;
      border: 1px solid rgba(255,255,255,0.05);
    }
    
    .predict-sec {
      background: linear-gradient(135deg, rgba(60,172,59,0.07) 0%, rgba(42,57,141,0.07) 100%);
      border: 1px solid rgba(60,172,59,0.2);
      border-radius: 12px;
      padding: 24px;
      text-align: center;
      margin-bottom: 40px;
    }
    .predict-cta-btn {
      display: inline-block;
      background: var(--g);
      color: #fff;
      font-family: 'Bebas Neue', sans-serif;
      font-size: 18px;
      padding: 10px 24px;
      border-radius: 8px;
      text-decoration: none;
      letter-spacing: 1px;
      margin-top: 14px;
      transition: background-color 0.2s;
    }
    .predict-cta-btn:hover {
      background: #349433;
    }
    
    @keyframes pulse-glow {
      0%, 100% { opacity: 1; transform: scale(1); }
      50% { opacity: 0.6; transform: scale(0.96); }
    }
    @media(max-width: 768px) {
      .stats-layout {
        grid-template-columns: 1fr;
      }
    }
    .wc-footer{background:#050505;border-top:1px solid rgba(255,255,255,0.05);padding:28px 24px;text-align:center;}
    .footer-logo{font-family:'Bebas Neue',sans-serif;font-size:20px;color:rgba(255,255,255,0.2);letter-spacing:3px;margin-bottom:8px;}
    .footer-text{font-size:11px;color:rgba(255,255,255,0.2);line-height:1.6;}
    .footer-credit {
      font-size: 16px;
      color: rgba(255,255,255,0.5);  
      margin-top: 16px;
      letter-spacing: 0.5px;
      font-weight: 600;
    }
    .footer-stripe {
      display: flex;
      justify-content: center;
      gap: 6px;
      margin: 10px 0;
    }
    @media(hover:hover) and (pointer:fine){
      .wc-page, .predict-page, .alerts-page{cursor:url("${cursorUrl}") 16 16,auto!important;}
      .wc-page a,.wc-page button,.wc-page select, .predict-page a, .predict-page button, .predict-page select, .alerts-page a, .alerts-page button, .alerts-page select{cursor:url("${cursorUrl}") 16 16,pointer!important;}
      .wc-page input,.wc-page textarea, .predict-page input, .predict-page textarea, .alerts-page input, .alerts-page textarea{cursor:text!important;}
    }
  `;

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: css }} />
      <div className="wc-page">
        <div className="top-stripe" />

        {/* Dynamic Match Header */}
        <section className="stats-header">
          <div style={{ maxWidth: 1000, margin: '0 auto' }}>
            <a href="/schedule" className="back-link">
              <ChevronLeft size={16} />
              <span>← All Matches</span>
            </a>

            <div className="teams-vs-row">
              
              {/* Home Visualizer */}
              <div className="team-visual">
                <div className="flag-circle">
                  {getFlag(staticMatch.homeTeam) ? (
                    <img src={getFlag(staticMatch.homeTeam)} alt={home} className="flag-img" />
                  ) : (
                    <span style={{ fontSize: 20, fontWeight: 700 }}>{home.slice(0,3).toUpperCase()}</span>
                  )}
                </div>
                <h2 className="team-title">{home}</h2>
              </div>

              {/* Center Box */}
              <div className="vs-box">
                <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 8 }}>
                  Match #{staticMatch.id} · Group {staticMatch.group}
                </div>
                {isStarted && score ? (
                  <div className="score-txt">{score}</div>
                ) : (
                  <div className="score-txt" style={{ fontSize: 32, color: 'rgba(255,255,255,0.3)', letterSpacing: 4 }}>VS</div>
                )}

                {isLive ? (
                  <div className="live-indicator">LIVE</div>
                ) : isFinished ? (
                  <div style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.4)', background: 'rgba(255,255,255,0.06)', padding: '3px 8px', borderRadius: 4, marginTop: 10, letterSpacing: 1 }}>FT</div>
                ) : (
                  <div style={{ fontSize: 11, color: 'var(--g)', fontWeight: 700, marginTop: 10, letterSpacing: 1 }}>{formattedTime}</div>
                )}
              </div>

              {/* Away Visualizer */}
              <div className="team-visual">
                <div className="flag-circle">
                  {getFlag(staticMatch.awayTeam) ? (
                    <img src={getFlag(staticMatch.awayTeam)} alt={away} className="flag-img" />
                  ) : (
                    <span style={{ fontSize: 20, fontWeight: 700 }}>{away.slice(0,3).toUpperCase()}</span>
                  )}
                </div>
                <h2 className="team-title">{away}</h2>
              </div>

            </div>

            {/* Stadium / Venue / Timestamps footer */}
            <div className="venue-details">
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <MapPin size={14} style={{ color: 'var(--g)' }} />
                <span>{staticMatch.venue}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <Calendar size={14} style={{ color: 'rgba(255,255,255,0.3)' }} />
                <span>{formattedDate} @ {formattedTime}</span>
              </div>
            </div>

          </div>
        </section>

        {/* Dynamic Match Stats Layout */}
        <section className="stats-layout">
          
          {/* Left Column — Stats & Events */}
          <div>
            <h3 className="section-title">Match Statistics</h3>
            
            {hasStats && stats ? (
              <div className="stat-bar-container">
                
                {/* Possession */}
                <div className="stat-row">
                  <div className="stat-numbers">
                    <span>{stats.possessionHome}%</span>
                    <span>{stats.possessionAway}%</span>
                  </div>
                  <div className="progress-track">
                    <div className="progress-fill-home" style={{ width: `${stats.possessionHome}%` }} />
                    <div className="progress-fill-away" style={{ width: `${stats.possessionAway}%` }} />
                  </div>
                  <div className="stat-label-center">Possession</div>
                </div>

                {/* Shots on Target */}
                <div className="stat-row">
                  <div className="stat-numbers">
                    <span>{stats.shotsOnTargetHome}</span>
                    <span>{stats.shotsOnTargetAway}</span>
                  </div>
                  <div className="progress-track">
                    <div className="progress-fill-home" style={{ width: `${(stats.shotsOnTargetHome / (stats.shotsOnTargetHome + stats.shotsOnTargetAway || 1)) * 100}%` }} />
                    <div className="progress-fill-away" style={{ width: `${(stats.shotsOnTargetAway / (stats.shotsOnTargetHome + stats.shotsOnTargetAway || 1)) * 100}%` }} />
                  </div>
                  <div className="stat-label-center">Shots on Target</div>
                </div>

                {/* Total Shots */}
                <div className="stat-row">
                  <div className="stat-numbers">
                    <span>{stats.totalShotsHome}</span>
                    <span>{stats.totalShotsAway}</span>
                  </div>
                  <div className="progress-track">
                    <div className="progress-fill-home" style={{ width: `${(stats.totalShotsHome / (stats.totalShotsHome + stats.totalShotsAway || 1)) * 100}%` }} />
                    <div className="progress-fill-away" style={{ width: `${(stats.totalShotsAway / (stats.totalShotsHome + stats.totalShotsAway || 1)) * 100}%` }} />
                  </div>
                  <div className="stat-label-center">Total Shots</div>
                </div>

                {/* Corners */}
                <div className="stat-row">
                  <div className="stat-numbers">
                    <span>{stats.cornersHome}</span>
                    <span>{stats.cornersAway}</span>
                  </div>
                  <div className="progress-track">
                    <div className="progress-fill-home" style={{ width: `${(stats.cornersHome / (stats.cornersHome + stats.cornersAway || 1)) * 100}%` }} />
                    <div className="progress-fill-away" style={{ width: `${(stats.cornersAway / (stats.cornersHome + stats.cornersAway || 1)) * 100}%` }} />
                  </div>
                  <div className="stat-label-center">Corners</div>
                </div>

                {/* Fouls */}
                <div className="stat-row">
                  <div className="stat-numbers">
                    <span>{stats.foulsHome}</span>
                    <span>{stats.foulsAway}</span>
                  </div>
                  <div className="progress-track">
                    <div className="progress-fill-home" style={{ width: `${(stats.foulsHome / (stats.foulsHome + stats.foulsAway || 1)) * 100}%` }} />
                    <div className="progress-fill-away" style={{ width: `${(stats.foulsAway / (stats.foulsHome + stats.foulsAway || 1)) * 100}%` }} />
                  </div>
                  <div className="stat-label-center">Fouls</div>
                </div>

                {/* Yellow Cards */}
                <div className="stat-row">
                  <div className="stat-numbers">
                    <span>{stats.yellowCardsHome}</span>
                    <span>{stats.yellowCardsAway}</span>
                  </div>
                  <div className="progress-track">
                    <div className="progress-fill-home" style={{ width: `${(stats.yellowCardsHome / (stats.yellowCardsHome + stats.yellowCardsAway || 1)) * 100}%` }} />
                    <div className="progress-fill-away" style={{ width: `${(stats.yellowCardsAway / (stats.yellowCardsHome + stats.yellowCardsAway || 1)) * 100}%` }} />
                  </div>
                  <div className="stat-label-center">Yellow Cards</div>
                </div>

                {/* Red Cards */}
                <div className="stat-row">
                  <div className="stat-numbers">
                    <span>{stats.redCardsHome}</span>
                    <span>{stats.redCardsAway}</span>
                  </div>
                  <div className="progress-track">
                    <div className="progress-fill-home" style={{ width: `${(stats.redCardsHome / (stats.redCardsHome + stats.redCardsAway || 1)) * 100}%` }} />
                    <div className="progress-fill-away" style={{ width: `${(stats.redCardsAway / (stats.redCardsHome + stats.redCardsAway || 1)) * 100}%` }} />
                  </div>
                  <div className="stat-label-center">Red Cards</div>
                </div>

              </div>
            ) : (
              <div style={{
                background:'rgba(255,255,255,0.03)',
                border:'1px solid rgba(255,255,255,0.07)',
                borderRadius:8, padding:'24px',
                textAlign:'center' as const,
                marginBottom: 32
              }}>
                <div style={{fontSize:24, marginBottom:10}}>📊</div>
                <div style={{
                  fontSize:13, fontWeight:600,
                  color:'#fff', marginBottom:6
                }}>
                  Detailed Stats Not Available
                </div>
                <div style={{
                  fontSize:12, 
                  color:'rgba(255,255,255,0.35)',
                  lineHeight:1.6
                }}>
                  Possession, shots, corners and lineups 
                  require a premium data plan. Final scores 
                  and goal scorers are shown below.
                </div>
                {staticMatch.status === 'finished' && (
                  <div style={{
                    marginTop:14, fontSize:11,
                    color:'rgba(255,255,255,0.2)'
                  }}>
                    Final Score: {staticMatch.homeTeam}{' '}
                    <span style={{color:'#fff', fontWeight:700}}>
                      {staticMatch.homeScore} - {staticMatch.awayScore}
                    </span>
                    {' '}{staticMatch.awayTeam}
                  </div>
                )}
              </div>
            )}

            {/* Goal Scorers Section */}
            {isFinished && (
              <div style={{ marginBottom: 32 }}>
                <h2 style={{
                  fontFamily:"'Bebas Neue',sans-serif",
                  fontSize:28, color:'#fff',
                  letterSpacing:2, marginBottom:16
                }}>
                  Goal Scorers
                </h2>
                
                {goals.length > 0 ? (
                  <div style={{
                    background:'#111',
                    border:'1px solid rgba(255,255,255,0.07)',
                    borderRadius:8, overflow:'hidden'
                  }}>
                    {goals.map((goal: any, i: number) => (
                      <div key={i} style={{
                        display:'flex', alignItems:'center',
                        gap:12, padding:'12px 16px',
                        borderBottom: i < goals.length - 1 
                          ? '1px solid rgba(255,255,255,0.05)' 
                          : 'none'
                      }}>
                        <span style={{
                          fontFamily:"'Bebas Neue',sans-serif",
                          fontSize:16, color:'#3CAC3B',
                          minWidth:44, textAlign:'right' as const
                        }}>
                          {goal.minute}'
                          {goal.injuryTime 
                            ? `+${goal.injuryTime}` : ''}
                        </span>
                        <span style={{fontSize:20}}>
                          {goal.type === 'OWN_GOAL' ? '🔴' : '⚽'}
                        </span>
                        <div style={{flex:1}}>
                          <div style={{
                            fontSize:13, fontWeight:700,
                            color:'#fff'
                          }}>
                            {goal.scorer?.name || 'Unknown'}
                          </div>
                          <div style={{
                            fontSize:11,
                            color:'rgba(255,255,255,0.4)',
                            marginTop:2,
                            display:'flex', gap:8
                          }}>
                            <span style={{color:'rgba(255,255,255,0.5)'}}>
                              {goal.team?.name || ''}
                            </span>
                            {goal.type === 'OWN_GOAL' && (
                              <span style={{color:'#E61D25'}}>
                                Own Goal
                              </span>
                            )}
                            {goal.type === 'PENALTY' && (
                              <span style={{
                                color:'rgba(255,255,255,0.35)'
                              }}>
                                Penalty
                              </span>
                            )}
                            {goal.assist?.name && (
                              <span style={{
                                color:'rgba(255,255,255,0.35)'
                              }}>
                                Assist: {goal.assist.name}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div style={{
                    background:'rgba(255,255,255,0.03)',
                    border:'1px solid rgba(255,255,255,0.07)',
                    borderRadius:8, padding:'24px',
                    textAlign:'center' as const,
                    fontSize:12,
                    color:'rgba(255,255,255,0.35)'
                  }}>
                    {mergedMatch.homeScore === 0 && 
                     mergedMatch.awayScore === 0
                      ? '0 - 0 · No goals scored'
                      : 'Goal scorer details not available from API'
                    }
                  </div>
                )}
              </div>
            )}

          </div>

          {/* Right Column — H2H & Predictions */}
          <div>
            
            {/* Predictions Card Widget */}
            <div className="predict-sec">
              <h3 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 22, margin: '0 0 10px', letterSpacing: 1 }}>
                🎯 Predictor Game
              </h3>
              
              {userPrediction ? (
                <div>
                  <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', margin: '0 0 12px' }}>Your match prediction:</p>
                  <div style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.05)', padding: 12, borderRadius: 8, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 12, margin: '0 auto 12px', maxWidth: 160 }}>
                    <span style={{ fontSize: 14, fontWeight: 700 }}>{home.slice(0,3).toUpperCase()}</span>
                    <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 22, color: 'var(--g)', letterSpacing: 1 }}>{userPrediction.predicted_home} - {userPrediction.predicted_away}</span>
                    <span style={{ fontSize: 14, fontWeight: 700 }}>{away.slice(0,3).toUpperCase()}</span>
                  </div>

                  {isFinished && userPrediction.is_scored ? (
                    <div style={{ fontSize: 11, fontWeight: 700, color: userPrediction.points_earned > 0 ? 'var(--g)' : 'var(--r)', textTransform: 'uppercase', letterSpacing: 0.5 }}>
                      Earned: {formatPoints(userPrediction.points_earned)}
                    </div>
                  ) : isFinished ? (
                    <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>Evaluating prediction score...</div>
                  ) : (
                    <div style={{ fontSize: 11, color: 'var(--g)', fontWeight: 600 }}>Prediction saved & locked!</div>
                  )}
                </div>
              ) : (
                <div>
                  <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', margin: '0 0 10px', lineHeight: 1.6 }}>
                    Join other fans! Cast your prediction score before kickoff.
                  </p>
                  <a href="/predict" className="predict-cta-btn">Make prediction →</a>
                </div>
              )}
            </div>

            {/* Head to Head Meetings */}
            <h3 className="section-title">Head to Head</h3>
            <div style={{ marginBottom: 40 }}>
              <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: 1, margin: '0 0 12px' }}>
                Previous World Cup Meetings
              </p>
              {meetings.length === 0 ? (
                <div style={{
                  textAlign:'center' as const,
                  padding:'32px 16px'
                }}>
                  <div style={{fontSize:28, marginBottom:10}}>🤝</div>
                  <div style={{fontSize:13, fontWeight:600, color:'#fff', marginBottom:6}}>
                    No Previous World Cup Meetings
                  </div>
                  <div style={{fontSize:12, color:'rgba(255,255,255,0.35)', lineHeight:1.6}}>
                    These teams have not faced each other in 
                    a previous FIFA World Cup match.
                  </div>
                </div>
              ) : (
                meetings.map((meeting: any) => (
                  <div key={meeting.utcDate} style={{
                    display:'grid',
                    gridTemplateColumns:'1fr auto 1fr',
                    alignItems:'center',
                    gap:12, padding:'12px 0',
                    borderBottom:'1px solid rgba(255,255,255,0.05)'
                  }}>
                    <div style={{
                      fontSize:13, fontWeight:700,
                      color: meeting.score.winner==='HOME_TEAM'
                        ?'#3CAC3B':'#fff'
                    }}>
                      {meeting.homeTeam.name}
                    </div>
                    <div style={{
                      fontFamily:"'Bebas Neue',sans-serif",
                      fontSize:20, color:'#fff', letterSpacing:3,
                      textAlign:'center'
                    }}>
                      {meeting.score.fullTime.home} - 
                      {meeting.score.fullTime.away}
                    </div>
                    <div style={{
                      fontSize:13, fontWeight:700,
                      color: meeting.score.winner==='AWAY_TEAM'
                        ?'#3CAC3B':'#fff',
                      textAlign:'right'
                    }}>
                      {meeting.awayTeam.name}
                    </div>
                    <div style={{
                      gridColumn:'1/-1',
                      fontSize:10,
                      color:'rgba(255,255,255,0.3)',
                      textAlign:'center'
                    }}>
                      {new Date(meeting.utcDate)
                        .toLocaleDateString('en-IN',{
                          year:'numeric',month:'short',day:'numeric'
                        })} · {meeting.competition.name}
                    </div>
                  </div>
                ))
              )}
            </div>

          </div>

        </section>

        {isFinished && (
          <div style={{ maxWidth: 900, margin: '0 auto 40px', padding: '0 20px' }}>
            <MatchRating matchId={staticMatch.id} isFinished={isFinished} />
          </div>
        )}

        {/* Footer */}
        <footer className="wc-footer">
          <div className="footer-logo">WC 2026</div>
          <div className="footer-stripe">
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--g)' }} />
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--b)' }} />
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--r)' }} />
          </div>
          <div className="footer-text">Fan creation · Not affiliated with FIFA</div>
          <div style={{marginTop:8}}>
            <a href="/legal" style={{
              fontSize:11,
              color:'rgba(255,255,255,0.2)',
              textDecoration:'none',
              letterSpacing:0.5,
              transition:'color 0.15s'
            }}
            onMouseEnter={e => 
              (e.target as HTMLAnchorElement)
                .style.color='rgba(255,255,255,0.5)'}
            onMouseLeave={e => 
              (e.target as HTMLAnchorElement)
                .style.color='rgba(255,255,255,0.2)'}>
              Privacy Policy · Terms of Use · Disclaimer
            </a>
            <div style={{
              fontSize: 10,
              color: 'rgba(255,255,255,0.2)',
              marginTop: 6
            }}>
              Contact: ishaannnn24@gmail.com
            </div>
          </div>
          <div className="footer-credit">Made with ❤️ by Ishan</div>
        </footer>
      </div>
    </>
  );
}
