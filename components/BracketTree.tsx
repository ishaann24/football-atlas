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

export default function BracketTree() {
  const css = `
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

    @media(max-width: 768px) {
      .bracket-scroll-wrapper, .bracket-wrapper, .bracket-container {
        overflow-x: auto !important;
        -webkit-overflow-scrolling: touch !important;
        padding: 0 16px 24px !important;
        cursor: grab !important;
      }
      .bracket-scroll-wrapper::before, .bracket-wrapper::before, .bracket-container::before {
        content: '← Swipe to see full bracket →' !important;
        display: block !important;
        text-align: center !important;
        font-size: 11px !important;
        color: rgba(255,255,255,0.3) !important;
        letter-spacing: 1px !important;
        margin-bottom: 16px !important;
        padding-top: 8px !important;
      }
    }
  `;

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: css }} />
      <div className="bracket-container bracket-scroll-wrapper bracket-wrapper">
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
            <div style={{ margin: '0 16px', textAlign: 'center' }}>
              <div style={{
                fontSize: 10, fontWeight: 700,
                color: '#FFD700', letterSpacing: 3,
                textTransform: 'uppercase',
                marginBottom: 8
              }}>
                🏆 World Cup Final
              </div>
              
              {/* Final match card */}
              <div style={{
                background: 'rgba(255,215,0,0.05)',
                border: '2px solid rgba(255,215,0,0.4)',
                borderRadius: 8, width: 180, padding: '0 0 8px',
                margin: '0 auto'
              }}>
                {/* Spain — winner */}
                <div style={{
                  display: 'flex', justifyContent: 'space-between',
                  alignItems: 'center', padding: '8px 12px',
                  borderBottom: '1px solid rgba(255,255,255,0.06)'
                }}>
                  <span style={{
                    fontSize: 13, fontWeight: 700,
                    color: '#3CAC3B'
                  }}>
                    🇪🇸 Spain
                  </span>
                  <span style={{
                    fontFamily: "'Bebas Neue',sans-serif",
                    fontSize: 20, color: '#3CAC3B'
                  }}>1</span>
                </div>
                {/* Argentina */}
                <div style={{
                  display: 'flex', justifyContent: 'space-between',
                  alignItems: 'center', padding: '8px 12px',
                  opacity: 0.4
                }}>
                  <span style={{
                    fontSize: 13, fontWeight: 700, color: '#fff'
                  }}>
                    🇦🇷 Argentina
                  </span>
                  <span style={{
                    fontFamily: "'Bebas Neue',sans-serif",
                    fontSize: 20, color: 'rgba(255,255,255,0.5)'
                  }}>0</span>
                </div>
                {/* AET badge */}
                <div style={{
                  textAlign: 'center', marginTop: 4,
                  fontSize: 9, fontWeight: 700,
                  color: 'rgba(255,215,0,0.6)',
                  letterSpacing: 1
                }}>
                  AFTER EXTRA TIME
                </div>
              </div>

              {/* Champion banner */}
              <div style={{ marginTop: 16 }}>
                <div style={{ fontSize: 32 }}>🏆</div>
                <div style={{
                  fontFamily: "'Bebas Neue',sans-serif",
                  fontSize: 22, color: '#FFD700',
                  letterSpacing: 3, marginTop: 4
                }}>
                  SPAIN
                </div>
                <div style={{
                  fontSize: 10,
                  color: 'rgba(255,255,255,0.4)',
                  letterSpacing: 1, marginTop: 2
                }}>
                  World Champions 2026
                </div>
                <div style={{
                  fontSize: 10,
                  color: 'rgba(255,255,255,0.25)',
                  marginTop: 4
                }}>
                  July 19 · MetLife Stadium
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
    </>
  );
}
