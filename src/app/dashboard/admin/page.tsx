"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { DashboardHeader } from "@/components/dashboard/header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { TerminalText } from "@/components/ui/animated-background";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Shield, AlertTriangle, Save, Plus, Edit, Trash2, X, Search, RefreshCw } from "lucide-react";

interface PredictionOverride {
  id: string;
  matchId: string;
  match: string;
  underdog: string;
  odds: number;
  originalEdge: number;
  overriddenEdge: number;
  status: "active" | "pending" | "settled";
}

export default function AdminPage() {
  const [systemLock, setSystemLock] = useState(false);
  const [noBetToday, setNoBetToday] = useState(false);
  const [overrides, setOverrides] = useState<PredictionOverride[]>([]);
  const [showAddOverride, setShowAddOverride] = useState(false);
  const [selectedOverride, setSelectedOverride] = useState<PredictionOverride | null>(null);

  // Sample predictions for override demo
  const samplePredictions = [
    { id: "1", match: "Sinner vs Alcaraz - ATP Rome", underdog: "Alcaraz", odds: 2.85, edge: 12.5, status: "active" },
    { id: "2", match: "Zverev vs Medvedev - ATP Dubai", underdog: "Medvedev", odds: 2.45, edge: 8.3, status: "active" },
    { id: "3", match: "Swiatek vs Sabalenka - WTA Madrid", underdog: "Sabalenka", odds: 3.20, edge: 6.8, status: "pending" },
  ];

  const handleAddOverride = (prediction: any) => {
    const newOverride: PredictionOverride = {
      id: `override_${Date.now()}`,
      matchId: prediction.id,
      match: prediction.match,
      underdog: prediction.underdog,
      odds: prediction.odds,
      originalEdge: prediction.edge,
      overriddenEdge: prediction.edge,
      status: "active",
    };
    setOverrides([...overrides, newOverride]);
    setShowAddOverride(false);
  };

  return (
    <div className="min-h-screen">
      <DashboardHeader 
        title="Admin Panel" 
        subtitle="System controls and prediction management"
      />

      <div className="p-6 space-y-6">
        {/* Admin Warning */}
        <div className="p-4 rounded-lg bg-orange-500/10 border border-orange-500/30">
          <div className="flex items-start gap-3">
            <Shield className="w-5 h-5 text-orange-400 flex-shrink-0 mt-0.5" />
            <div>
              <div className="text-sm font-bold font-mono text-orange-400">ADMIN ACCESS GRANTED</div>
              <div className="text-sm font-mono text-cyan-400/60 mt-1">
                You have access to system controls. Use with caution - changes affect prediction generation and betting calculations.
              </div>
            </div>
          </div>
        </div>

        {/* System Controls */}
        <Card className="border-orange-500/20 bg-black/60 backdrop-blur-xl">
          <CardHeader>
            <CardTitle className="text-lg font-mono text-orange-400 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" />
              System Controls
            </CardTitle>
            <CardDescription className="font-mono text-cyan-400/60">
              Global system settings - affects all users
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-lg bg-black/40 border border-orange-500/20">
              <div>
                <Label className="text-white font-mono">Lock System</Label>
                <div className="text-sm font-mono text-cyan-400/60">
                  Prevent any new predictions from being generated
                </div>
              </div>
              <Switch
                checked={systemLock}
                onCheckedChange={setSystemLock}
              />
            </div>

            <div className="flex items-center justify-between p-4 rounded-lg bg-black/40 border border-orange-500/20">
              <div>
                <Label className="text-white font-mono">No Bet Today</Label>
                <div className="text-sm font-mono text-cyan-400/60">
                  Force "No Qualifying Edge" state for today
                </div>
              </div>
              <Switch
                checked={noBetToday}
                onCheckedChange={setNoBetToday}
              />
            </div>

            {noBetToday && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="p-4 rounded-lg bg-orange-500/10 border border-orange-500/20"
              >
                <TerminalText 
                  text="SYSTEM OVERRIDE: No bets will be shown today" 
                  speed={40}
                  className="text-sm font-mono text-orange-400"
                />
              </motion.div>
            )}
          </CardContent>
        </Card>

        {/* Prediction Overrides */}
        <Card className="border-cyan-500/20 bg-black/60 backdrop-blur-xl">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg font-mono text-cyan-400">Prediction Overrides</CardTitle>
                <CardDescription className="font-mono text-cyan-400/60">
                  Manually adjust or remove predictions
                </CardDescription>
              </div>
              <Button onClick={() => setShowAddOverride(true)} variant="outline" size="sm" className="font-mono">
                <Plus className="w-4 h-4 mr-2" />
                Add Override
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {overrides.length > 0 ? (
              <div className="space-y-3">
                {overrides.map((override) => (
                  <div 
                    key={override.id}
                    className="p-4 rounded-lg bg-black/40 border border-cyan-500/10 flex items-center justify-between"
                  >
                    <div>
                      <div className="text-sm font-mono text-white">{override.match}</div>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="success">{override.underdog}</Badge>
                        <span className="text-xs font-mono text-cyan-400/60">Odds: {override.odds}</span>
                        <span className="text-xs font-mono text-cyan-400/60">Edge: +{override.overriddenEdge}%</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="icon" onClick={() => setSelectedOverride(override)}>
                        <Edit className="w-4 h-4 text-cyan-400" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => setOverrides(overrides.filter(o => o.id !== override.id))}
                      >
                        <Trash2 className="w-4 h-4 text-red-400" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-sm font-mono text-cyan-400/60">No overrides active</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Available Predictions */}
        <Card className="border-cyan-500/20 bg-black/60 backdrop-blur-xl">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-mono text-cyan-400">Available Predictions</CardTitle>
              <Button variant="outline" size="sm" className="font-mono">
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {samplePredictions.map((prediction) => (
                <div 
                  key={prediction.id}
                  className="p-4 rounded-lg bg-black/40 border border-cyan-500/10"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="text-sm font-mono text-white">{prediction.match}</div>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="success">{prediction.underdog}</Badge>
                        <Badge variant="default">Odds: {prediction.odds}</Badge>
                        <Badge variant="default">Edge: +{prediction.edge}%</Badge>
                        <Badge variant={prediction.status === "active" ? "live" : "pending"}>
                          {prediction.status.toUpperCase()}
                        </Badge>
                      </div>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="font-mono"
                      onClick={() => handleAddOverride(prediction)}
                    >
                      Override
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Bankroll Adjustment */}
        <Card className="border-cyan-500/20 bg-black/60 backdrop-blur-xl">
          <CardHeader>
            <CardTitle className="text-lg font-mono text-cyan-400">Manual Bankroll Adjustment</CardTitle>
            <CardDescription className="font-mono text-cyan-400/60">
              Add or subtract from user bankroll
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-cyan-400/70 font-mono">Amount</Label>
                <Input type="number" placeholder="Enter amount" className="font-mono" />
              </div>
              <div className="space-y-2">
                <Label className="text-cyan-400/70 font-mono">Reason</Label>
                <Input placeholder="e.g., Deposit, Withdrawal, Correction" className="font-mono" />
              </div>
            </div>
            <div className="flex gap-4">
              <Button className="font-mono bg-green-500/20 text-green-400 hover:bg-green-500/30 border border-green-500/30">
                <Plus className="w-4 h-4 mr-2" />
                Add Funds
              </Button>
              <Button variant="outline" className="font-mono bg-red-500/20 text-red-400 hover:bg-red-500/30 border border-red-500/30">
                <Trash2 className="w-4 h-4 mr-2" />
                Subtract Funds
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Audit Log */}
        <Card className="border-cyan-500/20 bg-black/60 backdrop-blur-xl">
          <CardHeader>
            <CardTitle className="text-lg font-mono text-cyan-400">Recent Admin Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 font-mono text-sm">
              <div className="flex items-center gap-4 p-3 rounded-lg bg-black/40 border border-cyan-500/10">
                <span className="text-xs text-cyan-400/50">2026-05-21 14:32</span>
                <span className="text-cyan-400">Bankroll adjustment: +₦50,000 (Deposit)</span>
              </div>
              <div className="flex items-center gap-4 p-3 rounded-lg bg-black/40 border border-cyan-500/10">
                <span className="text-xs text-cyan-400/50">2026-05-21 10:15</span>
                <span className="text-cyan-400">Edge threshold updated: 5% → 6%</span>
              </div>
              <div className="flex items-center gap-4 p-3 rounded-lg bg-black/40 border border-cyan-500/10">
                <span className="text-xs text-cyan-400/50">2026-05-20 22:45</span>
                <span className="text-cyan-400">Prediction override removed: Sinner vs Alcaraz</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}