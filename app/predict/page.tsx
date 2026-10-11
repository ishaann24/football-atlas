'use client';

import React, { useState, useEffect, useMemo } from 'react';
import rawMatches from '@/data/matches.json';
import { calculatePoints } from '@/lib/scoring';
import { Globe, Save, CheckCircle2, AlertCircle, Award, Trophy, User } from 'lucide-react';

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

interface UserProfile {
  id: string;
  username: string;
  display_name: string;
  favourite_team: string | null;
  total_points: number;
  total_predictions: number;
  exact_scores: number;
}

const TEAM_CODES: Record<string, string> = {
  'Mexico': 'mx',
  'South Africa': 'za',
  'South Korea': 'kr',
  'Czechia': 'cz',
  'Canada': 'ca',
  'Bosnia-Herzegovina': 'ba',
  'United States': 'us',
  'USA': 'us',
  'Germany': 'de',
  'Argentina': 'ar',
  'Algeria': 'dz',
  'Brazil': 'br',
  'France': 'fr',
  'Spain': 'es',
  'England': 'gb-eng',
  'Scotland': 'gb-sct',
  'Wales': 'gb-wls',
  'Portugal': 'pt',
  'Morocco': 'ma',
  'Japan': 'jp',
  'Netherlands': 'nl',
  'Belgium': 'be',
  'Croatia': 'hr',
  'Switzerland': 'ch',
  'Uruguay': 'uy',
  'Ecuador': 'ec',
  'Colombia': 'co',
  'Chile': 'cl',
  'Peru': 'pe',
  'Paraguay': 'py',
  'Venezuela': 've',
  'Bolivia': 'bo',
  'Panama': 'pa',
  'Costa Rica': 'cr',
  'Honduras': 'hn',
  'Jamaica': 'jm',
  'Cuba': 'cu',
  'Trinidad and Tobago': 'tt',
  'Cameroon': 'cm',
  'Nigeria': 'ng',
  'Senegal': 'sn',
  'Ghana': 'gh',
  'Ivory Coast': 'ci',
  'Mali': 'ml',
  'Guinea': 'gn',
  'Egypt': 'eg',
  'Tunisia': 'tn',
  'DR Congo': 'cd',
  'Congo DR': 'cd',
  'Tanzania': 'tz',
  'Benin': 'bj',
  'Comoros': 'km',
  'Saudi Arabia': 'sa',
  'Iran': 'ir',
  'Iraq': 'iq',
  'Qatar': 'qa',
  'Jordan': 'jo',
  'Uzbekistan': 'uz',
  'Australia': 'au',
  'New Zealand': 'nz',
  'Indonesia': 'id',
  'Serbia': 'rs',
  'Poland': 'pl',
  'Slovakia': 'sk',
  'Slovenia': 'si',
  'Denmark': 'dk',
  'Sweden': 'se',
  'Norway': 'no',
  'Finland': 'fi',
  'Austria': 'at',
  'Romania': 'ro',
  'Hungary': 'hu',
  'Greece': 'gr',
  'Turkey': 'tr',
  'Ukraine': 'ua',
  'Albania': 'al',
  'Georgia': 'ge',
  'Iceland': 'is',
  'Lithuania': 'lt',
  'Estonia': 'ee',
  'Cabo Verde': 'cv',
  'Cape Verde': 'cv',
  'Cape Verde Islands': 'cv',
  'Haiti': 'ht',
  'Bahrain': 'bh',
  'Israel': 'il',
  'China': 'cn',
  'Curaçao': 'cw',
  'Curacao': 'cw',
  "Côte d'Ivoire": 'ci',
  'Korea Republic': 'kr',
  'Bosnia and Herzegovina': 'ba',
};

// Filter unique teams for dropdowns
const uniqueTeamsList = (() => {
  const s = new Set<string>();
  rawMatches.forEach((m) => {
    const skip = (t: string) => t && (t.includes('Winner') || t.includes('Runner') || t.includes('Loser') || t === 'TBD');
    if (m.homeTeam && !skip(m.homeTeam)) s.add(m.homeTeam);
    if (m.awayTeam && !skip(m.awayTeam)) s.add(m.awayTeam);
  });
  return Array.from(s).sort();
})();

