import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const apiKey = searchParams.get("key");

  if (!apiKey) {
    return NextResponse.json({
      success: false,
      error: "API key required",
    });
  }

  try {
    // Get available sports to find correct tennis key
    const sportsResponse = await fetch(
      `https://api.the-odds-api.com/v4/sports?apiKey=${apiKey}`,
      { signal: AbortSignal.timeout(10000) }
    );

    let tennisSportKey = "tennis_atp";

    if (sportsResponse.ok) {
      const sports = await sportsResponse.json();
      const tennisSports = sports.filter((s: any) =>
        s.title?.toLowerCase().includes('tennis')
      );
      if (tennisSports.length > 0) {
        tennisSportKey = tennisSports[0].key;
      }
    }

    // Fetch tennis odds
    const oddsResponse = await fetch(
      `https://api.the-odds-api.com/v4/sports/${tennisSportKey}/odds?apiKey=${apiKey}&regions=uk,eu,us&markets=h2h`,
      { cache: 'no-store', signal: AbortSignal.timeout(15000) }
    );

    if (!oddsResponse.ok) {
      const errorText = await oddsResponse.text();
      return NextResponse.json({
        success: false,
        error: `HTTP ${oddsResponse.status}`,
        details: errorText.substring(0, 300),
      });
    }

    const data = await oddsResponse.json();
    return NextResponse.json({
      success: true,
      totalMatches: data?.length || 0,
      matches: data || [],
    });

  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.name === 'TimeoutError' ? 'Request timeout' : error.message,
    });
  }
}
