// Real-time Tennis Data Service
// Fetches actual live tennis matches and odds

const ODDS_API_KEY = process.env.ODDS_API_KEY || "ee4f52e1b0c8ac9c766431712d594f87";

export interface LiveTennisMatch {
  id: string;
  tournament: string;
  teams: {
    home: { name: string; odds: number };
    away: { name: string; odds: number };
  };
  startTime: string;
  status: "upcoming" | "live" | "finished";
  score?: string;
  homeScore?: number;
  awayScore?: number;
}

export async function getLiveTennisMatches(): Promise<LiveTennisMatch[]> {
  console.log("🎾 Fetching LIVE tennis data from The Odds API...");
  
  try {
    // Fetch ATP tennis odds
    const atpResponse = await fetch(
      `https://api.the-odds-api.com/v4/sports/tennis_atp/odds?apiKey=${ODDS_API_KEY}&regions=uk,eu,us&markets=h2h,spread,total&dateFormat=iso`,
      { 
        cache: 'no-store',
        headers: { 'Accept': 'application/json' }
      }
    );

    if (!atpResponse.ok) {
      console.error(`ATP API Error: ${atpResponse.status} - ${atpResponse.statusText}`);
      const errorText = await atpResponse.text();
      console.error("Error details:", errorText);
    } else {
      const atpData = await atpResponse.json();
      console.log(`📊 ATP Response: ${atpData?.length || 0} events`);
      
      if (atpData && Array.isArray(atpData) && atpData.length > 0) {
        return atpData.map((event: any) => {
          // Extract odds from first bookmaker
          let homeOdds = 1.5;
          let awayOdds = 2.5;
          
          if (event.bookmakers && event.bookmakers.length > 0) {
            const bookmaker = event.bookmakers[0];
            if (bookmaker.markets) {
              const h2h = bookmaker.markets.find((m: any) => m.key === 'h2h');
              if (h2h && h2h.outcomes) {
                const homeOutcome = h2h.outcomes.find((o: any) => 
                  o.name.toLowerCase().includes(event.home_team?.toLowerCase().split(' ')[0])
                );
                const awayOutcome = h2h.outcomes.find((o: any) => 
                  o.name.toLowerCase().includes(event.away_team?.toLowerCase().split(' ')[0])
                );
                if (homeOutcome) homeOdds = homeOutcome.price;
                if (awayOutcome) awayOdds = awayOutcome.price;
              }
            }
          }

          return {
            id: event.id,
            tournament: event.sport_title || "ATP Tour",
            teams: {
              home: { name: event.home_team, odds: homeOdds },
              away: { name: event.away_team, odds: awayOdds }
            },
            startTime: event.commence_time,
            status: determineStatus(event),
            score: event.last_event?.score || undefined,
          };
        });
      }
    }

    // Also try WTA
    const wtaResponse = await fetch(
      `https://api.the-odds-api.com/v4/sports/tennis_wta/odds?apiKey=${ODDS_API_KEY}&regions=uk,eu,us&markets=h2h`,
      { cache: 'no-store' }
    );

    if (wtaResponse.ok) {
      const wtaData = await wtaResponse.json();
      console.log(`📊 WTA Response: ${wtaData?.length || 0} events`);
    }

  } catch (error) {
    console.error("❌ Error fetching tennis data:", error);
  }

  return [];
}

function determineStatus(event: any): "upcoming" | "live" | "finished" {
  // Check if event has started based on commence time
  const commenceTime = new Date(event.commence_time);
  const now = new Date();
  
  if (commenceTime > now) return "upcoming";
  
  // Check if bookmakers have updated odds recently (indicates live)
  if (event.bookmakers?.[0]?.last_update) {
    const lastUpdate = new Date(event.bookmakers[0].last_update);
    const minutesAgo = (now.getTime() - lastUpdate.getTime()) / 60000;
    if (minutesAgo < 30) return "live";
  }
  
  return "upcoming";
}

// Debug function to check API status
export async function checkApiStatus(): Promise<{status: string; remainingRequests: number; dataFreshness: string}> {
  try {
    const response = await fetch(
      `https://api.the-odds-api.com/v4/sports/tennis_atp/odds?apiKey=${ODDS_API_KEY}&regions=uk&markets=h2h`,
      { cache: 'no-store' }
    );
    
    const remaining = response.headers.get('X-Requests-Remaining') || '0';
    const used = response.headers.get('X-Requests-Used') || '0';
    
    return {
      status: response.ok ? "CONNECTED" : `ERROR: ${response.status}`,
      remainingRequests: parseInt(remaining),
      dataFreshness: response.ok ? "LIVE" : "N/A"
    };
  } catch (error) {
    return {
      status: "DISCONNECTED",
      remainingRequests: 0,
      dataFreshness: "N/A"
    };
  }
}
