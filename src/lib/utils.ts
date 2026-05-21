import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatPercent(value: number, decimals: number = 1): string {
  return `${value.toFixed(decimals)}%`;
}

export function calculateImpliedProbability(odds: number): number {
  return (1 / odds) * 100;
}

export function calculateEdge(modelProb: number, impliedProb: number): number {
  return modelProb - impliedProb;
}

export function getConfidenceLevel(edge: number): { level: string; units: number } {
  if (edge >= 15) return { level: "HIGH", units: 3 };
  if (edge >= 8) return { level: "MEDIUM", units: 2 };
  return { level: "LOW", units: 1 };
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

export function formatTime(date: Date): string {
  return new Intl.DateTimeFormat("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    timeZoneName: "short",
  }).format(date);
}

export function getTimeUntilMatch(startTime: Date): string {
  const now = new Date();
  const diff = startTime.getTime() - now.getTime();
  
  if (diff < 0) return "LIVE";
  
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  
  if (hours > 24) {
    const days = Math.floor(hours / 24);
    return `${days}d ${hours % 24}h`;
  }
  
  return `${hours}h ${minutes}m`;
}

export function generateId(): string {
  return Math.random().toString(36).substring(2, 15);
}

export function parseScore(score: string | null): { sets: number[][]; currentGame: string } {
  if (!score) return { sets: [], currentGame: "" };
  
  const parts = score.split(" ");
  const sets: number[][] = [];
  
  for (const part of parts) {
    const [p1, p2] = part.split("-").map(Number);
    if (!isNaN(p1) && !isNaN(p2)) {
      sets.push([p1, p2]);
    }
  }
  
  return { sets, currentGame: parts[parts.length - 1] || "" };
}