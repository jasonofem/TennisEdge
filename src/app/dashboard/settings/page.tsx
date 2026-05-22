"use client";

import { useState, useEffect } from "react";
import { DashboardHeader } from "@/components/dashboard/header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Save, Key, Wifi, AlertCircle, CheckCircle, Eye, EyeOff } from "lucide-react";

export default function SettingsPage() {
  const [oddsApiKey, setOddsApiKey] = useState("");
  const [tennisApiKey, setTennisApiKey] = useState("");
  const [saved, setSaved] = useState(false);
  const [showOddsKey, setShowOddsKey] = useState(false);
  const [showTennisKey, setShowTennisKey] = useState(false);
  const [testingApi, setTestingApi] = useState(false);
  const [apiTestResult, setApiTestResult] = useState<{success: boolean; message: string} | null>(null);

  // Load saved keys from localStorage
  useEffect(() => {
    const savedOdds = localStorage.getItem("odds_api_key");
    const savedTennis = localStorage.getItem("tennis_api_key");
    if (savedOdds) setOddsApiKey(savedOdds);
    if (savedTennis) setTennisApiKey(savedTennis);
  }, []);

  const handleSave = () => {
    localStorage.setItem("odds_api_key", oddsApiKey);
    localStorage.setItem("tennis_api_key", tennisApiKey);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const testApiConnection = async () => {
    setTestingApi(true);
    setApiTestResult(null);
    
    try {
      // Test with the entered key
      const response = await fetch(
        `https://api.the-odds-api.com/v4/sports/tennis_atp/odds?apiKey=${oddsApiKey}&regions=uk&markets=h2h`,
        { signal: AbortSignal.timeout(10000) }
      );
      
      if (response.ok) {
        const data = await response.json();
        setApiTestResult({ 
          success: true, 
          message: `Connected! Found ${data?.length || 0} matches` 
        });
      } else {
        const error = await response.text();
        setApiTestResult({ 
          success: false, 
          message: `Error: ${response.status} - ${error.substring(0, 100)}` 
        });
      }
    } catch (error: any) {
      setApiTestResult({ 
        success: false, 
        message: `Failed: ${error.message}` 
      });
    }
    
    setTestingApi(false);
  };

  return (
    <div className="min-h-screen">
      <DashboardHeader title="Settings" subtitle="Configure API Keys" />
      
      <div className="p-6 max-w-2xl mx-auto space-y-6">
        {/* API Keys Section */}
        <Card className="border-cyan-500/20 bg-black/60 backdrop-blur-xl">
          <CardHeader>
            <CardTitle className="text-lg font-mono text-cyan-400 flex items-center gap-2">
              <Key className="w-5 h-5" />
              API Configuration
            </CardTitle>
            <CardDescription className="font-mono text-cyan-400/60">
              Enter your API keys to enable live data. Keys are saved in your browser.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Odds API Key */}
            <div className="space-y-2">
              <Label className="text-cyan-400 font-mono">Odds API Key</Label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Input
                    type={showOddsKey ? "text" : "password"}
                    value={oddsApiKey}
                    onChange={(e) => setOddsApiKey(e.target.value)}
                    placeholder="Enter Odds API Key"
                    className="font-mono pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowOddsKey(!showOddsKey)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-cyan-400/50 hover:text-cyan-400"
                  >
                    {showOddsKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <p className="text-xs font-mono text-cyan-400/50">
                Get from: the-odds-api.com
              </p>
            </div>

            {/* Tennis API Key */}
            <div className="space-y-2">
              <Label className="text-cyan-400 font-mono">Tennis API Key</Label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Input
                    type={showTennisKey ? "text" : "password"}
                    value={tennisApiKey}
                    onChange={(e) => setTennisApiKey(e.target.value)}
                    placeholder="Enter Tennis API Key"
                    className="font-mono pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowTennisKey(!showTennisKey)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-cyan-400/50 hover:text-cyan-400"
                  >
                    {showTennisKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <p className="text-xs font-mono text-cyan-400/50">
                Get from: api-tennis.com
              </p>
            </div>

            {/* Save Button */}
            <div className="flex gap-4">
              <Button onClick={handleSave} className="font-mono flex-1">
                <Save className="w-4 h-4 mr-2" />
                {saved ? "✓ Saved!" : "Save API Keys"}
              </Button>
              <Button onClick={testApiConnection} variant="outline" disabled={testingApi || !oddsApiKey} className="font-mono">
                {testingApi ? "Testing..." : "Test Connection"}
              </Button>
            </div>

            {/* Test Result */}
            {apiTestResult && (
              <div className={`p-4 rounded-lg border ${
                apiTestResult.success 
                  ? 'bg-green-500/10 border-green-500/30' 
                  : 'bg-red-500/10 border-red-500/30'
              }`}>
                <div className="flex items-center gap-2">
                  {apiTestResult.success ? (
                    <CheckCircle className="w-5 h-5 text-green-400" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-red-400" />
                  )}
                  <span className={`font-mono ${apiTestResult.success ? 'text-green-400' : 'text-red-400'}`}>
                    {apiTestResult.message}
                  </span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Instructions */}
        <Card className="border-cyan-500/20 bg-black/60 backdrop-blur-xl">
          <CardHeader>
            <CardTitle className="text-lg font-mono text-cyan-400">How to get API Keys</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm font-mono text-cyan-400/70">
            <div>
              <strong className="text-cyan-400">Odds API:</strong>
              <ol className="list-decimal ml-5 mt-2 space-y-1">
                <li>Go to <span className="text-cyan-400">the-odds-api.com</span></li>
                <li>Sign up for free account</li>
                <li>Copy your API key from dashboard</li>
                <li>Paste in the field above</li>
              </ol>
            </div>
            <div>
              <strong className="text-cyan-400">Tennis API:</strong>
              <ol className="list-decimal ml-5 mt-2 space-y-1">
                <li>Go to <span className="text-cyan-400">api-tennis.com</span></li>
                <li>Register and get free API key</li>
                <li>Paste in the field above</li>
              </ol>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
