'use client';
import React, { useState, useEffect } from 'react';

const ALL_TEAMS = [
  'Algeria', 'Argentina', 'Australia', 'Belgium', 'Brazil', 'Canada', 'Chile', 'Colombia',
  'Croatia', 'Czechia', 'Denmark', 'Ecuador', 'England', 'France', 'Germany', 'Japan',
  'Mexico', 'Morocco', 'Netherlands', 'Nigeria', 'Norway', 'Peru', 'Poland', 'Portugal',
  'Saudi Arabia', 'Senegal', 'Serbia', 'South Korea', 'Spain', 'Switzerland', 'Uruguay', 'USA'
].sort();

const TEAM_COLORS: Record<string, string> = {
  'Brazil': '#009C3B',
  'France': '#003189',
  'Argentina': '#43A1D5',
  'England': '#CF081F',
  'Germany': '#000000',
  'Spain': '#AA151B',
  'Portugal': '#006600',
  'Netherlands': '#FF6600',
  'Morocco': '#C1272D',
  'USA': '#002868',
  'Mexico': '#006847',
  'Japan': '#BC002D',
  'Croatia': '#FF0000',
  'Belgium': '#000000',
  'Uruguay': '#5EB6E4',
};

interface PollData {
  topTeams: Array<{
    team: string;
    votes: number;
    percentage: number;
  }>;
  total: number;
}

