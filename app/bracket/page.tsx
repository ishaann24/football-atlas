'use client';

import React from 'react';

const BRACKET = {
  left: {
    r32: [
      { home:'Canada', away:'South Africa', hs:1, as:0, winner:'Canada' },
      { home:'Norway', away:'Ivory Coast', hs:2, as:1, winner:'Norway' },
      { home:'Germany', away:'Paraguay', hs:1, as:1, winner:'Paraguay', pens:'3-4' },
      { home:'Netherlands', away:'Morocco', hs:1, as:1, winner:'Morocco', pens:'2-3' },
      { home:'Brazil', away:'Japan', hs:2, as:1, winner:'Brazil' },
      { home:'France', away:'Sweden', hs:3, as:0, winner:'France' },
      { home:'Mexico', away:'Ecuador', hs:2, as:0, winner:'Mexico' },
      { home:'England', away:'DR Congo', hs:2, as:1, winner:'England' },
    ],
    r16: [
      { home:'Morocco', away:'Canada', hs:3, as:0, winner:'Morocco' },
      { home:'Norway', away:'Brazil', hs:2, as:1, winner:'Norway' },
      { home:'France', away:'Paraguay', hs:1, as:0, winner:'France' },
      { home:'England', away:'Mexico', hs:3, as:2, winner:'England' },
    ],
    qf: [
      { home:'France', away:'Morocco', hs:2, as:0, winner:'France' },
      { home:'England', away:'Norway', hs:2, as:1, winner:'England', note:'AET' },
    ],
    sf: [
      { home:'Spain', away:'France', hs:2, as:0, winner:'Spain' },
    ],
  },
  right: {
    r32: [
      { home:'Belgium', away:'Senegal', hs:3, as:2, winner:'Belgium', note:'AET' },
      { home:'USA', away:'Bosnia and Herzegovina', hs:2, as:0, winner:'USA' },
      { home:'Spain', away:'Austria', hs:3, as:0, winner:'Spain' },
      { home:'Portugal', away:'Croatia', hs:2, as:1, winner:'Portugal' },
      { home:'Egypt', away:'Australia', hs:1, as:1, winner:'Egypt', pens:'4-2' },
      { home:'Argentina', away:'Cape Verde', hs:3, as:2, winner:'Argentina', note:'AET' },
      { home:'Switzerland', away:'Algeria', hs:2, as:0, winner:'Switzerland' },
      { home:'Colombia', away:'Ghana', hs:1, as:0, winner:'Colombia' },
    ],
    r16: [
      { home:'Belgium', away:'USA', hs:4, as:1, winner:'Belgium' },
      { home:'Argentina', away:'Egypt', hs:3, as:2, winner:'Argentina' },
      { home:'Spain', away:'Portugal', hs:1, as:0, winner:'Spain' },
      { home:'Switzerland', away:'Colombia', hs:0, as:0, winner:'Switzerland', pens:'4-3' },
    ],
    qf: [
      { home:'Spain', away:'Belgium', hs:2, as:1, winner:'Spain' },
      { home:'Argentina', away:'Switzerland', hs:3, as:1, winner:'Argentina', note:'AET' },
    ],
    sf: [
      { home:'Argentina', away:'England', hs:2, as:1, winner:'Argentina' },
    ],
  },
  final: { home:'Spain', away:'Argentina', hs:1, as:0, winner:'Spain', note:'AET' },
  thirdPlace: { home:'England', away:'France', hs:6, as:4, winner:'England' },
};

interface MatchData {
  home: string;
  away: string;
  hs: number;
  as: number;
  winner: string;
  pens?: string;
  note?: string;
}