export default function PredictorPage() {
  const footballSVG = '<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32"><circle cx="16" cy="16" r="15" fill="white" stroke="%23222" stroke-width="1.5"/><polygon points="16,4 20,10 16,14 12,10" fill="%23111"/><polygon points="26,11 28,17 23,19 21,13" fill="%23111"/><polygon points="24,24 19,27 16,22 20,18" fill="%23111"/><polygon points="8,24 6,18 11,16 13,22" fill="%23111"/><polygon points="6,11 11,8 13,14 8,16" fill="%23111"/></svg>';
  const cursorUrl = `data:image/svg+xml,${footballSVG}`;

  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [showAuth, setShowAuth] = useState(false);

  // Load User on mount
  useEffect(() => {
    const token = localStorage.getItem('wc26_token');
    const savedUser = localStorage.getItem('wc26_user');
    if (token && savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        setUser(parsedUser);

        // Verify session is still valid
        fetch(`/api/user?token=${token}`)
          .then(r => r.json())
          .then(data => {
            if (data.user) {
              setUser(data.user);
              localStorage.setItem('wc26_user', JSON.stringify(data.user));
            } else {
              // Session expired
              localStorage.removeItem('wc26_token');
              localStorage.removeItem('wc26_user');
              setUser(null);
            }
          })
          .catch(() => {});
      } catch (e) {
        console.error('Failed to parse cached user:', e);
      }
    }
    setLoading(false);
  }, []);

  const logout = () => {
    localStorage.removeItem('wc26_token');
    localStorage.removeItem('wc26_user');
    setUser(null);
  };

  if (loading) {
    return (
      <div style={{ background: '#080808', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontFamily: 'Inter, sans-serif' }}>
        Loading Predictor Game...
      </div>
    );
  }

  const css = `
    @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Inter:wght@400;500;600;700&display=swap');
    :root { --g:#3CAC3B; --b:#2A398D; --r:#E61D25; --gr:#474A4A; }
    *{box-sizing:border-box;} body{margin:0;background:#080808;}
    
    /* Predict page specific */
    .predict-page {
      min-height: 100vh;
      background: #080808;
      font-family: 'Inter', sans-serif;
      color: #fff;
    }

    /* Top branding stripe */
    .top-stripe {
      height: 4px;
      background: linear-gradient(90deg, var(--g) 33%, var(--b) 33% 66%, var(--r) 66%);
      position: sticky;
      top: 0;
      z-index: 100;
    }

    /* Navigation Bar */
    .wc-nav {
      position: sticky;
      top: 4px;
      z-index: 99;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 12px 24px;
      background: rgba(8,8,8,0.92);
      backdrop-filter: blur(12px);
      border-bottom: 1px solid rgba(255,255,255,0.05);
    }
    .wc-logo {
      font-family: 'Bebas Neue', sans-serif;
      font-size: 22px;
      color: #fff;
      letter-spacing: 3px;
    }
    .wc-logo span {
      color: var(--g);
    }
    .nav-pills {
      display: flex;
      gap: 6px;
      flex-wrap: wrap;
    }
    .np {
      font-size: 10px;
      font-weight: 700;
      padding: 5px 12px;
      border-radius: 3px;
      border: none;
      cursor: pointer;
      letter-spacing: 1px;
      font-family: 'Inter', sans-serif;
      text-transform: uppercase;
    }
    .np-g { background: var(--g); color: #fff; }
    .np-b { background: var(--b); color: #fff; }
    .np-r { background: var(--r); color: #fff; }

    /* Hero with stadium background */
    .predict-hero {
      position: relative;
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      overflow: hidden;
    }

    .predict-stadium-bg {
      position: absolute;
      inset: 0;
      background-image: url('/images/stadium-hero.jpg');
      background-size: cover;
      background-position: center top;
      opacity: 0.35;
    }

    .predict-stadium-overlay {
      position: absolute;
      inset: 0;
      background: linear-gradient(
        to bottom,
        rgba(8,8,8,0.5) 0%,
        rgba(8,8,8,0.7) 60%,
        rgba(8,8,8,1) 100%
      );
    }

    /* Match prediction card */
    .predict-card {
      position: relative;
      z-index: 2;
      background: rgba(17,17,17,0.85);
      backdrop-filter: blur(12px);
      border: 1px solid rgba(255,255,255,0.1);
      border-radius: 16px;
      padding: 32px;
      width: 100%;
      max-width: 520px;
      margin: 0 auto;
    }

    /* Score input buttons */
    .score-input-wrap {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 4px;
    }

    .score-btn {
      background: rgba(255,255,255,0.06);
      border: none;
      color: rgba(255,255,255,0.5);
      width: 32px;
      height: 22px;
      border-radius: 4px;
      cursor: pointer;
      font-size: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.1s;
    }
    .score-btn:hover {
      background: rgba(60,172,59,0.2);
      color: #3CAC3B;
    }

    .score-display {
      font-family: 'Bebas Neue', sans-serif;
      font-size: 64px;
      color: #fff;
      line-height: 1;
      min-width: 72px;
      text-align: center;
      background: rgba(255,255,255,0.05);
      border: 2px solid rgba(255,255,255,0.1);
      border-radius: 10px;
      padding: 8px 16px;
      transition: border-color 0.2s;
    }
    .score-display:focus-within {
      border-color: #3CAC3B;
    }

    /* Popular predictions */
    .pop-pred-item {
      background: rgba(255,255,255,0.04);
      border: 1px solid rgba(255,255,255,0.07);
      border-radius: 8px;
      padding: 10px 12px;
      text-align: center;
      cursor: pointer;
      transition: all 0.15s;
    }
    .pop-pred-item:hover {
      border-color: rgba(60,172,59,0.4);
      background: rgba(60,172,59,0.05);
    }

    /* Auth modal */
    .auth-modal-overlay {
      position: fixed;
      inset: 0;
      background: rgba(0,0,0,0.8);
      backdrop-filter: blur(4px);
      z-index: 1000;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20px;
    }

    .auth-modal {
      background: #111;
      border: 1px solid rgba(255,255,255,0.1);
      border-radius: 14px;
      padding: 32px;
      width: 100%;
      max-width: 400px;
      position: relative;
    }

    /* Results section */
    .result-card {
      background: #111;
      border-radius: 8px;
      padding: 14px 16px;
      display: grid;
      grid-template-columns: 1fr auto auto;
      align-items: center;
      gap: 12px;
    }

    .wc-footer {
      background: #050505;
      border-top: 1px solid rgba(255,255,255,0.05);
      padding: 28px 24px;
      text-align: center;
    }
    .footer-logo {
      font-family: 'Bebas Neue', sans-serif;
      font-size: 20px;
      color: rgba(255,255,255,0.2);
      letter-spacing: 3px;
      margin-bottom: 8px;
    }
    .footer-text {
      font-size: 11px;
      color: rgba(255,255,255,0.2);
      line-height: 1.6;
    }
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

    @keyframes pdot {
      0%, 100% { opacity: 1; transform: scale(1); }
      50% { opacity: 0.35; transform: scale(0.65); }
    }

    /* Mobile-friendly responsive styles */
    .predict-grid {
      display: grid;
      grid-template-columns: 1fr auto auto auto 1fr;
      align-items: center;
      gap: 12px;
      margin-bottom: 24px;
    }
    
    .predict-flag {
      width: 72px;
      height: 72px;
      border-radius: 50%;
      overflow: hidden;
      border: 2px solid rgba(255,255,255,0.1);
      background: #1a1a1a;
      margin: 0 auto 10px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    
    .predict-team-name {
      font-family: 'Bebas Neue', sans-serif;
      font-size: 16px;
      color: #fff;
      letter-spacing: 2px;
    }
    
    .nav-dots-container {
      display: flex;
      justify-content: center;
      gap: 6px;
      margin-bottom: 20px;
    }
    
    .nav-dot {
      height: 6px;
      border-radius: 3px;
      cursor: pointer;
      transition: all 0.3s;
    }
    
    .submit-btn {
      width: 100%;
      padding: 14px;
      background: #3CAC3B;
      border: none;
      border-radius: 8px;
      color: #fff;
      font-size: 13px;
      font-weight: 700;
      cursor: pointer;
      letter-spacing: 2px;
      text-transform: uppercase;
      font-family: 'Inter', sans-serif;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      transition: all 0.2s;
    }
    
    .close-countdown-text {
      font-family: 'Bebas Neue', sans-serif;
      font-size: 28px;
      color: #E61D25;
      letter-spacing: 4px;
    }
    
    .all-preds-section {
      background: #080808;
      padding: 60px 24px;
    }
    
    .predict-eyebrow {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      background: rgba(60,172,59,0.1);
      border: 1px solid rgba(60,172,59,0.3);
      border-radius: 20px;
      padding: 6px 16px;
      font-size: 11px;
      font-weight: 700;
      color: #3CAC3B;
      letter-spacing: 2px;
      text-transform: uppercase;
    }
    
    .mobile-lb-teaser {
      display: none;
    }

    .np-active {
      position: relative;
    }
    .np-active::after {
      content: '';
      position: absolute;
      bottom: -4px;
      left: 50%;
      transform: translateX(-50%);
      width: 16px;
      height: 2px;
      border-radius: 1px;
      background: #fff;
    }

    .mobile-home-btn {
      display: none;
    }

    @media(max-width:1024px) {
      .predict-layout {
        grid-template-columns: 1fr 420px !important;
      }
      .predict-left-panel {
        display: none !important;
      }
    }

    @media(max-width: 768px) {
      /* FIX 1: Navigation Bar */
      .wc-nav {
        padding: 10px 12px !important;
        flex-wrap: wrap !important;
        gap: 8px !important;
      }
      
      .wc-logo {
        font-size: 20px !important;
      }
      
      .nav-pills {
        display: flex !important;
        flex-wrap: nowrap !important;
        overflow-x: auto !important;
        -webkit-overflow-scrolling: touch !important;
        scrollbar-width: none !important;
        gap: 6px !important;
        width: 100% !important;
        padding-bottom: 4px !important;
      }
      
      .nav-pills::-webkit-scrollbar {
        display: none !important;
      }
      
      .np {
        font-size: 10px !important;
        padding: 6px 10px !important;
        white-space: nowrap !important;
        flex-shrink: 0 !important;
        letter-spacing: 0.5px !important;
      }

      /* FIX 9: GLOBAL MOBILE TYPOGRAPHY + SPACING */
      body, .wc-page, .predict-page {
        overflow-x: hidden !important;
        max-width: 100vw !important;
      }
      
      section {
        padding-left: 16px !important;
        padding-right: 16px !important;
      }
      
      [style*="Bebas Neue"] {
        letter-spacing: 1px !important;
      }
      
      button {
        min-height: 44px;
      }
      
      input, select, textarea {
        font-size: 16px !important;
      }
      
      .wc-footer {
        padding: 24px 16px !important;
        gap: 8px !important;
      }
      
      .footer-text {
        font-size: 11px !important;
        text-align: center !important;
      }

      /* FIX 4: PREDICT PAGE */
      /* Main 3-column layout → single column */
      .predict-layout {
        grid-template-columns: 1fr !important;
        padding: 0 12px !important;
        gap: 16px !important;
      }
      
      /* Hide left tagline panel on mobile */
      .predict-left-panel {
        display: none !important;
      }
      
      /* Hide right leaderboard panel on mobile */
      .predict-right-panel {
        display: none !important;
      }

      .predict-hero {
        min-height: auto !important;
        padding-bottom: 32px !important;
      }
      
      /* Match card full width */
      .predict-card {
        padding: 16px 12px !important;
        border-radius: 12px !important;
      }

      .predict-grid {
        gap: 8px !important;
      }
      
      /* Score display smaller */
      .score-display {
        font-size: 48px !important;
        min-width: 56px !important;
        padding: 6px 12px !important;
      }
      
      /* Score buttons bigger tap target */
      .score-btn {
        width: 44px !important;
        height: 32px !important;
        min-height: 32px !important;
        font-size: 16px !important;
      }
      
      /* Team flags smaller */
      .predict-team-flag, .predict-flag {
        width: 52px !important;
        height: 52px !important;
      }

      .predict-team-name {
        font-size: 13px !important;
      }
      
      /* Popular predictions - show 3 not 5 */
      .popular-preds-grid {
        grid-template-columns: repeat(3, 1fr) !important;
      }
      
      .popular-preds-grid > div:nth-child(n+4) {
        display: none !important;
      }

      .nav-dots-container {
        gap: 8px !important;
      }
      .nav-dot {
        height: 8px !important;
        border-radius: 4px !important;
      }
      .submit-btn {
        padding: 16px !important;
        font-size: 14px !important;
      }
      .close-countdown-text {
        font-size: 36px !important;
      }
      .mobile-lb-teaser {
        display: block !important;
        margin-top: 16px;
      }
      
      /* Auth modal - bottom sheet */
      .auth-modal {
        position: fixed !important;
        bottom: 0 !important;
        left: 0 !important;
        right: 0 !important;
        top: auto !important;
        border-radius: 16px 16px 0 0 !important;
        max-width: 100% !important;
        max-height: 90vh !important;
        overflow-y: auto !important;
        margin: 0 !important;
      }
      
      .auth-modal-overlay {
        align-items: flex-end !important;
        padding: 0 !important;
      }

      .all-preds-section {
        padding: 60px 16px !important;
      }
      .predict-eyebrow {
        font-size: 9px !important;
        letter-spacing: 1px !important;
        padding: 5px 12px !important;
      }
    }

  `;

  return (
    <div className="predict-page">
      <style dangerouslySetInnerHTML={{ __html: css }} />
      <div className="top-stripe" />
      
      {/* Nav */}
      <nav className="wc-nav">
        <a href="/" style={{textDecoration:'none'}}>
          <div className="wc-logo" style={{
            fontFamily:"'Bebas Neue',sans-serif",
            fontSize:20, letterSpacing:3,
            color:'#fff', cursor:'pointer'
          }}>
            FOOTBALL<span style={{color:'#3CAC3B'}}>
              ATLAS
            </span>
          </div>
        </a>
        <div className="nav-pills">

          <a href="/schedule" style={{textDecoration:'none'}}>
            <button className="np np-g">📅 Schedule</button>
          </a>
          <a href="/news" style={{textDecoration:'none'}}>
            <button className="np" style={{
              background:'rgba(234,179,8,0.15)',
              color:'#EAB308',
              border:'1px solid rgba(234,179,8,0.4)'
            }}>
              🗞️ News
            </button>
          </a>
          <a href="/about" style={{textDecoration:'none'}}>
            <button className="np np-r">🌍 About &amp; Facts</button>
          </a>
          <a href="/" style={{textDecoration:'none'}}>
            <button className="np" style={{
              background:'rgba(255,255,255,0.08)',
              color:'rgba(255,255,255,0.7)',
              border:'1px solid rgba(255,255,255,0.2)'
            }}>
              ⌂ Home
            </button>
          </a>
          <a href="/alerts" style={{textDecoration:'none'}}>
            <button className="np np-b">🔔 Get Alerts</button>
          </a>
        </div>
      </nav>

      {/* HERO SECTION with stadium bg */}
      <div className="predict-hero">
        <div className="predict-stadium-bg" />
        <div className="predict-stadium-overlay" />
        
        {/* Content layer */}
        <div style={{position:'relative', zIndex:2, padding:'40px 24px', flex:1}}>
          
          {/* Top eyebrow */}
          <div style={{textAlign:'center', marginBottom:32}}>
            <div className="predict-eyebrow">
              <div style={{width:6,height:6,borderRadius:'50%',
                background:'#3CAC3B',
                animation:'pdot 1.2s infinite',
                marginRight:4}}/>
              Score Predictor · FIFA World Cup 2026
            </div>
          </div>

          {/* Left tagline + Card + Right panel layout */}
          <div className="predict-layout" style={{
            display:'grid',
            gridTemplateColumns:'1fr 520px 1fr',
            gap:24, maxWidth:1200, margin:'0 auto',
            alignItems:'start'
          }}>
            
            {/* LEFT PANEL — tagline */}
            <div className="predict-left-panel" style={{paddingTop:40}}>
              {user ? (
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  marginBottom: 16,
                  background: 'rgba(255,255,255,0.05)',
                  padding: '8px 12px',
                  borderRadius: 8,
                  width: 'fit-content'
                }}>
                  <span style={{color: '#3CAC3B', fontWeight: 600, fontSize: 13}}>👋 {user.display_name}</span>
                  <button
                    onClick={logout}
                    style={{
                      background: 'transparent',
                      border: '1px solid rgba(255,255,255,0.15)',
                      color: 'rgba(255,255,255,0.4)',
                      fontSize: 10,
                      padding: '3px 8px',
                      borderRadius: 4,
                      cursor: 'pointer',
                      fontFamily: "'Inter', sans-serif"
                    }}
                  >
                    Log Out
                  </button>
                </div>
              ) : null}

              <div style={{
                fontSize:11, fontWeight:700,
                letterSpacing:3, color:'#3CAC3B',
                textTransform:'uppercase', marginBottom:12
              }}>
                Predict. Compete. Win.
              </div>
              <div style={{
                fontFamily:"'Bebas Neue',sans-serif",
                fontSize:'clamp(32px,4vw,52px)',
                color:'#fff', lineHeight:0.95,
                letterSpacing:2, marginBottom:16
              }}>
                Your prediction<br/>
                makes you part<br/>
                <span style={{color:'#3CAC3B'}}>
                  of the game.
                </span>
              </div>
              <div style={{
                fontSize:13, color:'rgba(255,255,255,0.4)',
                lineHeight:1.7, marginBottom:28,
                maxWidth:220
              }}>
                Predict scores, earn points and 
                climb the leaderboard to become 
                the world&apos;s top predictor.
              </div>

              {/* Live predictor count from leaderboard API */}
              <PredictorCount />
            </div>

            {/* CENTER — Match Prediction Card */}
            <div>
              <MatchPredictCard
                user={user}
                onLoginRequired={() => setShowAuth(true)}
              />
              <MobileLeaderboardTeaser />
            </div>

            {/* RIGHT PANEL — Leaderboard preview */}
            <div className="predict-right-panel" style={{paddingTop:40}}>
              <LeaderboardPreview 
                currentUserId={user?.id}
              />
            </div>

          </div>
        </div>
      </div>

      {/* BELOW HERO — if logged in show all 6 predictions */}
      {user && (
        <AllPredictions user={user} />
      )}

      {/* Auth Modal */}
      {showAuth && (
        <AuthModal
          onSuccess={(u) => {
            setUser(u);
            setShowAuth(false);
          }}
          onClose={() => setShowAuth(false)}
        />
      )}

      {/* Footer */}
      <footer className="wc-footer">
        <div className="footer-logo" style={{
          fontFamily:"'Bebas Neue',sans-serif",
          fontSize:18, letterSpacing:3
        }}>
          FOOTBALL<span style={{color:'#3CAC3B'}}>
            ATLAS
          </span>
        </div>
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
  );
}

