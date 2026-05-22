import { NextResponse } from "next/server";

export async function GET() {
  const ODDS_API_KEY = process.env.ODDS_API_KEY;
  
  // Check if API key exists
  if (!ODDS_API_KEY) {
    return NextResponse.json({
      success: false,
      error: "API Key not configured",
      matches: [],
    });
  }

  try {
    const url = `https://api.the-odds-api.com/v4/sports/tennis_atp/odds?apiKey=${ODDS_API_KEY}&regions=uk,eu&markets=h2h&dateFormat=iso`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
      signal: AbortSignal.timeout(10000), // 10 second timeout
    });

    // Check if response is HTML (error page)
    const contentType = response.headers.get('content-type') || '';
    if (!contentType.includes('application/json')) {
      return NextResponse.json({
        success: false,
        error: `Invalid response (${contentType})`,
        message: "API may be rate limited or key invalid",
        matches: [],
      });
    }

    const data = await response.json();

    return NextResponse.json({
      success: true,
      totalMatches: data?.length || 0,
      matches: data || [],
      timestamp: new Date().toISOString(),
    });

  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.name === 'TimeoutError' ? 'Request Timeout' : error.message,
      matches: [],
    });
  }
}
