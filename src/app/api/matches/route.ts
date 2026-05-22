import { NextResponse } from "next/server";

const ODDS_API_KEY = process.env.ODDS_API_KEY || "ee4f52e1b0c8ac9c766431712d594f87";

export async function GET() {
  console.log("🔍 Fetching LIVE tennis data from The Odds API...");
  
  try {
    // Fetch ATP tennis
    const atpResponse = await fetch(
      `https://api.the-odds-api.com/v4/sports/tennis_atp/odds?apiKey=${ODDS_API_KEY}&regions=uk,eu,us&markets=h2h,spread`,
      { cache: 'no-store' }
    );

    console.log("ATP Response Status:", atpResponse.status);
    console.log("ATP Response Headers:", Object.fromEntries(atpResponse.headers.entries()));

    if (!atpResponse.ok) {
      const errorText = await atpResponse.text();
      console.error("ATP API Error:", errorText);
      
      return NextResponse.json({
        success: false,
        error: `API Error: ${atpResponse.status}`,
        details: errorText,
        apiKeyValid: atpResponse.status !== 401,
      });
    }

    const atpData = await atpResponse.json();
    console.log("ATP Data received:", JSON.stringify(atpData, null, 2)?.substring(0, 1000));

    // Also fetch WTA
    const wtaResponse = await fetch(
      `https://api.the-odds-api.com/v4/sports/tennis_wta/odds?apiKey=${ODDS_API_KEY}&regions=uk,eu,us&markets=h2h`,
      { cache: 'no-store' }
    );

    let wtaData = [];
    if (wtaResponse.ok) {
      wtaData = await wtaResponse.json();
    }

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      atpMatches: atpData?.length || 0,
      wtaMatches: wtaData?.length || 0,
      data: {
        atp: atpData || [],
        wta: wtaData || [],
      },
    });

  } catch (error: any) {
    console.error("❌ Fetch error:", error);
    return NextResponse.json({
      success: false,
      error: error.message || "Unknown error",
    });
  }
}