/* ==================== SUB-COMPONENTS ==================== */

function PredictorCount() {
  const [count, setCount] = useState<number|null>(null);
  
  useEffect(() => {
    fetch('/api/leaderboard')
      .then(r => r.json())
      .then(data => {
        setCount(Array.isArray(data) ? data.length : 0);
      })
      .catch(() => setCount(0));
  }, []);

  if (count === null) return null;

  return (
    <div style={{
      display:'flex', alignItems:'center', gap:10,
      background:'rgba(255,255,255,0.05)',
      border:'1px solid rgba(255,255,255,0.08)',
      borderRadius:8, padding:'10px 14px',
      width:'fit-content'
    }}>
      <span style={{fontSize:18}}>👥</span>
      <div>
        <div style={{
          fontFamily:"'Bebas Neue',sans-serif",
          fontSize:24, color:'#fff', lineHeight:1
        }}>
          {count === 0 
            ? 'Be the first!' 
            : `${count.toLocaleString()}`}
        </div>
        <div style={{
          fontSize:10, 
          color:'rgba(255,255,255,0.35)',
          letterSpacing:1
        }}>
          {count === 0 
            ? 'Start predicting now'
            : 'fans competing'}
        </div>
      </div>
    </div>
  );
}

interface MatchPredictCardProps {
  user: UserProfile | null;
  onLoginRequired: () => void;
}

