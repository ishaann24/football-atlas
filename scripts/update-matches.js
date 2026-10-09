const fs = require('fs');
const path = require('path');

const matchesPath = path.join(__dirname, '..', 'data', 'matches.json');
const matches = JSON.parse(fs.readFileSync(matchesPath, 'utf8'));

// Helper to normalize team names for matching existing group matches
function norm(t) {
  if (!t) return '';
  let s = t.toLowerCase().trim();
  if (s.includes('korea')) return 'korea';
  if (s.includes('united states') || s === 'usa') return 'usa';
  if (s.includes('turk') || s.includes('türkiye')) return 'turkey';
  if (s.includes('congo')) return 'congo';
  if (s.includes('bosnia')) return 'bosnia';
  if (s.includes('cape verde')) return 'capeverde';
  return s;
}

// 1. Group Stage Results from prompt
const groupResults = [
  // GROUP A
  { home: 'Mexico', away: 'South Africa', hs: 2, as: 0 },
  { home: 'Korea Republic', away: 'Czechia', hs: 2, as: 1 },
  { home: 'Czechia', away: 'South Africa', hs: 1, as: 1 },
  { home: 'Mexico', away: 'South Korea', hs: 1, as: 0 },
  { home: 'Mexico', away: 'Czechia', hs: 3, as: 0 },
  { home: 'South Africa', away: 'South Korea', hs: 1, as: 0 },

  // GROUP B
  { home: 'Canada', away: 'Bosnia and Herzegovina', hs: 1, as: 1 },
  { home: 'Switzerland', away: 'Qatar', hs: 1, as: 1 },
  { home: 'Switzerland', away: 'Bosnia and Herzegovina', hs: 4, as: 1 },
  { home: 'Canada', away: 'Qatar', hs: 6, as: 0 },
  { home: 'Switzerland', away: 'Canada', hs: 3, as: 1 },
  { home: 'Bosnia and Herzegovina', away: 'Qatar', hs: 3, as: 1 },

  // GROUP C
  { home: 'Brazil', away: 'Morocco', hs: 1, as: 1 },
  { home: 'Scotland', away: 'Haiti', hs: 1, as: 0 },
  { home: 'Scotland', away: 'Morocco', hs: 0, as: 1 },
  { home: 'Brazil', away: 'Haiti', hs: 3, as: 0 },
  { home: 'Scotland', away: 'Brazil', hs: 0, as: 3 },
  { home: 'Morocco', away: 'Haiti', hs: 4, as: 2 },

  // GROUP D
  { home: 'United States', away: 'Paraguay', hs: 4, as: 1 },
  { home: 'Australia', away: 'Türkiye', hs: 2, as: 0 },
  { home: 'United States', away: 'Australia', hs: 2, as: 0 },
  { home: 'Türkiye', away: 'Paraguay', hs: 0, as: 1 },
  { home: 'Türkiye', away: 'United States', hs: 3, as: 2 },
  { home: 'Paraguay', away: 'Australia', hs: 0, as: 0 },

  // GROUP E
  { home: 'Germany', away: 'Curaçao', hs: 7, as: 1 },
  { home: 'Ivory Coast', away: 'Ecuador', hs: 1, as: 0 },
  { home: 'Germany', away: 'Ivory Coast', hs: 2, as: 1 },
  { home: 'Ecuador', away: 'Curaçao', hs: 0, as: 0 },
  { home: 'Ivory Coast', away: 'Curaçao', hs: 2, as: 0 },
  { home: 'Ecuador', away: 'Germany', hs: 2, as: 1 },

  // GROUP F
  { home: 'Netherlands', away: 'Japan', hs: 2, as: 2 },
  { home: 'Sweden', away: 'Tunisia', hs: 5, as: 1 },
  { home: 'Netherlands', away: 'Sweden', hs: 5, as: 1 },
  { home: 'Japan', away: 'Tunisia', hs: 4, as: 0 },
  { home: 'Japan', away: 'Sweden', hs: 1, as: 1 },
  { home: 'Netherlands', away: 'Tunisia', hs: 3, as: 1 },

  // GROUP G
  { home: 'Belgium', away: 'Egypt', hs: 1, as: 1 },
  { home: 'Iran', away: 'New Zealand', hs: 2, as: 2 },
  { home: 'Belgium', away: 'Iran', hs: 0, as: 0 },
  { home: 'Egypt', away: 'New Zealand', hs: 3, as: 1 },
  { home: 'Egypt', away: 'Iran', hs: 1, as: 1 },
  { home: 'Belgium', away: 'New Zealand', hs: 5, as: 1 },

  // GROUP H
  { home: 'Spain', away: 'Cape Verde', hs: 0, as: 0 },
  { home: 'Saudi Arabia', away: 'Uruguay', hs: 1, as: 1 },
  { home: 'Spain', away: 'Saudi Arabia', hs: 4, as: 0 },
  { home: 'Uruguay', away: 'Cape Verde', hs: 2, as: 2 },
  { home: 'Cape Verde', away: 'Saudi Arabia', hs: 0, as: 0 },
  { home: 'Spain', away: 'Uruguay', hs: 1, as: 0 },

  // GROUP I
  { home: 'France', away: 'Senegal', hs: 3, as: 1 },
  { home: 'Norway', away: 'Iraq', hs: 4, as: 1 },
  { home: 'France', away: 'Iraq', hs: 3, as: 0 },
  { home: 'Norway', away: 'Senegal', hs: 3, as: 2 },
  { home: 'France', away: 'Norway', hs: 4, as: 1 },
  { home: 'Senegal', away: 'Iraq', hs: 5, as: 0 },

  // GROUP J
  { home: 'Argentina', away: 'Algeria', hs: 3, as: 0 },
  { home: 'Austria', away: 'Jordan', hs: 3, as: 1 },
  { home: 'Argentina', away: 'Austria', hs: 2, as: 0 },
  { home: 'Jordan', away: 'Algeria', hs: 1, as: 2 },
  { home: 'Argentina', away: 'Jordan', hs: 3, as: 1 },
  { home: 'Austria', away: 'Algeria', hs: 3, as: 3 },

  // GROUP K
  { home: 'Portugal', away: 'DR Congo', hs: 1, as: 1 },
  { home: 'Uzbekistan', away: 'Colombia', hs: 1, as: 3 },
  { home: 'Portugal', away: 'Uzbekistan', hs: 5, as: 0 },
  { home: 'Colombia', away: 'DR Congo', hs: 1, as: 0 },
  { home: 'Colombia', away: 'Portugal', hs: 0, as: 0 },
  { home: 'DR Congo', away: 'Uzbekistan', hs: 3, as: 1 },

  // GROUP L
  { home: 'England', away: 'Croatia', hs: 4, as: 2 },
  { home: 'Ghana', away: 'Panama', hs: 1, as: 0 },
  { home: 'England', away: 'Ghana', hs: 0, as: 0 },
  { home: 'Panama', away: 'Croatia', hs: 0, as: 1 },
  { home: 'England', away: 'Panama', hs: 2, as: 0 },
  { home: 'Croatia', away: 'Ghana', hs: 2, as: 1 },
];

