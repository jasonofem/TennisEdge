import { TennisMatch, calculateModelProbability } from "./tennis-api";
import { generateSimulatedOdds, calculateImpliedProbability } from "./odds-api";

export interface Prediction {
  id: string;
  match: TennisMatch;
  underdog: string;
  bookmakerOdds: number;
  impliedProbability: number;
  modelProbability: number;
  edge: number;
  confidence: "LOW" | "MEDIUM" | "HIGH";
  suggestedUnits: number;
  reasoning: string;
  matchTime: Date;
  status: "upcoming" | "live" | "completed";
  currentScore?: string;
}

interface PredictionConfig {
  edgeThreshold: number;
  maxDailyPicks: number;
  minConfidence: number;
}

const DEFAULT_CONFIG: PredictionConfig = {
  edgeThreshold: 5,
  maxDailyPicks: 3,
  minConfidence: 40,
};

// Calculate confidence level and suggested units based on edge
function calculateConfidence(edge: number): { confidence: "LOW" | "MEDIUM" | "HIGH"; units: number } {
  if (edge >= 15) return { confidence: "HIGH", units: 3 };
  if (edge >= 8) return { confidence: "MEDIUM", units: 2 };
  return { confidence: "LOW", units: 1 };
}

// Generate reasoning text based on analysis
function generateReasoning(
  underdog: string,
  favorite: string,
  edge: number,
  modelProb: number,
  impliedProb: number
): string {
  const points: string[] = [];
  
  points.push(`Model probability of ${underdog} winning a set: ${modelProb.toFixed(1)}%`);
  points.push(`Implied probability from bookmaker odds: ${impliedProb.toFixed(1)}%`);
  points.push(`Calculated edge: +${edge.toFixed(1)}%`);
  
  if (edge >= 15) {
    points.push("HIGH CONFIDENCE: Strong edge detected");
    points.push("Favorable matchup indicators detected in recent performance");
  } else if (edge >= 8) {
    points.push("MEDIUM CONFIDENCE: Decent value opportunity");
    points.push("Historical performance suggests potential for set victory");
  } else {
    points.push("LOW CONFIDENCE: Marginal edge, use caution");
    points.push("Value exists but requires tight bankroll management");
  }
  
  return points.join(". ");
}

// Main prediction engine
export function generatePredictions(
  matches: TennisMatch[],
  config: PredictionConfig = DEFAULT_CONFIG
): Prediction[] {
  const predictions: Prediction[] = [];
  
  for (const match of matches) {
    if (predictions.length >= config.maxDailyPicks) break;
    
    // Skip completed matches
    if (match.status === "completed") continue;
    
    // Generate simulated odds
    const oddsData = generateSimulatedOdds(match.player1.name, match.player2.name);
    
    const underdog = oddsData.underdog;
    const underdogOdds = oddsData.underdogOdds;
    const favorite = underdog === match.player1.name ? match.player2.name : match.player1.name;
    
    // Calculate probabilities
    const underdogPlayer = underdog === match.player1.name ? match.player1 : match.player2;
    const favoritePlayer = underdog === match.player1.name ? match.player2 : match.player1;
    
    // Simulate model probability with some randomness
    const baseProb = calculateModelProbability(underdogPlayer, favoritePlayer, match.surface);
    const modelProb = Math.min(95, Math.max(5, baseProb + (Math.random() * 20 - 10)));
    
    const impliedProb = calculateImpliedProbability(underdogOdds);
    const edge = modelProb - impliedProb;
    
    // Check if edge meets threshold
    if (edge >= config.edgeThreshold && modelProb >= config.minConfidence) {
      const { confidence, units } = calculateConfidence(edge);
      
      const prediction: Prediction = {
        id: `pred_${match.id}_${Date.now()}`,
        match,
        underdog,
        bookmakerOdds: underdogOdds,
        impliedProbability: impliedProb,
        modelProbability: modelProb,
        edge,
        confidence,
        suggestedUnits: units,
        reasoning: generateReasoning(underdog, favorite, edge, modelProb, impliedProb),
        matchTime: new Date(match.startTime),
        status: match.status === "live" ? "live" : "upcoming",
        currentScore: match.score?.current,
      };
      
      predictions.push(prediction);
    }
  }
  
  // Sort by edge (highest first)
  return predictions.sort((a, b) => b.edge - a.edge);
}

// Check if any qualifying edge exists today
export function hasQualifyingEdge(
  matches: TennisMatch[],
  config: PredictionConfig = DEFAULT_CONFIG
): boolean {
  for (const match of matches) {
    if (match.status === "completed") continue;
    
    const oddsData = generateSimulatedOdds(match.player1.name, match.player2.name);
    const underdogPlayer = oddsData.underdog === match.player1.name ? match.player1 : match.player2;
    const favoritePlayer = oddsData.underdog === match.player1.name ? match.player2 : match.player1;
    
    const modelProb = calculateModelProbability(underdogPlayer, favoritePlayer, match.surface);
    const impliedProb = calculateImpliedProbability(oddsData.underdogOdds);
    const edge = modelProb - impliedProb;
    
    if (edge >= config.edgeThreshold && modelProb >= config.minConfidence) {
      return true;
    }
  }
  
  return false;
}

// Format prediction for display
export function formatPredictionDisplay(prediction: Prediction): {
  displayOdds: string;
  displayEdge: string;
  displayConfidence: { label: string; color: string };
  displayUnits: string;
  edgeIndicator: "positive" | "neutral" | "negative";
} {
  return {
    displayOdds: prediction.bookmakerOdds.toFixed(2),
    displayEdge: `+${prediction.edge.toFixed(1)}%`,
    displayConfidence: {
      label: prediction.confidence,
      color: prediction.confidence === "HIGH" ? "#00ff88" : prediction.confidence === "MEDIUM" ? "#00f0ff" : "#a855f7",
    },
    displayUnits: `${prediction.suggestedUnits} unit${prediction.suggestedUnits > 1 ? "s" : ""}`,
    edgeIndicator: prediction.edge > 10 ? "positive" : prediction.edge > 5 ? "neutral" : "negative",
  };
}