function MatchPredictCard({ user, onLoginRequired }: MatchPredictCardProps) {
  const [matches, setMatches] = useState<any[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [scores, setScores] = useState({home:0, away:0});
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [popularPreds, setPopularPreds] = useState<any[]>([]);
  const [closeCountdown, setCloseCountdown] = useState('');
  const [userTz] = useState(
    typeof window !== 'undefined' ? Intl.DateTimeFormat().resolvedOptions().timeZone : 'UTC'
  );

  // Load upcoming matches
  useEffect(() => {
    const upcoming = (rawMatches as any[])
      .filter(m => new Date(m.date) > new Date())
      .sort((a,b) => 
        new Date(a.date).getTime() - 
        new Date(b.date).getTime()
      )
      .slice(0, 6);
    setMatches(upcoming);
  }, []);

  // Load user's existing prediction for current match
  useEffect(() => {
    if (!user || !matches[currentIdx]) return;
    fetch(`/api/predict?userId=${user.id}`)
      .then(r => r.json())
      .then(preds => {
        const existing = preds.find(
          (p:any) => p.match_id === matches[currentIdx].id
        );
        if (existing) {
          setScores({
            home: existing.predicted_home,
            away: existing.predicted_away
          });
          setSaved(true);
        } else {
          setScores({home:0, away:0});
          setSaved(false);
        }
      });
  }, [user, currentIdx, matches]);

  // Load popular predictions for current match
  useEffect(() => {
    if (!matches[currentIdx]) return;
    fetch(`/api/popular-predictions?matchId=${matches[currentIdx].id}`)
      .then(r => r.json())
      .then(data => setPopularPreds(
        Array.isArray(data) ? data.slice(0,5) : []
      ))
      .catch(() => setPopularPreds([]));
  }, [currentIdx, matches]);

  // Countdown to match kickoff
  useEffect(() => {
    if (!matches[currentIdx]) return;
    const tick = () => {
      const diff = new Date(matches[currentIdx].date)
        .getTime() - Date.now();
      if (diff <= 0) {
        setCloseCountdown('Prediction closed');
        return;
      }
      const h = Math.floor(diff/3600000);
      const m = Math.floor((diff%3600000)/60000);
      const s = Math.floor((diff%60000)/1000);
      const pad = (n:number) => String(n).padStart(2,'0');
      setCloseCountdown(`${pad(h)}:${pad(m)}:${pad(s)}`);
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [currentIdx, matches]);

  const match = matches[currentIdx];
  if (!match) return (
    <div className="predict-card" style={{textAlign:'center', 
      padding:'40px 32px'}}>
      <div style={{fontSize:48,marginBottom:16}}>
        🏆
      </div>
      <div style={{
        fontFamily:"'Bebas Neue',sans-serif",
        fontSize:32, color:'#FFD700',
        letterSpacing:2, marginBottom:8
      }}>
        Spain Win the World Cup!
      </div>
      <div style={{fontSize:14,
        color:'rgba(255,255,255,0.5)',
        marginBottom:8}}>
        Final: Spain 1-0 Argentina (AET)
      </div>
      <div style={{fontSize:12,
        color:'rgba(255,255,255,0.35)'}}>
        Ferran Torres 106&apos; · MetLife Stadium · 
        July 19, 2026
      </div>
      <div style={{marginTop:24}}>
        <a href="/leaderboard" style={{
          display:'inline-block',
          background:'#FFD700', color:'#000',
          padding:'12px 28px', borderRadius:6,
          fontSize:12, fontWeight:700,
          textDecoration:'none',
          letterSpacing:1.5,
          textTransform:'uppercase' as const
        }}>
          🏅 See Final Leaderboard →
        </a>
      </div>
    </div>
  );

  const handleSubmit = async () => {
    if (!user) { onLoginRequired(); return; }
    
    // Safety check for start time
    if (new Date(match.date) < new Date()) {
      alert('Cannot predict a match that has already started.');
      return;
    }

    setSaving(true);
    try {
      const res = await fetch('/api/predict', {
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body: JSON.stringify({
          userId: user.id,
          matchId: match.id,
          homeTeam: match.homeTeam,
          awayTeam: match.awayTeam,
          predictedHome: scores.home,
          predictedAway: scores.away
        })
      });
      if (res.ok) {
        setSaved(true);
        // Auto advance to next unpredicted match after 1.5s
        setTimeout(() => {
          const next = matches.findIndex(
            (m:any, i:number) => i > currentIdx
          );
          if (next !== -1) setCurrentIdx(next);
        }, 1500);
      } else {
        const errorData = await res.json();
        alert(`Error: ${errorData.error}`);
      }
    } catch {
      alert('Failed to save prediction.');
    }
    setSaving(false);
  };

  const localTime = new Date(match.date)
    .toLocaleString('en-IN', {
      weekday:'short', month:'short', day:'numeric',
      hour:'2-digit', minute:'2-digit',
      timeZone: userTz, hour12:true
    });

  return (
    <div>
      {/* Upcoming match label */}
      <div style={{textAlign:'center',marginBottom:12}}>
        <div style={{
          display:'inline-flex',alignItems:'center',
          gap:6,fontSize:11,fontWeight:700,
          color:'#3CAC3B',letterSpacing:2,
          textTransform:'uppercase'
        }}>
          <span>🛡️</span> Upcoming Match
        </div>
        <div style={{
          fontSize:13,color:'rgba(255,255,255,0.6)',
          marginTop:4
        }}>
          {localTime}
        </div>
        <div style={{
          fontSize:11,color:'rgba(255,255,255,0.35)',
          marginTop:2
        }}>
          {match.venue || match.city}
        </div>
      </div>

      <div className="predict-card">
        {/* Match navigation dots */}
        <div className="nav-dots-container">
          {matches.map((_:any,i:number) => (
            <div key={i}
              onClick={() => setCurrentIdx(i)}
              className="nav-dot"
              style={{
                width: i===currentIdx ? 20 : 6,
                background: i===currentIdx 
                  ? '#3CAC3B' : 'rgba(255,255,255,0.2)',
              }}
            />
          ))}
        </div>

        {/* Teams + Score inputs */}
        <div className="predict-grid">
          {/* Home team */}
          <div style={{textAlign:'center'}}>
            <div className="predict-flag predict-team-flag">
              <img
                src={`https://flagcdn.com/64x48/${
                  TEAM_CODES[match.homeTeam]||'un'
                }.png`}
                alt={match.homeTeam || 'TBD'}
                style={{width:'100%',height:'100%', objectFit:'cover'}}
                onError={e => {
                  (e.target as HTMLImageElement).src='';
                }}
              />
            </div>
            <div className="predict-team-name">
              {match.homeTeam || 'TBD'}
            </div>
          </div>

          {/* Home score */}
          <div className="score-input-wrap">
            <button className="score-btn"
              onClick={() => {
                setSaved(false);
                setScores(p => ({
                  ...p, home: Math.min(20, p.home+1)
                }));
              }}>▲</button>
            <div className="score-display">
              {scores.home}
            </div>
            <button className="score-btn"
              onClick={() => {
                setSaved(false);
                setScores(p => ({
                  ...p, home: Math.max(0, p.home-1)
                }));
              }}>▼</button>
          </div>

          {/* Dash */}
          <div style={{
            fontFamily:"'Bebas Neue',sans-serif",
            fontSize:32,color:'rgba(255,255,255,0.2)',
            lineHeight:1
          }}>—</div>

          {/* Away score */}
          <div className="score-input-wrap">
            <button className="score-btn"
              onClick={() => {
                setSaved(false);
                setScores(p => ({
                  ...p, away: Math.min(20, p.away+1)
                }));
              }}>▲</button>
            <div className="score-display">
              {scores.away}
            </div>
            <button className="score-btn"
              onClick={() => {
                setSaved(false);
                setScores(p => ({
                  ...p, away: Math.max(0, p.away-1)
                }));
              }}>▼</button>
          </div>

          {/* Away team */}
          <div style={{textAlign:'center'}}>
            <div className="predict-flag predict-team-flag">
              <img
                src={`https://flagcdn.com/64x48/${
                  TEAM_CODES[match.awayTeam]||'un'
                }.png`}
                alt={match.awayTeam || 'TBD'}
                style={{width:'100%',height:'100%', objectFit:'cover'}}
                onError={e => {
                  (e.target as HTMLImageElement).src='';
                }}
              />
            </div>
            <div className="predict-team-name">
              {match.awayTeam || 'TBD'}
            </div>
          </div>
        </div>

        {/* Predict the score label */}
        <div style={{textAlign:'center',
          fontSize:10,fontWeight:700,
          color:'rgba(255,255,255,0.3)',
          letterSpacing:3,textTransform:'uppercase',
          marginBottom:16}}>
          Predict The Score
        </div>

        {/* Submit button */}
        <button
          onClick={handleSubmit}
          disabled={saving}
          className="submit-btn"
          style={{
            opacity: saving ? 0.7 : 1
          }}>
          {saving ? 'Saving...' 
            : saved ? '✓ Prediction Saved!' 
            : 'Submit Prediction →'}
        </button>

        {/* Login hint if not logged in */}
        {!user && (
          <div style={{
            textAlign:'center',marginTop:10,
            fontSize:11,color:'rgba(255,255,255,0.3)',
            display:'flex',alignItems:'center',
            justifyContent:'center',gap:6
          }}>
            <span>🛡️</span>
            Login to save your predictions and earn points
          </div>
        )}

        {/* Prediction closes countdown */}
        {closeCountdown && closeCountdown !== 'Prediction closed' && (
          <div style={{
            marginTop:16,
            background:'rgba(255,255,255,0.04)',
            border:'1px solid rgba(255,255,255,0.07)',
            borderRadius:8,padding:'10px 14px',
            textAlign:'center'
          }}>
            <div style={{fontSize:10,fontWeight:700,
              color:'rgba(255,255,255,0.35)',
              letterSpacing:2,textTransform:'uppercase',
              marginBottom:6}}>
              Prediction Closes In
            </div>
            <div className="close-countdown-text">
              {closeCountdown}
            </div>
          </div>
        )}
      </div>

      {/* Popular predictions for this match */}
      {popularPreds.length > 0 && (
        <div style={{marginTop:16, maxWidth: 520, margin: '16px auto 0'}}>
          <div style={{fontSize:10,fontWeight:700,
            color:'rgba(255,255,255,0.3)',
            letterSpacing:2,textTransform:'uppercase',
            marginBottom:10,textAlign:'center'}}>
            Popular Predictions
          </div>
          <div className="popular-preds-grid" style={{display:'grid', gridTemplateColumns:'repeat(5,1fr)',gap:6}}>
            {popularPreds.map((p:any,i:number) => (
              <div key={i} className="pop-pred-item"
                onClick={() => {
                  setSaved(false);
                  setScores({
                    home:p.predicted_home,
                    away:p.predicted_away
                  });
                }}>
                <div style={{
                  fontFamily:"'Bebas Neue',sans-serif",
                  fontSize:20,letterSpacing:2,
                  color: i===0?'#3CAC3B':
                         i===1?'#2A398D':
                         i===2?'#E61D25':'#fff'
                }}>
                  {p.predicted_home}-{p.predicted_away}
                </div>
                <div style={{fontSize:10, color:'rgba(255,255,255,0.4)', marginTop:3}}>
                  {p.percentage}%
                </div>
                <div style={{
                  height:2,marginTop:6,borderRadius:1,
                  background: i===0?'#3CAC3B':
                              i===1?'#2A398D':
                              i===2?'#E61D25':
                              'rgba(255,255,255,0.15)',
                  width:`${p.percentage}%`,
                  maxWidth:'100%'
                }}/>
              </div>
            ))}
          </div>
          <div style={{textAlign:'center',marginTop:8, fontSize:10,color:'rgba(255,255,255,0.2)'}}>
            Total predictions: {popularPreds.reduce((s:number,p:any)=>s+(p.count||0),0)}
          </div>
        </div>
      )}
    </div>
  );
}

function LeaderboardPreview({ currentUserId }: { currentUserId?: string }) {
  const [leaders, setLeaders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setLoading(false);
    }, 4000);

    fetch('/api/leaderboard')
      .then(r => r.json())
      .then(data => {
        clearTimeout(timeout);
        setLeaders(Array.isArray(data) ? data.slice(0,5) : []);
        setLoading(false);
      })
      .catch(() => {
        clearTimeout(timeout);
        setLoading(false);
      });

    return () => clearTimeout(timeout);
  }, []);

  const medals = ['🥇','🥈','🥉'];

  return (
    <div style={{
      background:'rgba(17,17,17,0.8)',
      backdropFilter:'blur(12px)',
      border:'1px solid rgba(255,255,255,0.08)',
      borderRadius:12,padding:'20px'
    }}>
      <div style={{display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:16}}>
        <div style={{
          fontFamily:"'Bebas Neue',sans-serif",
          fontSize:18,color:'#fff',letterSpacing:2
        }}>
          Leaderboard
        </div>
        <a href="/leaderboard" style={{
          fontSize:11,color:'#3CAC3B',
          textDecoration:'none',fontWeight:700,
          letterSpacing:1
        }}>View Full →</a>
      </div>

      {loading ? (
        <div style={{fontSize:12, color:'rgba(255,255,255,0.3)', textAlign:'center',padding:'20px 0'}}>
          Loading...
        </div>
      ) : leaders.length === 0 ? (
        <div style={{fontSize:12, color:'rgba(255,255,255,0.3)', textAlign:'center',padding:'20px 0', lineHeight:1.6}}>
          No predictors yet.<br/>
          Be the first! 🏆
        </div>
      ) : (
        leaders.map((l:any, i:number) => (
          <div key={l.id} style={{
            display:'flex',alignItems:'center',
            gap:10,padding:'10px 0',
            borderBottom: i < leaders.length-1
              ? '1px solid rgba(255,255,255,0.05)'
              : 'none',
            background: l.id === currentUserId
              ? 'rgba(60,172,59,0.05)' : 'transparent',
            borderRadius:4,
            paddingLeft: l.id===currentUserId?8:0
          }}>
            <span style={{fontSize:16,width:24}}>
              {medals[i] || `${i+1}`}
            </span>
            <div style={{flex:1}}>
              <div style={{fontSize:13,fontWeight:700,
                color: l.id===currentUserId ? '#3CAC3B' : '#fff'}}>
                {l.display_name}
                {l.id===currentUserId && 
                  <span style={{fontSize:10, color:'#3CAC3B',marginLeft:6}}>
                    (you)
                  </span>
                }
              </div>
              <div style={{fontSize:10, color:'rgba(255,255,255,0.3)',marginTop:1}}>
                {l.total_predictions} predictions · {l.exact_scores} exact
              </div>
            </div>
            <div style={{
              fontFamily:"'Bebas Neue',sans-serif",
              fontSize:20,color:'#FFD700'
            }}>
              {l.total_points}
              <span style={{fontSize:10, color:'rgba(255,255,255,0.3)', fontFamily:"'Inter',sans-serif", marginLeft:2}}>pts</span>
            </div>
          </div>
        ))
      )}

      {/* Your rank if logged in but not in top 5 */}
      {currentUserId && !leaders.find((l:any) => l.id === currentUserId) && (
        <div style={{
          marginTop:12,paddingTop:12,
          borderTop:'1px solid rgba(255,255,255,0.05)',
          fontSize:12,color:'rgba(255,255,255,0.3)',
          textAlign:'center'
        }}>
          Your rank: unranked · Make predictions to earn points!
        </div>
      )}

      {!currentUserId && (
        <div style={{
          marginTop:12,paddingTop:12,
          borderTop:'1px solid rgba(255,255,255,0.05)',
          fontSize:11,color:'rgba(255,255,255,0.3)',
          textAlign:'center',lineHeight:1.6
        }}>
          🛡️ Login to compete<br/>
          and appear on the leaderboard
        </div>
      )}
    </div>
  );
}

