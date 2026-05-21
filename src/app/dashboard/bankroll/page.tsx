"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { DashboardHeader } from "@/components/dashboard/header";
import { MetricCard } from "@/components/dashboard/metric-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { formatCurrency } from "@/lib/utils";
import { DollarSign, TrendingUp, TrendingDown, Target, AlertTriangle, Save, RefreshCw } from "lucide-react";

export default function BankrollPage() {
  const [bankroll, setBankroll] = useState({
    totalAmount: 100000,
    unitSize: 2000,
    currentAmount: 98500,
    dailyRiskPercent: 5,
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editValues, setEditValues] = useState(bankroll);

  const calculateRiskAmount = () => bankroll.totalAmount * (bankroll.dailyRiskPercent / 100);
  const calculateMaxStake = () => bankroll.unitSize * 3; // Max 3 units per bet
  const calculateTotalExposure = () => calculateRiskAmount();
  
  // Calculate units from profit/loss
  const totalUnits = Math.round((bankroll.currentAmount - bankroll.totalAmount) / bankroll.unitSize);

  const handleSave = () => {
    setBankroll(editValues);
    setIsEditing(false);
    // In production, save to database
  };

  const handleReset = () => {
    setEditValues({
      totalAmount: 100000,
      unitSize: 2000,
      currentAmount: 100000,
      dailyRiskPercent: 5,
    });
  };

  return (
    <div className="min-h-screen">
      <DashboardHeader 
        title="Bankroll Management" 
        subtitle="Configure your betting capital"
      />

      <div className="p-6 space-y-6">
        {/* Bankroll Status Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard
            title="Total Bankroll"
            value={bankroll.totalAmount}
            prefix="₦"
            icon={<DollarSign className="w-5 h-5" />}
          />
          <MetricCard
            title="Current Balance"
            value={bankroll.currentAmount}
            prefix="₦"
            icon={<Target className="w-5 h-5" />}
            variant={bankroll.currentAmount >= bankroll.totalAmount ? "success" : "warning"}
          />
          <MetricCard
            title="Units Won/Lost"
            value={totalUnits}
            icon={totalUnits >= 0 ? <TrendingUp className="w-5 h-5" /> : <TrendingDown className="w-5 h-5" />}
            variant={totalUnits >= 0 ? "success" : "danger"}
          />
          <MetricCard
            title="Daily Risk (5%)"
            value={calculateRiskAmount()}
            prefix="₦"
            icon={<AlertTriangle className="w-5 h-5" />}
            variant="warning"
          />
        </div>

        {/* Configuration Section */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Bankroll Settings */}
          <Card className="border-cyan-500/20 bg-black/60 backdrop-blur-xl">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-mono text-cyan-400 flex items-center gap-2">
                  <DollarSign className="w-5 h-5" />
                  Bankroll Configuration
                </CardTitle>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setIsEditing(!isEditing)}
                  className="font-mono"
                >
                  {isEditing ? "Cancel" : "Edit"}
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Total Bankroll */}
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label className="text-cyan-400/70 font-mono">Total Bankroll</Label>
                  <span className="text-lg font-bold font-mono text-white">
                    {formatCurrency(editValues.totalAmount)}
                  </span>
                </div>
                {isEditing && (
                  <Input
                    type="number"
                    value={editValues.totalAmount}
                    onChange={(e) => setEditValues({ ...editValues, totalAmount: Number(e.target.value) })}
                    className="text-lg font-mono"
                  />
                )}
                <div className="text-xs font-mono text-cyan-400/50">
                  Your total betting capital
                </div>
              </div>

              {/* Unit Size */}
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label className="text-cyan-400/70 font-mono">Unit Size</Label>
                  <span className="text-lg font-bold font-mono text-cyan-400">
                    {formatCurrency(editValues.unitSize)}
                  </span>
                </div>
                {isEditing && (
                  <Input
                    type="number"
                    value={editValues.unitSize}
                    onChange={(e) => setEditValues({ ...editValues, unitSize: Number(e.target.value) })}
                    className="text-lg font-mono"
                  />
                )}
                <div className="text-xs font-mono text-cyan-400/50">
                  1 unit = {formatCurrency(editValues.unitSize)}
                </div>
              </div>

              {/* Current Balance */}
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label className="text-cyan-400/70 font-mono">Current Balance</Label>
                  <span className="text-lg font-bold font-mono text-white">
                    {formatCurrency(editValues.currentAmount)}
                  </span>
                </div>
                {isEditing && (
                  <Input
                    type="number"
                    value={editValues.currentAmount}
                    onChange={(e) => setEditValues({ ...editValues, currentAmount: Number(e.target.value) })}
                    className="text-lg font-mono"
                  />
                )}
                <div className="text-xs font-mono text-cyan-400/50">
                  Adjust for deposits/withdrawals
                </div>
              </div>

              {/* Daily Risk Slider */}
              <div className="space-y-4">
                <div className="flex justify-between">
                  <Label className="text-cyan-400/70 font-mono">Daily Risk Limit</Label>
                  <span className="text-lg font-bold font-mono text-orange-400">
                    {editValues.dailyRiskPercent}%
                  </span>
                </div>
                {isEditing && (
                  <Slider
                    value={[editValues.dailyRiskPercent]}
                    onValueChange={(v) => setEditValues({ ...editValues, dailyRiskPercent: v[0] })}
                    min={1}
                    max={10}
                    step={1}
                    className="py-4"
                  />
                )}
                <div className="text-xs font-mono text-cyan-400/50">
                  Maximum {formatCurrency(editValues.totalAmount * (editValues.dailyRiskPercent / 100))} at risk per day
                </div>
              </div>

              {isEditing && (
                <div className="flex gap-4 pt-4">
                  <Button onClick={handleSave} className="flex-1 font-mono">
                    <Save className="w-4 h-4 mr-2" />
                    Save Changes
                  </Button>
                  <Button onClick={handleReset} variant="outline" className="font-mono">
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Reset
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Staking Guide */}
          <Card className="border-cyan-500/20 bg-black/60 backdrop-blur-xl">
            <CardHeader>
              <CardTitle className="text-lg font-mono text-cyan-400 flex items-center gap-2">
                <Target className="w-5 h-5" />
                Staking Guide
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Confidence-Based Staking */}
              <div className="space-y-3">
                <div className="text-sm font-mono text-cyan-400/70 uppercase tracking-wider">Based on Confidence Level</div>
                
                <div className="p-4 rounded-lg bg-green-500/5 border border-green-500/20">
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="text-lg font-bold font-mono text-green-400">HIGH</div>
                      <div className="text-xs font-mono text-cyan-400/50">Edge ≥ 15%</div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold font-mono text-white">3 units</div>
                      <div className="text-sm font-mono text-cyan-400/70">{formatCurrency(bankroll.unitSize * 3)}</div>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-lg bg-cyan-500/5 border border-cyan-500/20">
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="text-lg font-bold font-mono text-cyan-400">MEDIUM</div>
                      <div className="text-xs font-mono text-cyan-400/50">Edge 8-14%</div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold font-mono text-white">2 units</div>
                      <div className="text-sm font-mono text-cyan-400/70">{formatCurrency(bankroll.unitSize * 2)}</div>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-lg bg-purple-500/5 border border-purple-500/20">
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="text-lg font-bold font-mono text-purple-400">LOW</div>
                      <div className="text-xs font-mono text-cyan-400/50">Edge 5-7%</div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold font-mono text-white">1 unit</div>
                      <div className="text-sm font-mono text-cyan-400/70">{formatCurrency(bankroll.unitSize * 1)}</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Risk Summary */}
              <div className="pt-4 border-t border-cyan-500/10">
                <div className="text-sm font-mono text-cyan-400/70 uppercase tracking-wider mb-3">Daily Summary</div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 rounded-lg bg-black/40">
                    <div className="text-xs font-mono text-cyan-400/50">Max Exposure</div>
                    <div className="text-lg font-bold font-mono text-white">{formatCurrency(calculateTotalExposure())}</div>
                  </div>
                  <div className="p-3 rounded-lg bg-black/40">
                    <div className="text-xs font-mono text-cyan-400/50">Max Single Bet</div>
                    <div className="text-lg font-bold font-mono text-white">{formatCurrency(calculateMaxStake())}</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Performance Overview */}
        <Card className="border-cyan-500/20 bg-black/60 backdrop-blur-xl">
          <CardHeader>
            <CardTitle className="text-lg font-mono text-cyan-400">Performance Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-4 gap-4">
              <div className="p-4 rounded-lg bg-black/40 border border-cyan-500/10">
                <div className="text-xs font-mono text-cyan-400/50 mb-1">Starting Balance</div>
                <div className="text-xl font-bold font-mono text-white">{formatCurrency(bankroll.totalAmount)}</div>
              </div>
              <div className="p-4 rounded-lg bg-black/40 border border-cyan-500/10">
                <div className="text-xs font-mono text-cyan-400/50 mb-1">Current Balance</div>
                <div className="text-xl font-bold font-mono text-white">{formatCurrency(bankroll.currentAmount)}</div>
              </div>
              <div className="p-4 rounded-lg bg-black/40 border border-cyan-500/10">
                <div className="text-xs font-mono text-cyan-400/50 mb-1">Profit/Loss</div>
                <div className={`text-xl font-bold font-mono ${bankroll.currentAmount - bankroll.totalAmount >= 0 ? "text-green-400" : "text-red-400"}`}>
                  {bankroll.currentAmount - bankroll.totalAmount >= 0 ? "+" : ""}
                  {formatCurrency(bankroll.currentAmount - bankroll.totalAmount)}
                </div>
              </div>
              <div className="p-4 rounded-lg bg-black/40 border border-cyan-500/10">
                <div className="text-xs font-mono text-cyan-400/50 mb-1">ROI</div>
                <div className={`text-xl font-bold font-mono ${((bankroll.currentAmount - bankroll.totalAmount) / bankroll.totalAmount * 100) >= 0 ? "text-green-400" : "text-red-400"}`}>
                  {((bankroll.currentAmount - bankroll.totalAmount) / bankroll.totalAmount * 100).toFixed(1)}%
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Disclaimer */}
        <div className="p-4 rounded-lg bg-orange-500/5 border border-orange-500/20">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-orange-400 flex-shrink-0 mt-0.5" />
            <div>
              <div className="text-sm font-bold font-mono text-orange-400">Risk Management Reminder</div>
              <div className="text-sm font-mono text-cyan-400/60 mt-1">
                Never stake more than you can afford to lose. The recommended daily risk limit is 5% of your total bankroll. 
                Adjust your unit size based on your risk tolerance and betting frequency.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}