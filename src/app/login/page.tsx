"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { GradientOrb, FloatingParticles } from "@/components/ui/cyber-grid";
import { Activity, ArrowRight, User, Lock, Mail } from "lucide-react";

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate login - in production this would connect to Supabase
    setTimeout(() => {
      setLoading(false);
      // Redirect to dashboard
      window.location.href = "/dashboard";
    }, 1500);
  };

  return (
    <main className="min-h-screen flex items-center justify-center p-4 bg-[#0a0a0a] relative overflow-hidden">
      {/* Background Effects */}
      <GradientOrb color="cyan" size={500} className="top-1/4 left-1/4 opacity-20" />
      <GradientOrb color="purple" size={400} className="bottom-1/4 right-1/4 opacity-15" />
      <FloatingParticles count={30} />
      
      {/* Login Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md relative z-10"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-3">
            <div className="relative">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-purple-500 flex items-center justify-center">
                <Activity className="w-6 h-6 text-black" />
              </div>
              <div className="absolute inset-0 rounded-xl bg-cyan-400/50 blur-lg" />
            </div>
            <div>
              <span className="text-2xl font-bold font-mono text-white">TENNIS</span>
              <span className="text-2xl font-bold font-mono text-cyan-400">EDGE</span>
            </div>
          </Link>
        </div>

        <Card className="border-cyan-500/30 bg-black/80 backdrop-blur-xl">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-mono text-white">
              {isLogin ? "ACCESS PLATFORM" : "CREATE ACCOUNT"}
            </CardTitle>
            <CardDescription className="font-mono text-cyan-400/60">
              {isLogin ? "Enter your credentials to continue" : "Set up your trading account"}
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <div className="space-y-2">
                  <label className="text-sm font-mono text-cyan-400/70">Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-cyan-400/40" />
                    <Input
                      type="text"
                      placeholder="Your name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="pl-10"
                    />
                  </div>
                </div>
              )}
              
              <div className="space-y-2">
                <label className="text-sm font-mono text-cyan-400/70">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-cyan-400/40" />
                  <Input
                    type="email"
                    placeholder="trader@tennisedge.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="pl-10"
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-mono text-cyan-400/70">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-cyan-400/40" />
                  <Input
                    type="password"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full font-mono" 
                disabled={loading}
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="loading-dot w-2 h-2 rounded-full bg-current" />
                    <span className="loading-dot w-2 h-2 rounded-full bg-current" />
                    <span className="loading-dot w-2 h-2 rounded-full bg-current" />
                  </span>
                ) : (
                  <>
                    {isLogin ? "SIGN IN" : "CREATE ACCOUNT"}
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </>
                )}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="text-sm font-mono text-cyan-400/60 hover:text-cyan-400 transition-colors"
              >
                {isLogin ? "Need an account? Sign up" : "Already have an account? Sign in"}
              </button>
            </div>

            {/* Demo Access */}
            <div className="mt-6 p-4 rounded-lg bg-cyan-500/5 border border-cyan-500/10">
              <p className="text-xs font-mono text-cyan-400/60 text-center">
                Demo Mode: Enter any email and password to explore the platform
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Back to Home */}
        <div className="text-center mt-6">
          <Link href="/" className="text-sm font-mono text-cyan-400/40 hover:text-cyan-400 transition-colors">
            ← Back to Home
          </Link>
        </div>
      </motion.div>
    </main>
  );
}