function MatchSlot({ match }: { match: MatchData }) {
  const isHomeWinner = match.winner === match.home;
  const isAwayWinner = match.winner === match.away;

  return (
    <div style={{
      width: 160,
      background: '#111',
      border: `1px solid ${match.winner ? 'rgba(60,172,59,0.35)' : 'rgba(255,255,255,0.08)'}`,
      borderRadius: 8,
      padding: '8px 10px',
      fontSize: 12,
      fontFamily: "'Inter', sans-serif",
      boxShadow: '0 4px 14px rgba(0,0,0,0.5)',
      flexShrink: 0,
    }}>
      {/* Home team */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        opacity: isAwayWinner ? 0.4 : 1,
        marginBottom: 4
      }}>
        <span style={{
          fontWeight: 700,
          color: isHomeWinner ? '#3CAC3B' : '#fff',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          maxWidth: 105
        }}>
          {match.home}
        </span>
        <span style={{
          fontFamily: "'Bebas Neue', sans-serif",
          fontSize: 16,
          color: isHomeWinner ? '#3CAC3B' : 'rgba(255,255,255,0.6)'
        }}>
          {match.hs}
        </span>
      </div>

      {/* Divider */}
      <div style={{ height: 1, background: 'rgba(255,255,255,0.06)', margin: '3px 0' }} />

      {/* Away team */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        opacity: isHomeWinner ? 0.4 : 1,
        marginTop: 4
      }}>
        <span style={{
          fontWeight: 700,
          color: isAwayWinner ? '#3CAC3B' : '#fff',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          maxWidth: 105
        }}>
          {match.away}
        </span>
        <span style={{
          fontFamily: "'Bebas Neue', sans-serif",
          fontSize: 16,
          color: isAwayWinner ? '#3CAC3B' : 'rgba(255,255,255,0.6)'
        }}>
          {match.as}
        </span>
      </div>

      {/* Badges */}
      {(match.pens || match.note) && (
        <div style={{
          display: 'flex',
          gap: 4,
          justifyContent: 'flex-end',
          marginTop: 4,
          fontSize: 9,
          fontWeight: 700
        }}>
          {match.pens && (
            <span style={{
              background: 'rgba(234,179,8,0.15)',
              color: '#EAB308',
              border: '1px solid rgba(234,179,8,0.3)',
              padding: '1px 5px',
              borderRadius: 3
            }}>
              ({match.pens} P)
            </span>
          )}
          {match.note && (
            <span style={{
              background: 'rgba(59,130,246,0.15)',
              color: '#60A5FA',
              border: '1px solid rgba(59,130,246,0.3)',
              padding: '1px 5px',
              borderRadius: 3
            }}>
              ({match.note})
            </span>
          )}
        </div>
      )}
    </div>
  );
}

