'use client';
import React, { useState, useEffect, useRef } from 'react';

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

function TopScorers() {
  const FINAL_SCORERS = [
    {
      name: 'Kylian Mbappé',
      country: 'France',
      countryCode: 'fr',
      goals: 10,
      isWinner: true,
      award: '🥇 Golden Boot Winner'
    },
    {
      name: 'Lionel Messi',
      country: 'Argentina', 
      countryCode: 'ar',
      goals: 8,
      isWinner: false,
      award: '⚽ All-Time WC Record: 21 goals'
    },
    {
      name: 'Jude Bellingham',
      country: 'England',
      countryCode: 'gb-eng',
      goals: 7,
      isWinner: false,
      award: '🥉 3rd Place'
    },
    {
      name: 'Erling Haaland',
      country: 'Norway',
      countryCode: 'no',
      goals: 7,
      isWinner: false,
      award: '4th (assists tiebreaker)'
    },
    {
      name: 'Ousmane Dembélé',
      country: 'France',
      countryCode: 'fr',
      goals: 6,
      isWinner: false,
      award: '5th Place'
    },
  ];

  return (
    <section style={{background:'#080808',padding:'60px 24px'}}>
      <div style={{maxWidth:'1100px',margin:'0 auto'}}>
        <FadeSection>
          <div style={{marginBottom:24}}>
            <div style={{fontFamily:"'Bebas Neue',sans-serif",
              fontSize:'clamp(28px,5vw,42px)',color:'#fff',
              letterSpacing:2}}>
              Golden Boot{' '}
              <span style={{color:'#FFD700'}}>Contenders</span>
            </div>
            <div style={{fontSize:11,
              color:'rgba(255,255,255,0.3)',
              letterSpacing:1,marginTop:2}}>
              Final confirmed standings of the top goalscorers at the FIFA World Cup 2026.
            </div>
          </div>
        </FadeSection>

        {/* Winner Banner */}
        <FadeSection>
          <div style={{
            background:'rgba(255,215,0,0.08)',
            border:'1px solid rgba(255,215,0,0.25)',
            borderRadius:10, padding:'16px 20px',
            marginBottom:24,
            display:'flex', alignItems:'center', gap:12
          }}>
            <span style={{fontSize:32}}>🏆</span>
            <div>
              <div style={{
                fontFamily:"'Bebas Neue',sans-serif",
                fontSize:22, color:'#FFD700', letterSpacing:2
              }}>
                Mbappé Wins Golden Boot 2026
              </div>
              <div style={{fontSize:12,
                color:'rgba(255,255,255,0.5)',marginTop:2}}>
                10 goals · First player to win consecutive 
                Golden Boots · New all-time record: 22 WC goals
              </div>
            </div>
          </div>
        </FadeSection>

        {/* Players Grid */}
        <div style={{display:'grid',
          gridTemplateColumns:'repeat(auto-fill,minmax(260px,1fr))',
          gap:10}}>
          {FINAL_SCORERS.map((p, i) => {
            const maxGoals = 10;
            return (
              <FadeSection key={p.name} delay={i*80}>
                <div style={{background:'#111',
                  border: p.isWinner ? '1px solid rgba(255,215,0,0.3)' : '1px solid rgba(255,255,255,0.07)',
                  borderRadius:8,padding:16,
                  display:'flex',flexDirection:'column',
                  gap:10,
                  boxShadow: p.isWinner ? '0 4px 20px rgba(255,215,0,0.05)' : 'none'}}>
                  <div style={{display:'flex',
                    alignItems:'center',
                    justifyContent:'space-between'}}>
                    <div style={{display:'flex',
                      alignItems:'center',gap:10}}>
                      <img 
                        src={`https://flagcdn.com/32x24/${p.countryCode}.png`}
                        alt={p.country}
                        style={{width:28,height:20,
                          objectFit:'cover',borderRadius:2}}
                        onError={(e)=>{
                          (e.target as HTMLImageElement)
                            .style.display='none'
                        }}
                      />
                      <div>
                        <div style={{fontSize:13,fontWeight:700,
                          color:'#fff'}}>{p.name}</div>
                        <div style={{fontSize:11,
                          color:'rgba(255,255,255,0.3)',
                          marginTop:1}}>{p.country}</div>
                      </div>
                    </div>
                    <div style={{
                      fontFamily:"'Bebas Neue',sans-serif",
                      fontSize:36,color: p.isWinner ? '#FFD700' : '#fff',
                      lineHeight:1}}>
                      {p.goals}
                    </div>
                  </div>
                  <div>
                    <div style={{height:4,
                      background:'rgba(255,255,255,0.08)',
                      borderRadius:2,overflow:'hidden'}}>
                      <div style={{height:'100%',
                        width:`${(p.goals/maxGoals)*100}%`,
                        background: p.isWinner ? '#FFD700' : '#3CAC3B',borderRadius:2,
                        transition:'width 0.6s ease'}}/>
                    </div>
                    <div style={{marginTop:8,fontSize:11,
                      fontWeight: 600,
                      color: p.isWinner ? '#FFD700' : 'rgba(255,255,255,0.5)'}}>
                      {p.award}
                    </div>
                  </div>
                </div>
              </FadeSection>
            );
          })}
        </div>
        <div style={{marginTop:14,textAlign:'center',
          fontSize:11,color:'rgba(255,255,255,0.2)',
          letterSpacing:0.5}}>
          ⚽ Confirmed final standings for the 2026 Golden Boot.
        </div>
      </div>
    </section>
  );
}

