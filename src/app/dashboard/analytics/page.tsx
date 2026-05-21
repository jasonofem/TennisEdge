"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { DashboardHeader } from "@/components/dashboard/header";
import { MetricCard } from "@/components/dashboard/metric-card";
import { AnalyticsChart, MultiLineChart } from "@/components/charts/analytics-charts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { formatCurrency, formatPercent } from "@/lib/utils";
import { TrendingUp, Target, DollarSign, Percent, Activity, Award, Zap } from "lucide-react";

// Sample data for charts
const cumulativeProfitData = [
  { name: "Jan", profit: 1200 },
  { name: "Feb", profit: 2100 },
  { name: "Mar", profit: 1800 },
  { name: "Apr", profit: 3500 },
  { name: "May", profit: 4200 },
  { name: "Jun", profit: 5100 },
  { name: "Jul", profit: 4800 },
  { name: "Aug", profit: 6200 },
  { name: "Sep", profit: 5800 },
  { name: "Oct", profit: 7500 },
  { name: "Nov", profit: 8200 },
  { name: "Dec", profit: 9100 },
];

const bankrollGrowthData = [
  { name: "Jan", bankroll: 100000 },
  { name: "Feb", bankroll: 102 },
  { name: "Mar", bankroll: 103 },
  { name: "Apr", bankroll: 105 },
  { name: "May", bankroll: 107 },
  { name: "Jun", bankroll: 110 },
  { name: "Jul", bankroll: 112 },
  { name: "Aug", bankroll: 114 },
  { name: "Sep", bankroll: 116 },
  { name: "Oct", bankroll: 119 },
  { name: "Nov", bankroll: 122 },
  { name: "Dec", bankroll: 125 },
];

const winRateByConfidence = [
  { name: "HIGH", value: 85 },
  { name: "MEDIUM", value: 68 },
  { name: "LOW", value: 52 },
];

const oddsDistribution = [
  { name: "1.5-2.0", count: 12 },
  { name: "2.0-2.5", count: 18 },
  { name: "2.5-3.0", count: 25 },
  { name: "3.0-3.5", count: 15 },
  { name: "3.5+", count: 8 },
];

const monthlyPerformance = [
  { name: "Jan", bets: 8, won: 5, edge: 8.2 },
  { name: "Feb", bets: 10, won: 7, edge: 9.1 },
  { name: "Mar", bets: 9, won: 6, edge: 7.8 },
  { name: "Apr", bets: 12, won: 9, edge: 10.5 },
  { name: "May", bets: 11, won: 8, edge: 8.9 },
  { name: "Jun", bets: 10, won: 7, edge: 11.2 },
];

