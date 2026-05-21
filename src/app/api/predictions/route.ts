import { NextResponse } from "next/server";
import { fetchLiveMatches } from "@/lib/api/tennis-api";
import { generatePredictions } from "@/lib/api/prediction-engine";

export async function GET() {
  try {
    const matches = await fetchLiveMatches();
    const predictions = generatePredictions(matches);
    
    return NextResponse.json({
      success: true,
      data: {
        matches,
        predictions,
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error("Failed to fetch predictions:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch predictions" },
      { status: 500 }
    );
  }
}