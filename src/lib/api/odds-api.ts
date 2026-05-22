// Odds API Integration
// API Key: ee4f52e1b0c8ac9c766431712d594f87

const ODDS_API_BASE = "https://api.the-odds-api.com/v4";

export interface BookmakerOdds {
  bookmaker: string;
  market: string;
  outcomes: {
    name: string;
    price: number;
    point?: number;
  }[];
  lastUpdate: string;
}

export interface TennisOdds {
  id: string;
  sport: string;
  commenceTime: string;
  homeTeam: string;
  awayTeam: string;
  bookmakers: BookmakerOdds[];
}

// Get available sports
export async function getSports(): Promise<any[]> {
  try {
    const response = await fetch(
      `${ODDS_API_BASE}/sports?apiKey=${process.env.ODDS_API_KEY}`
    );
    if (response.ok) {
      return await response.json();
    }
  } catch (error) {
    console.error("Odds API sports fetch failed:", error);
  }
  return [];
}

// Get odds for tennis
export async function getTennisOdds(sportKey: string = "tennis_atp"): Promise<TennisOdds[]> {
  try {
    const response = await fetch(
      `${ODDS_API_BASE}/sports/${sportKey}/odds?apiKey=${process.env.ODDS_API_KEY}&regions=uk,eu,us&markets=h2h,spread,total`,
      { next: { revalidate: 300 } }
    );
    
    if (response.ok) {
      return await response.json();
    }
  } catch (error) {
    console.error("Odds API fetch failed:", error);
  }
  
  return [];
}

// Get the best underdog odds from all bookmakers
export function extractBestUnderdogOdds(odds: TennisOdds): { 
  player: string; 
  odds: number; 
  bookmaker: string;
} | null {
  const bookmakers = odds.bookmakers;
  if (!bookmakers || bookmakers.length === 0) return null;
  
  let bestUnderdogOdds = { player: "", odds: 0, bookmaker: "" };
  
  for (const bookmaker of bookmakers) {
    const h2hMarket = bookmaker.outcomes; // Use outcomes directly since market is already h2h
    if (!h2hMarket || !Array.isArray(h2hMarket)) continue;
    
    // Find the underdog (higher odds)
    for (const outcome of h2hMarket) {
      if (outcome.price > bestUnderdogOdds.odds) {
        bestUnderdogOdds = {
          player: outcome.name,
          odds: outcome.price,
          bookmaker: bookmaker.bookmaker,
        };
      }
    }
  }
  
  return bestUnderdogOdds.odds > 0 ? bestUnderdogOdds : null;
}

// Calculate implied probability
export function calculateImpliedProbability(odds: number): number {
  return (1 / odds) * 100;
}

// Generate simulated odds for demo purposes
export function generateSimulatedOdds(player1: string, player2: string): { 
  player1Odds: number;
  player2Odds: number;
  underdog: string;
  underdogOdds: number;
} {
  // Generate realistic odds based on random favorite/underdog scenario
  const isPlayer1Underdog = Math.random() > 0.5;
  
  let underdogOdds: number;
  let favoriteOdds: number;
  let underdog: string;
  
  if (isPlayer1Underdog) {
    underdog = player1;
    underdogOdds = 1.8 + Math.random() * 2.2; // 1.8 to 4.0
    favoriteOdds = 1.1 + Math.random() * 0.7; // 1.1 to 1.8
  } else {
    underdog = player2;
    underdogOdds = 1.8 + Math.random() * 2.2;
    favoriteOdds = 1.1 + Math.random() * 0.7;
  }
  
  return {
    player1Odds: isPlayer1Underdog ? favoriteOdds : underdogOdds,
    player2Odds: isPlayer1Underdog ? underdogOdds : favoriteOdds,
    underdog,
    underdogOdds,
  };
}
