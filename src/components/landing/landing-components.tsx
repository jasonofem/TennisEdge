"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TerminalText } from "@/components/ui/animated-background";
import { CyberGrid, GradientOrb, FloatingParticles } from "@/components/ui/cyber-grid";
import Link from "next/link";
import { ArrowRight, Zap, Shield, TrendingUp, Target, Activity, ChevronRight } from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-[#0a0a0a] to-black" />
      <CyberGrid />
      <FloatingParticles count={50} />
      <GradientOrb color="cyan" size={600} className="top-1/4 -left-1/4 opacity-30" />
      <GradientOrb color="purple" size={500} className="bottom-1/4 -right-1/4 opacity-20" />
      
      {/* Content */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 py-24 text-center">
        {/* Logo Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/30 mb-8"
        >
          <Activity className="w-4 h-4 text-cyan-400" />
          <span className="text-sm font-mono text-cyan-400">ADVANCED TENNIS BETTING INTELLIGENCE</span>
        </motion.div>

        {/* Main Title */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-6xl md:text-8xl font-black font-mono mb-6"
        >
          <span className="text-white">TENNIS</span>
          <span className="text-cyan-400">EDGE</span>
        </motion.h1>

        {/* Tagline */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mb-12"
        >
          <TerminalText 
            text="Precision. Discipline. Edge." 
            speed={80}
            className="text-2xl md:text-3xl font-mono text-cyan-400"
          />
        </motion.div>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="max-w-2xl mx-auto text-lg text-cyan-400/60 font-mono mb-12 leading-relaxed"
        >
          Professional tennis betting intelligence platform. 
          Maximum 3 high-value underdog opportunities daily. 
          Data-driven analysis with disciplined bankroll management.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.7 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link href="/login">
            <Button size="lg" className="font-mono group">
              ACCESS PLATFORM
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
          <Link href="/dashboard">
            <Button size="lg" variant="outline" className="font-mono">
              VIEW DEMO DASHBOARD
            </Button>
          </Link>
        </motion.div>

        {/* Stats Preview */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.9 }}
          className="mt-24 grid grid-cols-2 md:grid-cols-4 gap-6"
        >
          {[
            { value: "87%", label: "Win Rate" },
            { value: "+12.5%", label: "Avg Edge" },
            { value: "3", label: "Daily Picks" },
            { value: "₦1000", label: "Min Bankroll" },
          ].map((stat, index) => (
            <div 
              key={index}
              className="p-4 rounded-xl bg-black/40 border border-cyan-500/20 backdrop-blur-sm"
            >
              <div className="text-3xl font-bold font-mono text-cyan-400 mb-1">{stat.value}</div>
              <div className="text-xs font-mono text-cyan-400/50 uppercase">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <ChevronRight className="w-6 h-6 text-cyan-400/50 rotate-90" />
      </motion.div>
    </section>
  );
}

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  delay: number;
}

function FeatureCard({ icon, title, description, delay }: FeatureCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
    >
      <Card className="h-full border-cyan-500/20 bg-black/60 backdrop-blur-xl hover:border-cyan-500/40 transition-all duration-300 group">
        <CardHeader>
          <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center mb-4 group-hover:bg-cyan-500/20 group-hover:border-cyan-500/30 transition-colors">
            <div className="text-cyan-400">{icon}</div>
          </div>
          <CardTitle className="text-lg font-mono text-white">{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm font-mono text-cyan-400/60 leading-relaxed">{description}</p>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export function FeaturesSection() {
  const features = [
    {
      icon: <Target className="w-6 h-6" />,
      title: "Underdog Analysis",
      description: "AI-powered analysis identifies high-value underdog opportunities for set betting across all major tournaments.",
    },
    {
      icon: <TrendingUp className="w-6 h-6" />,
      title: "Edge Detection",
      description: "Proprietary algorithm calculates true probability vs implied odds to identify +EV betting opportunities.",
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Bankroll Management",
      description: "Disciplined unit sizing system based on confidence levels. Protect your capital while maximizing returns.",
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Live Tracking",
      description: "Real-time match updates, live scores, and automatic result settlement for active predictions.",
    },
    {
      icon: <Activity className="w-6 h-6" />,
      title: "Performance Analytics",
      description: "Comprehensive analytics dashboard with ROI tracking, win rates, and streak analysis.",
    },
    {
      icon: <Target className="w-6 h-6" />,
      title: "Betting Journal",
      description: "Automated logging of all predictions with detailed notes and searchable history.",
    },
  ];

  return (
    <section className="relative py-24 px-6">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-500/5 to-transparent" />
      
      <div className="max-w-6xl mx-auto relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-sm font-mono text-cyan-400 uppercase tracking-wider">Platform Features</span>
          <h2 className="text-4xl md:text-5xl font-bold font-mono text-white mt-4">
            Professional Trading Tools
          </h2>
          <p className="max-w-2xl mx-auto text-cyan-400/60 font-mono mt-4">
            Everything you need for disciplined tennis betting analysis
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <FeatureCard key={index} {...feature} delay={index * 0.1} />
          ))}
        </div>
      </div>
    </section>
  );
}

export function HowItWorksSection() {
  const steps = [
    { step: "01", title: "Edge Scan", description: "System analyzes all available tennis matches and calculates value edges" },
    { step: "02", title: "Confidence Score", description: "Each opportunity rated LOW/MEDIUM/HIGH based on multiple factors" },
    { step: "03", title: "Stake Calculation", description: "Unit sizing derived from confidence level and bankroll parameters" },
    { step: "04", title: "Track Results", description: "Automatic logging and performance analytics on all predictions" },
  ];

  return (
    <section className="relative py-24 px-6 bg-black/50">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-sm font-mono text-cyan-400 uppercase tracking-wider">How It Works</span>
          <h2 className="text-4xl md:text-5xl font-bold font-mono text-white mt-4">
            Simple. Disciplined. Profitable.
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-4 gap-6">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="relative p-6 rounded-xl bg-black/60 border border-cyan-500/20"
            >
              <div className="text-5xl font-bold font-mono text-cyan-500/20 absolute top-4 right-4">
                {step.step}
              </div>
              <h3 className="text-xl font-bold font-mono text-white mb-2">{step.title}</h3>
              <p className="text-sm font-mono text-cyan-400/60">{step.description}</p>
              
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-px bg-cyan-500/30" />
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function CTASection() {
  return (
    <section className="relative py-24 px-6">
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 via-purple-500/10 to-cyan-500/10" />
        <div className="absolute inset-0 bg-cyber-grid bg-[size:30px_30px] opacity-30" />
      </div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="max-w-4xl mx-auto text-center relative"
      >
        <h2 className="text-4xl md:text-5xl font-bold font-mono text-white mb-6">
          Ready to Gain the Edge?
        </h2>
        <p className="text-xl font-mono text-cyan-400/60 mb-8">
          Join professional bettors using data-driven analysis for consistent profits
        </p>
        <Link href="/login">
          <Button size="lg" className="font-mono group">
            START YOUR EDGE
            <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Button>
        </Link>
      </motion.div>
    </section>
  );
}

export function Footer() {
  return (
    <footer className="relative py-12 px-6 border-t border-cyan-500/20 bg-black/80">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Activity className="w-5 h-5 text-cyan-400" />
          <span className="font-mono text-white">TENNIS<span className="text-cyan-400">EDGE</span></span>
        </div>
        <p className="text-sm font-mono text-cyan-400/40">
          © 2026 TennisEdge. Precision. Discipline. Edge.
        </p>
      </div>
    </footer>
  );
}