export default function FanPoll() {
  const [pollData, setPollData] = useState<PollData>({ topTeams: [], total: 0 });
  const [selectedTeam, setSelectedTeam] = useState('');
  const [voted, setVoted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [voting, setVoting] = useState(false);
  const [message, setMessage] = useState('');

  const tournamentOver = new Date() > new Date('2026-07-19T23:59:00Z');

  // Check if already voted (localStorage)
  useEffect(() => {
    const hasVoted = localStorage.getItem('wc26_poll_voted');
    if (hasVoted) setVoted(true);
    fetchResults();
  }, []);

  const fetchResults = () => {
    const timeout = setTimeout(() => {
      setLoading(false);
    }, 4000);

    fetch('/api/poll')
      .then(r => r.json())
      .then(data => {
        clearTimeout(timeout);
        if (data && data.topTeams) {
          setPollData(data);
        }
        setLoading(false);
      })
      .catch(() => {
        clearTimeout(timeout);
        setLoading(false);
      });
  };

  const handleVote = async () => {
    if (!selectedTeam || voting) return;
    setVoting(true);

    try {
      const res = await fetch('/api/poll', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ team: selectedTeam })
      });
      const data = await res.json();

      if (data.alreadyVoted) {
        setMessage('You have already voted!');
        setVoted(true);
      } else if (data.success) {
        localStorage.setItem('wc26_poll_voted', selectedTeam);
        setVoted(true);
        setMessage(`Your vote for ${selectedTeam} is in! 🎉`);
        fetchResults();
      }
    } catch (e) {
      console.error(e);
    }
    setVoting(false);
  };

  const getBarColor = (team: string, idx: number) => {
    if (TEAM_COLORS[team]) return TEAM_COLORS[team];
    const colors = [
      '#3CAC3B', '#2A398D', '#474A4A', '#856404'
    ];
    return colors[idx % colors.length];
  };

  return (
    <>
      <div style={{
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: 12,
        padding: '28px 32px',
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: 40,
        alignItems: 'center'
      }}>
        {/* Left side */}
        <div>
          <div style={{
            fontSize: 10, fontWeight: 700,
            letterSpacing: 3,
            color: '#3CAC3B',
            textTransform: 'uppercase' as const,
            marginBottom: 10
          }}>
            Fan Poll
          </div>
          <div style={{
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: 'clamp(28px,4vw,42px)',
            color: '#fff',
            letterSpacing: 2,
            lineHeight: 1,
            marginBottom: 12
          }}>
            Who Lifts<br/>The Trophy?
          </div>
          <div style={{
            fontSize: 13,
            color: 'rgba(255,255,255,0.4)',
            lineHeight: 1.6,
            marginBottom: 24
          }}>
            Cast your vote for the 2026 champion.
            Top 4 most voted teams shown.
          </div>

          {tournamentOver ? (
            <div>
              <div style={{
                background:'rgba(255,215,0,0.08)',
                border:'1px solid rgba(255,215,0,0.25)',
                borderRadius:8, padding:'14px 16px',
                marginBottom:16,
                display:'flex', alignItems:'center', gap:10
              }}>
                <span style={{fontSize:24}}>🏆</span>
                <div>
                  <div style={{fontSize:14,fontWeight:700,
                    color:'#FFD700'}}>
                    Spain won the World Cup!
                  </div>
                  <div style={{fontSize:11,
                    color:'rgba(255,255,255,0.4)',marginTop:2}}>
                    1-0 vs Argentina (AET) · July 19, 2026
                  </div>
                </div>
              </div>
              <div style={{fontSize:12,
                color:'rgba(255,255,255,0.4)'}}>
                {(pollData.total || 0).toLocaleString()} fans voted during the tournament
              </div>
            </div>
          ) : (
            <>
              {!voted ? (
                <div style={{
                  display: 'flex', gap: 10,
                  flexWrap: 'wrap' as const
                }}>
                  <select
                    value={selectedTeam}
                    onChange={e => setSelectedTeam(e.target.value)}
                    style={{
                      flex: 1, minWidth: 160,
                      padding: '10px 14px',
                      background: 'rgba(255,255,255,0.06)',
                      border: '1px solid rgba(255,255,255,0.12)',
                      borderRadius: 6,
                      color: selectedTeam ? '#fff' : 'rgba(255,255,255,0.4)',
                      fontSize: 14,
                      fontFamily: "'Inter', sans-serif",
                      cursor: 'pointer',
                      outline: 'none'
                    }}>
                    <option value="">Vote for a team...</option>
                    {ALL_TEAMS.map(t => (
                      <option key={t} value={t}
                        style={{background:'#1a1a1a', color:'#fff'}}>
                        {t}
                      </option>
                    ))}
                  </select>
                  <button
                    onClick={handleVote}
                    disabled={!selectedTeam || voting}
                    style={{
                      padding: '10px 24px',
                      background: selectedTeam ? '#3CAC3B' : 'rgba(255,255,255,0.1)',
                      border: 'none',
                      borderRadius: 6,
                      color: '#fff',
                      fontSize: 13,
                      fontWeight: 700,
                      cursor: selectedTeam ? 'pointer' : 'not-allowed',
                      letterSpacing: 1.5,
                      textTransform: 'uppercase' as const,
                      fontFamily: "'Inter', sans-serif",
                      transition: 'all 0.2s',
                      opacity: voting ? 0.6 : 1
                    }}>
                    {voting ? '...' : 'Vote'}
                  </button>
                </div>
              ) : (
                <div style={{
                  background: 'rgba(60,172,59,0.1)',
                  border: '1px solid rgba(60,172,59,0.3)',
                  borderRadius: 8,
                  padding: '12px 16px',
                  fontSize: 13,
                  color: '#3CAC3B',
                  fontWeight: 600
                }}>
                  ✓ {message || `You voted for ${localStorage.getItem('wc26_poll_voted')}!`}
                </div>
              )}

              <div style={{
                marginTop: 16, fontSize: 11,
                color: 'rgba(255,255,255,0.25)'
              }}>
                {loading ? 'Loading...' : `${(pollData.total || 0).toLocaleString()} total votes cast`}
              </div>
            </>
          )}
        </div>

        {/* Right side — results bars */}
        <div style={{
          display: 'flex',
          flexDirection: 'column' as const,
          gap: 12
        }}>
          {loading ? (
            [1,2,3,4].map(i => (
              <div key={i} style={{
                height: 48,
                background: 'rgba(255,255,255,0.05)',
                borderRadius: 6,
                animation: 'pulse 1.5s infinite'
              }}/>
            ))
          ) : pollData.topTeams.length === 0 ? (
            <div style={{
              textAlign: 'center' as const,
              padding: '32px 16px',
              color: 'rgba(255,255,255,0.3)',
              fontSize: 13
            }}>
              No votes yet.<br/>Be the first to vote! 🗳️
            </div>
          ) : (
            pollData.topTeams.map((t, i) => (
              <div key={t.team} style={{
                position: 'relative' as const,
                height: 52,
                borderRadius: 6,
                overflow: 'hidden',
                background: 'rgba(255,255,255,0.05)'
              }}>
                {/* Color fill bar */}
                <div style={{
                  position: 'absolute' as const,
                  top: 0, left: 0, bottom: 0,
                  width: `${t.percentage}%`,
                  background: getBarColor(t.team, i),
                  opacity: 0.7,
                  transition: 'width 0.8s ease',
                  borderRadius: 6
                }}/>
                {/* Team name + % */}
                <div style={{
                  position: 'absolute' as const,
                  inset: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0 14px',
                  zIndex: 1
                }}>
                  <span style={{
                    fontFamily: "'Bebas Neue',sans-serif",
                    fontSize: 18,
                    color: '#fff',
                    letterSpacing: 2
                  }}>
                    {t.team}
                  </span>
                  <span style={{
                    fontFamily: "'Bebas Neue',sans-serif",
                    fontSize: 18,
                    color: 'rgba(255,255,255,0.7)',
                    letterSpacing: 1
                  }}>
                    {t.percentage}%
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
}
