"use client";

import { motion } from "framer-motion";
import { Bell, User, Search, LogOut } from "lucide-react";
import { useState } from "react";
import { PulseIndicator } from "@/components/ui/animated-background";

interface HeaderProps {
  title: string;
  subtitle?: string;
  liveMatches?: number;
  showLiveIndicator?: boolean;
}

export function DashboardHeader({ title, subtitle, liveMatches = 0, showLiveIndicator = false }: HeaderProps) {
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="sticky top-0 z-30 bg-black/80 backdrop-blur-xl border-b border-cyan-500/20"
    >
      <div className="flex items-center justify-between px-6 py-4">
        <div>
          <h1 className="text-2xl font-bold font-mono text-white">{title}</h1>
          {subtitle && (
            <p className="text-sm font-mono text-cyan-400/60">{subtitle}</p>
          )}
        </div>

        <div className="flex items-center gap-4">
          {/* Live Matches Indicator */}
          {showLiveIndicator && liveMatches > 0 && (
            <PulseIndicator status="live" size="md" />
          )}

          {/* Search */}
          <button className="p-2 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 hover:bg-cyan-500/20 transition-colors">
            <Search className="w-5 h-5" />
          </button>

          {/* Notifications */}
          <div className="relative">
            <button 
              onClick={() => setNotificationsOpen(!notificationsOpen)}
              className="p-2 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 hover:bg-cyan-500/20 transition-colors relative"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            </button>
          </div>

          {/* User Menu */}
          <div className="flex items-center gap-3 px-4 py-2 rounded-lg bg-cyan-500/10 border border-cyan-500/20">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500 to-purple-500 flex items-center justify-center">
              <User className="w-4 h-4 text-black" />
            </div>
            <div className="hidden sm:block">
              <span className="text-sm font-mono text-white">Trader</span>
            </div>
          </div>

          {/* Logout */}
          <button className="p-2 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 transition-colors">
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </div>
    </motion.header>
  );
}