let updatedGroupCount = 0;
groupResults.forEach(gr => {
  const nh = norm(gr.home);
  const na = norm(gr.away);

  const m = matches.slice(0, 72).find(match => {
    const mh = norm(match.homeTeam);
    const ma = norm(match.awayTeam);
    return (mh === nh && ma === na) || (mh === na && ma === nh);
  });

  if (m) {
    m.status = 'finished';
    const mh = norm(m.homeTeam);
    if (mh === nh) {
      // Home team matches prompt's home team
      m.homeScore = gr.hs;
      m.awayScore = gr.as;
    } else {
      // Reversed in json
      m.homeScore = gr.as;
      m.awayScore = gr.hs;
    }
    m.score = `${m.homeScore}-${m.awayScore}`;
    updatedGroupCount++;
  } else {
    console.error('Group match NOT found:', gr.home, 'vs', gr.away);
  }
});

console.log(`Updated ${updatedGroupCount}/72 group stage matches.`);

// 2. Knockout Matches
const r32Matches = [
  { home: 'Canada', away: 'South Africa', hs: 1, as: 0 },
  { home: 'Brazil', away: 'Japan', hs: 2, as: 1 },
  { home: 'Germany', away: 'Paraguay', hs: 1, as: 1, penalties: { home: 3, away: 4 }, winner: 'Paraguay' },
  { home: 'Netherlands', away: 'Morocco', hs: 1, as: 1, penalties: { home: 2, away: 3 }, winner: 'Morocco' },
  { home: 'Norway', away: 'Ivory Coast', hs: 2, as: 1 },
  { home: 'France', away: 'Sweden', hs: 3, as: 0 },
  { home: 'Mexico', away: 'Ecuador', hs: 2, as: 0 },
  { home: 'England', away: 'DR Congo', hs: 2, as: 1 },
  { home: 'Belgium', away: 'Senegal', hs: 3, as: 2, note: 'AET' },
  { home: 'USA', away: 'Bosnia and Herzegovina', hs: 2, as: 0 },
  { home: 'Spain', away: 'Austria', hs: 3, as: 0 },
  { home: 'Portugal', away: 'Croatia', hs: 2, as: 1 },
  { home: 'Switzerland', away: 'Algeria', hs: 2, as: 0 },
  { home: 'Egypt', away: 'Australia', hs: 1, as: 1, penalties: { home: 4, away: 2 }, winner: 'Egypt' },
  { home: 'Argentina', away: 'Cape Verde', hs: 3, as: 2, note: 'AET' },
  { home: 'Colombia', away: 'Ghana', hs: 1, as: 0 },
];

