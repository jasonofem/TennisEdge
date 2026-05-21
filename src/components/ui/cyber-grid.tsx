"use client";

import { motion } from "framer-motion";

interface CyberGridProps {
  className?: string;
}

export function CyberGrid({ className = "" }: CyberGridProps) {
  return (
    <div className={`absolute inset-0 bg-cyber-grid bg-[size:50px_50px] ${className}`}>
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/50 to-black" />
    </div>
  );
}

interface FloatingParticlesProps {
  count?: number;
}

export function FloatingParticles({ count = 30 }: FloatingParticlesProps) {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {Array.from({ length: count }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-cyan-400/50 rounded-full"
          initial={{
            x: Math.random() * 100 + "%",
            y: Math.random() * 100 + "%",
            opacity: Math.random() * 0.5 + 0.2,
          }}
          animate={{
            y: [null, `${Math.random() * -100 - 50}%`],
            opacity: [null, 0],
          }}
          transition={{
            duration: Math.random() * 10 + 10,
            repeat: Infinity,
            delay: Math.random() * 10,
          }}
        />
      ))}
    </div>
  );
}

interface GradientOrbProps {
  color?: "cyan" | "purple" | "green";
  size?: number;
  className?: string;
}

export function GradientOrb({ color = "cyan", size = 400, className = "" }: GradientOrbProps) {
  const colorMap = {
    cyan: "from-cyan-500/30 via-cyan-500/10 to-transparent",
    purple: "from-purple-500/30 via-purple-500/10 to-transparent",
    green: "from-green-500/30 via-green-500/10 to-transparent",
  };

  return (
    <div 
      className={`absolute rounded-full bg-gradient-to-br ${colorMap[color]} blur-3xl ${className}`}
      style={{ width: size, height: size }}
    />
  );
}

interface NeonLineProps {
  direction?: "horizontal" | "vertical";
  className?: string;
}

export function NeonLine({ direction = "horizontal", className = "" }: NeonLineProps) {
  return (
    <div className={`relative ${className}`}>
      <div className={`absolute ${direction === "horizontal" ? "w-full h-px" : "h-full w-px"} bg-gradient-to-${direction === "horizontal" ? "r" : "b"} from-transparent via-cyan-500 to-transparent`} />
      <div className={`absolute ${direction === "horizontal" ? "w-full h-px" : "h-full w-px"} bg-gradient-to-${direction === "horizontal" ? "r" : "b"} from-transparent via-cyan-400/50 to-transparent blur-sm`} />
    </div>
  );
}