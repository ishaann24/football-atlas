'use client';
import React, { useState, useEffect } from 'react';

interface Props {
  matchId: number;
  isFinished: boolean;
}

export default function MatchRating(
  { matchId, isFinished }: Props
) {
  const [average, setAverage] = useState(0);
  const [count, setCount] = useState(0);
  const [hovered, setHovered] = useState(0);
  const [selected, setSelected] = useState(0);
  const [hasRated, setHasRated] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    // Check localStorage for existing rating
    const stored = localStorage.getItem(
      `wc26_rating_${matchId}`
    );
    if (stored) {
      setHasRated(true);
      setSelected(parseInt(stored));
    }

    // Fetch current rating
    fetch(`/api/rate-match?matchId=${matchId}`)
      .then(r => r.json())
      .then(d => {
        setAverage(d.average || 0);
        setCount(d.count || 0);
      });
  }, [matchId]);

  if (!isFinished) return null;

  const handleRate = async (rating: number) => {
    if (hasRated || submitting) return;
    setSubmitting(true);
    setSelected(rating);

    try {
      const res = await fetch('/api/rate-match', {
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify({ matchId, rating })
      });
      const data = await res.json();

      if (data.alreadyRated) {
        setHasRated(true);
      } else if (data.success) {
        localStorage.setItem(
          `wc26_rating_${matchId}`, 
          String(rating)
        );
        setHasRated(true);
        setAverage(data.average);
        setCount(data.count);
      }
    } catch (e) {
      console.error(e);
    }
    setSubmitting(false);
  };

  const displayStars = hovered || selected || 0;

  const labels: Record<number, string> = {
    1: 'Awful',
    2: 'Poor', 
    3: 'Average',
    4: 'Great',
    5: '🔥 Classic!'
  };

  return (
    <div style={{
      background: 'rgba(255,255,255,0.03)',
      border: '1px solid rgba(255,255,255,0.07)',
      borderRadius: 8,
      padding: '14px 16px',
      marginTop: 12
    }}>
      <div style={{
        fontSize: 10, fontWeight: 700,
        color: 'rgba(255,255,255,0.4)',
        letterSpacing: 2,
        textTransform: 'uppercase' as const,
        marginBottom: 10
      }}>
        Rate This Match
      </div>

      {/* Star rating */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 6, marginBottom: 8
      }}>
        {[1,2,3,4,5].map(star => (
          <span
            key={star}
            onClick={() => handleRate(star)}
            onMouseEnter={() => !hasRated && setHovered(star)}
            onMouseLeave={() => setHovered(0)}
            style={{
              fontSize: 28,
              cursor: hasRated ? 'default' : 'pointer',
              transition: 'transform 0.1s',
              transform: displayStars >= star ? 'scale(1.15)' : 'scale(1)',
              filter: displayStars >= star ? 'none' : 'grayscale(1)',
              opacity: hasRated && selected < star ? 0.3 : 1
            }}>
            ⭐
          </span>
        ))}
        {displayStars > 0 && !hasRated && (
          <span style={{
            fontSize: 12,
            color: 'rgba(255,255,255,0.5)',
            marginLeft: 4
          }}>
            {labels[displayStars]}
          </span>
        )}
      </div>

      {/* Average display */}
      {count > 0 && (
        <div style={{
          fontSize: 11,
          color: 'rgba(255,255,255,0.35)',
          display: 'flex',
          alignItems: 'center',
          gap: 6
        }}>
          <span style={{
            color: '#FFD700',
            fontWeight: 700,
            fontSize: 13
          }}>
            {average}/5
          </span>
          <span>
            from {count.toLocaleString()} {count === 1 ? ' fan' : ' fans'}
          </span>
          {average >= 4.5 && (
            <span style={{
              background:'rgba(255,215,0,0.15)',
              border:'1px solid rgba(255,215,0,0.3)',
              borderRadius:10,
              padding:'1px 8px',
              fontSize:9,
              color:'#FFD700',
              fontWeight:700,
              letterSpacing:1
            }}>
              CLASSIC
            </span>
          )}
        </div>
      )}

      {hasRated && (
        <div style={{
          fontSize: 11,
          color: '#3CAC3B',
          marginTop: 4,
          fontWeight: 600
        }}>
          ✓ You rated this {selected}/5
        </div>
      )}
    </div>
  );
}
