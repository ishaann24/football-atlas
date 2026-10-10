'use client';

import React from 'react';
import BracketTree from '@/components/BracketTree';

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
  `;

  return (
    <div className="wc-page">
      <style dangerouslySetInnerHTML={{ __html: css }} />
      <div className="top-stripe" />

      {/* Nav */}
      <nav className="wc-nav">
        <a href="/" style={{ textDecoration: 'none' }}>
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

      {/* Shared Bracket Tree Component */}
      <BracketTree />

      {/* Footer */}
      <footer style={{ background: '#050505', borderTop: '1px solid rgba(255,255,255,0.05)', padding: '24px', textAlign: 'center', marginTop: 'auto' }}>
        <div className="footer-logo" style={{
          fontFamily:"'Bebas Neue',sans-serif",
          fontSize:18, letterSpacing:3
        }}>
          FOOTBALL<span style={{color:'#3CAC3B'}}>
            ATLAS
          </span>
        </div>
        <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.2)', marginTop: 4 }}>
          Spain won the 2026 FIFA World Cup · July 19, 2026
        </div>
      </footer>
    </div>
  );
}
