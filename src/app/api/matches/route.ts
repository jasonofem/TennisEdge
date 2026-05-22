import { NextResponse } from "next/server";

export async function GET() {
  const ODDS_API_KEY = process.env.ODDS_API_KEY || "ee4f52e1b0c8ac9c766431712d594f87";
  
  try {
    const response = await fetch(
      `https://api.the-odds-api.com/v4/sports/tennis_atp/odds?apiKey=${ODDS_API_KEY}&regions=uk,eu,us&markets=h2h`,
      { cache: 'no-store' }
    );

    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json({
        success: false,
        error: `HTTP ${response.status}`,
        details: errorText,
      });
    }

    const tennisData = await response.json();

    return NextResponse.json({
      success: true,
      totalMatches: tennisData?.length || 0,
      matches: tennisData || [],
    });

  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: "Network Error",
      details: error.message,
    });
  }
}
