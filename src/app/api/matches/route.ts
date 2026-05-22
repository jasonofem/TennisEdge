import { NextResponse } from "next/server";

// This endpoint will be called from the client with API key in the URL
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
    const response = await fetch(
      `https://api.the-odds-api.com/v4/sports/tennis_atp/odds?apiKey=${apiKey}&regions=uk,eu,us&markets=h2h`,
      { 
        cache: 'no-store',
        signal: AbortSignal.timeout(15000)
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json({
        success: false,
        error: `HTTP ${response.status}`,
        details: errorText.substring(0, 200),
      });
    }

    const data = await response.json();
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
