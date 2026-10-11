'use client';

import React, { useState, useEffect } from 'react';
import { Trophy, Medal, Award, User, RefreshCw } from 'lucide-react';

interface LeaderboardUser {
  id: string;
  display_name: string;
  username: string;
  favourite_team: string | null;
  total_points: number;
  total_predictions: number;
  exact_scores: number;
}

export default function LeaderboardPage() {
  const footballSVG = '<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32"><circle cx="16" cy="16" r="15" fill="white" stroke="%23222" stroke-width="1.5"/><polygon points="16,4 20,10 16,14 12,10" fill="%23111"/><polygon points="26,11 28,17 23,19 21,13" fill="%23111"/><polygon points="24,24 19,27 16,22 20,18" fill="%23111"/><polygon points="8,24 6,18 11,16 13,22" fill="%23111"/><polygon points="6,11 11,8 13,14 8,16" fill="%23111"/></svg>';
  const cursorUrl = `data:image/svg+xml,${footballSVG}`;

  const [board, setBoard] = useState<LeaderboardUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchLeaderboard = async (showSpinner = false) => {
    if (showSpinner) setRefreshing(true);
    const timeout = setTimeout(() => {
      setLoading(false);
      setRefreshing(false);
    }, 4000);
    try {
      const res = await fetch('/api/leaderboard');
      const data = await res.json();
      clearTimeout(timeout);
      if (Array.isArray(data)) {
        setBoard(data);
      }
    } catch (e) {
      clearTimeout(timeout);
      console.error('Failed to fetch leaderboard:', e);
    }
    setLoading(false);
    setRefreshing(false);
  };

  useEffect(() => {
    // Check local storage for logged-in predictor user
    const localUser = localStorage.getItem('wc26_user');
    if (localUser) {
      try {
        setCurrentUser(JSON.parse(localUser));
      } catch (e) {
        console.error(e);
      }
    }

    fetchLeaderboard();

    // Auto-refresh every 30 seconds
    const interval = setInterval(() => {
      fetchLeaderboard(true);
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  // Find current user's rank
  const currentUserRank = board.findIndex(u => u.username === currentUser?.username) + 1;

  // Split top 3 podium
  const podium = {
    first: board[0] || null,
    second: board[1] || null,
    third: board[2] || null
  };

  const css = `
    @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Inter:wght@400;500;600;700&display=swap');
    :root { --g:#3CAC3B; --b:#2A398D; --r:#E61D25; --gr:#474A4A; }
    *{box-sizing:border-box;} body{margin:0;background:#080808;}
    .wc-page{font-family:'Inter',sans-serif;background:#080808;color:#fff;overflow-x:hidden;}
    .top-stripe{height:4px;background:linear-gradient(90deg,var(--g) 33%,var(--b) 33% 66%,var(--r) 66%);position:sticky;top:0;z-index:100;}
    .wc-nav{position:sticky;top:4px;z-index:99;display:flex;align-items:center;justify-content:space-between;padding:12px 24px;background:rgba(8,8,8,0.92);backdrop-filter:blur(12px);border-bottom:1px solid rgba(255,255,255,0.05);}
    .wc-logo{font-family:'Bebas Neue',sans-serif;font-size:22px;color:#fff;letter-spacing:3px;}
    .wc-logo span{color:var(--g);}
    .nav-pills{display:flex;gap:6px;flex-wrap:wrap;}
    .np{font-size:10px;font-weight:700;padding:5px 12px;border-radius:3px;border:none;cursor:pointer;letter-spacing:1px;font-family:'Inter',sans-serif;text-transform:uppercase;}
    .np-g{background:var(--g);color:#fff;} .np-b{background:var(--b);color:#fff;} .np-r{background:var(--r);color:#fff;}

    .header-sec {
      max-width: 1000px;
      margin: 40px auto 20px;
      padding: 0 20px;
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
    }
    .podium-container {
      max-width: 1000px;
      margin: 20px auto 40px;
      padding: 0 20px;
      display: grid;
      grid-template-columns: 1fr 1.1fr 1fr;
      align-items: flex-end;
      gap: 16px;
    }
    .podium-column {
      background: #111;
      border: 1px solid rgba(255,255,255,0.05);
      border-radius: 12px 12px 0 0;
      padding: 24px 16px;
      text-align: center;
      display: flex;
      flex-direction: column;
      align-items: center;
      position: relative;
    }
    .podium-column.rank-1 {
      height: 260px;
      border: 2px solid #FFD700;
      box-shadow: 0 10px 30px rgba(255,215,0,0.08);
      background: linear-gradient(180deg, rgba(255,215,0,0.02) 0%, #111 100%);
    }
    .podium-column.rank-2 {
      height: 220px;
      border-color: rgba(255,255,255,0.1);
    }
    .podium-column.rank-3 {
      height: 190px;
      border-color: rgba(255,255,255,0.1);
    }
    .podium-badge {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 700;
      font-size: 18px;
      margin-bottom: 12px;
      font-family: 'Bebas Neue', sans-serif;
    }
    .podium-badge.gold {
      background: #FFD700;
      color: #000;
    }
    .podium-badge.silver {
      background: #C0C0C0;
      color: #000;
    }
    .podium-badge.bronze {
      background: #CD7F32;
      color: #000;
    }
    .podium-name {
      font-size: 14px;
      font-weight: 750;
      color: #fff;
      margin-bottom: 4px;
      line-clamp: 1;
    }
    .podium-pts {
      font-family: 'Bebas Neue', sans-serif;
      font-size: 28px;
      color: #fff;
      line-height: 1;
    }
    .podium-stats {
      font-size: 10px;
      color: rgba(255,255,255,0.4);
      margin-top: 6px;
    }
    
    .table-container {
      max-width: 1000px;
      margin: 0 auto 80px;
      padding: 0 20px;
    }
    .leader-table {
      width: 100%;
      border-collapse: collapse;
      background: #111;
      border: 1px solid rgba(255,255,255,0.07);
      border-radius: 12px;
      overflow: hidden;
    }
    .leader-table th {
      background: rgba(255,255,255,0.04);
      padding: 14px 20px;
      font-size: 10px;
      font-weight: 700;
      color: rgba(255,255,255,0.4);
      text-transform: uppercase;
      letter-spacing: 1px;
      text-align: left;
      border-bottom: 1px solid rgba(255,255,255,0.07);
    }
    .leader-table td {
      padding: 14px 20px;
      font-size: 13px;
      color: rgba(255,255,255,0.8);
      border-bottom: 1px solid rgba(255,255,255,0.04);
    }
    .leader-table tr:last-child td {
      border-bottom: none;
    }
    .leader-table tr.highlight-user {
      background: rgba(60,172,59,0.07);
      border-left: 3px solid var(--g);
    }
    .leader-table tr.highlight-user td {
      color: #fff;
      font-weight: 600;
    }
    .user-rank-val {
      font-weight: 700;
      font-family: 'Bebas Neue', sans-serif;
      font-size: 16px;
      letter-spacing: 0.5px;
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

    @media(max-width: 768px) {
      /* Prevent horizontal overflow on any page */
      body, .wc-page {
        overflow-x: hidden !important;
        max-width: 100vw !important;
      }
      
      /* Section padding reduced on mobile */
      section {
        padding-left: 16px !important;
        padding-right: 16px !important;
      }
      
      /* All section max-width containers */
      .wc-page > section > div[style*="maxWidth"] {
        padding: 0 !important;
      }
      
      /* Bebas Neue headings scale down */
      [style*="Bebas Neue"] {
        letter-spacing: 1px !important;
      }
      
      /* Buttons - minimum tap target 44px */
      button {
        min-height: 44px !important;
      }
      
      /* Input fields - prevent iOS zoom */
      input, select, textarea {
        font-size: 16px !important;
      }
      
      /* Footer */
      .wc-footer {
        padding: 24px 16px !important;
        gap: 8px !important;
      }
      
      .footer-text {
        font-size: 11px !important;
        text-align: center !important;
      }

      /* Fix 1: Nav Bar */
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

      .podium-container {
        grid-template-columns: 1fr !important;
        gap: 12px !important;
      }
      .podium-column.rank-1, .podium-column.rank-2, .podium-column.rank-3 {
        height: auto !important;
        border-radius: 12px !important;
        padding: 16px !important;
      }
    }
    
  `;

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: css }} />
      <div className="wc-page">
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

        {/* Header Section */}
        <div className="header-sec">
          <div>
            <h1 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 44, color: '#fff', letterSpacing: 2, margin: 0 }}>Global Leaderboard</h1>
            <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', margin: '4px 0 0' }}>
              Updated after every match · Auto-refreshes every 30s
            </p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            {refreshing && <RefreshCw size={14} className="animate-spin" style={{ color: 'var(--g)' }} />}
            {currentUser && currentUserRank > 0 && (
              <div style={{ background: 'rgba(60,172,59,0.15)', border: '1px solid var(--g)', padding: '6px 14px', borderRadius: 8, fontSize: 12, fontWeight: 700, color: 'var(--g)' }}>
                You are Ranked #{currentUserRank}
              </div>
            )}
          </div>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '100px', color: 'rgba(255,255,255,0.4)' }}>
            Loading global standings...
          </div>
        ) : board.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '100px', color: 'rgba(255,255,255,0.3)' }}>
            No predictors have joined yet. Be the first to predict!
          </div>
        ) : (
          <>
            {/* Podium Visual Display */}
            <div className="podium-container">
              
              {/* Podium 2nd Place */}
              {podium.second ? (
                <div className="podium-column rank-2">
                  <div className="podium-badge silver">2</div>
                  <div className="podium-name">{podium.second.display_name}</div>
                  <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', marginBottom: 8 }}>@{podium.second.username}</div>
                  <div className="podium-pts">{podium.second.total_points} <span style={{ fontSize: 12, fontFamily: "'Inter', sans-serif" }}>pts</span></div>
                  <div className="podium-stats">🎯 {podium.second.exact_scores} exacts · {podium.second.total_predictions} games</div>
                </div>
              ) : (
                <div className="podium-column rank-2" style={{ justifyContent: 'center' }}>
                  <span style={{ color: 'rgba(255,255,255,0.15)' }}>No player</span>
                </div>
              )}

              {/* Podium 1st Place */}
              {podium.first ? (
                <div className="podium-column rank-1">
                  <Trophy size={20} style={{ color: '#FFD700', position: 'absolute', top: -12, filter: 'drop-shadow(0 0 10px rgba(255,215,0,0.5))' }} />
                  <div className="podium-badge gold">1</div>
                  <div className="podium-name" style={{ color: '#FFD700', fontSize: 16 }}>{podium.first.display_name}</div>
                  <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', marginBottom: 8 }}>@{podium.first.username}</div>
                  <div className="podium-pts" style={{ color: '#FFD700', fontSize: 36 }}>{podium.first.total_points} <span style={{ fontSize: 14, fontFamily: "'Inter', sans-serif" }}>pts</span></div>
                  <div className="podium-stats">🎯 {podium.first.exact_scores} exacts · {podium.first.total_predictions} games</div>
                </div>
              ) : (
                <div className="podium-column rank-1" style={{ justifyContent: 'center' }}>
                  <span style={{ color: 'rgba(255,255,255,0.15)' }}>No player</span>
                </div>
              )}

              {/* Podium 3rd Place */}
              {podium.third ? (
                <div className="podium-column rank-3">
                  <div className="podium-badge bronze">3</div>
                  <div className="podium-name">{podium.third.display_name}</div>
                  <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', marginBottom: 8 }}>@{podium.third.username}</div>
                  <div className="podium-pts">{podium.third.total_points} <span style={{ fontSize: 12, fontFamily: "'Inter', sans-serif" }}>pts</span></div>
                  <div className="podium-stats">🎯 {podium.third.exact_scores} exacts · {podium.third.total_predictions} games</div>
                </div>
              ) : (
                <div className="podium-column rank-3" style={{ justifyContent: 'center' }}>
                  <span style={{ color: 'rgba(255,255,255,0.15)' }}>No player</span>
                </div>
              )}

            </div>

            {/* Standings Table */}
            <div className="table-container">
              <table className="leader-table">
                <thead>
                  <tr>
                    <th style={{ width: 80 }}>Rank</th>
                    <th>Predictor</th>
                    <th>Favourite Team</th>
                    <th>Predictions</th>
                    <th style={{ textAlign: 'center' }}>🎯 Exacts</th>
                    <th style={{ textAlign: 'right' }}>Points</th>
                  </tr>
                </thead>
                <tbody>
                  {board.map((row, index) => {
                    const rank = index + 1;
                    const isSelf = currentUser && row.username === currentUser.username;
                    
                    let medalIcon = null;
                    if (rank === 1) medalIcon = '🥇';
                    else if (rank === 2) medalIcon = '🥈';
                    else if (rank === 3) medalIcon = '🥉';

                    return (
                      <tr key={row.id} className={isSelf ? 'highlight-user' : ''}>
                        <td className="user-rank-val">
                          {medalIcon ? (
                            <span style={{ fontSize: 18 }}>{medalIcon}</span>
                          ) : (
                            <span>#{rank}</span>
                          )}
                        </td>
                        <td>
                          <div>
                            {row.display_name} 
                            {isSelf && <span style={{ marginLeft: 6, fontSize: 9, background: 'var(--g)', color: '#fff', padding: '2px 6px', borderRadius: 4, textTransform: 'uppercase' }}>You</span>}
                          </div>
                          <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)' }}>@{row.username}</div>
                        </td>
                        <td style={{ color: row.favourite_team ? '#fff' : 'rgba(255,255,255,0.2)' }}>
                          {row.favourite_team || '—'}
                        </td>
                        <td>
                          {row.total_predictions} matches predicted
                        </td>
                        <td style={{ textAlign: 'center', color: row.exact_scores > 0 ? 'var(--g)' : 'rgba(255,255,255,0.3)' }}>
                          {row.exact_scores}
                        </td>
                        <td style={{ textAlign: 'right', fontWeight: 700, color: '#fff', fontSize: 15 }}>
                          {row.total_points}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </>
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
    </>
  );
}
