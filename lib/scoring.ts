export const POINTS = {
  EXACT_SCORE: 3,      // Predicted exact score e.g. 2-1 = 2-1
  CORRECT_RESULT: 1,   // Got winner right but not score
  WRONG: 0,            // Wrong result
};

export function calculatePoints(
  predictedHome: number,
  predictedAway: number,
  actualHome: number,
  actualAway: number
): { points: number; label: string; color: string } {
  const predResult = Math.sign(predictedHome - predictedAway);
  const actualResult = Math.sign(actualHome - actualAway);
  
  if (predictedHome === actualHome && 
      predictedAway === actualAway) {
    return { 
      points: POINTS.EXACT_SCORE, 
      label: '🎯 Exact!', 
      color: '#FFD700' 
    };
  }
  if (predResult === actualResult) {
    return { 
      points: POINTS.CORRECT_RESULT, 
      label: '✅ Correct result', 
      color: '#3CAC3B' 
    };
  }
  return { 
    points: POINTS.WRONG, 
    label: '❌ Wrong', 
    color: '#E61D25' 
  };
}

export function formatPoints(p: number): string {
  return p === 3 ? '+3 pts' : p === 1 ? '+1 pt' : '0 pts';
}
