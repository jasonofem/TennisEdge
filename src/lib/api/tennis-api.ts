// API-Tennis Integration
// API Key: a3fa245ffa1f3e6e0f65cebe1e79b28d48e1607cf377578941e3d141e127d4ce

const TENNIS_API_BASE = "https://v1.api-tennis.com";
const TENNIS_API_KEY = process.env.TENNIS_API_KEY || "a3fa245ffa1f3e6e0f65cebe1e79b28d48e1607cf377578941e3d141e127d4ce";

export interface TennisMatch {
  id: string;
  tournament: string;
  tournamentShort: string;
  surface: string;
  round: string;
  player1: {
    name: string;
    country: string;
    ranking: number;
  };
  player2: {
    name: string;
    country: string;
    ranking: number;
  };
  startTime: string;
  status: "scheduled" | "live" | "completed";
  score?: {
    current: string;
    sets: { p1: number; p2: number }[];
    server?: string;
    gamePoints?: string;
  };
}

// Simulated tennis data for when API is not available
const SAMPLE_TOURNAMENTS = [
  "ATP Masters 1000 Rome",
  "ATP 500 Dubai", 
  "WTA 1000 Madrid",
  "ATP 250 Munich",
  "WTA 500 Stuttgart",
  "ATP 250 Lyon",
  "WTA 250 Rabat",
];

const SAMPLE_PLAYERS = [
  { name: "Carlos Alcaraz", country: "ESP", ranking: 2 },
  { name: "Jannik Sinner", country: "ITA", ranking: 3 },
  { name: "Daniil Medvedev", country: "RUS", ranking: 4 },
  { name: "Alexander Zverev", country: "GER", ranking: 5 },
  { name: "Holger Rune", country: "DEN", ranking: 6 },
  { name: "Stefanos Tsitsipas", country: "GRE", ranking: 7 },
  { name: "Andrey Rublev", country: "RUS", ranking: 8 },
  { name: "Alex de Minaur", country: "AUS", ranking: 12 },
  { name: "Tommy Paul", country: "USA", ranking: 15 },
  { name: "Grigor Dimitrov", country: "BUL", ranking: 18 },
  { name: "Taylor Fritz", country: "USA", ranking: 14 },
  { name: "Casper Ruud", country: "NOR", ranking: 10 },
  { name: "Karen Khachanov", country: "RUS", ranking: 20 },
  { name: "Ben Shelton", country: "USA", ranking: 22 },
  { name: "Nicolas Mahut", country: "FRA", ranking: 45 },
  { name: "Fabio Fognini", country: "ITA", ranking: 55 },
  { name: "Borna Coric", country: "CRO", ranking: 25 },
  { name: "Sebastian Korda", country: "USA", ranking: 38 },
];

const SURFACES = ["Clay", "Hard", "Grass"];

function generateRandomMatch(index: number): TennisMatch {
  const shuffledPlayers = [...SAMPLE_PLAYERS].sort(() => Math.random() - 0.5);
  const player1 = shuffledPlayers[0];
  const player2 = shuffledPlayers[1];
  const tournament = SAMPLE_TOURNAMENTS[Math.floor(Math.random() * SAMPLE_TOURNAMENTS.length)];
  const surface = SURFACES[Math.floor(Math.random() * SURFACES.length)];
  
  // Generate start time within next 24-72 hours
  const startTime = new Date();
  startTime.setHours(startTime.getHours() + Math.floor(Math.random() * 48) + 12);
  
  const statuses: ("scheduled" | "live" | "completed")[] = ["scheduled", "scheduled", "scheduled", "live", "completed"];
  const status = statuses[Math.floor(Math.random() * statuses.length)];
  
  const score = status !== "scheduled" ? {
    current: status === "live" ? "3-2, 1-1" : "6-4 6-3",
    sets: status === "live" 
      ? [{ p1: 3, p2: 2 }, { p1: 1, p2: 1 }] 
      : [{ p1: 6, p2: 4 }, { p1: 6, p2: 3 }],
  } : undefined;
  
  return {
    id: `match_${index}_${Date.now()}`,
    tournament,
    tournamentShort: tournament.split(" ").slice(1).join(" "),
    surface,
    round: "Quarterfinal",
    player1: {
      name: player1.name,
      country: player1.country,
      ranking: player1.ranking,
    },
    player2: {
      name: player2.name,
      country: player2.country,
      ranking: player2.ranking,
    },
    startTime: startTime.toISOString(),
    status,
    score,
  };
}

export async function fetchLiveMatches(): Promise<TennisMatch[]> {
  try {
    // Try to fetch from API-Tennis
    const response = await fetch(`${TENNIS_API_BASE}/v2/tennis/?token=${TENNIS_API_KEY}&schedule=today`, {
      next: { revalidate: 300 },
    });
    
    if (response.ok) {
      const data = await response.json();
      return transformTennisApiResponse(data);
    }
  } catch (error) {
    console.error("API-Tennis fetch failed, using simulated data:", error);
  }
  
  // Return simulated data
  return Array.from({ length: 8 }, (_, i) => generateRandomMatch(i));
}

export async function fetchMatchDetails(matchId: string): Promise<TennisMatch | null> {
  try {
    const response = await fetch(`${TENNIS_API_BASE}/v2/tennis/${matchId}/?token=${TENNIS_API_KEY}`, {
      next: { revalidate: 60 },
    });
    
    if (response.ok) {
      const data = await response.json();
      return transformMatchDetail(data);
    }
  } catch (error) {
    console.error("API-Tennis detail fetch failed:", error);
  }
  
  return null;
}

function transformTennisApiResponse(data: any): TennisMatch[] {
  if (!data.data || !Array.isArray(data.data)) {
    return [];
  }
  
  return data.data.map((match: any) => ({
    id: match.id?.toString() || "",
    tournament: match.event?.name || "Unknown Tournament",
    tournamentShort: match.event?.short_name || "",
    surface: match.surface || "Hard",
    round: match.round || "",
    player1: {
      name: match.participants?.find((p: any) => p.seed === 1 || p.home_away === "home")?.name || "Player 1",
      country: match.participants?.find((p: any) => p.seed === 1)?.country_code || "",
      ranking: match.participants?.find((p: any) => p.seed === 1)?.ranking || 0,
    },
    player2: {
      name: match.participants?.find((p: any) => p.seed !== 1 && p.home_away !== "home")?.name || "Player 2",
      country: match.participants?.find((p: any) => p.seed !== 1)?.country_code || "",
      ranking: match.participants?.find((p: any) => p.seed !== 1)?.ranking || 0,
    },
    startTime: match.scheduled_at || new Date().toISOString(),
    status: match.status === "in_progress" ? "live" : match.status === "finished" ? "completed" : "scheduled",
    score: match.scores ? {
      current: match.scores.display || "",
      sets: match.scores.sets?.map((s: any) => ({ p1: s.home || 0, p2: s.away || 0 })) || [],
    } : undefined,
  }));
}

function transformMatchDetail(data: any): TennisMatch | null {
  if (!data.data) return null;
  return transformTennisApiResponse(data)[0];
}