function MobileLeaderboardTeaser() {
  const [leaders, setLeaders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setLoading(false);
    }, 4000);

    fetch('/api/leaderboard')
      .then(r => r.json())
      .then(data => {
        clearTimeout(timeout);
        setLeaders(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => {
        clearTimeout(timeout);
        setLoading(false);
      });

    return () => clearTimeout(timeout);
  }, []);

  if (loading || leaders.length === 0) return null;

  return (
    <div className="mobile-lb-teaser" style={{
      background: 'rgba(17,17,17,0.85)',
      backdropFilter: 'blur(12px)',
      border: '1px solid rgba(255,255,255,0.08)',
      borderRadius: 12,
      padding: '16px',
    }}>
      <div style={{display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:10}}>
        <div style={{fontSize:12, fontWeight:700, color:'#fff'}}>
          🏅 {leaders.length.toLocaleString()} fans competing
        </div>
        <a href="/leaderboard" style={{fontSize:11, color:'#3CAC3B', textDecoration:'none', fontWeight:700}}>
          View Leaderboard →
        </a>
      </div>
      
      {/* Top 3 row */}
      <div style={{display:'flex', gap:10, justifyContent:'space-between'}}>
        {leaders.slice(0, 3).map((l, i) => (
          <div key={l.id} style={{
            flex: 1,
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.05)',
            borderRadius: 6,
            padding: '8px',
            textAlign: 'center',
            fontSize: 11
          }}>
            <span style={{marginRight: 4}}>{i === 0 ? '🥇' : i === 1 ? '🥈' : '🥉'}</span>
            <span style={{fontWeight: 600, color: '#fff'}}>{l.display_name}</span>
            <span style={{color: 'rgba(255,255,255,0.4)', marginLeft: 6}}>{l.total_points || 0} pts</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function AllPredictions({ user }: { user: UserProfile }) {
  const [predictions, setPredictions] = useState<any[]>([]);
  const [userTz] = useState(
    typeof window !== 'undefined' ? Intl.DateTimeFormat().resolvedOptions().timeZone : 'UTC'
  );

  useEffect(() => {
    fetch(`/api/predict?userId=${user.id}`)
      .then(r => r.json())
      .then(data => setPredictions(
        Array.isArray(data) ? data : []
      ));
  }, [user]);

  // Upcoming matches (next 6)
  const upcoming = (rawMatches as any[])
    .filter(m => new Date(m.date) > new Date())
    .sort((a,b) => 
      new Date(a.date).getTime()-new Date(b.date).getTime()
    )
    .slice(0,6);

  // Completed with predictions
  const completed = predictions.filter(p => p.is_scored);

  const getPred = (matchId:number) =>
    predictions.find(p => p.match_id === matchId);

  return (
    <div className="all-preds-section">
      <div style={{maxWidth:1100,margin:'0 auto'}}>

        {/* My Predictions grid */}
        <div style={{
          fontFamily:"'Bebas Neue',sans-serif",
          fontSize:36,color:'#fff',letterSpacing:2,
          marginBottom:20
        }}>
          My <span style={{color:'#3CAC3B'}}>Predictions</span>
        </div>

        {upcoming.length === 0 ? (
          <div style={{
            background:'#111', border:'1px solid rgba(255,255,255,0.07)',
            borderRadius:8, padding:'40px 20px', textAlign:'center',
            color:'rgba(255,255,255,0.4)', fontSize:13, marginBottom:48
          }}>
            No upcoming scheduled matches available.
          </div>
        ) : (
          <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(300px,1fr))', gap:10, marginBottom:48}}>
            {upcoming.map((m:any) => {
              const pred = getPred(m.id);
              const isPredicted = !!pred;
              const dt = new Date(m.date)
                .toLocaleDateString('en-IN',{
                  weekday:'short',month:'short',
                  day:'numeric',timeZone:userTz
                });
              const time = new Date(m.date)
                .toLocaleTimeString('en-IN',{
                  hour:'2-digit',minute:'2-digit',
                  timeZone:userTz,hour12:true
                });

              return (
                <div key={m.id} style={{
                  background:'#111',
                  border:`1px solid ${isPredicted ? 'rgba(60,172,59,0.3)' : 'rgba(255,255,255,0.07)'}`,
                  borderRadius:8,padding:'14px 16px'
                }}>
                  <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:10}}>
                    <span style={{fontSize:10, color:'rgba(255,255,255,0.35)', letterSpacing:1}}>
                      Group {m.group}
                    </span>
                    <span style={{fontSize:10, color: isPredicted ? '#3CAC3B':'rgba(255,255,255,0.25)', fontWeight:700,letterSpacing:1}}>
                      {isPredicted?'✓ Predicted':'Not predicted'}
                    </span>
                  </div>
                  <div style={{display:'grid', gridTemplateColumns:'1fr auto 1fr', alignItems:'center', gap:8, marginBottom:10}}>
                    <div style={{fontSize:13, fontWeight:700,color:'#fff'}}>
                      {m.homeTeam || 'TBD'}
                    </div>
                    <div style={{
                      fontFamily:"'Bebas Neue',sans-serif",
                      fontSize: isPredicted?24:16,
                      color: isPredicted ? '#fff':'rgba(255,255,255,0.2)',
                      letterSpacing:2,textAlign:'center'
                    }}>
                      {isPredicted
                        ?`${pred.predicted_home}-${pred.predicted_away}`
                        :'VS'
                      }
                    </div>
                    <div style={{fontSize:13, fontWeight:700,color:'#fff', textAlign:'right'}}>
                      {m.awayTeam || 'TBD'}
                    </div>
                  </div>
                  <div style={{fontSize:11, color:'rgba(255,255,255,0.3)', display:'flex', justifyContent:'space-between'}}>
                    <span style={{color:'#3CAC3B', fontWeight:600}}>
                      {dt} · {time}
                    </span>
                    <span>{(m.venue||'').split(',')[0]}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Results section */}
        {completed.length > 0 && (
          <div>
            <div style={{display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:16}}>
              <div style={{
                fontFamily:"'Bebas Neue',sans-serif",
                fontSize:36,color:'#fff',letterSpacing:2
              }}>
                My <span style={{color:'#FFD700'}}>Results</span>
              </div>
              <div style={{
                background:'rgba(255,215,0,0.08)',
                border:'1px solid rgba(255,215,0,0.2)',
                borderRadius:8,padding:'8px 16px',
                textAlign:'center'
              }}>
                <div style={{
                  fontFamily:"'Bebas Neue',sans-serif",
                  fontSize:24,color:'#FFD700'
                }}>
                  {completed.reduce((s:number,p:any)=>s+p.points_earned,0)} pts
                </div>
                <div style={{fontSize:10, color:'rgba(255,255,255,0.35)', letterSpacing:1}}>
                  total earned
                </div>
              </div>
            </div>

            <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(300px,1fr))', gap:10}}>
              {completed.map((p:any) => {
                const pts = p.points_earned;
                const borderColor = pts===3
                  ?'rgba(255,215,0,0.4)'
                  :pts===1
                  ?'rgba(60,172,59,0.4)'
                  :'rgba(255,255,255,0.07)';
                const badge = pts===3
                  ?{icon:'🎯',label:'Exact!', color:'#FFD700'}
                  :pts===1
                  ?{icon:'✅',label:'Correct result', color:'#3CAC3B'}
                  :{icon:'❌',label:'Wrong', color:'rgba(255,255,255,0.3)'};

                return (
                  <div key={p.id} style={{
                    background:'#111',
                    border:`1px solid ${borderColor}`,
                    borderRadius:8,padding:'14px 16px'
                  }}>
                    <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:10}}>
                      <div style={{fontSize:13, fontWeight:700,color:'#fff'}}>
                        {p.home_team} vs {p.away_team}
                      </div>
                      <div style={{
                        fontSize:11,fontWeight:700,
                        color:badge.color,
                        display:'flex',
                        alignItems:'center',gap:4
                      }}>
                        {badge.icon} {badge.label}
                      </div>
                    </div>
                    <div style={{display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:8,textAlign:'center'}}>
                      <div style={{background:'rgba(255,255,255,0.04)', borderRadius:6,padding:'8px'}}>
                        <div style={{fontSize:9, color:'rgba(255,255,255,0.3)', letterSpacing:1,marginBottom:4}}>
                          YOUR PICK
                        </div>
                        <div style={{
                          fontFamily:"'Bebas Neue',sans-serif",
                          fontSize:20,color:'#fff',
                          letterSpacing:2}}>
                          {p.predicted_home}-{p.predicted_away}
                        </div>
                      </div>
                      <div style={{background:'rgba(255,255,255,0.04)', borderRadius:6,padding:'8px'}}>
                        <div style={{fontSize:9, color:'rgba(255,255,255,0.3)', letterSpacing:1,marginBottom:4}}>
                          ACTUAL
                        </div>
                        <div style={{
                          fontFamily:"'Bebas Neue',sans-serif",
                          fontSize:20,
                          color:pts>0?'#3CAC3B':'#E61D25',
                          letterSpacing:2}}>
                          {p.actual_home}-{p.actual_away}
                        </div>
                      </div>
                      <div style={{
                        background: pts===3
                          ?'rgba(255,215,0,0.08)'
                          :pts===1
                          ?'rgba(60,172,59,0.08)'
                          :'rgba(255,255,255,0.04)',
                        borderRadius:6,padding:'8px'}}>
                        <div style={{fontSize:9, color:'rgba(255,255,255,0.3)', letterSpacing:1,marginBottom:4}}>
                          POINTS
                        </div>
                        <div style={{
                          fontFamily:"'Bebas Neue',sans-serif",
                          fontSize:20,
                          color:badge.color,
                          letterSpacing:2}}>
                          +{pts}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

interface AuthModalProps {
  onSuccess: (user: UserProfile) => void;
  onClose: () => void;
}

function AuthModal({ onSuccess, onClose }: AuthModalProps) {
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [formData, setFormData] = useState({
    username: '', password: '', 
    displayName: '', favouriteTeam: ''
  });
  const [authError, setAuthError] = useState('');
  const [authLoading, setAuthLoading] = useState(false);

  return (
    <div className="auth-modal-overlay" onClick={(e) => {
      if (e.target === e.currentTarget) onClose();
    }}>
      <div className="auth-modal">
        {/* close button */}
        <button onClick={onClose} style={{
          position:'absolute',top:16,right:16,
          background:'transparent',border:'none',
          color:'rgba(255,255,255,0.4)',
          fontSize:20,cursor:'pointer'
        }}>✕</button>

        {/* Form Header */}
        <div style={{textAlign:'center', marginBottom:20}}>
          <div style={{fontSize:32, marginBottom:8}}>🎯</div>
          <div style={{
            fontFamily:"'Bebas Neue',sans-serif",
            fontSize:28, color:'#fff', letterSpacing:2
          }}>
            Score Predictor
          </div>
          <div style={{fontSize:11, color:'rgba(255,255,255,0.35)', marginTop:4}}>
            Sign in to start scoring points and ranking
          </div>
        </div>

        {/* Toggle Login/Register */}
        <div style={{
          display:'grid', gridTemplateColumns:'1fr 1fr',
          gap:4, background:'rgba(255,255,255,0.05)',
          borderRadius:6, padding:4, marginBottom:20
        }}>
          <button
            onClick={() => { setAuthMode('login'); setAuthError(''); }}
            style={{
              padding:'8px 0', borderRadius:4,
              border:'none', cursor:'pointer',
              background: authMode==='login' ? '#3CAC3B' : 'transparent',
              color: authMode==='login' ? '#fff' : 'rgba(255,255,255,0.4)',
              fontWeight:700, fontSize:12,
              fontFamily:"'Inter',sans-serif",
              letterSpacing:1
            }}>
            LOG IN
          </button>
          <button
            onClick={() => { setAuthMode('register'); setAuthError(''); }}
            style={{
              padding:'8px 0', borderRadius:4,
              border:'none', cursor:'pointer',
              background: authMode==='register' ? '#2A398D' : 'transparent',
              color: authMode==='register' ? '#fff' : 'rgba(255,255,255,0.4)',
              fontWeight:700, fontSize:12,
              fontFamily:"'Inter',sans-serif",
              letterSpacing:1
            }}>
            REGISTER
          </button>
        </div>

        {/* Form Inputs */}
        <div style={{marginBottom:14}}>
          <label style={{fontSize:10, fontWeight:700, color:'rgba(255,255,255,0.4)', letterSpacing:1, textTransform:'uppercase', display:'block', marginBottom:6}}>
            Username
          </label>
          <input
            type="text"
            placeholder="e.g. ishan_predicts"
            value={formData.username}
            onChange={e => setFormData(p => ({...p, username: e.target.value}))}
            style={{
              width:'100%', padding:'10px 14px',
              background:'rgba(255,255,255,0.06)',
              border:'1px solid rgba(255,255,255,0.1)',
              borderRadius:6, color:'#fff',
              fontSize:14, fontFamily:"'Inter',sans-serif",
              outline:'none'
            }}
          />
        </div>

        <div style={{marginBottom:14}}>
          <label style={{fontSize:10, fontWeight:700, color:'rgba(255,255,255,0.4)', letterSpacing:1, textTransform:'uppercase', display:'block', marginBottom:6}}>
            Password
          </label>
          <input
            type="password"
            placeholder={authMode==='register' ? 'Min 6 characters' : 'Your password'}
            value={formData.password}
            onChange={e => setFormData(p => ({...p, password: e.target.value}))}
            style={{
              width:'100%', padding:'10px 14px',
              background:'rgba(255,255,255,0.06)',
              border:'1px solid rgba(255,255,255,0.1)',
              borderRadius:6, color:'#fff',
              fontSize:14, fontFamily:"'Inter',sans-serif",
              outline:'none'
            }}
          />
        </div>

        {authMode === 'register' && (
          <>
            <div style={{marginBottom:14}}>
              <label style={{fontSize:10, fontWeight:700, color:'rgba(255,255,255,0.4)', letterSpacing:1, textTransform:'uppercase', display:'block', marginBottom:6}}>
                Display Name
              </label>
              <input
                type="text"
                placeholder="How you appear on leaderboard"
                value={formData.displayName}
                onChange={e => setFormData(p => ({...p, displayName: e.target.value}))}
                style={{
                  width:'100%', padding:'10px 14px',
                  background:'rgba(255,255,255,0.06)',
                  border:'1px solid rgba(255,255,255,0.1)',
                  borderRadius:6, color:'#fff',
                  fontSize:14, fontFamily:"'Inter',sans-serif",
                  outline:'none'
                }}
              />
            </div>

            <div style={{marginBottom:14}}>
              <label style={{fontSize:10, fontWeight:700, color:'rgba(255,255,255,0.4)', letterSpacing:1, textTransform:'uppercase', display:'block', marginBottom:6}}>
                Favourite Team (optional)
              </label>
              <select
                value={formData.favouriteTeam}
                onChange={e => setFormData(p => ({...p, favouriteTeam: e.target.value}))}
                style={{
                  width:'100%', padding:'10px 14px',
                  background:'#1a1a1a',
                  border:'1px solid rgba(255,255,255,0.1)',
                  borderRadius:6, color:'#fff',
                  fontSize:14, fontFamily:"'Inter',sans-serif",
                  outline:'none', cursor:'pointer'
                }}>
                <option value="">Select a team</option>
                {uniqueTeamsList.map(t => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
          </>
        )}

        {authError && (
          <div style={{
            background:'rgba(230,29,37,0.1)',
            border:'1px solid rgba(230,29,37,0.3)',
            borderRadius:6, padding:'10px 14px',
            fontSize:12, color:'#ff7070',
            marginBottom:14
          }}>
            {authError}
          </div>
        )}

        <button
          disabled={authLoading}
          onClick={async () => {
            setAuthError('');
            setAuthLoading(true);
            try {
              const res = await fetch('/api/user', {
                method:'POST',
                headers:{'Content-Type':'application/json'},
                body: JSON.stringify({
                  action: authMode,
                  username: formData.username,
                  password: formData.password,
                  displayName: formData.displayName,
                  favouriteTeam: formData.favouriteTeam
                })
              });
              const data = await res.json();
              if (!res.ok) {
                setAuthError(data.error || 'Something went wrong');
              } else {
                localStorage.setItem('wc26_token', data.token);
                localStorage.setItem('wc26_user', JSON.stringify(data.user));
                onSuccess(data.user);
              }
            } catch {
              setAuthError('Network error. Please try again.');
            } finally {
              setAuthLoading(false);
            }
          }}
          style={{
            width:'100%', padding:'12px',
            background: authMode==='login' ? '#3CAC3B' : '#2A398D',
            border:'none', borderRadius:6,
            color:'#fff', fontSize:13,
            fontWeight:700, cursor:'pointer',
            fontFamily:"'Inter',sans-serif",
            letterSpacing:1, textTransform:'uppercase',
            opacity: authLoading ? 0.6 : 1
          }}>
          {authLoading ? 'Please wait...' : authMode==='login' ? 'Log In' : 'Create Account'}
        </button>
      </div>
    </div>
  );
}
