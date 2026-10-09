'use client';
import React, { useState, useEffect, useRef } from 'react';
import rawMatches from '@/data/matches.json';
import { FINAL_STANDINGS } from '@/lib/static-standings';
import RegisterForm from '@/components/RegisterForm';
import NewsStrip from '@/components/NewsStrip';
import FanPoll from '@/components/FanPoll';

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

function Countdown() {
  const [status, setStatus] = useState<'loading' | 'pre' | 'live' | 'post'>('post');
  const [time, setTime] = useState({ d: '00', h: '00', m: '00', s: '00' });

  useEffect(() => {
    const target = new Date('2026-06-11T19:00:00Z').getTime();
    const finalDate = new Date('2026-07-19T23:59:59Z').getTime();

    const tick = () => {
      const now = Date.now();
      if (now < target) {
        setStatus('pre');
        const diff = Math.max(0, target - now);
        const p = (n: number) => String(n).padStart(2, '0');
        setTime({
          d: p(Math.floor(diff / 86400000)),
          h: p(Math.floor((diff % 86400000) / 3600000)),
          m: p(Math.floor((diff % 3600000) / 60000)),
          s: p(Math.floor((diff % 60000) / 1000))
        });
      } else if (now >= target && now <= finalDate) {
        setStatus('live');
      } else {
        setStatus('post');
      }
    };

    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  if (status === 'loading') {
    return (
      <div style={{ height: 60, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,0.4)', fontSize: 13 }}>
        Loading...
      </div>
    );
  }

  if (status === 'live') {
    return (
      <div style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 12,
        background: 'rgba(230, 29, 37, 0.08)',
        border: '1px solid rgba(230, 29, 37, 0.3)',
        borderRadius: '50px',
        padding: '10px 24px',
        boxShadow: '0 8px 32px rgba(230, 29, 37, 0.15)',
        backdropFilter: 'blur(8px)',
        animation: 'pulse-glow 2s infinite ease-in-out'
      }}>
        <span style={{
          width: 10,
          height: 10,
          borderRadius: '50%',
          background: '#E61D25',
          boxShadow: '0 0 10px #E61D25',
          animation: 'pdot 1.2s infinite'
        }} />
        <span style={{
          fontFamily: "'Bebas Neue', sans-serif",
          fontSize: 22,
          color: '#fff',
          letterSpacing: 2,
          textTransform: 'uppercase'
        }}>
          Tournament Live
        </span>
      </div>
    );
  }

  if (status === 'post') {
    return (
      <div style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 12,
        background: 'linear-gradient(135deg, rgba(255, 215, 0, 0.1) 0%, rgba(255, 215, 0, 0.02) 100%)',
        border: '1px solid rgba(255, 215, 0, 0.35)',
        borderRadius: '16px',
        padding: '16px 28px',
        boxShadow: '0 8px 32px rgba(255, 215, 0, 0.1)',
        backdropFilter: 'blur(8px)'
      }}>
        <span style={{ fontSize: 24 }}>🏆</span>
        <div style={{ textAlign: 'left' }}>
          <div style={{
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: 24,
            color: '#FFD700',
            letterSpacing: 1.5,
            lineHeight: 1
          }}>
            Tournament Complete
          </div>
          <div style={{
            fontSize: 11,
            color: 'rgba(255, 255, 255, 0.5)',
            marginTop: 4,
            fontWeight: 500
          }}>
            Spain are World Champions 2026
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
      {[{ val: time.d, label: 'Days' }, { val: time.h, label: 'Hours' }, { val: time.m, label: 'Mins' }, { val: time.s, label: 'Secs' }].map(({ val, label }) => (
        <div key={label} style={{ textAlign: 'center' }}>
          <div style={{
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: 'clamp(36px,8vw,52px)',
            color: '#fff',
            lineHeight: 1,
            background: 'rgba(255,255,255,0.07)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: 8,
            padding: '8px 14px',
            minWidth: 64,
            display: 'block'
          }}>{val}</div>
          <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.35)', letterSpacing: 3, textTransform: 'uppercase' as const, marginTop: 6 }}>{label}</div>
        </div>
      ))}
    </div>
  );
}

