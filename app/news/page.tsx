'use client';
import React, { useState, useEffect } from 'react';
import { timeAgo } from '@/lib/news-cache';
import { NewsArticle } from '@/lib/news';

function formatFullDate(dateStr: string): string {
  try {
    return new Date(dateStr).toLocaleDateString('en-IN', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  } catch {
    return dateStr;
  }
}

const TOPIC_FILTERS: Record<string, 
  (a: NewsArticle) => boolean> = {
  'All': () => true,
  'Match Reports': (a) => {
    const text = (a.title + ' ' + 
      a.description).toLowerCase();
    return text.includes('match') || 
           text.includes(' vs ') ||
           text.includes('score') ||
           text.includes('goal') ||
           text.includes('win') ||
           text.includes('defeat') ||
           text.includes('draw');
  },
  'Squads & Transfers': (a) => {
    const text = (a.title + ' ' + 
      a.description).toLowerCase();
    return text.includes('squad') ||
           text.includes('transfer') ||
           text.includes('sign') ||
           text.includes('call-up') ||
           text.includes('selected') ||
           text.includes('named');
  },
  'Injuries': (a) => {
    const text = (a.title + ' ' + 
      a.description).toLowerCase();
    return text.includes('injur') ||
           text.includes('doubt') ||
           text.includes('fitness') ||
           text.includes('return') ||
           text.includes('miss') ||
           text.includes('out');
  },
  'Players': (a) => {
    const text = (a.title + ' ' + 
      a.description).toLowerCase();
    const stars = [
      'messi','ronaldo','mbappé','mbappe',
      'haaland','kane','neymar','salah',
      'bellingham','vinicius','pedri','rodri'
    ];
    return stars.some(p => text.includes(p));
  },
  'Analysis': (a) => {
    const text = (a.title + ' ' + 
      a.description).toLowerCase();
    return text.includes('preview') ||
           text.includes('analysis') ||
           text.includes('tactical') ||
           text.includes('review') ||
           text.includes('verdict') ||
           text.includes('opinion') ||
           text.includes('rated');
  },
};

export default function NewsPage() {
  const footballSVG = '<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32"><circle cx="16" cy="16" r="15" fill="white" stroke="%23222" stroke-width="1.5"/><polygon points="16,4 20,10 16,14 12,10" fill="%23111"/><polygon points="26,11 28,17 23,19 21,13" fill="%23111"/><polygon points="24,24 19,27 16,22 20,18" fill="%23111"/><polygon points="8,24 6,18 11,16 13,22" fill="%23111"/><polygon points="6,11 11,8 13,14 8,16" fill="%23111"/></svg>';
  const cursorUrl = `data:image/svg+xml,${footballSVG}`;

  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('All');
  const [sort, setSort] = useState<'latest' | 'relevant'>('latest');

  useEffect(() => {
    const timeout = setTimeout(() => {
      setLoading(false);
    }, 4000);

    fetch('/api/news?limit=30')
      .then(r => r.json())
      .then(data => {
        clearTimeout(timeout);
        setArticles(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => {
        clearTimeout(timeout);
        setLoading(false);
      });

    return () => clearTimeout(timeout);
  }, []);

  const filterTopics = [
    'All',
    'Match Reports',
    'Squads & Transfers',
    'Injuries',
    'Players',
    'Analysis'
  ];

  const filteredArticles = articles.filter(a => {
    const filterFn = TOPIC_FILTERS[activeFilter];
    return filterFn ? filterFn(a) : true;
  });

  const sortedArticles = [...filteredArticles]
    .sort((a, b) => {
      if (sort === 'latest') {
        return new Date(b.publishedAt).getTime() - 
               new Date(a.publishedAt).getTime();
      }
      // Relevant: image first, then longer desc
      const aScore = (a.image ? 10 : 0) + 
        (a.description?.length || 0) / 10;
      const bScore = (b.image ? 10 : 0) + 
        (b.description?.length || 0) / 10;
      return bScore - aScore;
    });

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
    
    .news-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
      gap: 20px;
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

      /* Fix 5: News Page */
      .news-header {
        padding: 40px 16px 24px !important;
      }
      
      .news-filters {
        flex-wrap: nowrap !important;
        overflow-x: auto !important;
        -webkit-overflow-scrolling: touch !important;
        scrollbar-width: none !important;
        padding-bottom: 4px !important;
        gap: 6px !important;
      }
      
      .news-filters::-webkit-scrollbar {
        display: none !important;
      }
      
      .news-filter-btn {
        white-space: nowrap !important;
        flex-shrink: 0 !important;
        font-size: 11px !important;
        padding: 6px 12px !important;
      }

      .news-sort {
        flex-wrap: wrap !important;
      }

      .news-articles-grid {
        grid-template-columns: 1fr !important;
        padding: 0 12px !important;
        gap: 12px !important;
      }
      
      .news-card-image {
        height: 180px !important;
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
            <a href="/" style={{textDecoration:'none'}}>
              <button className="np" style={{
                background:'rgba(255,255,255,0.08)',
                color:'rgba(255,255,255,0.7)',
                border:'1px solid rgba(255,255,255,0.2)'
              }}>
                ⌂ Home
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
        <section className="news-header" style={{background:'#080808', padding:'60px 24px 32px'}}>
          <div style={{maxWidth:'1100px', margin:'0 auto'}}>
            <div style={{display:'flex', alignItems:'center', gap:8, marginBottom:6}}>
              <span style={{fontSize:20}}>🗞️</span>
              <span style={{fontSize:10, fontWeight:700, letterSpacing:4, color:'rgba(255,255,255,0.4)', textTransform:'uppercase'}}>
                Live Updates
              </span>
            </div>
            <div style={{fontFamily:"'Bebas Neue',sans-serif", fontSize:'clamp(40px,7vw,64px)', color:'#fff', letterSpacing:2, marginBottom:4}}>
              World Cup <span style={{color:'#3CAC3B'}}>News</span>
            </div>
            <div style={{fontSize:12, color:'rgba(255,255,255,0.35)', letterSpacing:1, marginBottom:24}}>
              Latest FIFA World Cup 2026 coverage from around the world
            </div>

            {/* Filter Buttons */}
            <div className="news-filters" style={{display:'flex', gap:8, flexWrap:'wrap'}}>
              {filterTopics.map(t => (
                <button
                  key={t}
                  className="news-filter-btn"
                  onClick={() => setActiveFilter(t)}
                  style={{
                    background: activeFilter === t ? '#3CAC3B' : 'rgba(255,255,255,0.05)',
                    border: `1px solid ${activeFilter === t ? '#3CAC3B' : 'rgba(255,255,255,0.08)'}`,
                    color: activeFilter === t ? '#fff' : 'rgba(255,255,255,0.5)',
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
                  {t}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Main Grid content */}
        <section style={{background:'#0d0d0d', padding:'40px 24px 80px'}}>
          <div style={{maxWidth:'1100px', margin:'0 auto'}}>
            {!loading && (
              <div style={{display:'flex',
                justifyContent:'space-between',
                alignItems:'center',
                marginBottom:16,flexWrap:'wrap',gap:8}}>
                <div style={{fontSize:11,
                  color:'rgba(255,255,255,0.3)'}}>
                  {filteredArticles.length} articles found
                </div>
                <div className="news-sort" style={{display:'flex',gap:6}}>
                  <button
                    onClick={() => setSort('latest')}
                    style={{
                      fontSize:11,padding:'5px 12px',
                      borderRadius:4,border:'none',
                      cursor:'pointer',
                      fontFamily:"'Inter',sans-serif",
                      background: sort==='latest'
                        ? 'rgba(60,172,59,0.15)'
                        : 'rgba(255,255,255,0.05)',
                      color: sort==='latest'
                        ? '#3CAC3B'
                        : 'rgba(255,255,255,0.4)',
                      fontWeight:700,letterSpacing:0.5
                    }}>
                    Latest
                  </button>
                  <button
                    onClick={() => setSort('relevant')}
                    style={{
                      fontSize:11,padding:'5px 12px',
                      borderRadius:4,border:'none',
                      cursor:'pointer',
                      fontFamily:"'Inter',sans-serif",
                      background: sort==='relevant'
                        ? 'rgba(60,172,59,0.15)'
                        : 'rgba(255,255,255,0.05)',
                      color: sort==='relevant'
                        ? '#3CAC3B'
                        : 'rgba(255,255,255,0.4)',
                      fontWeight:700,letterSpacing:0.5
                    }}>
                    Most Relevant
                  </button>
                </div>
              </div>
            )}
            {loading && (
              <div className="news-grid news-articles-grid">
                {[1,2,3,4,5,6].map(i => (
                  <div key={i} style={{
                    background: '#111',
                    borderRadius: 10,
                    overflow: 'hidden',
                    border: '1px solid rgba(255,255,255,0.07)'
                  }}>
                    <div className="news-card-image" style={{height: 200, background: 'rgba(255,255,255,0.05)'}}/>
                    <div style={{padding: 16}}>
                      <div style={{height: 12, background: 'rgba(255,255,255,0.06)', borderRadius: 4, marginBottom: 8, width: '40%'}}/>
                      <div style={{height: 16, background: 'rgba(255,255,255,0.06)', borderRadius: 4, marginBottom: 6}}/>
                      <div style={{height: 16, background: 'rgba(255,255,255,0.06)', borderRadius: 4, width: '80%'}}/>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {!loading && sortedArticles.length === 0 && (
              <div style={{
                background: 'rgba(255,255,255,0.02)',
                border: '1px solid rgba(255,255,255,0.06)',
                borderRadius: 10,
                padding: '80px 24px',
                textAlign: 'center'
              }}>
                <div style={{fontSize: 32, marginBottom: 12}}>🔍</div>
                <div style={{fontSize: 16, fontWeight: 600, color: '#fff', marginBottom: 6}}>
                  No Articles Found
                </div>
                <div style={{fontSize: 12, color: 'rgba(255,255,255,0.35)'}}>
                  Try selecting another category or check back later.
                </div>
              </div>
            )}

            {!loading && sortedArticles.length > 0 && (
              <div className="news-grid news-articles-grid">
                {sortedArticles.map((a, i) => (
                  <a
                    key={i}
                    href={a.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      textDecoration: 'none',
                      display: 'flex',
                      flexDirection: 'column',
                      background: '#111',
                      border: '1px solid rgba(255,255,255,0.07)',
                      borderRadius: 10,
                      overflow: 'hidden',
                      transition: 'border-color 0.15s, transform 0.15s',
                      cursor: 'pointer'
                    }}
                    onMouseEnter={e => {
                      (e.currentTarget as HTMLElement).style.borderColor = 'rgba(60,172,59,0.4)';
                      (e.currentTarget as HTMLElement).style.transform = 'translateY(-3px)';
                    }}
                    onMouseLeave={e => {
                      (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.07)';
                      (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
                    }}
                  >
                    {/* Image */}
                    <div className="news-card-image" style={{
                      height: 200,
                      overflow: 'hidden',
                      background: '#1a1a1a',
                      position: 'relative',
                      flexShrink: 0
                    }}>
                      {a.image ? (
                        <img
                          src={a.image}
                          alt={a.title}
                          style={{width: '100%', height: '100%', objectFit: 'cover'}}
                          onError={e => {
                            (e.target as HTMLImageElement).parentElement!.innerHTML =
                              '<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;font-size:48px">⚽</div>';
                          }}
                        />
                      ) : (
                        <div style={{
                          width:'100%', height:'100%',
                          display:'flex', flexDirection:'column' as const,
                          alignItems:'center', justifyContent:'center',
                          background: 'linear-gradient(135deg, #1a1a1a 0%, #0d0d0d 100%)',
                          gap: 6
                        }}>
                          <span style={{fontSize:36}}>⚽</span>
                          <span style={{
                            fontSize:10, fontWeight:700,
                            color:'rgba(255,255,255,0.25)',
                            letterSpacing:2, textTransform:'uppercase' as const
                          }}>
                            {a.source.name}
                          </span>
                        </div>
                      )}
                      <div style={{
                        position: 'absolute',
                        top: 12, left: 12,
                        background: 'rgba(0,0,0,0.8)',
                        backdropFilter: 'blur(4px)',
                        padding: '4px 10px',
                        borderRadius: 4,
                        fontSize: 10,
                        fontWeight: 700,
                        color: '#fff',
                        letterSpacing: 0.5
                      }}>
                        {a.source.name}
                      </div>
                    </div>

                    {/* Content */}
                    <div style={{
                      padding: 20,
                      display: 'flex',
                      flexDirection: 'column',
                      flex: 1
                    }}>
                      <div style={{
                        fontSize: 11,
                        color: 'rgba(255,255,255,0.3)',
                        letterSpacing: 1,
                        marginBottom: 8
                      }}>
                        {timeAgo(a.publishedAt)}
                      </div>
                      <div style={{
                        fontSize: 15,
                        fontWeight: 700,
                        color: '#fff',
                        lineHeight: 1.4,
                        marginBottom: 10,
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden'
                      }}>
                        {a.title}
                      </div>
                      <div style={{
                        fontSize: 12,
                        color: 'rgba(255,255,255,0.4)',
                        lineHeight: 1.6,
                        marginBottom: 16,
                        flex: 1
                      }}>
                        {a.description}
                      </div>
                      <div style={{
                        fontSize: 10,
                        color: 'rgba(255,255,255,0.25)',
                        borderTop: '1px solid rgba(255,255,255,0.05)',
                        paddingTop: 12,
                        marginBottom: 10
                      }}>
                        Published: {formatFullDate(a.publishedAt)}
                      </div>
                      <div style={{
                        fontSize: 12,
                        color: '#3CAC3B',
                        fontWeight: 600,
                        letterSpacing: 0.5
                      }}>
                        Read Full Article →
                      </div>
                    </div>
                  </a>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Floating Auto-Refresh Button */}
        <button
          onClick={() => window.location.reload()}
          style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            background: 'rgba(17, 17, 17, 0.9)',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            color: '#fff',
            padding: '10px 18px',
            borderRadius: '20px',
            fontSize: '12px',
            fontWeight: 600,
            cursor: 'pointer',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.5)',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            backdropFilter: 'blur(8px)',
            transition: 'all 0.2s'
          }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLElement).style.borderColor = '#3CAC3B';
            (e.currentTarget as HTMLElement).style.background = '#3CAC3B';
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255, 255, 255, 0.15)';
            (e.currentTarget as HTMLElement).style.background = 'rgba(17, 17, 17, 0.9)';
          }}
        >
          🔄 Refresh News
        </button>

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