export default function BracketPage() {
  const css = `
    @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Inter:wght@400;500;600;700&display=swap');
    :root { --g:#3CAC3B; --b:#2A398D; --r:#E61D25; }
    *{box-sizing:border-box;} body{margin:0;background:#080808;}
    .wc-page{font-family:'Inter',sans-serif;background:#080808;color:#fff;min-height:100vh;}
    .top-stripe{height:4px;background:linear-gradient(90deg,var(--g) 33%,var(--b) 33% 66%,var(--r) 66%);position:sticky;top:0;z-index:100;}
    .wc-nav{position:sticky;top:4px;z-index:99;display:flex;align-items:center;justify-content:space-between;padding:12px 24px;background:rgba(8,8,8,0.92);backdrop-filter:blur(12px);border-bottom:1px solid rgba(255,255,255,0.05);}
    .wc-logo{font-family:'Bebas Neue',sans-serif;font-size:22px;color:#fff;letter-spacing:3px;}
    .wc-logo span{color:var(--g);}
    .nav-pills{display:flex;gap:6px;flex-wrap:wrap;}
    .np{font-size:10px;font-weight:700;padding:5px 12px;border-radius:3px;border:none;cursor:pointer;letter-spacing:1px;font-family:'Inter',sans-serif;text-transform:uppercase;}
    .np-g{background:var(--g);color:#fff;} .np-b{background:var(--b);color:#fff;} .np-r{background:var(--r);color:#fff;}
    
    .round-title {
      font-family: 'Bebas Neue', sans-serif;
      font-size: 14px;
      color: rgba(255,255,255,0.6);
      letter-spacing: 2px;
      text-align: center;
      margin-bottom: 12px;
      text-transform: uppercase;
    }

    .bracket-container {
      overflow-x: auto;
      padding: 30px 20px 60px;
      WebkitOverflowScrolling: touch;
    }

    .bracket-tree {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 20px;
      min-width: 1550px;
      height: 850px;
      margin: 0 auto;
    }

    .bracket-col {
      display: flex;
      flex-direction: column;
      height: 100%;
    }

    .col-r32 { justify-content: space-around; }
    .col-r16 { justify-content: space-around; }
    .col-qf  { justify-content: space-around; }
    .col-sf  { justify-content: center; }
    .col-final { justify-content: center; align-items: center; }
  `;

  return (
    <div className="wc-page">
      <style dangerouslySetInnerHTML={{ __html: css }} />
      <div className="top-stripe" />

      {/* Nav */}
      <nav className="wc-nav">
        <a href="/" style={{ textDecoration: 'none' }}>
          <div className="wc-logo">WC<span>26</span></div>
        </a>
        <div className="nav-pills">
          <a href="/" style={{ textDecoration: 'none' }}>
            <button className="np" style={{ background: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.7)', border: '1px solid rgba(255,255,255,0.2)' }}>
              ⌂ Home
            </button>
          </a>
          <a href="/schedule" style={{ textDecoration: 'none' }}>
            <button className="np np-g">📅 Schedule</button>
          </a>
          <a href="/news" style={{ textDecoration: 'none' }}>
            <button className="np" style={{ background: 'rgba(234,179,8,0.15)', color: '#EAB308', border: '1px solid rgba(234,179,8,0.4)' }}>
              🗞️ News
            </button>
          </a>
          <a href="/predict" style={{ textDecoration: 'none' }}>
            <button className="np" style={{ background: '#2A398D', color: '#fff', border: '1px solid rgba(42,57,141,0.8)' }}>
              🎯 Predict
            </button>
          </a>
        </div>
      </nav>

      {/* Header */}
      <section style={{ textAlign: 'center', padding: '40px 20px 10px' }}>
        <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(36px,6vw,56px)', color: '#fff', letterSpacing: 2 }}>
          Knockout <span style={{ color: '#FFD700' }}>Bracket</span>
        </div>
        <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', letterSpacing: 1 }}>
          FIFA World Cup 2026 · Official Tournament Results
        </div>
      </section>

      {/* Bracket Visual Tree */}
      <div className="bracket-container">
        <div className="bracket-tree">
          {/* LEFT SIDE: R32 -> R16 -> QF -> SF */}
          
          {/* Left R32 */}
          <div className="bracket-col col-r32">
            <div className="round-title">R32 (Left)</div>
            {BRACKET.left.r32.map((m, idx) => (
              <MatchSlot key={idx} match={m} />
            ))}
          </div>

          {/* Left R16 */}
          <div className="bracket-col col-r16">
            <div className="round-title">Round of 16</div>
            {BRACKET.left.r16.map((m, idx) => (
              <MatchSlot key={idx} match={m} />
            ))}
          </div>

          {/* Left QF */}
          <div className="bracket-col col-qf">
            <div className="round-title">Quarter Finals</div>
            {BRACKET.left.qf.map((m, idx) => (
              <MatchSlot key={idx} match={m} />
            ))}
          </div>

          {/* Left SF */}
          <div className="bracket-col col-sf">
            <div className="round-title">Semi Final</div>
            {BRACKET.left.sf.map((m, idx) => (
              <MatchSlot key={idx} match={m} />
            ))}
          </div>

          {/* CENTER: FINAL & CHAMPION BANNER & THIRD PLACE */}
          <div className="bracket-col col-final" style={{ gap: 24 }}>
            <div>
              <div className="round-title" style={{ color: '#FFD700' }}>World Cup Final</div>
              <MatchSlot match={BRACKET.final} />
              
              {/* Champion Banner */}
              <div style={{ textAlign: 'center', marginTop: 12 }}>
                <div style={{ fontSize: 24 }}>🏆</div>
                <div style={{
                  fontFamily: "'Bebas Neue',sans-serif",
                  fontSize: 20, color: '#FFD700', letterSpacing: 2
                }}>
                  SPAIN
                </div>
                <div style={{
                  fontSize: 10,
                  color: 'rgba(255,255,255,0.4)'
                }}>
                  World Champions 2026
                </div>
              </div>
            </div>

            {/* Third Place Match */}
            <div style={{ marginTop: 12 }}>
              <div className="round-title" style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>Third Place Match</div>
              <MatchSlot match={BRACKET.thirdPlace} />
            </div>
          </div>

          {/* RIGHT SIDE: SF <- QF <- R16 <- R32 */}

          {/* Right SF */}
          <div className="bracket-col col-sf">
            <div className="round-title">Semi Final</div>
            {BRACKET.right.sf.map((m, idx) => (
              <MatchSlot key={idx} match={m} />
            ))}
          </div>

          {/* Right QF */}
          <div className="bracket-col col-qf">
            <div className="round-title">Quarter Finals</div>
            {BRACKET.right.qf.map((m, idx) => (
              <MatchSlot key={idx} match={m} />
            ))}
          </div>

          {/* Right R16 */}
          <div className="bracket-col col-r16">
            <div className="round-title">Round of 16</div>
            {BRACKET.right.r16.map((m, idx) => (
              <MatchSlot key={idx} match={m} />
            ))}
          </div>

          {/* Right R32 */}
          <div className="bracket-col col-r32">
            <div className="round-title">R32 (Right)</div>
            {BRACKET.right.r32.map((m, idx) => (
              <MatchSlot key={idx} match={m} />
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer style={{ background: '#050505', borderTop: '1px solid rgba(255,255,255,0.05)', padding: '24px', textAlign: 'center', marginTop: 'auto' }}>
        <div style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 18, color: 'rgba(255,255,255,0.2)', letterSpacing: 3 }}>
          WC 2026 BRACKET
        </div>
        <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.2)', marginTop: 4 }}>
          Spain won the 2026 FIFA World Cup · July 19, 2026
        </div>
      </footer>
    </div>
  );
}