function getDaysDisplay() {
  const now = Date.now();
  const kickoff = new Date('2026-06-11T19:00:00Z').getTime();
  const finalDate = new Date('2026-07-19T23:59:59Z').getTime();

  if (now < kickoff) {
    const diff = kickoff - now;
    const days = Math.ceil(diff / 86400000);
    return { n: `${days}`, l: days === 1 ? 'Day Left' : 'Days' };
  } else if (now >= kickoff && now <= finalDate) {
    const diff = now - kickoff;
    const dayOfTournament = Math.floor(diff / 86400000) + 1;
    return { n: `Day ${dayOfTournament}`, l: 'of 39' };
  } else {
    return { n: 'Ended', l: 'Tournament' };
  }
}


function TodaysMatches() {
  return (
    <section id="matches-section" style={{background:'#080808',padding:'40px 24px'}}>
      <div style={{maxWidth:'1100px',margin:'0 auto'}}>
        <div style={{
          background:'rgba(255,255,255,0.03)',
          border:'1px solid rgba(255,255,255,0.07)',
          borderRadius:10, padding:'24px',
          textAlign:'center'
        }}>
          <div style={{fontSize:28, marginBottom:8}}>🏆</div>
          <div style={{
            fontFamily:"'Bebas Neue',sans-serif",
            fontSize:22, color:'#FFD700', letterSpacing:2,
            marginBottom:6
          }}>
            Tournament Complete
          </div>
          <div style={{fontSize:13,
            color:'rgba(255,255,255,0.4)',
            lineHeight:1.7}}>
            Spain won the 2026 FIFA World Cup · 
            104 matches played · 
            June 11 - July 19
          </div>
          <a href="/schedule" style={{
            display:'inline-block', marginTop:16,
            background:'rgba(60,172,59,0.1)',
            border:'1px solid rgba(60,172,59,0.3)',
            color:'#3CAC3B', borderRadius:6,
            padding:'10px 20px', fontSize:12,
            fontWeight:700, textDecoration:'none',
            letterSpacing:1
          }}>
            📅 View All Results →
          </a>
        </div>
      </div>
    </section>
  );
}

