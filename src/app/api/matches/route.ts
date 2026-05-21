import { NextResponse } from "next/server";
import { fetchLiveMatches } from "@/lib/api/tennis-api";

export async function GET() {
  try {
    const matches = await fetchLiveMatches();
    
    return NextResponse.json({
      success: true,
      data: {
        matches,
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error("Failed to fetch matches:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch matches" },
      { status: 500 }
    );
  }
}