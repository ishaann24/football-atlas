'use client';

import React, { useState } from 'react';

export default function LegalPage() {
  const [activeTab, setActiveTab] = useState<'privacy' | 'terms' | 'disclaimer'>('privacy');

  const footballSVG = '<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32"><circle cx="16" cy="16" r="15" fill="white" stroke="%23222" stroke-width="1.5"/><polygon points="16,4 20,10 16,14 12,10" fill="%23111"/><polygon points="26,11 28,17 23,19 21,13" fill="%23111"/><polygon points="24,24 19,27 16,22 20,18" fill="%23111"/><polygon points="8,24 6,18 11,16 13,22" fill="%23111"/><polygon points="6,11 11,8 13,14 8,16" fill="%23111"/></svg>';
  const cursorUrl = `data:image/svg+xml,${footballSVG}`;

  const css = `
    @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Inter:wght@400;500;600;700&display=swap');
    :root { --g:#3CAC3B; --b:#2A398D; --r:#E61D25; --gr:#474A4A; }
    *{box-sizing:border-box;} body{margin:0;background:#080808;}
    
    .wc-page {
      font-family: 'Inter', sans-serif;
      background: #080808;
      color: #fff;
      overflow-x: hidden;
      min-height: 100vh;
      display: flex;
      flex-direction: column;
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
    
    .mobile-home-btn {
      display: none;
    }
    
    .legal-content-card {
      background: #111;
      border: 1px solid rgba(255,255,255,0.07);
      border-radius: 10px;
      padding: 28px 32px;
      max-width: 720px;
      margin: 0 auto 16px;
      text-align: left;
    }
    
    .legal-content-card h2 {
      font-family: 'Bebas Neue', sans-serif;
      font-size: 28px;
      color: #fff;
      letter-spacing: 2px;
      margin-top: 0;
      margin-bottom: 16px;
    }
    
    .legal-content-card h3 {
      font-family: 'Inter', sans-serif;
      font-size: 13px;
      font-weight: 700;
      color: rgba(255,255,255,0.7);
      text-transform: uppercase;
      letter-spacing: 1px;
      margin-top: 20px;
      margin-bottom: 8px;
    }
    
    .legal-content-card p {
      font-family: 'Inter', sans-serif;
      font-size: 13px;
      color: rgba(255,255,255,0.45);
      line-height: 1.8;
      margin-top: 0;
      margin-bottom: 12px;
    }
    
    .wc-footer {
      background: #050505;
      border-top: 1px solid rgba(255,255,255,0.05);
      padding: 28px 24px;
      text-align: center;
      margin-top: auto;
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

      .legal-content-card {
        padding: 20px !important;
        margin: 0 12px 16px !important;
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
            <a href="/" style={{textDecoration:'none'}} className="mobile-home-btn">
              <button className="np" style={{
                background:'rgba(255,255,255,0.08)',
                color:'rgba(255,255,255,0.6)',
                border:'1px solid rgba(255,255,255,0.15)',
                whiteSpace:'nowrap'
              }}>
                ← Home
              </button>
            </a>
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

        {/* Header Section */}
        <section style={{background:'#080808', padding:'60px 24px 32px'}}>
          <div style={{maxWidth:'1100px', margin:'0 auto', textAlign: 'center'}}>
            <div style={{display:'inline-flex', alignItems:'center', gap:8, marginBottom:12}}>
              <span style={{fontSize:10, fontWeight:700, letterSpacing:4, color:'rgba(255,255,255,0.4)', textTransform:'uppercase'}}>
                📋 Legal
              </span>
            </div>
            <div style={{fontFamily:"'Bebas Neue',sans-serif", fontSize:'clamp(40px,7vw,64px)', color:'#fff', letterSpacing:2, marginBottom:4}}>
              Legal <span style={{color:'#3CAC3B'}}>Information</span>
            </div>
            <div style={{fontSize:12, color:'rgba(255,255,255,0.35)', letterSpacing:1, marginBottom:24}}>
              Last updated: June 2026
            </div>

            {/* Tab Buttons */}
            <div style={{display:'flex', gap:8, justifyContent:'center', flexWrap:'wrap'}}>
              {[
                { id: 'privacy', label: 'Privacy Policy' },
                { id: 'terms', label: 'Terms of Use' },
                { id: 'disclaimer', label: 'Disclaimer' }
              ].map(t => (
                <button
                  key={t.id}
                  onClick={() => setActiveTab(t.id as any)}
                  style={{
                    background: activeTab === t.id ? '#3CAC3B' : 'rgba(255,255,255,0.05)',
                    border: `1px solid ${activeTab === t.id ? '#3CAC3B' : 'rgba(255,255,255,0.08)'}`,
                    color: activeTab === t.id ? '#fff' : 'rgba(255,255,255,0.4)',
                    fontSize: 11,
                    fontWeight: 600,
                    padding: '8px 16px',
                    borderRadius: 4,
                    cursor: 'pointer',
                    textTransform: 'uppercase',
                    fontFamily: "'Inter', sans-serif",
                    letterSpacing: 0.5,
                    transition: 'all 0.15s'
                  }}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Tab Content */}
        <section style={{background:'#0d0d0d', padding:'40px 12px 80px'}}>
          {activeTab === 'privacy' && (
            <div className="legal-content-card">
              <h2>Privacy Policy</h2>

              <h3>What data we collect</h3>
              <p>When you register for goal alerts, we collect 
              your name, email address, and WhatsApp number. 
              When you use the Score Predictor, we store your 
              chosen username and predictions. We also collect 
              IP addresses temporarily for vote deduplication 
              in our Fan Poll and match ratings.</p>

              <h3>How we use your data</h3>
              <p>Your email and WhatsApp number are used solely 
              to send you goal alerts for your chosen team 
              during FIFA World Cup 2026. We do not use your 
              data for marketing, advertising, or any other 
              purpose. We do not sell, share, or trade your 
              personal information with any third party.</p>

              <h3>Data storage</h3>
              <p>Personal data is stored securely in Supabase 
              (a PostgreSQL database). Prediction data and poll 
              votes are stored anonymously where possible. 
              IP addresses used for deduplication are not 
              linked to personal profiles.</p>

              <h3>Data retention</h3>
              <p>Alert registration data will be deleted within 
              90 days of the FIFA World Cup 2026 Final 
              (by October 2026). Prediction leaderboard data 
              may be retained longer for historical purposes 
              but can be deleted on request.</p>

              <h3>Your rights</h3>
              <p>You can request deletion of your data at any 
              time by contacting us. You can unsubscribe from 
              alerts at any time by replying STOP to any 
              notification or contacting us directly.</p>

              <h3>Third-party services</h3>
              <p>This site uses football-data.org for live match 
              data, GNews API for news content, and flagcdn.com 
              for flag images. These services have their own 
              privacy policies. We use Vercel for hosting and 
              Supabase for data storage.</p>

              <h3>Contact</h3>
              <p>
                For privacy questions, data deletion requests, 
                or any other queries about this site, contact:
              </p>
              <a href="mailto:ishaannnn24@gmail.com" 
                style={{
                  color: '#3CAC3B',
                  fontSize: 14,
                  fontWeight: 600,
                  textDecoration: 'none',
                  display: 'inline-block',
                  margin: '8px 0',
                  padding: '8px 16px',
                  background: 'rgba(60,172,59,0.08)',
                  border: '1px solid rgba(60,172,59,0.25)',
                  borderRadius: 6,
                }}>
                📧 ishaannnn24@gmail.com
              </a>
              <p style={{marginTop: 8, fontSize: 12, 
                color: 'rgba(255,255,255,0.4)'}}>
                Response time: within 48 hours. Independent 
                fan project maintained by one developer.
              </p>
            </div>
          )}

          {activeTab === 'terms' && (
            <div className="legal-content-card">
              <h2>Terms of Use</h2>

              <h3>Fan project</h3>
              <p>This website is an independent fan project 
              created for FIFA World Cup 2026. It is not 
              affiliated with, endorsed by, or connected to 
              FIFA, any national football federation, or any 
              official tournament body.</p>

              <h3>Score Predictor</h3>
              <p>The Score Predictor is for entertainment 
              purposes only. Points and leaderboard positions 
              have no monetary value and cannot be exchanged 
              for prizes, cash, or any other reward. We reserve 
              the right to reset leaderboards or suspend 
              accounts that show evidence of cheating or 
              automated voting.</p>

              <h3>Alerts service</h3>
              <p>Goal alerts are provided on a best-effort basis. 
              We do not guarantee delivery speed, accuracy, or 
              uptime. The service may be interrupted without 
              notice. We are not liable for missed notifications.</p>

              <h3>Content accuracy</h3>
              <p>Match schedules, scores, and statistics are 
              sourced from third-party APIs and may contain 
              errors or delays. Always verify critical 
              information with official sources.</p>

              <h3>Acceptable use</h3>
              <p>You agree not to use automated tools to 
              submit votes, predictions, or registrations. 
              You agree not to attempt to access, modify, 
              or interfere with any part of this service's 
              infrastructure.</p>

              <h3>Changes to service</h3>
              <p>We reserve the right to modify, suspend, or 
              discontinue the service at any time without 
              notice, including after the tournament ends.</p>
            </div>
          )}

          {activeTab === 'disclaimer' && (
            <div className="legal-content-card">
              <h2>Disclaimer</h2>

              <h3>FIFA affiliation</h3>
              <p>This is an independent fan website. FIFA™, 
              FIFA World Cup™, and all related marks are 
              trademarks of Fédération Internationale de 
              Football Association. This site is not 
              affiliated with, sponsored by, or endorsed 
              by FIFA or any of its affiliates.</p>

              <h3>No commercial use</h3>
              <p>This project was built by an individual 
              football fan for other football fans. It is 
              not a commercial product and does not 
              generate revenue.</p>

              <h3>News content</h3>
              <p>News articles displayed on this site are 
              sourced via GNews API and link to original 
              publishers. We do not claim ownership of 
              any news content. All articles remain the 
              property of their original publishers.</p>

              <h3>Limitation of liability</h3>
              <p>This site is provided "as is" without any 
              warranties. We are not responsible for any 
              decisions made based on information displayed 
              on this site.</p>

              <h3>Contact</h3>
              <p>
                For privacy questions, data deletion requests, 
                or any other queries about this site, contact:
              </p>
              <a href="mailto:ishaannnn24@gmail.com" 
                style={{
                  color: '#3CAC3B',
                  fontSize: 14,
                  fontWeight: 600,
                  textDecoration: 'none',
                  display: 'inline-block',
                  margin: '8px 0',
                  padding: '8px 16px',
                  background: 'rgba(60,172,59,0.08)',
                  border: '1px solid rgba(60,172,59,0.25)',
                  borderRadius: 6,
                }}>
                📧 ishaannnn24@gmail.com
              </a>
              <p style={{marginTop: 8, fontSize: 12, 
                color: 'rgba(255,255,255,0.4)'}}>
                Response time: within 48 hours. Independent 
                fan project maintained by one developer.
              </p>
            </div>
          )}
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
