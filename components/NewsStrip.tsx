'use client';
import React, { useState, useEffect } from 'react';
import { timeAgo } from '@/lib/news-cache';
import { NewsArticle } from '@/lib/news';

export default function NewsStrip() {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setLoading(false);
    }, 4000);

    fetch('/api/news?limit=3')
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

  return (
    <section style={{
      background: '#0d0d0d',
      padding: '60px 24px'
    }}>
      <div style={{
        maxWidth: '1100px',
        margin: '0 auto'
      }}>
        {/* Header row */}
        <div style={{
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'space-between',
          marginBottom: 24,
          flexWrap: 'wrap',
          gap: 12
        }}>
          <div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              marginBottom: 6
            }}>
              <div style={{
                width: 8, height: 8,
                borderRadius: '50%',
                background: '#E61D25',
                animation: 'pdot 1.5s infinite'
              }}/>
              <span style={{
                fontSize: 10, fontWeight: 700,
                letterSpacing: 4,
                color: 'rgba(255,255,255,0.4)',
                textTransform: 'uppercase' as const
              }}>
                Latest News
              </span>
            </div>
            <div style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: 'clamp(28px,5vw,42px)',
              color: '#fff',
              letterSpacing: 2,
              lineHeight: 1
            }}>
              World Cup <span style={{
                color: '#3CAC3B'
              }}>News</span>
            </div>
          </div>
          <a href="/news" style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            fontSize: 12,
            fontWeight: 700,
            color: '#3CAC3B',
            textDecoration: 'none',
            letterSpacing: 1,
            border: '1px solid rgba(60,172,59,0.3)',
            padding: '8px 16px',
            borderRadius: 4,
            textTransform: 'uppercase' as const,
            transition: 'all 0.15s'
          }}>
            View All News →
          </a>
        </div>

        {/* Loading skeleton */}
        {loading && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 
              'repeat(auto-fill,minmax(300px,1fr))',
            gap: 16
          }}>
            {[1,2,3].map(i => (
              <div key={i} style={{
                background: '#111',
                borderRadius: 10,
                overflow: 'hidden',
                border: '1px solid rgba(255,255,255,0.07)'
              }}>
                <div style={{
                  height: 160,
                  background: 
                    'rgba(255,255,255,0.05)'
                }}/>
                <div style={{padding: 16}}>
                  <div style={{
                    height: 12,
                    background: 
                      'rgba(255,255,255,0.06)',
                    borderRadius: 4,
                    marginBottom: 8, width: '40%'
                  }}/>
                  <div style={{
                    height: 16,
                    background: 
                      'rgba(255,255,255,0.06)',
                    borderRadius: 4,
                    marginBottom: 6
                  }}/>
                  <div style={{
                    height: 16,
                    background: 
                      'rgba(255,255,255,0.06)',
                    borderRadius: 4,
                    width: '80%'
                  }}/>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* No API key fallback */}
        {!loading && articles.length === 0 && (
          <div style={{
            background:'rgba(255,255,255,0.03)',
            border:'1px solid rgba(255,255,255,0.07)',
            borderRadius:10,padding:'32px 24px',
            textAlign:'center' as const
          }}>
            <div style={{fontSize:28,marginBottom:10}}>📡</div>
            <div style={{fontSize:14,fontWeight:600,
              color:'#fff',marginBottom:6}}>
              Fetching latest news...
            </div>
            <div style={{fontSize:12,
              color:'rgba(255,255,255,0.35)',
              lineHeight:1.6,marginBottom:16}}>
              News updates every 30 minutes from 
              BBC, ESPN, and Google News.
            </div>
            <button onClick={() => window.location.reload()}
              style={{
                background:'transparent',
                border:'1px solid rgba(255,255,255,0.15)',
                color:'rgba(255,255,255,0.4)',
                padding:'8px 20px',borderRadius:5,
                fontSize:12,cursor:'pointer',
                fontFamily:"'Inter',sans-serif",
                letterSpacing:1
              }}>
              🔄 Refresh
            </button>
          </div>
        )}

        {/* 3 News cards */}
        {!loading && articles.length > 0 && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 
              'repeat(auto-fill,minmax(300px,1fr))',
            gap: 16
          }}>
            {articles.slice(0,3).map((a, i) => (
              <a
                key={i}
                href={a.url}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  textDecoration: 'none',
                  display: 'flex',
                  flexDirection: 'column' as const,
                  background: '#111',
                  border: 
                    '1px solid rgba(255,255,255,0.07)',
                  borderRadius: 10,
                  overflow: 'hidden',
                  transition: 
                    'border-color 0.15s, transform 0.15s',
                  cursor: 'pointer'
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLElement)
                    .style.borderColor = 
                    'rgba(60,172,59,0.4)';
                  (e.currentTarget as HTMLElement)
                    .style.transform = 
                    'translateY(-3px)';
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLElement)
                    .style.borderColor = 
                    'rgba(255,255,255,0.07)';
                  (e.currentTarget as HTMLElement)
                    .style.transform = 
                    'translateY(0)';
                }}
              >
                {/* Article image */}
                <div style={{
                  height: 160,
                  overflow: 'hidden',
                  background: '#1a1a1a',
                  position: 'relative' as const,
                  flexShrink: 0
                }}>
                  {a.image ? (
                    <img
                      src={a.image}
                      alt={a.title}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover' as const
                      }}
                      onError={e => {
                        (e.target as HTMLImageElement)
                          .parentElement!.innerHTML =
                          '<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;font-size:40px">⚽</div>';
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
                      <span style={{fontSize:32}}>⚽</span>
                      <span style={{
                        fontSize:9, fontWeight:700,
                        color:'rgba(255,255,255,0.25)',
                        letterSpacing:2, textTransform:'uppercase' as const
                      }}>
                        {a.source.name}
                      </span>
                    </div>
                  )}
                  {/* Source badge overlay */}
                  <div style={{
                    position: 'absolute' as const,
                    top: 10, left: 10,
                    background: 'rgba(0,0,0,0.75)',
                    backdropFilter: 'blur(4px)',
                    padding: '3px 8px',
                    borderRadius: 4,
                    fontSize: 10,
                    fontWeight: 700,
                    color: '#fff',
                    letterSpacing: 0.5
                  }}>
                    {a.source.name}
                  </div>
                </div>

                {/* Article content */}
                <div style={{
                  padding: '14px 16px',
                  display: 'flex',
                  flexDirection: 'column' as const,
                  flex: 1
                }}>
                  <div style={{
                    fontSize: 10,
                    color: 'rgba(255,255,255,0.3)',
                    letterSpacing: 1,
                    marginBottom: 8
                  }}>
                    {timeAgo(a.publishedAt)}
                  </div>
                  <div style={{
                    fontSize: 14,
                    fontWeight: 700,
                    color: '#fff',
                    lineHeight: 1.4,
                    marginBottom: 8,
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 
                      'vertical' as const,
                    overflow: 'hidden'
                  }}>
                    {a.title}
                  </div>
                  <div style={{
                    fontSize: 12,
                    color: 'rgba(255,255,255,0.35)',
                    lineHeight: 1.6,
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 
                      'vertical' as const,
                    overflow: 'hidden',
                    flex: 1
                  }}>
                    {a.description}
                  </div>
                  <div style={{
                    marginTop: 12,
                    fontSize: 11,
                    color: '#3CAC3B',
                    fontWeight: 600,
                    letterSpacing: 0.5
                  }}>
                    Read more →
                  </div>
                </div>
              </a>
            ))}
          </div>
        )}

        {/* View all button below cards */}
        {!loading && articles.length > 0 && (
          <div style={{
            textAlign: 'center' as const,
            marginTop: 24
          }}>
            <a href="/news" style={{
              display: 'inline-block',
              background: 'transparent',
              border: '1px solid rgba(255,255,255,0.15)',
              color: 'rgba(255,255,255,0.5)',
              padding: '12px 32px',
              borderRadius: 5,
              fontSize: 12,
              fontWeight: 700,
              textDecoration: 'none',
              letterSpacing: 1.5,
              textTransform: 'uppercase' as const
            }}>
              View All News
            </a>
          </div>
        )}
      </div>
    </section>
  );
}
