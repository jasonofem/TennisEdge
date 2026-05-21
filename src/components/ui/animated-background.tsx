"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface TerminalTextProps {
  text: string;
  speed?: number;
  className?: string;
  showCursor?: boolean;
}

export function TerminalText({ text, speed = 50, className = "", showCursor = true }: TerminalTextProps) {
  const [displayedText, setDisplayedText] = useState("");
  const [showCursorState, setShowCursorState] = useState(true);

  useEffect(() => {
    setDisplayedText("");
    let currentIndex = 0;
    
    const interval = setInterval(() => {
      if (currentIndex < text.length) {
        setDisplayedText(text.slice(0, currentIndex + 1));
        currentIndex++;
      } else {
        clearInterval(interval);
      }
    }, speed);

    const cursorInterval = setInterval(() => {
      setShowCursorState(prev => !prev);
    }, 500);

    return () => {
      clearInterval(interval);
      clearInterval(cursorInterval);
    };
  }, [text, speed]);

  return (
    <span className={`font-mono ${className}`}>
      {displayedText}
      {showCursor && (
        <span className={`inline-block w-2 h-5 bg-cyan-400 ml-1 ${showCursorState ? 'opacity-100' : 'opacity-0'}`} />
      )}
    </span>
  );
}

interface GlowingBorderProps {
  children: React.ReactNode;
  color?: "cyan" | "green" | "purple" | "orange";
  intensity?: "low" | "medium" | "high";
  className?: string;
}

export function GlowingBorder({ children, color = "cyan", intensity = "medium", className = "" }: GlowingBorderProps) {
  const colorMap = {
    cyan: "border-cyan-500/50 hover:border-cyan-400",
    green: "border-green-500/50 hover:border-green-400",
    purple: "border-purple-500/50 hover:border-purple-400",
    orange: "border-orange-500/50 hover:border-orange-400",
  };

  const glowMap = {
    low: "shadow-[0_0_10px_rgba(0,240,255,0.2)]",
    medium: "shadow-[0_0_20px_rgba(0,240,255,0.3)]",
    high: "shadow-[0_0_30px_rgba(0,240,255,0.5)]",
  };

  return (
    <div className={`rounded-xl border ${colorMap[color]} ${glowMap[intensity]} transition-all duration-300 ${className}`}>
      {children}
    </div>
  );
}

interface PulseIndicatorProps {
  status: "live" | "pending" | "completed" | "won" | "lost";
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
}

export function PulseIndicator({ status, size = "md", showLabel = true }: PulseIndicatorProps) {
  const sizeMap = {
    sm: "w-2 h-2",
    md: "w-3 h-3",
    lg: "w-4 h-4",
  };

  const colorMap = {
    live: "bg-red-500",
    pending: "bg-yellow-500",
    completed: "bg-gray-500",
    won: "bg-green-500",
    lost: "bg-red-500",
  };

  const labelMap = {
    live: "LIVE",
    pending: "PENDING",
    completed: "COMPLETED",
    won: "WON",
    lost: "LOST",
  };

  return (
    <div className="flex items-center gap-2">
      <span className={`relative flex ${sizeMap[size]}`}>
        <span className={`absolute inline-flex h-full w-full rounded-full ${colorMap[status]} ${status === 'live' ? 'animate-ping' : ''}`} />
        <span className={`relative inline-flex rounded-full h-full w-full ${colorMap[status]}`} />
      </span>
      {showLabel && (
        <span className="text-xs font-mono font-semibold text-gray-400 uppercase">
          {labelMap[status]}
        </span>
      )}
    </div>
  );
}

interface AnimatedCounterProps {
  value: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  className?: string;
}

export function AnimatedCounter({ value, duration = 1000, prefix = "", suffix = "", decimals = 0, className = "" }: AnimatedCounterProps) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    const startTime = Date.now();
    const startValue = displayValue;
    const diff = value - startValue;

    const updateValue = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayValue(startValue + diff * eased);

      if (progress < 1) {
        requestAnimationFrame(updateValue);
      }
    };

    requestAnimationFrame(updateValue);
  }, [value]);

  return (
    <span className={`font-mono ${className}`}>
      {prefix}{displayValue.toFixed(decimals)}{suffix}
    </span>
  );
}

interface GlitchTextProps {
  children: React.ReactNode;
  className?: string;
}

export function GlitchText({ children, className = "" }: GlitchTextProps) {
  return (
    <span className={`relative ${className}`}>
      <span className="glitch-1 absolute inset-0">{children}</span>
      <span className="glitch-2 absolute inset-0">{children}</span>
      {children}
    </span>
  );
}