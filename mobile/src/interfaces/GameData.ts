export interface Tentativa {
  curday: number;
  solution: string;
  normSolution: string;
  tries: string[][]; // matriz de letras tentadas
  invalids: string[];
  curRow: number;
  curTry: string[];
  gameOver: 0 | 1;
  won: 0 | 1 | null;
}

export interface MetaInfo {
  startTime: number;
  endTime: number;
}

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

export interface Config { hardMode: number; }

export interface GameData {
  config: Config;
  meta: MetaInfo;
  stats: UserStats;
  state: Tentativa[];
}

export interface TermoPayload {
  termo?: GameData;
  duo?: GameData;
  quarteto?: GameData;
}