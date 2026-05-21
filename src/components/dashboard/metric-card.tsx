"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AnimatedCounter, PulseIndicator } from "@/components/ui/animated-background";
import { formatCurrency, formatPercent } from "@/lib/utils";
import { TrendingUp, TrendingDown, Minus, DollarSign, Target, Percent, Activity } from "lucide-react";
import { ReactNode } from "react";

interface MetricCardProps {
  title: string;
  value: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  trend?: number;
  icon?: ReactNode;
  variant?: "default" | "success" | "danger" | "warning";
  className?: string;
}

export function MetricCard({ title, value, prefix = "", suffix = "", decimals = 0, trend, icon, variant = "default", className = "" }: MetricCardProps) {
  const variantStyles = {
    default: "border-cyan-500/20",
    success: "border-green-500/20 hover:border-green-500/40",
    danger: "border-red-500/20 hover:border-red-500/40",
    warning: "border-orange-500/20 hover:border-orange-500/40",
  };

  const iconStyles = {
    default: "text-cyan-400",
    success: "text-green-400",
    danger: "text-red-400",
    warning: "text-orange-400",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className={`${variantStyles[variant]} ${className}`}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-mono text-cyan-400/70 uppercase tracking-wider">
            {title}
          </CardTitle>
          {icon && <div className={iconStyles[variant]}>{icon}</div>}
        </CardHeader>
        <CardContent>
          <div className="flex items-baseline gap-2">
            {prefix && <span className="text-lg font-mono text-cyan-400">{prefix}</span>}
            <AnimatedCounter 
              value={value} 
              suffix={suffix}
              decimals={decimals}
              className="text-3xl font-bold font-mono text-white"
            />
          </div>
          {trend !== undefined && (
            <div className={`flex items-center gap-1 mt-2 text-sm font-mono ${trend > 0 ? 'text-green-400' : trend < 0 ? 'text-red-400' : 'text-gray-400'}`}>
              {trend > 0 ? <TrendingUp className="w-4 h-4" /> : trend < 0 ? <TrendingDown className="w-4 h-4" /> : <Minus className="w-4 h-4" />}
              <span>{trend > 0 ? '+' : ''}{trend.toFixed(1)}%</span>
              <span className="text-cyan-400/50">vs last week</span>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}

interface LiveIndicatorProps {
  matches: number;
}

export function LiveIndicator({ matches }: LiveIndicatorProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex items-center gap-3 px-4 py-2 rounded-full bg-red-500/10 border border-red-500/30"
    >
      <PulseIndicator status="live" size="md" showLabel={false} />
      <span className="text-sm font-mono text-red-400">
        <span className="text-white font-bold">{matches}</span> LIVE MATCHES
      </span>
    </motion.div>
  );
}

interface StatusBadgeProps {
  label: string;
  status: "upcoming" | "live" | "completed" | "won" | "lost" | "pending";
}

export function StatusBadge({ label, status }: StatusBadgeProps) {
  const statusConfig = {
    upcoming: { color: "text-cyan-400", bg: "bg-cyan-500/20", border: "border-cyan-500/30" },
    live: { color: "text-red-400", bg: "bg-red-500/20", border: "border-red-500/30" },
    completed: { color: "text-gray-400", bg: "bg-gray-500/20", border: "border-gray-500/30" },
    won: { color: "text-green-400", bg: "bg-green-500/20", border: "border-green-500/30" },
    lost: { color: "text-red-400", bg: "bg-red-500/20", border: "border-red-500/30" },
    pending: { color: "text-yellow-400", bg: "bg-yellow-500/20", border: "border-yellow-500/30" },
  };

  const config = statusConfig[status];

  return (
    <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-mono font-semibold ${config.color} ${config.bg} border ${config.border}`}>
      {label}
    </span>
  );
}