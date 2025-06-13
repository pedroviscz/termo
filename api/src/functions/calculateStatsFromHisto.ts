import { HistoryEntry, UserStats } from "../interfaces/GameData";

function calculateStatsFromHistory(histo: HistoryEntry[]): Omit<UserStats, 'histo'> {
  const games = histo.length;
  let wins = 0;
  let totalAttempts = 0;
  let curstreak = 0;
  let maxstreak = 0;
  let currentStreak = 0;
  let minTime = Infinity;
  let maxTime = -Infinity;

  for (const { attempts, time } of histo) {
    if (attempts > 0) {
      wins++;
      totalAttempts += attempts;
      currentStreak++;
      maxstreak = Math.max(maxstreak, currentStreak);
      if (typeof time === 'number') {
        minTime = Math.min(minTime, time);
        maxTime = Math.max(maxTime, time);
      }
    } else {
      currentStreak = 0;
    }
  }

  return {
    games,
    wins,
    curstreak: currentStreak,
    maxstreak,
    avgAttempts: wins > 0 ? totalAttempts / wins : 0,
    mintime: isFinite(minTime) ? minTime : 0,
    maxtime: isFinite(maxTime) ? maxTime : 0
  };
}

export default calculateStatsFromHistory;