const r16Matches = [
  { home: 'Morocco', away: 'Canada', hs: 3, as: 0 },
  { home: 'France', away: 'Paraguay', hs: 1, as: 0 },
  { home: 'Norway', away: 'Brazil', hs: 2, as: 1 },
  { home: 'England', away: 'Mexico', hs: 3, as: 2 },
  { home: 'Spain', away: 'Portugal', hs: 1, as: 0 },
  { home: 'Belgium', away: 'USA', hs: 4, as: 1 },
  { home: 'Argentina', away: 'Egypt', hs: 3, as: 2 },
  { home: 'Switzerland', away: 'Colombia', hs: 0, as: 0, penalties: { home: 4, away: 3 }, winner: 'Switzerland' },
];

const qfMatches = [
  { home: 'France', away: 'Morocco', hs: 2, as: 0 },
  { home: 'Spain', away: 'Belgium', hs: 2, as: 1 },
  { home: 'England', away: 'Norway', hs: 2, as: 1, note: 'AET' },
  { home: 'Argentina', away: 'Switzerland', hs: 3, as: 1, note: 'AET' },
];

const sfMatches = [
  { home: 'Spain', away: 'France', hs: 2, as: 0 },
  { home: 'Argentina', away: 'England', hs: 2, as: 1 },
];

const thirdPlaceMatch = { home: 'England', away: 'France', hs: 6, as: 4 };

const finalMatch = { home: 'Spain', away: 'Argentina', hs: 1, as: 0, winner: 'Spain', note: 'AET' };

// Map knockouts into indexes 72..103 (IDs 73..104)
const koList = [
  ...r32Matches,
  ...r16Matches,
  ...qfMatches,
  ...sfMatches,
  thirdPlaceMatch,
  finalMatch,
];

koList.forEach((ko, idx) => {
  const matchIndex = 72 + idx; // 72 -> ID 73, 103 -> ID 104
  const m = matches[matchIndex];
  if (m) {
    m.homeTeam = ko.home;
    m.awayTeam = ko.away;
    m.status = 'finished';
    m.homeScore = ko.hs;
    m.awayScore = ko.as;
    m.score = `${ko.hs}-${ko.as}`;
    if (ko.penalties) m.penalties = ko.penalties;
    if (ko.winner) m.winner = ko.winner;
    if (ko.note) m.note = ko.note;
  }
});

fs.writeFileSync(matchesPath, JSON.stringify(matches, null, 2), 'utf8');
console.log('Successfully updated matches.json with all 104 match scores!');