export default function AboutPage() {
  const footballSVG = '<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32"><circle cx="16" cy="16" r="15" fill="white" stroke="%23222" stroke-width="1.5"/><polygon points="16,4 20,10 16,14 12,10" fill="%23111"/><polygon points="26,11 28,17 23,19 21,13" fill="%23111"/><polygon points="24,24 19,27 16,22 20,18" fill="%23111"/><polygon points="8,24 6,18 11,16 13,22" fill="%23111"/><polygon points="6,11 11,8 13,14 8,16" fill="%23111"/></svg>';
  const cursorUrl = `data:image/svg+xml,${footballSVG}`;

  const pageRef = useRef<HTMLDivElement>(null);

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
    
    .s-inner{max-width:720px;margin:0 auto;}
    .s-tag{display:inline-flex;align-items:center;gap:8px;margin-bottom:20px;}
    .s-tag-dot{width:8px;height:8px;border-radius:50%;}
    .s-tag-text{font-size:10px;font-weight:700;letter-spacing:4px;color:rgba(255,255,255,0.4);text-transform:uppercase;}
    .s-title{font-family:'Bebas Neue',sans-serif;font-size:clamp(40px,7vw,64px);color:#fff;letter-spacing:2px;line-height:0.92;margin-bottom:20px;}
    .s-body{font-size:14px;color:rgba(255,255,255,0.45);line-height:1.85;margin-bottom:28px;}
    .facts-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;}
    .fact{background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.07);border-radius:8px;padding:18px;text-align:center;}
    .fact-n{font-family:'Bebas Neue',sans-serif;font-size:30px;color:var(--g);line-height:1;margin-bottom:4px;}
    .fact-l{font-size:10px;color:rgba(255,255,255,0.3);letter-spacing:1px;text-transform:uppercase;}
    
    .dyk-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 16px; margin-bottom: 48px; }
    .dyk-card { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.07); border-radius: 10px; padding: 20px; transition: border-color 0.2s, transform 0.2s; }
    .dyk-card:hover { border-color: rgba(60,172,59,0.3); transform: translateY(-2px); }
    .dyk-icon { font-size: 28px; margin-bottom: 10px; }
    .dyk-stat { font-family: 'Bebas Neue', sans-serif; font-size: 28px; color: var(--g); margin-bottom: 6px; }
    .dyk-desc { font-family: 'Inter', sans-serif; font-size: 12px; color: rgba(255,255,255,0.4); line-height: 1.6; }
    
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
    .s-divider{height:1px;background:linear-gradient(90deg,transparent,rgba(255,255,255,0.06),transparent);margin: 20px 0;}
    
    @keyframes tfloat {
      50% { transform: translateY(-10px); }
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
      .stats-bar{grid-template-columns:repeat(2,1fr);}
      .facts-grid{grid-template-columns:repeat(2,1fr);}
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
    .trophy-detailed-section {
      margin-top: 48px;
      background: rgba(255,215,0,0.03);
      border: 1px solid rgba(255,215,0,0.12);
      border-radius: 12px;
      padding: 40px 32px;
      display: grid;
      grid-template-columns: 200px 1fr;
      gap: 40px;
      align-items: center;
    }
    @media(max-width:640px) {
      .trophy-detailed-section {
        grid-template-columns: 1fr;
        padding: 32px 20px;
        gap: 24px;
        text-align: center;
      }
      .trophy-detailed-section img {
        margin: 0 auto;
      }
    }
    @keyframes heartbeat {
      0% { transform: scale(1); }
      30% { transform: scale(1.4); }
      60% { transform: scale(0.9); }
      100% { transform: scale(1); }
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
            <a href="/" style={{textDecoration:'none'}}>
              <button className="np" style={{
                background:'rgba(255,255,255,0.08)',
                color:'rgba(255,255,255,0.7)',
                border:'1px solid rgba(255,255,255,0.2)'
              }}>
                ⌂ Home
              </button>
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

        {/* SECTION 1: HISTORY ON THE LINE */}
        <section style={{
          background:'#080808',
          padding:'80px 24px'
        }}>
          <div style={{maxWidth:'1100px',margin:'0 auto'}}>

            {/* Header */}
            <FadeSection>
              <div style={{marginBottom:40}}>
                <div style={{display:'flex',
                  alignItems:'center',gap:8,marginBottom:12}}>
                  <div style={{width:8,height:8,
                    borderRadius:'50%',
                    background:'#E61D25'}}/>
                  <span style={{fontSize:10,fontWeight:700,
                    letterSpacing:4,
                    color:'rgba(255,255,255,0.4)',
                    textTransform:'uppercase'}}>
                    History On The Line
                  </span>
                </div>
                <div style={{
                  fontFamily:"'Bebas Neue',sans-serif",
                  fontSize:'clamp(36px,7vw,64px)',
                  color:'#fff',letterSpacing:2,
                  lineHeight:0.92,marginBottom:12}}>
                  Records That Could<br/>
                  <span style={{color:'#E61D25'}}>
                    Fall In 2026
                  </span>
                </div>
                <div style={{fontSize:13,
                  color:'rgba(255,255,255,0.4)',
                  lineHeight:1.7,maxWidth:600}}>
                  This tournament could rewrite football 
                  history. These are the records that have 
                  stood for decades — and the players 
                  threatening to smash them.
                </div>
              </div>
            </FadeSection>

            {/* Record cards grid */}
            <div style={{display:'grid',
              gridTemplateColumns:
                'repeat(auto-fill,minmax(260px,1fr))',
              gap:10}}>

              {[
                {
                  icon:'⚽',
                  record:'All-Time Top Scorer',
                  current:'Miroslav Klose — 16 goals',
                  chaser:'Lionel Messi (13) needs 3 more',
                  chaser2:'Cristiano Ronaldo (8) needs 8 more',
                  progress: 100,
                  likelihood:'✅ BROKEN',
                  likelihoodColor:'#3CAC3B',
                  note:'Messi broke Klose\'s record with 21 goals. Then Mbappé overtook Messi with 22 career World Cup goals.',
                  accentColor:'#3CAC3B'
                },
                {
                  icon:'🏆',
                  record:'First 6-Time World Cup Player',
                  current:'Never achieved in history',
                  chaser:'Messi, Ronaldo & Ochoa all attempting',
                  chaser2:'Would be historic first',
                  progress:100,
                  likelihood:'✅ Confirmed',
                  likelihoodColor:'#3CAC3B',
                  note:'Messi, Ronaldo and Ochoa all appeared at their 6th World Cup. Historic first achieved by all three.',
                  accentColor:'#3CAC3B'
                },
                {
                  icon:'👴',
                  record:'Oldest World Cup Goal Scorer',
                  current:'Roger Milla — 42 years, 39 days (1994)',
                  chaser:'Cristiano Ronaldo will be 41 in June 2026',
                  chaser2:'Only 1 year younger than the record',
                  progress:0,
                  likelihood:'❌ Not broken',
                  likelihoodColor:'rgba(255,255,255,0.3)',
                  note:'Messi at 39 scored multiple goals but Roger Milla\'s record of 42 years stands.',
                  accentColor:'#FFD700'
                },
                {
                  icon:'🎯',
                  record:'Most Goals in Single Tournament',
                  current:"Just Fontaine — 13 goals (France, 1958)",
                  chaser:'Kylian Mbappé — scored 8 in 2022',
                  chaser2:'Erling Haaland on tournament debut',
                  progress:77,
                  likelihood:'⚡ Near miss',
                  likelihoodColor:'#FFD700',
                  note:'Mbappé scored 10 goals — incredible but Fontaine\'s 13 still stands. Closest anyone has come in decades.',
                  accentColor:'#2A398D'
                },
                {
                  icon:'🧤',
                  record:'Most World Cup Clean Sheets',
                  current:'Peter Shilton & Fabien Barthez — 10 each',
                  chaser:'Thibaut Courtois has 7 clean sheets',
                  chaser2:'Needs 4 more across 7 matches',
                  progress:70,
                  likelihood:'⚡ Possible',
                  likelihoodColor:'#FFD700',
                  note:'Belgium deep run needed. Courtois is in form.',
                  accentColor:'#FFD700'
                },
                {
                  icon:'📅',
                  record:'Most World Cup Appearances',
                  current:'Lothar Matthäus — 25 matches',
                  chaser:'Lionel Messi has 26 appearances already',
                  chaser2:'Already broken! Messi holds this record',
                  progress:100,
                  likelihood:'✅ Already broken',
                  likelihoodColor:'#3CAC3B',
                  note:'Messi surpassed Matthäus at Qatar 2022.',
                  accentColor:'#3CAC3B'
                },
                {
                  icon: '🤝',
                  record: 'Most World Cup Finals Played',
                  current: 'Germany — 8 finals (4W, 4L)',
                  chaser: 'Brazil have played 7 finals (5W, 2L)',
                  chaser2: 'Both could meet in the MetLife final',
                  progress: 55,
                  likelihood: '👀 Outsider',
                  likelihoodColor: 'rgba(255,255,255,0.4)',
                  note: 'Would require both to reach July 19 final.',
                  accentColor: '#474A4A'
                },
                {
                  icon: '⚡',
                  record: 'Fastest World Cup Hat-Trick',
                  current: 'Fastest WC hat-trick: Laszlo Kiss — 7 min',
                  chaser: 'Mbappé scored 3 in 12 mins at Qatar 2022',
                  chaser2: 'With 48 teams more mismatches possible',
                  progress: 45,
                  likelihood: '👀 Outsider',
                  likelihoodColor: 'rgba(255,255,255,0.4)',
                  note: 'More group stage mismatches in 48-team format increases chances.',
                  accentColor: '#474A4A'
                },
                {
                  icon: '🧱',
                  record: 'Most Consecutive Clean Sheets',
                  current: 'Walter Zenga (Italy) — 517 mins without conceding (1990)',
                  chaser: 'Modern GKs: Courtois, Alisson, Ederson',
                  chaser2: 'Any goalkeeper on a deep run could threaten this',
                  progress: 40,
                  likelihood: '👀 Outsider',
                  likelihoodColor: 'rgba(255,255,255,0.4)',
                  note: 'Longest-standing defensive record in World Cup history.',
                  accentColor: '#474A4A'
                }
              ].map((r, i) => (
                <FadeSection key={r.record} delay={i*80}>
                  <div style={{
                    background:'#111',
                    border:`1px solid rgba(255,255,255,0.07)`,
                    borderRadius:10,
                    padding:'14px 16px',
                    borderTop:`3px solid ${r.accentColor}`,
                    height:'100%'
                  }}>
                    <div style={{display:'flex',
                      alignItems:'flex-start',
                      justifyContent:'space-between',
                      marginBottom:6}}>
                      <span style={{fontSize:20}}>{r.icon}</span>
                      <span style={{
                        fontSize:9,fontWeight:700,
                        padding:'3px 8px',borderRadius:10,
                        background:`${r.likelihoodColor}20`,
                        color:r.likelihoodColor,
                        border:`1px solid ${r.likelihoodColor}40`,
                        letterSpacing:0.5,whiteSpace:'nowrap'
                      }}>
                        {r.likelihood}
                      </span>
                    </div>

                    <div style={{fontSize:11,fontWeight:700,
                      color:'rgba(255,255,255,0.35)',
                      letterSpacing:2,textTransform:'uppercase',
                      marginBottom:4}}>
                      {r.record}
                    </div>

                    <div style={{fontSize:13,fontWeight:700,
                      color:'#fff',marginBottom:6,lineHeight:1.3}}>
                      {r.current}
                    </div>

                    <div style={{fontSize:11,
                      color:r.accentColor,
                      marginBottom:2,fontWeight:600}}>
                      → {r.chaser}
                    </div>
                    <div style={{fontSize:10,
                      color:'rgba(255,255,255,0.3)',
                      marginBottom:10}}>
                      {r.chaser2}
                    </div>

                    {/* Progress bar */}
                    <div style={{marginBottom:8}}>
                      <div style={{display:'flex',
                        justifyContent:'space-between',
                        fontSize:10,
                        color:'rgba(255,255,255,0.3)',
                        marginBottom:5}}>
                        <span>Likelihood</span>
                        <span style={{color:r.accentColor,
                          fontWeight:700}}>
                          {r.progress}%
                        </span>
                      </div>
                      <div style={{height:4,
                        background:'rgba(255,255,255,0.08)',
                        borderRadius:2,overflow:'hidden'}}>
                        <div style={{
                          height:'100%',
                          width:`${r.progress}%`,
                          background:r.accentColor,
                          borderRadius:2,
                          transition:'width 1s ease'
                        }}/>
                      </div>
                    </div>

                    <div style={{fontSize:10,
                      color:'rgba(255,255,255,0.25)',
                      fontStyle:'italic',lineHeight:1.5,
                      borderLeft:
                        `2px solid ${r.accentColor}40`,
                      paddingLeft:6}}>
                      {r.note}
                    </div>
                  </div>
                </FadeSection>
              ))}
            </div>
          </div>
        </section>

        <div className="s-divider"/>

        {/* SECTION 2: GOLDEN BOOT CONTENDERS */}
        <TopScorers />

        <div className="s-divider"/>

        {/* SECTION 3: WHY 2026 IS SPECIAL */}
        <section style={{background:'#0d0d0d', padding:'80px 24px'}} id="why-2026">
          <div className="s-inner">
            <FadeSection>
              <div className="s-tag">
                <div className="s-tag-dot" style={{ background: 'var(--g)' }} />
                <span className="s-tag-text">🌍 The Tournament</span>
              </div>
            </FadeSection>
            <FadeSection delay={100}>
              <div className="s-title">Why 2026 Is<br /><span style={{ color: 'var(--g)' }}>Special</span></div>
            </FadeSection>
            <FadeSection delay={200}>
              <p className="s-body">For the first time ever, three nations unite to host football&apos;s greatest spectacle. The 23rd FIFA World Cup expands to 48 teams across 16 cities spanning the USA, Canada and Mexico. Argentina arrive as defending champions, chasing back-to-back glory at MetLife Stadium on July 19, 2026.</p>
            </FadeSection>
            
            <div className="facts-grid">
              {[{ n: '1st', l: '3-Nation Host Ever' }, { n: '48', l: 'Teams — Record High' }, { n: '3rd', l: 'Time Mexico Hosts' }].map(({ n, l }, i) => (
                <FadeSection key={l} delay={i * 120}>
                  <div className="fact">
                    <div className="fact-n">{n}</div>
                    <div className="fact-l">{l}</div>
                  </div>
                </FadeSection>
              ))}
            </div>
          </div>
        </section>

        <div className="s-divider"/>

        {/* SECTION 4: DID YOU KNOW? */}
        <section style={{background:'#0d0d0d', padding:'60px 24px'}} id="did-you-know">
          <div className="s-inner">
            <FadeSection>
              <div className="s-tag">
                <div className="s-tag-dot" style={{ background: 'var(--g)' }} />
                <span className="s-tag-text">⚽ Did You Know?</span>
              </div>
              <div className="s-title">Mind-Blowing<br />Facts</div>
            </FadeSection>

            <div className="dyk-grid">
              <FadeSection delay={50}>
                <div className="dyk-card">
                  <div className="dyk-icon">🌍</div>
                  <div className="dyk-stat">891 Players</div>
                  <div className="dyk-desc">are playing in their FIRST ever World Cup in 2026 — more tournament debutants than any edition in history</div>
                </div>
              </FadeSection>

              <FadeSection delay={100}>
                <div className="dyk-card">
                  <div className="dyk-icon">⚽</div>
                  <div className="dyk-stat">104 Matches</div>
                  <div className="dyk-desc">will be played across 39 days — up from 64 matches in Qatar 2022. Like a full Premier League season, but in 39 days</div>
                </div>
              </FadeSection>

              <FadeSection delay={150}>
                <div className="dyk-card">
                  <div className="dyk-icon">👴</div>
                  <div className="dyk-stat">26 Year Age Gap</div>
                  <div className="dyk-desc">between the youngest player (17-year-old Gilberto Mora, Mexico) and the oldest (43-year-old Craig Gordon, Scotland)</div>
                </div>
              </FadeSection>

              <FadeSection delay={200}>
                <div className="dyk-card">
                  <div className="dyk-icon">📺</div>
                  <div className="dyk-stat">5.5 Billion Viewers</div>
                  <div className="dyk-desc">projected global TV audience — more than 3x the number of people who watched the Super Bowl final</div>
                </div>
              </FadeSection>

              <FadeSection delay={250}>
                <div className="dyk-card">
                  <div className="dyk-icon">🏆</div>
                  <div className="dyk-stat">3 Players</div>
                  <div className="dyk-desc">Messi, Ronaldo and Ochoa are each playing their 6th World Cup — a feat never achieved before in history</div>
                </div>
              </FadeSection>

              <FadeSection delay={300}>
                <div className="dyk-card">
                  <div className="dyk-icon">💰</div>
                  <div className="dyk-stat">£1.7 Billion</div>
                  <div className="dyk-desc">in prize money — the largest ever World Cup prize pool, spread across 48 nations</div>
                </div>
              </FadeSection>
            </div>
          </div>
        </section>

        <div className="s-divider"/>

        {/* SECTION 5: TROPHY INFO */}
        <section style={{background:'#0d0d0d', padding:'60px 24px 100px'}} id="trophy-specs">
          <div className="s-inner">
            <FadeSection delay={350}>
              <div className="trophy-detailed-section">
                {/* Trophy image */}
                <div style={{textAlign:'center', position:'relative'}}>
                  <div style={{
                    position:'absolute', inset:0,
                    background:'radial-gradient(ellipse at center, rgba(255,215,0,0.12) 0%, transparent 70%)',
                    pointerEvents:'none'
                  }}/>
                  <img
                    src="/images/trophy.png"
                    alt="FIFA World Cup Trophy"
                    style={{
                      width: 160,
                      height: 'auto',
                      filter: 'drop-shadow(0 0 24px rgba(255,215,0,0.5)) drop-shadow(0 0 48px rgba(255,215,0,0.2))',
                      animation: 'tfloat 3s ease-in-out infinite'
                    }}
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                      const pEl = (e.target as HTMLImageElement).parentElement;
                      if (pEl) {
                        pEl.innerHTML = '<span style="font-size:96px; line-height:1;">🏆</span>';
                      }
                    }}
                  />
                </div>

                {/* Trophy info */}
                <div style={{ textAlign: 'left' }}>
                  <div style={{fontSize:10, fontWeight:700,
                    letterSpacing:4, color:'rgba(255,215,0,0.6)',
                    textTransform:'uppercase', marginBottom:10}}>
                    The Ultimate Prize
                  </div>
                  <div style={{
                    fontFamily:"'Bebas Neue',sans-serif",
                    fontSize:42, color:'#fff', 
                    letterSpacing:2, lineHeight:0.9,
                    marginBottom:16}}>
                    FIFA World Cup<br/>
                    <span style={{color:'#FFD700'}}>Trophy</span>
                  </div>
                  <div style={{
                    display:'grid', 
                    gridTemplateColumns:'repeat(2,1fr)',
                    gap:10, marginBottom:16}}>
                    {[
                      {n:'36.8cm', l:'Height'},
                      {n:'6.175kg', l:'Weight'},
                      {n:'18K Gold', l:'Material'},
                      {n:'1974', l:'First Awarded'},
                    ].map(({n,l}) => (
                      <div key={l} style={{
                        background:'rgba(255,215,0,0.05)',
                        border:'1px solid rgba(255,215,0,0.15)',
                        borderRadius:6, padding:'12px 14px'
                      }}>
                        <div style={{
                          fontFamily:"'Bebas Neue',sans-serif",
                          fontSize:22, color:'#FFD700', lineHeight:1}}>
                          {n}
                        </div>
                        <div style={{fontSize:10,
                          color:'rgba(255,255,255,0.35)',
                          letterSpacing:1, textTransform:'uppercase',
                          marginTop:2}}>
                          {l}
                        </div>
                      </div>
                    ))}
                  </div>
                  <p style={{fontSize:12, 
                    color:'rgba(255,255,255,0.35)',
                    lineHeight:1.7, margin:0,
                    borderLeft:'2px solid rgba(255,215,0,0.3)',
                    paddingLeft:12}}>
                    Crafted from 18-carat gold, featuring two human 
                    figures raising the globe — symbolising the joy of 
                    victory and the unity of nations. Presented at 
                    MetLife Stadium on July 19, 2026.
                  </p>
                </div>
              </div>
            </FadeSection>
          </div>
        </section>

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
