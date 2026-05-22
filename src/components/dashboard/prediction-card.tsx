"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { PulseIndicator } from "@/components/ui/animated-background";
import { formatCurrency, getTimeUntilMatch } from "@/lib/utils";
import type { Prediction } from "@/lib/api/prediction-engine";
import { ChevronDown, ChevronUp, Clock, Target, TrendingUp, Zap } from "lucide-react";
import { useState } from "react";

interface PredictionCardProps {
  prediction: Prediction;
  bankroll?: { unitSize: number };
  index?: number;
}

export function PredictionCard({ prediction, bankroll, index = 0 }: PredictionCardProps) {
  const [expanded, setExpanded] = useState(false);
  
  const confidenceColors: Record<string, { bg: string; text: string; border: string }> = {
    LOW: { bg: "bg-purple-500/20", text: "text-purple-400", border: "border-purple-500/30" },
    MEDIUM: { bg: "bg-cyan-500/20", text: "text-cyan-400", border: "border-cyan-500/30" },
    HIGH: { bg: "bg-green-500/20", text: "text-green-400", border: "border-green-500/30" },
  };

  const confidenceStyles = confidenceColors[prediction.confidence] || confidenceColors.MEDIUM;
  const stakeAmount = bankroll ? bankroll.unitSize * prediction.suggestedUnits : prediction.suggestedUnits * 100;
  const potentialWin = stakeAmount * (prediction.bookmakerOdds - 1);

  const match = prediction.match;
  const player1 = match.player1.name;
  const player2 = match.player2.name;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <Card className="relative overflow-hidden border-cyan-500/30 hover:border-cyan-400/50 transition-all duration-300">
        {/* Glowing top border */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent" />
        
        {/* Live indicator */}
        {prediction.status === "live" && (
          <div className="absolute top-2 right-2">
            <PulseIndicator status="live" size="sm" />
          </div>
        )}

        <CardHeader className="pb-4">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Target className="w-4 h-4 text-cyan-400" />
                <span className="text-xs font-mono text-cyan-400/70 uppercase tracking-wider">
                  {match.tournamentShort || match.tournament}
                </span>
              </div>
              <CardTitle className="text-lg font-bold text-white flex items-center gap-2">
                <span className={player1 === prediction.underdog ? "text-green-400" : "text-white"}>
                  {player1}
                </span>
                <span className="text-cyan-500/50">vs</span>
                <span className={player2 === prediction.underdog ? "text-green-400" : "text-white"}>
                  {player2}
                </span>
              </CardTitle>
              <div className="flex items-center gap-3 text-sm font-mono text-cyan-400/60">
                {match.surface && <span>{match.surface}</span>}
                {match.round && <span>{match.round}</span>}
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {getTimeUntilMatch(new Date(match.startTime))}
                </span>
              </div>
            </div>
            
            {/* Confidence Badge */}
            <Badge 
              variant={prediction.confidence.toLowerCase() as any}
              className="text-xs font-bold"
            >
              {prediction.confidence} CONFIDENCE
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Main Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="space-y-1">
              <span className="text-xs font-mono text-cyan-400/60 uppercase">Market</span>
              <div className="text-sm font-mono text-white">Underdog To Win Set</div>
            </div>
            <div className="space-y-1">
              <span className="text-xs font-mono text-cyan-400/60 uppercase">Odds</span>
              <div className="text-2xl font-bold font-mono text-cyan-400">{prediction.bookmakerOdds.toFixed(2)}</div>
            </div>
            <div className="space-y-1">
              <span className="text-xs font-mono text-cyan-400/60 uppercase">Edge</span>
              <div className={`text-2xl font-bold font-mono ${prediction.edge > 10 ? "text-green-400" : "text-cyan-400"}`}>
                +{prediction.edge.toFixed(1)}%
              </div>
            </div>
            <div className="space-y-1">
              <span className="text-xs font-mono text-cyan-400/60 uppercase">Units</span>
              <div className="text-2xl font-bold font-mono text-white">{prediction.suggestedUnits}</div>
            </div>
          </div>

          {/* Probability Comparison */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm font-mono">
              <span className="text-cyan-400/70">Model Probability</span>
              <span className="text-white">{prediction.modelProbability.toFixed(1)}%</span>
            </div>
            <Progress 
              value={prediction.modelProbability} 
              className="h-2"
              indicatorClassName="bg-gradient-to-r from-cyan-500 to-cyan-400"
            />
            <div className="flex justify-between text-sm font-mono">
              <span className="text-cyan-400/70">Implied Probability</span>
              <span className="text-white">{prediction.impliedProbability.toFixed(1)}%</span>
            </div>
          </div>

          {/* Live Score */}
          {prediction.status === "live" && prediction.currentScore && (
            <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-red-400 animate-pulse" />
                <span className="text-sm font-mono text-red-400">LIVE SCORE</span>
              </div>
              <div className="text-2xl font-bold font-mono text-white mt-1">
                {prediction.currentScore}
              </div>
            </div>
          )}

          {/* Betting Info */}
          <div className="flex items-center justify-between p-3 rounded-lg bg-black/40 border border-cyan-500/20">
            <div className="flex items-center gap-4">
              <div>
                <span className="text-xs font-mono text-cyan-400/60">Stake</span>
                <div className="text-lg font-bold font-mono text-white">{formatCurrency(stakeAmount)}</div>
              </div>
              <div className="h-8 w-px bg-cyan-500/30" />
              <div>
                <span className="text-xs font-mono text-cyan-400/60">Potential Win</span>
                <div className="text-lg font-bold font-mono text-green-400">{formatCurrency(potentialWin)}</div>
              </div>
            </div>
            <div className="flex items-center gap-2 text-cyan-400">
              <Zap className="w-4 h-4" />
              <span className="text-xs font-mono uppercase">High Value</span>
            </div>
          </div>

          {/* Expandable Reasoning */}
          <div className="border-t border-cyan-500/10 pt-4">
            <button
              onClick={() => setExpanded(!expanded)}
              className="flex items-center gap-2 text-cyan-400 hover:text-cyan-300 transition-colors"
            >
              <span className="text-xs font-mono uppercase">Analysis</span>
              {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
            
            {expanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                className="mt-3 p-3 rounded-lg bg-black/40 border border-cyan-500/10"
              >
                <p className="text-sm font-mono text-cyan-400/80 leading-relaxed">
                  {prediction.reasoning}
                </p>
              </motion.div>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
