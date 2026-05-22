// Real Tennis API Integration
// Using actual API endpoints

const ODDS_API_KEY = process.env.ODDS_API_KEY || "5aa7953743ecc124d0dc2c7a76ef2347";
const TENNIS_API_KEY = process.env.TENNIS_API_KEY || "8050d4441ca56029371545f57740bfe59db8c8b9ca0eac5b12a101f390cc5e7f";

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
  };
  player1Odds?: number;
  player2Odds?: number;
}

// Fetch real live matches from The Odds API
export async function fetchLiveMatches(): Promise<TennisMatch[]> {
  console.log("🔍 Fetching real tennis data from APIs...");
  
  try {
    // First try The Odds API for live tennis odds
    const oddsResponse = await fetch(
      `https://api.the-odds-api.com/v4/sports/tennis_atp/odds?apiKey=${ODDS_API_KEY}&regions=uk,eu,us&markets=h2h&dateFormat=iso`,
      { 
        next: { revalidate: 120 }, // 2 minute cache
        headers: { 'Content-Type': 'application/json' }
      }
    );

    if (oddsResponse.ok) {
      const oddsData = await oddsResponse.json();
      console.log("📊 Odds API response:", oddsData.length, "matches");
      
      if (oddsData && Array.isArray(oddsData) && oddsData.length > 0) {
        const matches = oddsData.map((event: any) => transformOddsApiMatch(event));
        if (matches.length > 0) {
          console.log("✅ Using real data from The Odds API");
          return matches;
        }
      }
    } else {
      console.log("⚠️ Odds API failed:", oddsResponse.status);
    }
  } catch (error) {
    console.error("❌ Odds API error:", error);
  }

  // Try Tennis API as backup
  try {
    console.log("🔄 Trying API-Tennis...");
    const tennisResponse = await fetch(
      `https://api-tennis.com/result/games?APIkey=${TENNIS_API_KEY}& sport=Tennis& match_status=inprogress`,
      { next: { revalidate: 120 } }
    );

    if (tennisResponse.ok) {
      const tennisData = await tennisResponse.json();
      console.log("🎾 Tennis API response:", tennisData);
      
      if (tennisData && Array.isArray(tennisData) && tennisData.length > 0) {
        const matches = tennisData.map((event: any) => transformTennisApiMatch(event));
        if (matches.length > 0) {
          console.log("✅ Using real data from Tennis API");
          return matches;
        }
      }
    }
  } catch (error) {
    console.error("❌ Tennis API error:", error);
  }

  // Try alternative Tennis API endpoint
  try {
    const altResponse = await fetch(
      `https://v1.api-tennis.com/tennis/api.php?method=get_games&APIkey=${TENNIS_API_KEY}`,
      { next: { revalidate: 120 } }
    );

    if (altResponse.ok) {
      const altData = await altResponse.json();
      console.log("🎾 Alternative Tennis API response:", altData);
    }
  } catch (error) {
    console.error("❌ Alternative Tennis API error:", error);
  }

  // Last resort - return empty with message that no real data is available
  console.log("⚠️ No real API data available");
  return [];
}

function transformOddsApiMatch(event: any): TennisMatch {
  // Extract player names from the event
  const homeTeam = event.home_team || "";
  const awayTeam = event.away_team || "";
  
  // Get the best odds from bookmakers
  let player1Odds = 1.5;
  let player2Odds = 2.5;
  
  if (event.bookmakers && event.bookmakers.length > 0) {
    const bookmaker = event.bookmakers[0];
    const h2hMarket = bookmaker.markets?.find((m: any) => m.key === "h2h");
    if (h2hMarket?.outcomes) {
      const homeOutcome = h2hMarket.outcomes.find((o: any) => o.name === homeTeam);
      const awayOutcome = h2hMarket.outcomes.find((o: any) => o.name === awayTeam);
      if (homeOutcome) player1Odds = homeOutcome.price;
      if (awayOutcome) player2Odds = awayOutcome.price;
    }
  }

  return {
    id: event.id || `odds_${Date.now()}`,
    tournament: event.sport_title || "ATP Tour",
    tournamentShort: event.sport_title || "ATP",
    surface: "Hard", // Default, would need more API calls for surface
    round: "Match",
    player1: {
      name: homeTeam,
      country: "",
      ranking: 0,
    },
    player2: {
      name: awayTeam,
      country: "",
      ranking: 0,
    },
    startTime: event.commence_time || new Date().toISOString(),
    status: event.sport_key?.includes("live") ? "live" : "scheduled",
    player1Odds,
    player2Odds,
  };
}

function transformTennisApiMatch(event: any): TennisMatch {
  return {
    id: event.id?.toString() || `tennis_${Date.now()}`,
    tournament: event.competition || event.league || "Tennis",
    tournamentShort: event.competition || "Tennis",
    surface: event.surface || "Hard",
    round: event.round || "Match",
    player1: {
      name: event.home_player || event.player1 || "Player 1",
      country: event.home_country || "",
      ranking: event.home_ranking || 0,
    },
    player2: {
      name: event.away_player || event.player2 || "Player 2",
      country: event.away_country || "",
      ranking: event.away_ranking || 0,
    },
    startTime: event.start_time || event.scheduled || new Date().toISOString(),
    status: event.status === "inprogress" || event.live ? "live" : 
            event.status === "finished" ? "completed" : "scheduled",
    score: event.current_score ? {
      current: event.current_score,
      sets: event.sets || [],
    } : undefined,
    player1Odds: event.home_odds || event.player1_odds,
    player2Odds: event.away_odds || event.player2_odds,
  };
}

export async function fetchMatchDetails(matchId: string): Promise<TennisMatch | null> {
  try {
    const response = await fetch(
      `https://api.the-odds-api.com/v4/sports/tennis_atp/odds/${matchId}?apiKey=${ODDS_API_KEY}`,
      { next: { revalidate: 60 } }
    );
    
    if (response.ok) {
      const data = await response.json();
      return transformOddsApiMatch(data);
    }
  } catch (error) {
    console.error("Failed to fetch match details:", error);
  }
  return null;
}
