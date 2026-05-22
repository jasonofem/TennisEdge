"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { DashboardHeader } from "@/components/dashboard/header";
import { PredictionCard } from "@/components/dashboard/prediction-card";
import { MetricCard, LiveIndicator } from "@/components/dashboard/metric-card";
import { EmptyState } from "@/components/ui/empty-state";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, formatPercent, generateId } from "@/lib/utils";
import { fetchLiveMatches } from "@/lib/api/tennis-api";
import { generatePredictions, type Prediction } from "@/lib/api/prediction-engine";
import { Target, TrendingUp, DollarSign, Activity, Calendar, RefreshCw } from "lucide-react";
import type { Match } from "@/lib/api/tennis-api";

export default function DashboardPage() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  // Bankroll state (simplified for demo)
  const bankroll = {
    total: 100000,
    unitSize: 2000,
    current: 98500,
  };

  const loadData = async () => {
    setLoading(true);
    try {
      const liveMatches = await fetchLiveMatches();
      setMatches(liveMatches);
      
      const dailyPredictions = generatePredictions(liveMatches);
      setPredictions(dailyPredictions);
      setLastUpdate(new Date());
    } catch (error) {
      console.error("Failed to load data:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadData();
    // Auto-refresh every 5 minutes
    const interval = setInterval(loadData, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const liveMatches = matches.filter(m => m.status === "live").length;

  // Stats
  const stats = {
    todayPicks: predictions.length,
    avgEdge: predictions.length > 0 ? predictions.reduce((a, p) => a + p.edge, 0) / predictions.length : 0,
    totalProfit: -1500, // Example from journal
    winRate: 72.5,
  };

  return (
    <div className="min-h-screen">
      <DashboardHeader 
        title="Dashboard" 
        subtitle="Daily Underdog Opportunities"
        liveMatches={liveMatches}
        showLiveIndicator={true}
      />

      <div className="p-6 space-y-6">
        {/* Stats Row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard
            title="Today's Picks"
            value={stats.todayPicks}
            suffix={"/ 3"}
            icon={<Target className="w-5 h-5" />}
          />
          <MetricCard
            title="Avg Edge"
            value={stats.avgEdge}
            suffix="%"
            decimals={1}
            trend={2.3}
            icon={<TrendingUp className="w-5 h-5" />}
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
            value={stats.winRate}
            suffix="%"
            decimals={1}
            trend={1.2}
            icon={<Activity className="w-5 h-5" />}
          />
        </div>

        {/* Live Matches Indicator */}
        {liveMatches > 0 && (
          <div className="flex items-center justify-between p-4 rounded-xl bg-black/60 border border-cyan-500/20 backdrop-blur-xl">
            <div className="flex items-center gap-3">
              <LiveIndicator matches={liveMatches} />
              <span className="text-sm font-mono text-cyan-400/70">Active matches being tracked</span>
            </div>
            <button 
              onClick={loadData}
              className="p-2 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 hover:bg-cyan-500/20 transition-colors"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        )}

        {/* Predictions Section */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-bold font-mono text-white">Today's Predictions</h2>
              <p className="text-sm font-mono text-cyan-400/60">Maximum 3 high-value underdog opportunities</p>
            </div>
            <Badge variant="default" className="font-mono">
              <Calendar className="w-3 h-3 mr-1" />
              {new Date().toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' })}
            </Badge>
          </div>

          {predictions.length > 0 ? (
            <div className="grid lg:grid-cols-1 xl:grid-cols-2 gap-4">
              {predictions.map((prediction, index) => (
                <PredictionCard 
                  key={prediction.id} 
                  prediction={prediction} 
                  bankroll={{ unitSize: bankroll.unitSize }}
                  index={index}
                />
              ))}
            </div>
          ) : (
            <EmptyState
              title="NO QUALIFYING EDGE TODAY"
              description="System scan complete. No underdog opportunities meet the minimum edge threshold of 5%. Check back tomorrow for new analysis."
              variant="no-edge"
              icon={<Target className="w-8 h-8 text-cyan-400" />}
            />
          )}
        </div>

        {/* Quick Stats Panel */}
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
              <div className="flex justify-between items-center p-3 rounded-lg bg-orange-500/5 border border-orange-500/20">
                <span className="text-sm font-mono text-cyan-400/70">Daily Risk (5%)</span>
                <span className="text-lg font-bold font-mono text-orange-400">{formatCurrency(bankroll.total * 0.05)}</span>
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
                <span className="text-sm font-mono text-green-400">ONLINE</span>
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
              <div className="flex justify-between items-center p-3 rounded-lg bg-orange-500/5 border border-orange-500/20">
                <span className="text-sm font-mono text-cyan-400/70">Max Daily Picks</span>
                <span className="text-sm font-mono text-white">3</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}