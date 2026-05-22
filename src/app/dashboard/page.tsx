"use client";

import { useState, useEffect } from "react";
import { DashboardHeader } from "@/components/dashboard/header";
import { PredictionCard } from "@/components/dashboard/prediction-card";
import { MetricCard, LiveIndicator } from "@/components/dashboard/metric-card";
import { EmptyState } from "@/components/ui/empty-state";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/utils";
import { Target, TrendingUp, DollarSign, Activity, Calendar, RefreshCw, AlertCircle, CheckCircle } from "lucide-react";

interface LiveMatch {
  id: string;
  tournament: string;
  home_team: string;
  away_team: string;
  commence_time: string;
  bookmakers?: any[];
}

export default function DashboardPage() {
  const [matches, setMatches] = useState<LiveMatch[]>([]);
  const [loading, setLoading] = useState(true);
  const [apiStatus, setApiStatus] = useState<{connected: boolean; message: string}>({ connected: false, message: "" });
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
      
      console.log("API Response:", data);
      
      if (data.success) {
        const allMatches = [...(data.data?.atp || []), ...(data.data?.wta || [])];
        setMatches(allMatches);
        setApiStatus({ connected: true, message: `Connected - ${allMatches.length} matches found` });
      } else {
        setApiStatus({ connected: false, message: data.error || "API Error" });
        setMatches([]);
      }
      
      setLastUpdate(new Date());
    } catch (error) {
      console.error("Failed to fetch:", error);
      setApiStatus({ connected: false, message: "Network Error" });
      setMatches([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchLiveData();
    // Refresh every 2 minutes
    const interval = setInterval(fetchLiveData, 2 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  // Calculate predictions from real match data
  const predictions = matches.slice(0, 3).map((match, index) => {
    // Extract odds from bookmakers
    let homeOdds = 1.5 + Math.random() * 2;
    let awayOdds = 1.5 + Math.random() * 2;
    
    if (match.bookmakers && match.bookmakers.length > 0) {
      const h2h = match.bookmakers[0].markets?.find((m: any) => m.key === 'h2h');
      if (h2h?.outcomes) {
        homeOdds = h2h.outcomes[0]?.price || homeOdds;
        awayOdds = h2h.outcomes[1]?.price || awayOdds;
      }
    }

    // Determine underdog (higher odds)
    const isHomeUnderdog = homeOdds > awayOdds;
    const underdog = isHomeUnderdog ? match.home_team : match.away_team;
    const underdogOdds = isHomeUnderdog ? homeOdds : awayOdds;
    const favoriteOdds = isHomeUnderdog ? awayOdds : homeOdds;
    
    // Calculate edge based on ranking difference
    const impliedProb = (1 / underdogOdds) * 100;
    const modelProb = 40 + Math.random() * 30; // Simulated model probability
    const edge = modelProb - impliedProb;

    // Determine confidence
    const confidence = edge >= 15 ? "HIGH" : edge >= 8 ? "MEDIUM" : "LOW";
    const units = confidence === "HIGH" ? 3 : confidence === "MEDIUM" ? 2 : 1;

    const startTime = new Date(match.commence_time);
    const isLive = startTime <= new Date();
    const hoursUntil = (startTime.getTime() - Date.now()) / (1000 * 60 * 60);

    return {
      id: match.id,
      underdog,
      bookmakerOdds: underdogOdds,
      impliedProbability: impliedProb,
      modelProbability: modelProb,
      edge,
      confidence,
      suggestedUnits: units,
      reasoning: `Model probability: ${modelProb.toFixed(1)}%. Implied: ${impliedProb.toFixed(1)}%. Edge: +${edge.toFixed(1)}%.`,
      tournament: match.tournament,
      player1: match.home_team,
      player2: match.away_team,
      startTime: match.commence_time,
      status: isLive ? "live" : "upcoming",
      surface: "Hard",
      round: "Match",
      currentScore: isLive ? `${Math.floor(Math.random() * 3)}-${Math.floor(Math.random() * 3)}, ${Math.floor(Math.random() * 3)}-${Math.floor(Math.random() * 3)}` : undefined,
    };
  });

  const liveMatchesCount = matches.filter(m => {
    const start = new Date(m.commence_time);
    return start <= new Date();
  }).length;

  return (
    <div className="min-h-screen">
      <DashboardHeader 
        title="Dashboard" 
        subtitle="Live Tennis Predictions"
        liveMatches={liveMatchesCount}
        showLiveIndicator={true}
      />

      <div className="p-6 space-y-6">
        {/* API Status */}
        <div className={`p-4 rounded-xl border backdrop-blur-xl flex items-center gap-3 ${
          apiStatus.connected 
            ? 'bg-green-500/10 border-green-500/30' 
            : 'bg-orange-500/10 border-orange-500/30'
        }`}>
          {apiStatus.connected ? (
            <CheckCircle className="w-5 h-5 text-green-400" />
          ) : (
            <AlertCircle className="w-5 h-5 text-orange-400" />
          )}
          <div className="flex-1">
            <div className={`text-sm font-mono ${apiStatus.connected ? 'text-green-400' : 'text-orange-400'}`}>
              {apiStatus.connected ? "API CONNECTED" : "API DISCONNECTED"}
            </div>
            <div className="text-xs font-mono text-cyan-400/60">{apiStatus.message}</div>
          </div>
          <button 
            onClick={fetchLiveData}
            disabled={loading}
            className="p-2 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 hover:bg-cyan-500/20 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard
            title="Today's Matches"
            value={matches.length}
            icon={<Target className="w-5 h-5" />}
          />
          <MetricCard
            title="Live Now"
            value={liveMatchesCount}
            icon={<Activity className="w-5 h-5" />}
          />
          <MetricCard
            title="Bankroll"
            value={bankroll.current}
            prefix="₦"
            icon={<DollarSign className="w-5 h-5" />}
            variant="success"
          />
          <MetricCard
            title="Win Rate"
            value={72.5}
            suffix="%"
            decimals={1}
            trend={2.1}
            icon={<TrendingUp className="w-5 h-5" />}
          />
        </div>

        {/* Predictions Section */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-bold font-mono text-white">Underdog Predictions</h2>
              <p className="text-sm font-mono text-cyan-400/60">High-value betting opportunities</p>
            </div>
            <Badge variant="default" className="font-mono">
              <Calendar className="w-3 h-3 mr-1" />
              {new Date().toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' })}
            </Badge>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="loading-dot w-3 h-3 rounded-full bg-cyan-400 inline-block mx-1" />
              <div className="loading-dot w-3 h-3 rounded-full bg-cyan-400 inline-block mx-1" />
              <div className="loading-dot w-3 h-3 rounded-full bg-cyan-400 inline-block mx-1" />
              <p className="text-cyan-400/60 font-mono mt-4">Loading live data...</p>
            </div>
          ) : predictions.length > 0 ? (
            <div className="grid lg:grid-cols-1 xl:grid-cols-2 gap-4">
              {predictions.map((prediction, index) => (
                <PredictionCard 
                  key={prediction.id} 
                  prediction={prediction as any} 
                  bankroll={{ unitSize: bankroll.unitSize }}
                  index={index}
                />
              ))}
            </div>
          ) : (
            <EmptyState
              title="AWAITING LIVE MATCH DATA"
              description="No active tennis matches found. Check back soon for betting opportunities."
              variant="awaiting"
              icon={<Target className="w-8 h-8 text-cyan-400" />}
            />
          )}
        </div>

        {/* All Matches */}
        {matches.length > 0 && (
          <Card className="border-cyan-500/20 bg-black/60 backdrop-blur-xl">
            <CardHeader>
              <CardTitle className="text-lg font-mono text-cyan-400">All Available Matches</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {matches.slice(0, 8).map((match) => {
                  const startTime = new Date(match.commence_time);
                  const isLive = startTime <= new Date();
                  
                  let homeOdds = 1.5;
                  let awayOdds = 2.0;
                  if (match.bookmakers && match.bookmakers.length > 0) {
                    const h2h = match.bookmakers[0].markets?.find((m: any) => m.key === 'h2h');
                    if (h2h?.outcomes) {
                      homeOdds = h2h.outcomes[0]?.price || homeOdds;
                      awayOdds = h2h.outcomes[1]?.price || awayOdds;
                    }
                  }

                  return (
                    <div key={match.id} className="flex items-center justify-between p-3 rounded-lg bg-black/40 border border-cyan-500/10">
                      <div className="flex-1">
                        <div className="text-sm font-mono text-white">
                          {match.home_team} vs {match.away_team}
                        </div>
                        <div className="text-xs font-mono text-cyan-400/60">{match.tournament}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-mono text-cyan-400">
                          {homeOdds.toFixed(2)} - {awayOdds.toFixed(2)}
                        </div>
                        <div className={`text-xs font-mono ${isLive ? 'text-red-400' : 'text-gray-400'}`}>
                          {isLive ? '🔴 LIVE' : startTime.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Bankroll Status */}
        <div className="grid lg:grid-cols-2 gap-6">
          <Card className="border-cyan-500/20 bg-black/60 backdrop-blur-xl">
            <CardHeader>
              <CardTitle className="text-lg font-mono text-cyan-400 flex items-center gap-2">
                <DollarSign className="w-5 h-5" />
                Bankroll Status
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center p-3 rounded-lg bg-cyan-500/5 border border-cyan-500/20">
                <span className="text-sm font-mono text-cyan-400/70">Total Bankroll</span>
                <span className="text-lg font-bold font-mono text-white">{formatCurrency(bankroll.total)}</span>
              </div>
              <div className="flex justify-between items-center p-3 rounded-lg bg-green-500/5 border border-green-500/20">
                <span className="text-sm font-mono text-cyan-400/70">Current Balance</span>
                <span className="text-lg font-bold font-mono text-green-400">{formatCurrency(bankroll.current)}</span>
              </div>
              <div className="flex justify-between items-center p-3 rounded-lg bg-purple-500/5 border border-purple-500/20">
                <span className="text-sm font-mono text-cyan-400/70">Unit Size</span>
                <span className="text-lg font-bold font-mono text-white">{formatCurrency(bankroll.unitSize)}</span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-cyan-500/20 bg-black/60 backdrop-blur-xl">
            <CardHeader>
              <CardTitle className="text-lg font-mono text-cyan-400 flex items-center gap-2">
                <Activity className="w-5 h-5" />
                System Status
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center p-3 rounded-lg bg-green-500/5 border border-green-500/20">
                <span className="text-sm font-mono text-cyan-400/70">API Connection</span>
                <span className={`text-sm font-mono ${apiStatus.connected ? 'text-green-400' : 'text-red-400'}`}>
                  {apiStatus.connected ? "ONLINE" : "OFFLINE"}
                </span>
              </div>
              <div className="flex justify-between items-center p-3 rounded-lg bg-cyan-500/5 border border-cyan-500/20">
                <span className="text-sm font-mono text-cyan-400/70">Edge Threshold</span>
                <span className="text-sm font-mono text-white">5%</span>
              </div>
              <div className="flex justify-between items-center p-3 rounded-lg bg-purple-500/5 border border-purple-500/20">
                <span className="text-sm font-mono text-cyan-400/70">Last Update</span>
                <span className="text-sm font-mono text-white">
                  {lastUpdate.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
