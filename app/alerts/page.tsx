'use client';

import React, { useState } from 'react';
import RegisterForm from '@/components/RegisterForm';

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ background: '#111', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '8px', overflow: 'hidden' }}>
      <button 
        onClick={() => setOpen(!open)}
        style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'transparent', border: 'none', padding: '16px 20px', color: '#fff', fontSize: '14px', fontWeight: 600, cursor: 'pointer', textAlign: 'left' }}
      >
        <span>{q}</span>
        <span style={{ transition: 'transform 0.2s', transform: open ? 'rotate(180deg)' : 'none', fontSize: '10px', color: 'rgba(255,255,255,0.4)' }}>{open ? '▲' : '▼'}</span>
      </button>
      {open && (
        <div style={{ padding: '0 20px 20px', color: 'rgba(255,255,255,0.5)', fontSize: '13px', lineHeight: 1.6 }}>
          {a}
        </div>
      )}
    </div>
  );
}

export default function AlertsPage() {
  const footballSVG = '<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32"><circle cx="16" cy="16" r="15" fill="white" stroke="%23222" stroke-width="1.5"/><polygon points="16,4 20,10 16,14 12,10" fill="%23111"/><polygon points="26,11 28,17 23,19 21,13" fill="%23111"/><polygon points="24,24 19,27 16,22 20,18" fill="%23111"/><polygon points="8,24 6,18 11,16 13,22" fill="%23111"/><polygon points="6,11 11,8 13,14 8,16" fill="%23111"/></svg>';
  const cursorUrl = `data:image/svg+xml,${footballSVG}`;

  const [showToast, setShowToast] = useState(false);

  const handleWhatsAppComingSoon = () => {
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3500);
  };

  const css = `
    @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Inter:wght@400;500;600;700&display=swap');
    :root { --g:#3CAC3B; --b:#2A398D; --r:#E61D25; --gr:#474A4A; }
    *{box-sizing:border-box;} body{margin:0;background:#080808;}
    
    .alerts-page {
      min-height: 100vh;
      background: #080808;
      font-family: 'Inter', sans-serif;
      color: #fff;
    }

    .top-stripe {
      height: 4px;
      background: linear-gradient(90deg, var(--g) 33%, var(--b) 33% 66%, var(--r) 66%);
      position: sticky;
      top: 0;
      z-index: 100;
    }

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

    .alerts-hero {
      position: relative;
      padding: 80px 24px 60px;
      text-align: center;
      background: radial-gradient(circle at center, rgba(230,29,37,0.12) 0%, rgba(8,8,8,1) 80%);
      border-bottom: 1px solid rgba(255,255,255,0.05);
    }

    .alerts-title {
      font-family: 'Bebas Neue', sans-serif;
      font-size: clamp(40px, 8vw, 72px);
      letter-spacing: 2px;
      line-height: 0.95;
      margin-bottom: 12px;
    }
    .alerts-title span {
      color: var(--r);
    }

    .alerts-subtitle {
      font-size: 15px;
      color: rgba(255,255,255,0.5);
      max-w: 600px;
      margin: 0 auto 28px;
      line-height: 1.6;
    }

    .alert-pill {
      background: rgba(255,255,255,0.05);
      border: 1px solid rgba(255,255,255,0.1);
      color: #fff;
      padding: 6px 14px;
      border-radius: 20px;
      font-size: 11px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 1px;
    }

    .step-card {
      background: #111;
      border: 1px solid rgba(255,255,255,0.06);
      border-radius: 12px;
      padding: 28px 24px;
      text-align: center;
    }
    .step-num {
      background: var(--r);
      color: #fff;
      width: 32px;
      height: 32px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 700;
      margin: 0 auto 16px;
      font-size: 14px;
    }
    .step-title {
      font-size: 14px;
      font-weight: 700;
      margin-bottom: 8px;
      text-transform: uppercase;
      letter-spacing: 1px;
    }
    .step-desc {
      font-size: 12px;
      color: rgba(255,255,255,0.4);
      line-height: 1.6;
      margin: 0;
    }

    .toast {
      position: fixed;
      bottom: 28px;
      left: 50%;
      transform: translateX(-50%) translateY(80px);
      background: #111;
      border: 1px solid rgba(37,211,102,0.5);
      border-radius: 10px;
      padding: 14px 24px;
      display: flex;
      align-items: center;
      gap: 10px;
      font-size: 13px;
      font-weight: 600;
      color: #fff;
      z-index: 9999;
      transition: transform 0.4s cubic-bezier(.34,1.56,.64,1), opacity 0.4s ease;
      opacity: 0;
      pointer-events: none;
      white-space: nowrap;
      box-shadow: 0 8px 32px rgba(0,0,0,0.4);
    }
    .toast.show {
      transform: translateX(-50%) translateY(0);
      opacity: 1;
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

    .s-divider {
      height: 1px;
      background: linear-gradient(90deg, transparent, rgba(255,255,255,0.06), transparent);
    }

    @media(max-width:640px) {
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
    <div className="alerts-page">
      <style dangerouslySetInnerHTML={{ __html: css }} />
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
          <a href="/" style={{textDecoration:'none'}}>
            <button className="np" style={{
              background:'rgba(255,255,255,0.08)',
              color:'rgba(255,255,255,0.7)',
              border:'1px solid rgba(255,255,255,0.2)'
            }}>
              ⌂ Home
            </button>
          </a>
        </div>
      </nav>

      {/* Hero section */}
      <section className="alerts-hero">
        <h1 className="alerts-title">WC 2026 is Over · <span>Stay Ready</span></h1>
        <p className="alerts-subtitle">
          The 2026 World Cup has ended. Register now to be first in line for alerts when the next tournament begins.
        </p>

        {/* 3 Detail pills */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', flexWrap: 'wrap', marginTop: '16px' }}>
          <div className="alert-pill">📧 Email Alerts</div>
          <div className="alert-pill">💬 WhatsApp (Soon)</div>
          <div className="alert-pill">⚡ Real-Time Speed</div>
        </div>
      </section>

      {/* How it works timeline */}
      <section style={{ padding: '60px 24px', background: '#080808' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '36px', textAlign: 'center', letterSpacing: '2px', marginBottom: '32px' }}>
            How It <span style={{ color: 'var(--r)' }}>Works</span>
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px' }}>
            <div className="step-card">
              <div className="step-num">1</div>
              <h3 className="step-title">Register Details</h3>
              <p className="step-desc">Enter your email and specify your favourite team to customize notifications.</p>
            </div>
            <div className="step-card">
              <div className="step-num">2</div>
              <h3 className="step-title">We Watch Matches</h3>
              <p className="step-desc">Our systems monitor live match streams and data points in real time.</p>
            </div>
            <div className="step-card">
              <div className="step-num">3</div>
              <h3 className="step-title">Receive Alerts</h3>
              <p className="step-desc">
                Get notified within seconds of a goal being scored. 100% free.
                <br />
                <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.25)', display: 'block', marginTop: '6px' }}>
                  Next tournament: FIFA World Cup 2030
                </span>
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="s-divider" />

      {/* Register Form Section */}
      <section style={{ background: '#0d0d0d', padding: '60px 24px' }}>
        <div style={{ maxWidth: '440px', margin: '0 auto' }}>
          
          {/* WhatsApp coming soon banner */}
          <div onClick={handleWhatsAppComingSoon} style={{ display: 'flex', alignItems: 'center', gap: 10, background: 'rgba(37,211,102,0.07)', border: '1px solid rgba(37,211,102,0.25)', borderRadius: 8, padding: '12px 16px', marginBottom: 20, cursor: 'pointer' }}>
            <span style={{ fontSize: 20 }}>📲</span>
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: '#25d366', letterSpacing: 0.5 }}>WhatsApp Goal Alerts</div>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', marginTop: 2 }}>Tap to learn more · Rolling out soon</div>
            </div>
            <div style={{ marginLeft: 'auto', fontSize: 10, fontWeight: 700, background: 'rgba(37,211,102,0.15)', color: '#25d366', border: '1px solid rgba(37,211,102,0.3)', borderRadius: 12, padding: '3px 10px', letterSpacing: 1, textTransform: 'uppercase' as const }}>Coming Soon</div>
          </div>

          <RegisterForm />
        </div>
      </section>

      <div className="s-divider" />

      {/* FAQs section */}
      <section style={{ padding: '60px 24px', background: '#080808' }}>
        <div style={{ maxWidth: '640px', margin: '0 auto' }}>
          <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '36px', textAlign: 'center', letterSpacing: '2px', marginBottom: '32px' }}>
            Frequently Asked <span style={{ color: 'var(--r)' }}>Questions</span>
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <FAQItem 
              q="How much do goal alerts cost?" 
              a="Goal alerts are 100% free! There are no hidden fees, premium tiers, or subscription charges." 
            />
            <FAQItem 
              q="Can I select multiple teams to follow?" 
              a="Currently, you select one main favourite team when you register, but you can update your preference or subscribe to match-specific notifications as the tournament draws closer." 
            />
            <FAQItem 
              q="When will the alerts timeline go live?" 
              a="Email goal alerts will begin running from the opening matchday on June 11, 2026. WhatsApp alerts are rolling out shortly after. You will receive an onboarding email as soon as alerts are active." 
            />
          </div>
        </div>
      </section>

      {/* Toast notification */}
      <div className={`toast${showToast ? ' show' : ''}`}>
        <span className="toast-icon">📲</span>
        WhatsApp alerts coming soon — sign up to be first notified!
      </div>

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
