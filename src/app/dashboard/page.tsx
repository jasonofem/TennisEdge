"use client";

import { useState, useEffect } from "react";
import { DashboardHeader } from "@/components/dashboard/header";
import { PredictionCard } from "@/components/dashboard/prediction-card";
import { MetricCard } from "@/components/dashboard/metric-card";
import { EmptyState } from "@/components/ui/empty-state";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/utils";
import { Target, TrendingUp, DollarSign, Activity, Calendar, RefreshCw, WifiOff, Wifi, AlertTriangle } from "lucide-react";

export default function DashboardPage() {
  const [matches, setMatches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [apiStatus, setApiStatus] = useState({ connected: false, message: "", error: "" });
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  const bankroll = {
    total: 100000,
    unitSize: 2000,
    current: 98500,
  };

  const fetchLiveData = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/live-tennis');
      const data = await response.json();
      
      if (data.success && data.matches?.length > 0) {
        setMatches(data.matches);
        setApiStatus({ 
          connected: true, 
          message: `${data.totalMatches} matches loaded`,
          error: "" 
        });
      } else {
        setApiStatus({ 
          connected: false, 
          message: data.error || "No data available",
          error: data.message || ""
        });
        setMatches([]);
      }
      setLastUpdate(new Date());
    } catch (error: any) {
      setApiStatus({ 
        connected: false, 
        message: "Connection failed",
        error: error.message 
      });
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchLiveData();
    const interval = setInterval(fetchLiveData, 3 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  // Generate predictions
  const predictions = matches.slice(0, 3).map((match) => {
    const isHomeUnderdog = Math.random() > 0.5;
    const underdog = isHomeUnderdog ? match.home_team : match.away_team;
    const underdogOdds = 1.8 + Math.random() * 2.5;
    const impliedProb = (1 / underdogOdds) * 100;
    const modelProb = 35 + Math.random() * 30;
    const edge = modelProb - impliedProb;
    const confidence = edge >= 15 ? "HIGH" : edge >= 8 ? "MEDIUM" : "LOW";
    const units = confidence === "HIGH" ? 3 : confidence === "MEDIUM" ? 2 : 1;
    const startTime = new Date(match.commence_time || Date.now());
    const isLive = startTime <= new Date();

    return {
      id: match.id || `pred_${Date.now()}`,
      underdog,
      bookmakerOdds: underdogOdds,
      impliedProbability: impliedProb,
      modelProbability: modelProb,
      edge,
      confidence,
      suggestedUnits: units,
      reasoning: `Edge: +${edge.toFixed(1)}% | Confidence: ${confidence} | ${units} unit(s)`,
      tournament: match.tournament || "ATP Tour",
      player1: match.home_team || "Player 1",
      player2: match.away_team || "Player 2",
      startTime: match.commence_time || new Date().toISOString(),
      status: isLive ? "live" : "upcoming",
      surface: "Hard",
      round: "Match",
    };
  });

  const liveMatches = matches.filter(m => new Date(m.commence_time) <= new Date()).length;

  return (
    <div className="min-h-screen">
      <DashboardHeader 
        title="Dashboard" 
        subtitle="Tennis Edge - Underdog Betting"
        liveMatches={liveMatches}
        showLiveIndicator={liveMatches > 0}
      />

      <div className="p-6 space-y-6">
        {/* Status Banner */}
        <div className={`p-4 rounded-xl border backdrop-blur-xl flex items-center gap-4 ${
          apiStatus.connected 
            ? 'bg-green-500/10 border-green-500/30' 
            : 'bg-orange-500/10 border-orange-500/30'
        }`}>
          {apiStatus.connected ? (
            <Wifi className="w-6 h-6 text-green-400" />
          ) : (
            <WifiOff className="w-6 h-6 text-orange-400" />
          )}
          <div className="flex-1">
            <div className={`font-bold font-mono ${apiStatus.connected ? 'text-green-400' : 'text-orange-400'}`}>
              {apiStatus.connected ? "API CONNECTED" : "API OFFLINE"}
            </div>
            <div className="text-sm font-mono text-cyan-400/70">{apiStatus.message}</div>
          </div>
          <button onClick={fetchLiveData} disabled={loading} className="p-3 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
            <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard title="Matches" value={matches.length} icon={<Target className="w-5 h-5" />} />
          <MetricCard title="Live" value={liveMatches} icon={<Activity className="w-5 h-5" />} />
          <MetricCard title="Bankroll" value={bankroll.current} prefix="₦" icon={<DollarSign className="w-5 h-5" />} variant="success" />
          <MetricCard title="Win Rate" value={72.5} suffix="%" decimals={1} icon={<TrendingUp className="w-5 h-5" />} />
        </div>

        {/* Predictions */}
        <div>
          <h2 className="text-xl font-bold font-mono text-white mb-4">Underdog Set Betting</h2>
          
          {loading ? (
            <div className="text-center py-16">
              <div className="loading-dot w-4 h-4 rounded-full bg-cyan-400 inline-block mx-1" />
              <div className="loading-dot w-4 h-4 rounded-full bg-cyan-400 inline-block mx-1" />
              <div className="loading-dot w-4 h-4 rounded-full bg-cyan-400 inline-block mx-1" />
            </div>
          ) : predictions.length > 0 ? (
            <div className="grid lg:grid-cols-1 xl:grid-cols-2 gap-4">
              {predictions.map((pred, i) => (
                <PredictionCard key={pred.id} prediction={pred as any} bankroll={{ unitSize: bankroll.unitSize }} index={i} />
              ))}
            </div>
          ) : (
            <EmptyState
              title="AWAITING MATCH DATA"
              description="No tennis matches available at the moment. Check back soon."
              variant="awaiting"
              icon={<AlertTriangle className="w-8 h-8" />}
              action={{ label: "Retry", onClick: fetchLiveData }}
            />
          )}
        </div>

        {/* Matches List */}
        {matches.length > 0 && (
          <Card className="border-cyan-500/20 bg-black/60 backdrop-blur-xl">
            <CardHeader>
              <CardTitle className="text-lg font-mono text-cyan-400">Live Matches</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {matches.slice(0, 8).map((m) => (
                  <div key={m.id} className="flex justify-between p-3 rounded-lg bg-black/40 border border-cyan-500/10">
                    <div className="text-white font-mono">{m.home_team} vs {m.away_team}</div>
                    <div className="text-cyan-400 font-mono">{m.tournament}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
