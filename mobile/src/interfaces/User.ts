export interface HistoryEntry {
  attempts: number; // 0 se perdeu, 1-6 se venceu
  time?: number;
}

export interface UserStats {
  histo: HistoryEntry[];
  games: number;
  wins: number;
  curstreak: number;
  maxstreak: number;
  avgAttempts: number;
  mintime: number;
  maxtime: number;
}

export interface IUserDocument extends Document {
    username: string;
    deviceId: string;
    stats: UserStats;
}