"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { DashboardHeader } from "@/components/dashboard/header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Save, Bell, Shield, Eye, Database, Trash2 } from "lucide-react";

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    edgeThreshold: 5,
    maxDailyPicks: 3,
    minConfidence: 40,
    autoSettlement: true,
    notifications: true,
    emailAlerts: false,
    darkMode: true,
    soundEffects: false,
  });

  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
    // In production, save to database
  };

  return (
    <div className="min-h-screen">
      <DashboardHeader 
        title="Settings" 
        subtitle="Configure your trading parameters"
      />

      <div className="p-6 space-y-6 max-w-4xl">
        {/* Prediction Settings */}
        <Card className="border-cyan-500/20 bg-black/60 backdrop-blur-xl">
          <CardHeader>
            <CardTitle className="text-lg font-mono text-cyan-400 flex items-center gap-2">
              <Eye className="w-5 h-5" />
              Prediction Settings
            </CardTitle>
            <CardDescription className="font-mono text-cyan-400/60">
              Control how predictions are generated and displayed
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Edge Threshold */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <Label className="text-white font-mono">Minimum Edge Threshold</Label>
                  <div className="text-sm font-mono text-cyan-400/60">
                    Only show predictions with edge above this value
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    value={settings.edgeThreshold}
                    onChange={(e) => setSettings({ ...settings, edgeThreshold: Number(e.target.value) })}
                    className="w-20 text-center font-mono"
                    min={1}
                    max={20}
                  />
                  <span className="text-cyan-400 font-mono">%</span>
                </div>
              </div>
              <Slider
                value={[settings.edgeThreshold]}
                onValueChange={(v) => setSettings({ ...settings, edgeThreshold: v[0] })}
                min={1}
                max={20}
                step={0.5}
                className="py-2"
              />
            </div>

            {/* Max Daily Picks */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label className="text-white font-mono">Maximum Daily Picks</Label>
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    value={settings.maxDailyPicks}
                    onChange={(e) => setSettings({ ...settings, maxDailyPicks: Number(e.target.value) })}
                    className="w-20 text-center font-mono"
                    min={1}
                    max={5}
                  />
                </div>
              </div>
              <div className="text-sm font-mono text-cyan-400/60">
                Maximum number of underdog predictions shown per day
              </div>
            </div>

            {/* Minimum Confidence */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <Label className="text-white font-mono">Minimum Confidence</Label>
                  <div className="text-sm font-mono text-cyan-400/60">
                    Model probability must exceed this value
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    value={settings.minConfidence}
                    onChange={(e) => setSettings({ ...settings, minConfidence: Number(e.target.value) })}
                    className="w-20 text-center font-mono"
                    min={20}
                    max={80}
                  />
                  <span className="text-cyan-400 font-mono">%</span>
                </div>
              </div>
              <Slider
                value={[settings.minConfidence]}
                onValueChange={(v) => setSettings({ ...settings, minConfidence: v[0] })}
                min={20}
                max={80}
                step={5}
                className="py-2"
              />
            </div>
          </CardContent>
        </Card>

        {/* Notification Settings */}
        <Card className="border-cyan-500/20 bg-black/60 backdrop-blur-xl">
          <CardHeader>
            <CardTitle className="text-lg font-mono text-cyan-400 flex items-center gap-2">
              <Bell className="w-5 h-5" />
              Notifications
            </CardTitle>
            <CardDescription className="font-mono text-cyan-400/60">
              Configure alerts and update notifications
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-white font-mono">Push Notifications</Label>
                <div className="text-sm font-mono text-cyan-400/60">
                  Receive alerts for new predictions and results
                </div>
              </div>
              <Switch
                checked={settings.notifications}
                onCheckedChange={(v) => setSettings({ ...settings, notifications: v })}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label className="text-white font-mono">Email Alerts</Label>
                <div className="text-sm font-mono text-cyan-400/60">
                  Daily summary sent to your email
                </div>
              </div>
              <Switch
                checked={settings.emailAlerts}
                onCheckedChange={(v) => setSettings({ ...settings, emailAlerts: v })}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label className="text-white font-mono">Sound Effects</Label>
                <div className="text-sm font-mono text-cyan-400/60">
                  Play sounds for live match updates
                </div>
              </div>
              <Switch
                checked={settings.soundEffects}
                onCheckedChange={(v) => setSettings({ ...settings, soundEffects: v })}
              />
            </div>
          </CardContent>
        </Card>

        {/* System Settings */}
        <Card className="border-cyan-500/20 bg-black/60 backdrop-blur-xl">
          <CardHeader>
            <CardTitle className="text-lg font-mono text-cyan-400 flex items-center gap-2">
              <Shield className="w-5 h-5" />
              System Settings
            </CardTitle>
            <CardDescription className="font-mono text-cyan-400/60">
              General platform configuration
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-white font-mono">Auto-Settlement</Label>
                <div className="text-sm font-mono text-cyan-400/60">
                  Automatically update results when matches complete
                </div>
              </div>
              <Switch
                checked={settings.autoSettlement}
                onCheckedChange={(v) => setSettings({ ...settings, autoSettlement: v })}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label className="text-white font-mono">Dark Mode</Label>
                <div className="text-sm font-mono text-cyan-400/60">
                  Enable dark theme (always on for this platform)
                </div>
              </div>
              <Switch
                checked={settings.darkMode}
                disabled
              />
            </div>
          </CardContent>
        </Card>

        {/* Data Management */}
        <Card className="border-red-500/20 bg-black/60 backdrop-blur-xl">
          <CardHeader>
            <CardTitle className="text-lg font-mono text-red-400 flex items-center gap-2">
              <Database className="w-5 h-5" />
              Data Management
            </CardTitle>
            <CardDescription className="font-mono text-cyan-400/60">
              Manage your stored data and cache
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-white font-mono">Clear Cache</Label>
                <div className="text-sm font-mono text-cyan-400/60">
                  Remove cached API responses
                </div>
              </div>
              <Button variant="outline" size="sm" className="font-mono">
                Clear Cache
              </Button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label className="text-white font-mono">Reset Analytics</Label>
                <div className="text-sm font-mono text-cyan-400/60">
                  Clear all performance statistics
                </div>
              </div>
              <Button variant="destructive" size="sm" className="font-mono">
                <Trash2 className="w-4 h-4 mr-2" />
                Reset
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Save Button */}
        <div className="flex justify-end">
          <Button onClick={handleSave} className="font-mono">
            {saved ? (
              <>
                <span className="loading-dot w-2 h-2 rounded-full bg-current mr-2" />
                Saved!
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Save Settings
              </>
            )}
          </Button>
        </div>

        {/* API Status */}
        <Card className="border-cyan-500/20 bg-black/60 backdrop-blur-xl">
          <CardHeader>
            <CardTitle className="text-lg font-mono text-cyan-400">API Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="p-4 rounded-lg bg-green-500/5 border border-green-500/20">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                  <span className="text-sm font-mono text-green-400">ONLINE</span>
                </div>
                <div className="text-xs font-mono text-cyan-400/60">Odds API</div>
              </div>
              <div className="p-4 rounded-lg bg-green-500/5 border border-green-500/20">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                  <span className="text-sm font-mono text-green-400">ONLINE</span>
                </div>
                <div className="text-xs font-mono text-cyan-400/60">Tennis API</div>
              </div>
              <div className="p-4 rounded-lg bg-green-500/5 border border-green-500/20">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                  <span className="text-sm font-mono text-green-400">ONLINE</span>
                </div>
                <div className="text-xs font-mono text-cyan-400/60">Supabase DB</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}