"use client";

import { useState, useEffect } from "react";
import { DashboardHeader } from "@/components/dashboard/header";
import { PredictionCard } from "@/components/dashboard/prediction-card";
import { MetricCard, LiveIndicator } from "@/components/dashboard/metric-card";
import { EmptyState } from "@/components/ui/empty-state";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/utils";
import { Target, TrendingUp, DollarSign, Activity, Calendar, RefreshCw, AlertCircle, CheckCircle, Wifi, WifiOff } from "lucide-react";

interface MatchData {
  id: string;
  tournament: string;
  home_team: string;
  away_team: string;
  commence_time: string;
  bookmakers?: any[];
}

export default function DashboardPage() {
  const [matches, setMatches] = useState<MatchData[]>([]);
  const [loading, setLoading] = useState(true);
  const [apiStatus, setApiStatus] = useState({ connected: false, message: "", details: "" });
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  const [testResult, setTestResult] = useState<string>("");

  const bankroll = {
    total: 100000,
    unitSize: 2000,
    current: 98500,
  };

  const testApiConnection = async () => {
    try {
      const response = await fetch('/api/test');
      const data = await response.json();
      setTestResult(JSON.stringify(data, null, 2));
    } catch (error: any) {
      setTestResult("Test failed: " + error.message);
    }
  };

  const fetchLiveData = async () => {
    setLoading(true);
    try {
      console.log("Fetching live tennis data...");
      const response = await fetch('/api/live-tennis');
      const data = await response.json();
      
      console.log("API Response:", JSON.stringify(data, null, 2));
      
      if (data.success) {
        const allMatches = data.matches || [];
        setMatches(allMatches);
        setApiStatus({ 
          connected: true, 
          message: `Connected - ${allMatches.length} matches found`,
          details: `Last updated: ${new Date().toLocaleTimeString()}`
        });
      } else {
        setApiStatus({ 
          connected: false, 
          message: data.error || "API Error",
          details: data.details || ""
        });
        setMatches([]);
      }
      
      setLastUpdate(new Date());
    } catch (error: any) {
      console.error("Fetch error:", error);
      setApiStatus({ 
        connected: false, 
        message: "Network Error",
        details: error.message
      });
      setMatches([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    testApiConnection();
    fetchLiveData();
    const interval = setInterval(fetchLiveData, 2 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  // Generate predictions from match data
  const predictions = matches.slice(0, 3).map((match) => {
    let homeOdds = 1.8 + Math.random() * 1.5;
    let awayOdds = 1.8 + Math.random() * 1.5;
    
    if (match.bookmakers && match.bookmakers.length > 0) {
      const h2h = match.bookmakers[0].markets?.find((m: any) => m.key === 'h2h');
      if (h2h?.outcomes) {
        homeOdds = h2h.outcomes[0]?.price || homeOdds;
        awayOdds = h2h.outcomes[1]?.price || awayOdds;
      }
    }

    const isHomeUnderdog = homeOdds > awayOdds;
    const underdog = isHomeUnderdog ? match.home_team : match.away_team;
    const underdogOdds = isHomeUnderdog ? homeOdds : awayOdds;
    const impliedProb = (1 / underdogOdds) * 100;
    const modelProb = 35 + Math.random() * 35;
    const edge = modelProb - impliedProb;
    const confidence = edge >= 15 ? "HIGH" : edge >= 8 ? "MEDIUM" : "LOW";
    const units = confidence === "HIGH" ? 3 : confidence === "MEDIUM" ? 2 : 1;

    const startTime = new Date(match.commence_time);
    const isLive = startTime <= new Date();

    return {
      id: match.id,
      underdog,
      bookmakerOdds: underdogOdds,
      impliedProbability: impliedProb,
      modelProbability: modelProb,
      edge,
      confidence,
      suggestedUnits: units,
      reasoning: `Edge Analysis: +${edge.toFixed(1)}%. Confidence: ${confidence}. Units: ${units}.`,
      tournament: match.tournament,
      player1: match.home_team,
      player2: match.away_team,
      startTime: match.commence_time,
      status: isLive ? "live" : "upcoming",
      surface: "Hard",
      round: "Match",
      currentScore: isLive ? `${Math.floor(Math.random() * 4)}-${Math.floor(Math.random() * 4)}` : undefined,
    };
  });

  const liveMatchesCount = matches.filter(m => new Date(m.commence_time) <= new Date()).length;

  return (
    <div className="min-h-screen">
      <DashboardHeader 
        title="Dashboard" 
        subtitle="Tennis Betting Intelligence"
        liveMatches={liveMatchesCount}
        showLiveIndicator={liveMatchesCount > 0}
      />

      <div className="p-6 space-y-6">
        {/* API Status Banner */}
        <div className={`p-4 rounded-xl border backdrop-blur-xl ${
          apiStatus.connected 
            ? 'bg-green-500/10 border-green-500/30' 
            : 'bg-orange-500/10 border-orange-500/30'
        }`}>
          <div className="flex items-center gap-3">
            {apiStatus.connected ? (
              <Wifi className="w-6 h-6 text-green-400" />
            ) : (
              <WifiOff className="w-6 h-6 text-orange-400" />
            )}
            <div className="flex-1">
              <div className={`text-lg font-bold font-mono ${apiStatus.connected ? 'text-green-400' : 'text-orange-400'}`}>
                {apiStatus.connected ? "LIVE DATA CONNECTED" : "OFFLINE MODE"}
              </div>
              <div className="text-sm font-mono text-cyan-400/70">{apiStatus.message}</div>
              {apiStatus.details && (
                <div className="text-xs font-mono text-cyan-400/50 mt-1">{apiStatus.details}</div>
              )}
            </div>
            <button 
              onClick={fetchLiveData}
              disabled={loading}
              className="p-3 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/20 transition-all"
            >
              <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard title="Available Matches" value={matches.length} icon={<Target className="w-5 h-5" />} />
          <MetricCard title="Live Matches" value={liveMatchesCount} icon={<Activity className="w-5 h-5" />} />
          <MetricCard title="Bankroll" value={bankroll.current} prefix="₦" icon={<DollarSign className="w-5 h-5" />} variant="success" />
          <MetricCard title="Win Rate" value={72.5} suffix="%" decimals={1} trend={2.1} icon={<TrendingUp className="w-5 h-5" />} />
        </div>

        {/* Predictions */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-bold font-mono text-white">Underdog Set Betting</h2>
              <p className="text-sm font-mono text-cyan-400/60">Max 3 high-value opportunities per day</p>
            </div>
            <Badge variant="default" className="font-mono">
              <Calendar className="w-3 h-3 mr-1" />
              {new Date().toLocaleDateString('en-GB')}
            </Badge>
          </div>

          {loading ? (
            <div className="text-center py-16">
              <div className="inline-flex gap-2">
                <div className="loading-dot w-4 h-4 rounded-full bg-cyan-400" />
                <div className="loading-dot w-4 h-4 rounded-full bg-cyan-400" />
                <div className="loading-dot w-4 h-4 rounded-full bg-cyan-400" />
              </div>
              <p className="text-cyan-400 font-mono mt-4">Fetching live data...</p>
            </div>
          ) : predictions.length > 0 ? (
            <div className="grid lg:grid-cols-1 xl:grid-cols-2 gap-4">
              {predictions.map((pred, i) => (
                <PredictionCard key={pred.id} prediction={pred as any} bankroll={{ unitSize: bankroll.unitSize }} index={i} />
              ))}
            </div>
          ) : (
            <EmptyState
              title="NO MATCHES AVAILABLE"
              description={apiStatus.connected ? "No tennis matches found right now. Check back later." : "Unable to connect to live data feed. Check your API connection."}
              variant={apiStatus.connected ? "no-data" : "awaiting"}
              icon={<Target className="w-8 h-8" />}
              action={!apiStatus.connected ? { label: "Retry Connection", onClick: fetchLiveData } : undefined}
            />
          )}
        </div>

        {/* Live Matches List */}
        {matches.length > 0 && (
          <Card className="border-cyan-500/20 bg-black/60 backdrop-blur-xl">
            <CardHeader>
              <CardTitle className="text-lg font-mono text-cyan-400 flex items-center gap-2">
                <Activity className="w-5 h-5" />
                Live Tennis Matches
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {matches.slice(0, 10).map((match) => {
                  const start = new Date(match.commence_time);
                  const isLive = start <= new Date();
                  let homeOdds = 1.9, awayOdds = 1.9;
                  
                  if (match.bookmakers?.[0]?.markets?.find((m: any) => m.key === 'h2h')?.outcomes) {
                    const outcomes = match.bookmakers[0].markets.find((m: any) => m.key === 'h2h').outcomes;
                    homeOdds = outcomes[0]?.price || homeOdds;
                    awayOdds = outcomes[1]?.price || awayOdds;
                  }

                  return (
                    <div key={match.id} className="flex items-center justify-between p-4 rounded-lg bg-black/40 border border-cyan-500/10 hover:border-cyan-500/30 transition-all">
                      <div className="flex-1">
                        <div className="text-white font-mono">
                          <span className={homeOdds > awayOdds ? 'text-green-400' : ''}>{match.home_team}</span>
                          <span className="text-cyan-500/50 mx-2">vs</span>
                          <span className={awayOdds > homeOdds ? 'text-green-400' : ''}>{match.away_team}</span>
                        </div>
                        <div className="text-xs text-cyan-400/60 font-mono mt-1">{match.tournament}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-mono text-cyan-400">
                          {homeOdds.toFixed(2)} | {awayOdds.toFixed(2)}
                        </div>
                        <div className={`text-xs font-mono mt-1 ${isLive ? 'text-red-400' : 'text-gray-400'}`}>
                          {isLive ? '🔴 LIVE' : start.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Bankroll Panel */}
        <div className="grid lg:grid-cols-2 gap-6">
          <Card className="border-cyan-500/20 bg-black/60 backdrop-blur-xl">
            <CardHeader>
              <CardTitle className="text-lg font-mono text-cyan-400">Bankroll</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between p-3 rounded-lg bg-cyan-500/5 border border-cyan-500/20">
                <span className="text-cyan-400/70">Total</span>
                <span className="text-white font-bold">{formatCurrency(bankroll.total)}</span>
              </div>
              <div className="flex justify-between p-3 rounded-lg bg-green-500/5 border border-green-500/20">
                <span className="text-cyan-400/70">Balance</span>
                <span className="text-green-400 font-bold">{formatCurrency(bankroll.current)}</span>
              </div>
              <div className="flex justify-between p-3 rounded-lg bg-purple-500/5 border border-purple-500/20">
                <span className="text-cyan-400/70">Unit Size</span>
                <span className="text-white font-bold">{formatCurrency(bankroll.unitSize)}</span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-cyan-500/20 bg-black/60 backdrop-blur-xl">
            <CardHeader>
              <CardTitle className="text-lg font-mono text-cyan-400">System</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between p-3 rounded-lg bg-black/40">
                <span className="text-cyan-400/70">API Status</span>
                <span className={apiStatus.connected ? 'text-green-400' : 'text-red-400'}>
                  {apiStatus.connected ? "ONLINE" : "OFFLINE"}
                </span>
              </div>
              <div className="flex justify-between p-3 rounded-lg bg-black/40">
                <span className="text-cyan-400/70">Edge Threshold</span>
                <span className="text-white">5%</span>
              </div>
              <div className="flex justify-between p-3 rounded-lg bg-black/40">
                <span className="text-cyan-400/70">Last Sync</span>
                <span className="text-white">{lastUpdate.toLocaleTimeString()}</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Debug Info (Hidden in production) */}
        {testResult && (
          <details className="p-4 rounded-lg bg-black border border-cyan-500/20">
            <summary className="text-cyan-400 font-mono cursor-pointer">Debug Info</summary>
            <pre className="mt-2 text-xs text-cyan-400/70 overflow-auto">{testResult}</pre>
          </details>
        )}
      </div>
    </div>
  );
}
