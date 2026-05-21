"use client";

import { motion } from "framer-motion";

export function LoadingScreen() {
  return (
    <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl flex items-center justify-center">
      <div className="relative">
        {/* Matrix-style loading */}
        <div className="flex flex-col items-center gap-8">
          <div className="relative">
            {/* Outer ring */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="w-24 h-24 border-4 border-transparent border-t-cyan-500 rounded-full"
            />
            {/* Middle ring */}
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
              className="absolute inset-2 w-20 h-20 border-4 border-transparent border-b-purple-500 rounded-full"
            />
            {/* Inner ring */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="absolute inset-4 w-16 h-16 border-4 border-transparent border-l-green-500 rounded-full"
            />
            {/* Center */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-4 h-4 bg-cyan-400 rounded-full shadow-[0_0_20px_rgba(0,240,255,0.8)]" />
            </div>
          </div>

          {/* Terminal text */}
          <div className="font-mono text-cyan-400 text-sm">
            <motion.span
              animate={{ opacity: [0, 1, 0] }}
              transition={{ duration: 1, repeat: Infinity }}
            >
              INITIALIZING TENNISEDGE SYSTEM
            </motion.span>
          </div>

          {/* Loading bars */}
          <div className="flex gap-1">
            {[0, 1, 2, 3, 4].map((i) => (
              <motion.div
                key={i}
                className="w-1 h-8 bg-cyan-500/50 rounded-full"
                animate={{
                  height: ["2rem", "4rem", "2rem"],
                }}
                transition={{
                  duration: 0.8,
                  repeat: Infinity,
                  delay: i * 0.1,
                  ease: "easeInOut",
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function TableLoading() {
  return (
    <div className="w-full p-8 flex flex-col items-center justify-center gap-4">
      <div className="flex gap-1">
        {[0, 1, 2, 3, 4].map((i) => (
          <motion.div
            key={i}
            className="w-1 h-6 bg-cyan-500/30 rounded-full"
            animate={{
              height: ["1.5rem", "3rem", "1.5rem"],
            }}
            transition={{
              duration: 0.6,
              repeat: Infinity,
              delay: i * 0.1,
            }}
          />
        ))}
      </div>
      <span className="text-cyan-400/60 text-sm font-mono">LOADING DATA...</span>
    </div>
  );
}