"use client";

import { motion } from "framer-motion";
import { TerminalText } from "./animated-background";
import { Button } from "./button";

interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  action?: {
    label: string;
    onClick: () => void;
  };
  variant?: "no-edge" | "no-data" | "no-bankroll" | "awaiting";
}

export function EmptyState({ title, description, icon, action, variant = "no-data" }: EmptyStateProps) {
  const terminalMessages: Record<string, { prefix: string; color: string }> = {
    "no-edge": { prefix: "[EDGE_SCAN]", color: "text-green-400" },
    "no-data": { prefix: "[SYSTEM]", color: "text-cyan-400" },
    "no-bankroll": { prefix: "[CONFIG]", color: "text-orange-400" },
    "awaiting": { prefix: "[SYNC]", color: "text-purple-400" },
  };

  const { prefix, color } = terminalMessages[variant];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center justify-center p-12 rounded-xl border border-cyan-500/20 bg-black/60 backdrop-blur-xl"
    >
      <div className="mb-6 relative">
        <div className="absolute inset-0 bg-cyan-500/20 blur-xl rounded-full" />
        {icon || (
          <div className="w-16 h-16 rounded-full border-2 border-cyan-500/50 flex items-center justify-center">
            <svg className="w-8 h-8 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        )}
      </div>
      
      <div className="text-center space-y-4 max-w-md">
        <div className={`font-mono text-sm ${color}`}>
          {prefix}_
        </div>
        <TerminalText 
          text={title} 
          speed={40} 
          className="text-xl font-bold text-white" 
        />
        {description && (
          <p className="text-cyan-400/60 text-sm font-mono">
            {description}
          </p>
        )}
      </div>

      {action && (
        <div className="mt-6">
          <Button onClick={action.onClick} variant="outline" size="sm">
            {action.label}
          </Button>
        </div>
      )}
    </motion.div>
  );
}