const streakData = [
  { name: "Current Streak", value: 3, type: "win" },
  { name: "Best Win Streak", value: 7, type: "win" },
  { name: "Longest Lose", value: 2, type: "lose" },
];

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState<"week" | "month" | "year">("month");

  const metrics = {
    totalBets: 156,
    wonBets: 112,
    lostBets: 38,
    voidBets: 6,
    totalUnits: 312,
    unitsWon: 89,
    unitsLost: 45,
    roi: 44.2,
    winRate: 71.8,
    avgOdds: 2.65,
    bestEdge: 18.5,
    currentStreak: 3,
    longestWinStreak: 7,
    longestLoseStreak: 2,
  };

  return (
    <div className="min-h-screen">
      <DashboardHeader 
        title="Analytics" 
        subtitle="Performance metrics & betting statistics"
      />

      <div className="p-6 space-y-6">
        {/* Time Range Selector */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Badge variant="default" className="font-mono">OVERALL PERFORMANCE</Badge>
          </div>
          <Tabs value={timeRange} onValueChange={(v) => setTimeRange(v as any)}>
            <TabsList>
              <TabsTrigger value="week">Week</TabsTrigger>
              <TabsTrigger value="month">Month</TabsTrigger>
              <TabsTrigger value="year">Year</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Main Metrics Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard
            title="Total Bets"
            value={metrics.totalBets}
            icon={<Target className="w-5 h-5" />}
            trend={5.2}
          />
          <MetricCard
            title="Win Rate"
            value={metrics.winRate}
            suffix="%"
            decimals={1}
            icon={<Percent className="w-5 h-5" />}
            variant="success"
            trend={2.1}
          />
          <MetricCard
            title="ROI"
            value={metrics.roi}
            suffix="%"
            decimals={1}
            icon={<TrendingUp className="w-5 h-5" />}
            variant="success"
            trend={8.4}
          />
          <MetricCard
            title="Total Units"
            value={metrics.unitsWon - metrics.unitsLost}
            icon={<Zap className="w-5 h-5" />}
            variant="success"
          />
        </div>

        {/* Charts Row 1 */}
        <div className="grid lg:grid-cols-2 gap-6">
          <AnalyticsChart
            title="Cumulative Profit (₦)"
            subtitle="Total profit over time"
            data={cumulativeProfitData}
            type="area"
            dataKey="profit"
          />
          <AnalyticsChart
            title="Bankroll Growth"
            subtitle="Starting ₦100,000"
            data={bankrollGrowthData}
            type="line"
            dataKey="bankroll"
          />
        </div>

        {/* Charts Row 2 */}
        <div className="grid lg:grid-cols-3 gap-6">
          <AnalyticsChart
            title="Win Rate by Confidence"
            subtitle="Success rate by tier"
            data={winRateByConfidence}
            type="bar"
            dataKey="value"
            colors={["#00ff88", "#00f0ff", "#a855f7"]}
            height={250}
          />
          <AnalyticsChart
            title="Odds Distribution"
            subtitle="Number of bets per odds range"
            data={oddsDistribution}
            type="bar"
            dataKey="count"
            height={250}
          />
          <Card className="border-cyan-500/20 bg-black/60 backdrop-blur-xl">
            <CardHeader>
              <CardTitle className="text-lg font-mono text-cyan-400">Streak Tracker</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {streakData.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-black/40 border border-cyan-500/10">
                  <span className="text-sm font-mono text-cyan-400/70">{item.name}</span>
                  <div className="flex items-center gap-2">
                    <span className={`text-2xl font-bold font-mono ${item.type === 'win' ? 'text-green-400' : 'text-red-400'}`}>
                      {item.value}
                    </span>
                    <span className="text-xs font-mono text-cyan-400/50">{item.type === 'win' ? 'WINS' : 'LOSSES'}</span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Detailed Stats */}
        <div className="grid lg:grid-cols-2 gap-6">
          <Card className="border-cyan-500/20 bg-black/60 backdrop-blur-xl">
            <CardHeader>
              <CardTitle className="text-lg font-mono text-cyan-400">Betting Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-lg bg-green-500/5 border border-green-500/20">
                  <div className="text-2xl font-bold font-mono text-green-400">{metrics.wonBets}</div>
                  <div className="text-sm font-mono text-cyan-400/60">Won Bets</div>
                </div>
                <div className="p-4 rounded-lg bg-red-500/5 border border-red-500/20">
                  <div className="text-2xl font-bold font-mono text-red-400">{metrics.lostBets}</div>
                  <div className="text-sm font-mono text-cyan-400/60">Lost Bets</div>
                </div>
                <div className="p-4 rounded-lg bg-cyan-500/5 border border-cyan-500/20">
                  <div className="text-2xl font-bold font-mono text-cyan-400">{metrics.unitsWon}</div>
                  <div className="text-sm font-mono text-cyan-400/60">Units Won</div>
                </div>
                <div className="p-4 rounded-lg bg-purple-500/5 border border-purple-500/20">
                  <div className="text-2xl font-bold font-mono text-purple-400">{metrics.unitsLost}</div>
                  <div className="text-sm font-mono text-cyan-400/60">Units Lost</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-cyan-500/20 bg-black/60 backdrop-blur-xl">
            <CardHeader>
              <CardTitle className="text-lg font-mono text-cyan-400">Key Metrics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between items-center p-3 rounded-lg bg-black/40 border border-cyan-500/10">
                <span className="text-sm font-mono text-cyan-400/70">Average Odds</span>
                <span className="text-lg font-bold font-mono text-white">{metrics.avgOdds.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center p-3 rounded-lg bg-black/40 border border-cyan-500/10">
                <span className="text-sm font-mono text-cyan-400/70">Best Edge</span>
                <span className="text-lg font-bold font-mono text-green-400">+{metrics.bestEdge}%</span>
              </div>
              <div className="flex justify-between items-center p-3 rounded-lg bg-black/40 border border-cyan-500/10">
                <span className="text-sm font-mono text-cyan-400/70">Void Bets</span>
                <span className="text-lg font-bold font-mono text-gray-400">{metrics.voidBets}</span>
              </div>
              <div className="flex justify-between items-center p-3 rounded-lg bg-black/40 border border-cyan-500/10">
                <span className="text-sm font-mono text-cyan-400/70">Longest Win Streak</span>
                <span className="text-lg font-bold font-mono text-green-400">{metrics.longestWinStreak}</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Monthly Performance */}
        <MultiLineChart
          title="Monthly Performance"
          subtitle="Bets placed vs won per month"
          data={monthlyPerformance}
          lines={[
            { dataKey: "bets", color: "#00f0ff", name: "Total Bets" },
            { dataKey: "won", color: "#00ff88", name: "Won" },
            { dataKey: "edge", color: "#a855f7", name: "Avg Edge %" },
          ]}
        />
      </div>
    </div>
  );
}