function GroupStandings() {
  const groups = ['A','B','C','D','E','F','G','H','I','J','K','L'];
  const [activeGroup, setActiveGroup] = useState('A');
  const table = FINAL_STANDINGS[activeGroup as keyof typeof FINAL_STANDINGS] || [];

  return (
    <section style={{background:'#0d0d0d',padding:'60px 24px'}}>
      <div style={{maxWidth:'1100px',margin:'0 auto'}}>
        <FadeSection>
          <div style={{display:'flex',alignItems:'flex-start',
            justifyContent:'space-between',
            flexWrap:'wrap',gap:12,marginBottom:24}}>
            <div>
              <div style={{fontFamily:"'Bebas Neue',sans-serif",
                fontSize:'clamp(28px,5vw,42px)',color:'#fff',
                letterSpacing:2}}>
                Group <span style={{color:'#3CAC3B'}}>Standings</span>
              </div>
              <div style={{fontSize:11,
                color:'rgba(255,255,255,0.3)',
                letterSpacing:1,marginTop:2}}>
                Final Group Stage Standings
              </div>
            </div>
            <a href="/schedule" style={{fontSize:12,
              color:'rgba(255,255,255,0.3)',
              textDecoration:'none',letterSpacing:1,
              marginTop:8}}>
              Full schedule →
            </a>
          </div>
        </FadeSection>

        {/* Group tabs */}
        <div style={{display:'flex',gap:6,
          flexWrap:'wrap',marginBottom:16}}>
          {groups.map((g) => (
            <button key={g} onClick={() => setActiveGroup(g)}
              style={{
                background: activeGroup===g 
                  ? '#3CAC3B' : 'rgba(255,255,255,0.05)',
                border:`1px solid ${activeGroup===g 
                  ? '#3CAC3B' : 'rgba(255,255,255,0.08)'}`,
                color: activeGroup===g 
                  ? '#fff' : 'rgba(255,255,255,0.4)',
                fontFamily:"'Bebas Neue',sans-serif",
                fontSize:16,letterSpacing:2,
                padding:'5px 14px',borderRadius:4,
                cursor:'pointer',transition:'all 0.15s'
              }}>
              {g}
            </button>
          ))}
        </div>

        {/* Table */}
        <div style={{background:'#111',
          border:'1px solid rgba(255,255,255,0.07)',
          borderRadius:8,overflow:'hidden'}}>
          <div style={{display:'grid',
            gridTemplateColumns:'28px 1fr 32px 32px 32px 32px 36px 44px',
            padding:'10px 16px',
            background:'rgba(255,255,255,0.04)',
            borderBottom:'1px solid rgba(255,255,255,0.07)',
            fontSize:10,fontWeight:700,
            color:'rgba(255,255,255,0.3)',
            letterSpacing:1,textTransform:'uppercase' as const,
            gap:4}}>
            <span>#</span>
            <span>Team</span>
            <span style={{textAlign:'center' as const}}>P</span>
            <span style={{textAlign:'center' as const}}>W</span>
            <span style={{textAlign:'center' as const}}>D</span>
            <span style={{textAlign:'center' as const}}>L</span>
            <span style={{textAlign:'center' as const}}>GD</span>
            <span style={{textAlign:'center' as const,
              color:'#3CAC3B'}}>PTS</span>
          </div>

          {table.map((row, i) => (
            <div key={row.team} style={{display:'grid',
              gridTemplateColumns:'28px 1fr 32px 32px 32px 32px 36px 44px',
              padding:'12px 16px',gap:4,
              borderBottom:i<table.length-1
                ?'1px solid rgba(255,255,255,0.04)':'none',
              background:row.qualified
                ?'rgba(60,172,59,0.06)':'transparent',
              alignItems:'center'}}>
              <span style={{fontSize:13,fontWeight:700,
                color:row.qualified?'#3CAC3B':'rgba(255,255,255,0.3)'}}>
                {i + 1}
              </span>
              <div style={{display:'flex',
                alignItems:'center',gap:8}}>
                <img src={`https://flagcdn.com/w40/${row.flag}.png`} 
                  alt={row.team}
                  style={{width:22,height:15,
                    objectFit:'cover',borderRadius:2}}
                  onError={(e)=>{
                    (e.target as HTMLImageElement).style.display='none'
                  }}/>
                <span style={{fontSize:13,fontWeight:600,
                  color:'#fff'}}>
                  {row.team}
                </span>
              </div>
              <span style={{textAlign:'center',fontSize:13,color:'rgba(255,255,255,0.5)'}}>{row.p}</span>
              <span style={{textAlign:'center',fontSize:13,color:'rgba(255,255,255,0.5)'}}>{row.w}</span>
              <span style={{textAlign:'center',fontSize:13,color:'rgba(255,255,255,0.5)'}}>{row.d}</span>
              <span style={{textAlign:'center',fontSize:13,color:'rgba(255,255,255,0.5)'}}>{row.l}</span>
              <span style={{textAlign:'center',fontSize:13,color:'rgba(255,255,255,0.5)'}}>
                {row.gd > 0 ? `+${row.gd}` : row.gd}
              </span>
              <span style={{textAlign:'center',fontSize:13,color:'#fff',fontWeight:700}}>{row.pts}</span>
            </div>
          ))}
        </div>

        <div style={{marginTop:10,fontSize:11,
          color:'rgba(255,255,255,0.2)',textAlign:'center' as const,
          letterSpacing:0.5}}>
          ✅ Top 2 per group + best 3rd-place teams advanced
          <span style={{color:'#3CAC3B'}}> · Green = qualified</span>
        </div>
      </div>
    </section>
  );
}



