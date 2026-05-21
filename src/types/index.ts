export interface User {
  id: string;
  email: string;
  name?: string;
  createdAt: Date;
}

export interface Bankroll {
  id: string;
  userId: string;
  totalAmount: number;
  unitSize: number;
  currentAmount: number;
  dailyRiskPercent: number;
}

export interface Match {
  id: string;
  externalId?: string;
  tournament: string;
  tournamentShort?: string;
  surface?: string;
  round?: string;
  player1Name: string;
  player2Name: string;
  player1Odds?: number;
  player2Odds?: number;
  startTime: Date;
  status: "scheduled" | "live" | "completed" | "abandoned";
  score?: string;
  set1Player1?: number;
  set1Player2?: number;
  set2Player1?: number;
  set2Player2?: number;
  set3Player1?: number;
  set3Player2?: number;
  currentSet?: number;
}

export interface Prediction {
  id: string;
  userId: string;
  matchId: string;
  underdog: string;
  bookmakerOdds: number;
  impliedProb: number;
  modelProb: number;
  edgePercent: number;
  confidence: "LOW" | "MEDIUM" | "HIGH";
  suggestedUnits: number;
  reasoning?: string;
  stakeAmount?: number;
  potentialWin?: number;
  actualResult?: "pending" | "won" | "lost" | "void";
  notes?: string;
  createdAt: Date;
  match?: Match;
}

export interface JournalEntry {
  id: string;
  userId: string;
  matchId?: string;
  predictionId?: string;
  date: Date;
  tournament: string;
  player1: string;
  player2: string;
  underdog: string;
  odds: number;
  units: number;
  stakeAmount: number;
  edgePercent: number;
  confidence: string;
  result?: "pending" | "won" | "lost" | "void" | "abandoned";
  profitLoss?: number;
  notes?: string;
  settledAt?: Date;
}

export interface Settings {
  edgeThreshold: number;
  maxDailyPicks: number;
  minConfidence: number;
  autoSettlement: boolean;
  notifications: boolean;
}

export interface Analytics {
  totalBets: number;
  wonBets: number;
  lostBets: number;
  voidBets: number;
  totalUnits: number;
  unitsWon: number;
  unitsLost: number;
  roi: number;
  winRate: number;
  avgOdds: number;
  bestEdge: number;
  currentStreak: number;
  longestWinStreak: number;
  longestLoseStreak: number;
}

export interface DailyPrediction extends Prediction {
  matchTime: Date;
  status: "upcoming" | "live" | "completed";
  currentScore?: string;
}