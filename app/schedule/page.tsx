'use client';
import React, { useState, useEffect, useRef, useMemo } from 'react';
import rawMatches from '@/data/matches.json';
import TimezoneSelector from '@/components/TimezoneSelector';
import MatchCard from '@/components/MatchCard';
import BracketTree from '@/components/BracketTree';

interface RawMatch {
  id: number; matchNumber: number; homeTeam: string | null; awayTeam: string | null;
  date: string; venue: string; group: string; stage: string; status: string; score: string | null;
}

function useFadeIn(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold }
    );
    obs.observe(el); return () => obs.disconnect();
  }, [threshold]);
  return { ref, visible };
}

function FadeSection({ children, delay = 0, className = '' }: { children: React.ReactNode; delay?: number; className?: string; }) {
  const { ref, visible } = useFadeIn();
  return (
    <div ref={ref} className={className} style={{ opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(36px)', transition: `opacity 0.75s ease ${delay}ms, transform 0.75s ease ${delay}ms` }}>
      {children}
    </div>
  );
}

export default function SchedulePage() {
  const footballSVG = '<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32"><circle cx="16" cy="16" r="15" fill="white" stroke="%23222" stroke-width="1.5"/><polygon points="16,4 20,10 16,14 12,10" fill="%23111"/><polygon points="26,11 28,17 23,19 21,13" fill="%23111"/><polygon points="24,24 19,27 16,22 20,18" fill="%23111"/><polygon points="8,24 6,18 11,16 13,22" fill="%23111"/><polygon points="6,11 11,8 13,14 8,16" fill="%23111"/></svg>';
  const cursorUrl = `data:image/svg+xml,${footballSVG}`;

  const [selectedTimezone, setSelectedTimezone] = useState('Asia/Kolkata');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTeam, setSelectedTeam] = useState('All');
  const [selectedStage, setSelectedStage] = useState('All');
  const pageRef = useRef<HTMLDivElement>(null);

  const [matches, setMatches] = useState<any[]>(rawMatches as any[]);
  const [view, setView] = useState<'fixtures' | 'bracket'>('fixtures');
  const [bracketMatches, setBracketMatches] = useState<any[]>([]);
  const [bracketLoading, setBracketLoading] = useState(true);

  const ROUNDS = [
    { name: 'Round of 32', short: 'R32', 
      matches: 16, dates: 'Jun 27 - Jul 1' },
    { name: 'Round of 16', short: 'R16', 
      matches: 8, dates: 'Jul 4 - Jul 7' },
    { name: 'Quarter Finals', short: 'QF', 
      matches: 4, dates: 'Jul 10 - Jul 11' },
    { name: 'Semi Finals', short: 'SF', 
      matches: 2, dates: 'Jul 15 - Jul 16' },
    { name: 'Final', short: 'F', 
      matches: 1, dates: 'Jul 19, 2026' },
  ];

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const tabParam = params.get('tab') || params.get('view');
      if (tabParam === 'bracket') {
        setView('bracket');
      }
    }
  }, []);

  useEffect(() => {
    fetch('/api/matches')
      .then(r => r.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setMatches(data);
        }
      })
      .catch(err => console.error('Failed to fetch matches:', err));

    const interval = setInterval(() => {
      fetch('/api/matches')
        .then(r => r.json())
        .then(data => {
          if (Array.isArray(data) && data.length > 0) {
            setMatches(data);
          }
        })
        .catch(() => {});
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setBracketLoading(false);
    }, 4000);

    fetch('/api/bracket')
      .then(r => r.json())
      .then(data => {
        clearTimeout(timeout);
        setBracketMatches(Array.isArray(data) ? data : []);
        setBracketLoading(false);
      })
      .catch(() => {
        clearTimeout(timeout);
        setBracketLoading(false);
      });

    return () => clearTimeout(timeout);
  }, []);

  const hasRealData = useMemo(() => bracketMatches.some(
    m => m.homeTeam?.name && m.homeTeam.name !== 'TBD'
  ), [bracketMatches]);

  const uniqueTeams = useMemo(() => {
    const s = new Set<string>();
    matches.forEach((m) => {
      const skip = (t: string) => t && (t.includes('Winner') || t.includes('Runner') || t.includes('Loser') || t === 'TBD');
      if (m.homeTeam && !skip(m.homeTeam)) s.add(m.homeTeam);
      if (m.awayTeam && !skip(m.awayTeam)) s.add(m.awayTeam);
    });
    return Array.from(s).sort();
  }, [matches]);

  const filteredMatches = useMemo(() => matches.filter((m) => {
    const home = m.homeTeam || 'TBD';
    const away = m.awayTeam || 'TBD';
    const tm = selectedTeam === 'All' || home.toLowerCase() === selectedTeam.toLowerCase() || away.toLowerCase() === selectedTeam.toLowerCase();
    const sm = !searchTerm || home.toLowerCase().includes(searchTerm.toLowerCase()) || away.toLowerCase().includes(searchTerm.toLowerCase()) || (m.venue || '').toLowerCase().includes(searchTerm.toLowerCase());
    const stm = selectedStage === 'All' || (selectedStage === 'Group Stage' && m.stage === 'Group Stage') || (selectedStage === 'Knockouts' && m.stage !== 'Group Stage');
    return tm && sm && stm;
  }), [matches, selectedTeam, searchTerm, selectedStage]);

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
    
    .s-schedule{background:#080808;padding:60px 24px;}
    .sch-header{max-width:1100px;margin:0 auto 24px;}
    .sch-title{font-family:'Bebas Neue',sans-serif;font-size:clamp(36px,6vw,54px);color:#fff;letter-spacing:2px;margin-bottom:4px;}
    .sch-title span{color:var(--g);}
    .sch-sub{font-size:12px;color:rgba(255,255,255,0.3);letter-spacing:1px;}
    .tz-row{max-width:1100px;margin:0 auto 16px;display:flex;align-items:center;justify-content:space-between;background:rgba(42,57,141,0.12);border:1px solid rgba(42,57,141,0.3);border-radius:8px;padding:12px 16px;flex-wrap:wrap;gap:10px;}
    .tz-left{font-size:12px;color:rgba(255,255,255,0.4);letter-spacing:1px;}
    .filters-row{max-width:1100px;margin:0 auto 16px;display:flex;gap:8px;flex-wrap:wrap;align-items:center;}
    .f-btn{background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.08);color:rgba(255,255,255,0.5);font-size:11px;font-weight:600;padding:7px 14px;border-radius:4px;cursor:pointer;letter-spacing:0.5px;text-transform:uppercase;font-family:'Inter',sans-serif;transition:all 0.15s;}
    .f-btn:hover{border-color:rgba(60,172,59,0.4);color:var(--g);}
    .f-btn.active{background:rgba(60,172,59,0.15);border-color:var(--g);color:var(--g);}
    .f-search{background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.08);color:#fff;font-size:12px;padding:7px 14px;border-radius:4px;font-family:'Inter',sans-serif;outline:none;}
    .f-search:focus{border-color:var(--g);}
    .f-search::placeholder{color:rgba(255,255,255,0.25);}
    .team-select{background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.08);color:rgba(255,255,255,0.6);font-size:11px;padding:7px 14px;border-radius:4px;font-family:'Inter',sans-serif;cursor:pointer;}
    .team-select option{background:#1a1a1a;color:#fff;}
    .match-list{max-width:1100px;margin:0 auto;}
    .match-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(320px,1fr));gap:12px;}
    .no-matches{text-align:center;padding:48px;font-size:14px;color:rgba(255,255,255,0.3);}
    .s-divider{height:1px;background:linear-gradient(90deg,transparent,rgba(255,255,255,0.06),transparent);margin:20px 0;}
    
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

    @media(max-width:640px){
      .match-grid{grid-template-columns:1fr;}
      .mobile-home-btn {
        display: inline-flex !important;
      }
      .nav-pills {
        overflow-x: auto;
        -webkit-overflow-scrolling: touch;
        scrollbar-width: none;
        padding-bottom: 2px;
      }
      .nav-pills::-webkit-scrollbar {
        display: none;
      }
    }
    
  `;

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: css }} />

      <div className="wc-page" ref={pageRef}>
        <div className="top-stripe" />

        {/* Nav */}
        <nav className="wc-nav">
          <a href="/" style={{textDecoration:'none'}}>
            <div style={{
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
            <a href="/" style={{textDecoration:'none'}}>
              <button className="np" style={{
                background:'rgba(255,255,255,0.08)',
                color:'rgba(255,255,255,0.7)',
                border:'1px solid rgba(255,255,255,0.2)'
              }}>
                ⌂ Home
              </button>
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
            <a href="/predict" style={{textDecoration:'none'}}>
              <button className="np" style={{
                background:'#2A398D',
                color:'#fff',
                border:'1px solid rgba(42,57,141,0.8)'
              }}>
                🎯 Predict
              </button>
            </a>
            <a href="/alerts" style={{textDecoration:'none'}}>
              <button className="np np-b">🔔 Get Alerts</button>
            </a>
          </div>
        </nav>

        {/* Header Section */}
        <section style={{background:'#080808', padding:'60px 24px 20px'}}>
          <div style={{maxWidth:'1100px', margin:'0 auto'}}>
            <div style={{fontFamily:"'Bebas Neue',sans-serif", 
              fontSize:'clamp(40px,7vw,64px)', color:'#fff', 
              letterSpacing:'2px', marginBottom:'4px'}}>
              {view === 'fixtures' ? (
                <>Full <span style={{color:'#3CAC3B'}}>Schedule</span></>
              ) : (
                <>Knockout <span style={{color:'#FFD700'}}>Bracket</span></>
              )}
            </div>
            <div style={{fontSize:'12px', color:'rgba(255,255,255,0.35)', 
              letterSpacing:'1px'}}>
              {view === 'fixtures' 
                ? 'All 104 fixtures · Times in your timezone'
                : 'Road to Glory · Round of 32 to the July 19 Final'
              }
            </div>
          </div>
        </section>

        {/* Sub-tab view switcher */}
        <div style={{maxWidth:'1100px', margin:'0 auto 24px', padding:'0 24px'}}>
          <div style={{
            display: 'flex', 
            borderBottom: '1px solid rgba(255,255,255,0.08)', 
            padding: '0', 
            gap: '32px'
          }}>
            <button 
              onClick={() => {
                setView('fixtures');
                if (typeof window !== 'undefined') {
                  const url = new URL(window.location.href);
                  url.searchParams.delete('view');
                  url.searchParams.delete('tab');
                  window.history.replaceState(null, '', url.pathname + url.search);
                }
              }}
              style={{
                background: 'transparent',
                border: 'none',
                borderBottom: view === 'fixtures' ? '3px solid var(--g)' : '3px solid transparent',
                color: view === 'fixtures' ? '#fff' : 'rgba(255,255,255,0.4)',
                fontSize: '13px',
                fontWeight: 700,
                padding: '10px 4px 14px 4px',
                cursor: 'pointer',
                letterSpacing: '1.5px',
                textTransform: 'uppercase',
                fontFamily: "'Inter', sans-serif",
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'all 0.15s ease',
              }}
            >
              📅 Fixtures
            </button>
            <button 
              onClick={() => {
                setView('bracket');
                if (typeof window !== 'undefined') {
                  const url = new URL(window.location.href);
                  url.searchParams.set('view', 'bracket');
                  window.history.replaceState(null, '', url.pathname + url.search);
                }
              }}
              style={{
                background: 'transparent',
                border: 'none',
                borderBottom: view === 'bracket' ? '3px solid #FFD700' : '3px solid transparent',
                color: view === 'bracket' ? '#fff' : 'rgba(255,255,255,0.5)',
                fontSize: '13px',
                fontWeight: 700,
                padding: '10px 4px 14px 4px',
                cursor: 'pointer',
                letterSpacing: '1.5px',
                textTransform: 'uppercase',
                fontFamily: "'Inter', sans-serif",
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'all 0.15s ease',
              }}
            >
              🏆 Bracket
            </button>
          </div>
        </div>

        {view === 'fixtures' ? (
          <>
            {/* Timezone Selector Row */}
            <div className="tz-row" style={{maxWidth:'1100px', margin:'0 auto 16px', display:'flex', alignItems:'center', justifyContent:'space-between', background:'rgba(42,57,141,0.12)', border:'1px solid rgba(42,57,141,0.3)', borderRadius:'8px', padding:'12px 16px', flexWrap:'wrap', gap:'10px'}}>
              <span className="tz-left">⏰ &nbsp;Showing times in</span>
              <TimezoneSelector selectedTimezone={selectedTimezone} onTimezoneChange={setSelectedTimezone} />
            </div>

            {/* Filters Row */}
            <div className="filters-row" style={{maxWidth:'1100px', margin:'0 auto 16px', display:'flex', gap:'8px', flexWrap:'wrap', alignItems:'center', padding:'0 16px'}}>
              {['All', 'Group Stage', 'Knockouts'].map((s) => (
                <button key={s} className={`f-btn${selectedStage === s ? ' active' : ''}`} onClick={() => setSelectedStage(s)}>{s}</button>
              ))}
              <select className="team-select" value={selectedTeam} onChange={(e) => setSelectedTeam(e.target.value)}>
                <option value="All">All Teams</option>
                {uniqueTeams.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
              <input className="f-search" placeholder="Search team or venue..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
            </div>

            {/* Match list */}
            <div className="match-list" style={{padding:'0 16px 80px'}}>
              {filteredMatches.length === 0
                ? <div className="no-matches">No matches found. Try adjusting your filters.</div>
                : <div className="match-grid">
                    {filteredMatches.map((match) => (
                      <MatchCard key={match.id} match={match} timezone={selectedTimezone} />
                    ))}
                  </div>
              }
            </div>
          </>
        ) : (
          /* Bracket View */
          <BracketTree />
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