export default function Home() {
  const [heroOffset, setHeroOffset] = useState(0);
  const [showToast, setShowToast] = useState(false);
  const pageRef = useRef<HTMLDivElement>(null);

  const dayInfo = getDaysDisplay();

  const footballSVG = '<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32"><circle cx="16" cy="16" r="15" fill="white" stroke="%23222" stroke-width="1.5"/><polygon points="16,4 20,10 16,14 12,10" fill="%23111"/><polygon points="26,11 28,17 23,19 21,13" fill="%23111"/><polygon points="24,24 19,27 16,22 20,18" fill="%23111"/><polygon points="8,24 6,18 11,16 13,22" fill="%23111"/><polygon points="6,11 11,8 13,14 8,16" fill="%23111"/></svg>';
  const cursorUrl = `data:image/svg+xml,${footballSVG}`;

  const handleWhatsAppComingSoon = () => { setShowToast(true); setTimeout(() => setShowToast(false), 3500); };

  useEffect(() => {
    const h = () => setHeroOffset(window.scrollY);
    window.addEventListener('scroll', h, { passive: true });
    return () => window.removeEventListener('scroll', h);
  }, []);

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
    .wc-hero{position:relative;min-height:100vh;display:flex;flex-direction:column;align-items:center;justify-content:center;overflow:hidden;}
    .hero-bg{position:absolute;inset:0;background-size:cover;background-position:center top;will-change:transform;}
    .hero-overlay{position:absolute;inset:0;background:linear-gradient(to bottom,rgba(8,8,8,0.25) 0%,rgba(8,8,8,0.6) 55%,rgba(8,8,8,1) 100%);}
    .hero-content{position:relative;z-index:2;text-align:center;padding:40px 20px;}
    .hero-eyebrow{font-size:10px;font-weight:700;letter-spacing:5px;color:rgba(255,255,255,0.4);text-transform:uppercase;margin-bottom:16px;}
    .hero-eyebrow span{color:var(--g);}
    .hero-title{font-family:'Bebas Neue',sans-serif;font-size:clamp(72px,15vw,120px);color:#fff;line-height:0.88;letter-spacing:3px;margin-bottom:12px;}
    .hero-title .tc{color:var(--g);} .hero-title .rc{color:var(--r);}
    .hero-dates{font-size:12px;color:rgba(255,255,255,0.4);letter-spacing:3px;text-transform:uppercase;margin-bottom:32px;}
    @keyframes pdot{0%,100%{opacity:1;transform:scale(1);}50%{opacity:0.35;transform:scale(0.65);}}
    .hero-ctas{display:flex;gap:10px;justify-content:center;flex-wrap:wrap;margin-top:24px;}
    .cta-primary{background:var(--r);color:#fff;border:none;padding:14px 28px;border-radius:5px;font-size:12px;font-weight:700;cursor:pointer;letter-spacing:1.5px;text-transform:uppercase;font-family:'Inter',sans-serif;}
    .cta-secondary{background:transparent;color:#fff;border:1px solid rgba(255,255,255,0.25);padding:14px 28px;border-radius:5px;font-size:12px;font-weight:600;cursor:pointer;letter-spacing:1px;text-transform:uppercase;font-family:'Inter',sans-serif;}
    .hero-scroll{display:flex;flex-direction:column;align-items:center;gap:8px;margin-top:36px;opacity:0.35;}
    .hero-scroll span{font-size:9px;letter-spacing:4px;color:#fff;text-transform:uppercase;}
    .scroll-line{width:1px;height:36px;background:linear-gradient(to bottom,rgba(255,255,255,0),#fff);}
    
    .stats-bar{display:grid;grid-template-columns:repeat(4,1fr);}
    .sb{padding:18px 10px;text-align:center;}
    .sb-n{font-family:'Bebas Neue',sans-serif;font-size:32px;color:#fff;line-height:1;}
    .sb-l{font-size:9px;color:rgba(255,255,255,0.65);letter-spacing:2px;text-transform:uppercase;margin-top:3px;}
    .s-divider{height:1px;background:linear-gradient(90deg,transparent,rgba(255,255,255,0.06),transparent);}
    
    .s-tag{display:inline-flex;align-items:center;gap:8px;margin-bottom:20px;}
    .s-tag-dot{width:8px;height:8px;border-radius:50%;}
    .s-tag-text{font-size:10px;font-weight:700;letter-spacing:4px;color:rgba(255,255,255,0.4);text-transform:uppercase;}
    .s-title{font-family:'Bebas Neue',sans-serif;font-size:clamp(40px,7vw,64px);color:#fff;letter-spacing:2px;line-height:0.92;margin-bottom:20px;}

    /* Features section redesign */
    .features-section {
      background: #0d0d0d;
      padding: 80px 24px;
    }
    .features-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 20px;
      max-width: 1200px;
      margin: 0 auto 40px;
    }
    .feature-card {
      background: #141414;
      border: 1px solid rgba(255,255,255,0.06);
      border-radius: 12px;
      padding: 24px;
      transition: all 0.25s ease;
      display: flex;
      flex-direction: column;
      gap: 12px;
      position: relative;
      overflow: hidden;
      text-align: left;
    }
    .feature-card:hover {
      transform: translateY(-4px);
      border-color: rgba(255,255,255,0.12);
      box-shadow: 0 8px 24px rgba(0,0,0,0.3);
    }
    .feature-icon-wrapper {
      width: 40px;
      height: 40px;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 20px;
      margin-bottom: 4px;
    }
    .feature-card-title {
      font-family: 'Bebas Neue', sans-serif;
      font-size: 18px;
      letter-spacing: 1px;
      margin: 0;
      color: #fff;
    }
    .feature-card-desc {
      font-size: 12px;
      color: rgba(255,255,255,0.45);
      line-height: 1.6;
      margin: 0;
      flex: 1;
    }
    .feature-card-tag {
      position: absolute;
      top: 16px;
      right: 16px;
      font-size: 9px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      padding: 3px 8px;
      border-radius: 10px;
      color: #fff;
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

    .toast{position:fixed;bottom:28px;left:50%;transform:translateX(-50%) translateY(80px);background:#111;border:1px solid rgba(37,211,102,0.5);border-radius:10px;padding:14px 24px;display:flex;align-items:center;gap:10px;font-size:13px;font-weight:600;color:#fff;z-index:9999;transition:transform 0.4s cubic-bezier(.34,1.56,.64,1),opacity 0.4s ease;opacity:0;pointer-events:none;white-space:nowrap;box-shadow:0 8px 32px rgba(0,0,0,0.4);}
    .toast.show{transform:translateX(-50%) translateY(0);opacity:1;}
    .toast-icon{font-size:20px;}
    @media(max-width:1024px) {
      .features-grid {
        grid-template-columns: repeat(2, 1fr);
      }
    }
    @media(max-width:640px){
      .stats-bar{grid-template-columns:repeat(2,1fr);}
      .features-grid {
        grid-template-columns: repeat(2, 1fr) !important;
        gap: 8px !important;
      }
      .feature-card {
        padding: 14px 12px !important;
      }
      .feature-icon-wrapper {
        font-size: 22px !important;
        margin-bottom: 8px !important;
      }
      .feature-card-title {
        font-size: 14px !important;
      }
      .feature-card-desc {
        font-size: 10px !important;
        line-height: 1.4 !important;
      }
      .feature-card-tag {
        font-size: 7px !important;
        padding: 2px 6px !important;
      }
    }
   
  `;

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: css }} />

      {/* Toast notification */}
      {showToast && (
        <div className="toast show">
          <span className="toast-icon">📲</span>
          WhatsApp alerts coming soon — sign up to be first notified!
        </div>
      )}

      <div className="wc-page" ref={pageRef}>
        <div className="top-stripe" />

        {/* Nav */}
        <nav className="wc-nav">
          <a href="/" style={{textDecoration:'none'}}>
            <div className="wc-logo">WC<span>26</span></div>
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

        {/* ── HERO ── */}
        <section className="wc-hero">
          <div className="hero-bg" style={{
            backgroundImage: "url('/images/stadium-hero.jpg'), url('https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=1600&q=80')",
            transform: `scale(1.06) translateY(${heroOffset * 0.18}px)`,
            opacity: Math.max(0, 0.32 - heroOffset * 0.0003),
          }} />
          <div className="hero-overlay" />
          <div className="hero-content">
            <div className="hero-eyebrow">The World&apos;s Greatest Stage 2026</div>
            <div className="hero-title">FIFA<br /><span className="tc">WORLD</span><br />CUP <span className="rc">2026</span></div>
            <div className="hero-dates">Spain 🏆 World Champions 2026</div>
            <Countdown />
            
            <div style={{
              display:'inline-flex', alignItems:'center',
              gap:10, background:'rgba(255,215,0,0.08)',
              border:'1px solid rgba(255,215,0,0.3)',
              borderRadius:10, padding:'12px 20px',
              marginTop:16
            }}>
              <span style={{fontSize:28}}>🏆</span>
              <div style={{textAlign:'left'}}>
                <div style={{
                  fontFamily:"'Bebas Neue',sans-serif",
                  fontSize:20, color:'#FFD700', letterSpacing:2
                }}>
                  Spain are World Champions!
                </div>
                <div style={{fontSize:11,
                  color:'rgba(255,255,255,0.4)'}}>
                  Spain 1-0 Argentina (AET) · July 19, 2026 · 
                  MetLife Stadium
                </div>
              </div>
            </div>
            
            <div className="hero-ctas">
              <button className="cta-primary" onClick={() => document.getElementById('matches-section')?.scrollIntoView({ behavior: 'smooth' })}>
                📅 &nbsp;View Schedule
              </button>
              <a href="/predict" style={{textDecoration:'none'}}>
                <button className="cta-secondary">
                  🎯 &nbsp;Predict Scores
                </button>
              </a>
            </div>
            <div className="hero-scroll" style={{ marginTop: 48 }}>
              <span>Scroll to explore</span>
              <div className="scroll-line" />
            </div>
          </div>
        </section>

        {/* Stats bar */}
        <div className="stats-bar">
          {[
            { n: '104', l: 'Matches', bg: 'var(--g)' },
            { n: '48', l: 'Teams', bg: 'var(--b)' },
            { n: '16', l: 'Host Cities', bg: 'var(--r)' },
            { n: '39', l: 'Days of Football', bg: 'var(--gr)' }
          ].map(({ n, l, bg }) => (
            <div key={l} className="sb" style={{ background: bg }}>
              <div className="sb-n">{n}</div>
              <div className="sb-l">{l}</div>
            </div>
          ))}
        </div>
        <div className="s-divider" />

        {/* Today's Matches */}
        <TodaysMatches />
        <div className="s-divider" />

        {/* Fan Poll Section */}
        <section style={{
          background:'#0d0d0d',
          padding:'60px 24px'
        }}>
          <div style={{
            maxWidth:'1100px',
            margin:'0 auto'
          }}>
            <FadeSection>
              <FanPoll />
            </FadeSection>
          </div>
        </section>
        <div className="s-divider"/>

        {/* Group Standings */}
        <GroupStandings />
        <div className="s-divider" />

        {/* Golden Boot Teaser */}
        <section style={{background:'#080808',
          padding:'40px 24px'}}>
          <div style={{
            maxWidth:'1100px', margin:'0 auto',
            display:'flex', alignItems:'center',
            justifyContent:'space-between',
            flexWrap:'wrap', gap:16
          }}>
            <div>
              <div style={{
                fontFamily:"'Bebas Neue',sans-serif",
                fontSize:'clamp(24px,4vw,36px)',
                color:'#fff', letterSpacing:2
              }}>
                Golden Boot{' '}
                <span style={{color:'#FFD700'}}>Winner</span>
              </div>
              <div style={{fontSize:13,
                color:'rgba(255,255,255,0.5)',marginTop:4}}>
                🥇 Kylian Mbappé — 10 goals · 
                First ever back-to-back Golden Boot winner
              </div>
            </div>
            <a href="/about" style={{
              display:'inline-flex',alignItems:'center',
              gap:8,
              background:'rgba(255,215,0,0.08)',
              border:'1px solid rgba(255,215,0,0.25)',
              borderRadius:6,padding:'12px 20px',
              fontSize:12,fontWeight:700,
              color:'#FFD700',textDecoration:'none',
              letterSpacing:1,textTransform:'uppercase'
            }}>
              🏅 View Final Standings →
            </a>
          </div>
        </section>
        <div className="s-divider" />

        {/* News Section */}
        <NewsStrip />
        <div className="s-divider" />

        {/* Redesigned Features Grid Section */}
        <section className="features-section">
          <div style={{ maxWidth: '1200px', margin: '0 auto 32px', textAlign: 'center' }}>
            <FadeSection>
              <div style={{ fontSize: '11px', fontWeight: '700', letterSpacing: '3px', color: 'var(--g)', textTransform: 'uppercase', marginBottom: '12px' }}>
                All-in-One Fan Hub
              </div>
              <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(32px, 6vw, 56px)', letterSpacing: '2px', color: '#fff', margin: '0 0 40px' }}>
                Features designed for <span style={{ color: 'var(--g)' }}>elite fans</span>
              </h2>
            </FadeSection>
          </div>

          <div className="features-grid">
            {[
              {
                icon: '🎨',
                title: 'Build Your Bracket',
                desc: 'Create your own knockout stage predictions and share your bracket with friends.',
                tag: 'Shareable',
                tagBg: 'rgba(255,215,0,0.1)',
                tagColor: '#FFD700',
                borderColor: 'rgba(255,215,0,0.2)',
                href: '/bracket'
              },
              { icon: '🔔', title: 'Goal Alerts', desc: 'Goal alerts were sent live during the tournament. Register to be first for future tournaments.', tag: 'Instant', tagBg: 'var(--r)' },
              { icon: '🎯', title: 'Score Predictor', desc: 'Fans predicted all 104 matches during the tournament. Check the final leaderboard.', tag: 'Interactive', tagBg: 'var(--b)', href: '/leaderboard' },
              { icon: '📊', title: 'Live Standings', desc: 'Full final group standings and knockout results from all 104 matches of WC 2026.', tag: 'Real-time', tagBg: 'var(--gr)' },
              {
                icon: '🏆',
                title: 'Knockout Bracket',
                desc: 'Full Road to Glory bracket from Round of 32 to the July 19 Final at MetLife Stadium.',
                tag: 'Live Draw',
                tagBg: 'rgba(255,215,0,0.1)',
                tagColor: '#FFD700',
                borderColor: 'rgba(255,215,0,0.2)',
                href: '/schedule?view=bracket'
              },
              { icon: '🗳️', title: 'Fan Polls', desc: 'Cast votes on match favorites and view real-time global fan sentiment.', tag: 'Community', tagBg: 'var(--b)' },
              { icon: '⭐', title: 'Match Ratings', desc: 'Rate fixtures 1-5 stars and discover community-highlighted classic matches.', tag: 'Feedback', tagBg: 'var(--r)' },
              { icon: '🗞️', title: 'Latest News', desc: 'Aggregated news, injury reports, and expert tactical analyses.', tag: 'Updates', tagBg: 'var(--gr)' },
            ].map((card: any, i) => (
              <FadeSection key={card.title} delay={i * 80}>
                <div 
                  className="feature-card"
                  onClick={card.title === 'Goal Alerts' ? handleWhatsAppComingSoon : (card.href ? () => window.location.href = card.href : undefined)}
                  style={{ cursor: (card.title === 'Goal Alerts' || card.href) ? 'pointer' : 'default', borderColor: card.borderColor }}
                >
                  <span className="feature-card-tag" style={{ background: card.tagBg, color: card.tagColor || '#fff' }}>{card.tag}</span>
                  <div className="feature-icon-wrapper" style={{ background: `${card.tagBg}15`, color: card.tagColor || card.tagBg }}>
                    {card.icon}
                  </div>
                  <h3 className="feature-card-title">{card.title}</h3>
                  <p className="feature-card-desc">{card.desc}</p>
                </div>
              </FadeSection>
            ))}
          </div>
        </section>

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