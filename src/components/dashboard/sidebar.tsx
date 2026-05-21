"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { LayoutDashboard, LineChart, BookOpen, Wallet, Settings, Shield, Menu, X, Activity } from "lucide-react";
import { useState } from "react";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/analytics", label: "Analytics", icon: LineChart },
  { href: "/dashboard/journal", label: "Journal", icon: BookOpen },
  { href: "/dashboard/bankroll", label: "Bankroll", icon: Wallet },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
];

const adminItems = [
  { href: "/dashboard/admin", label: "Admin Panel", icon: Shield },
];

export function Sidebar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      {/* Mobile Toggle */}
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="fixed top-4 left-4 z-50 lg:hidden p-2 rounded-lg bg-black/80 backdrop-blur-xl border border-cyan-500/30 text-cyan-400"
      >
        {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* Mobile Overlay */}
      {mobileOpen && (
        <div 
          className="fixed inset-0 bg-black/80 z-40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <motion.aside
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        className={cn(
          "fixed left-0 top-0 h-full w-64 bg-black/90 backdrop-blur-xl border-r border-cyan-500/20 z-50",
          "transition-transform duration-300 lg:translate-x-0",
          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        {/* Logo */}
        <div className="h-20 flex items-center px-6 border-b border-cyan-500/20">
          <Link href="/dashboard" className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-500 to-purple-500 flex items-center justify-center">
                <Activity className="w-5 h-5 text-black" />
              </div>
              <div className="absolute inset-0 rounded-lg bg-cyan-400/50 blur-lg" />
            </div>
            <div>
              <span className="text-lg font-bold font-mono text-white">TENNIS</span>
              <span className="text-lg font-bold font-mono text-cyan-400">EDGE</span>
            </div>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200",
                  "hover:bg-cyan-500/10 group",
                  isActive 
                    ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/30" 
                    : "text-cyan-400/60 hover:text-cyan-300"
                )}
              >
                <item.icon className={cn("w-5 h-5", isActive ? "text-cyan-400" : "text-cyan-400/40 group-hover:text-cyan-400")} />
                <span className="font-mono text-sm font-medium">{item.label}</span>
                {isActive && (
                  <div className="ml-auto w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_10px_rgba(0,240,255,0.5)]" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Admin Section */}
        <div className="p-4 border-t border-cyan-500/10">
          <div className="px-4 py-2 text-xs font-mono text-cyan-400/40 uppercase tracking-wider">
            Admin
          </div>
          {adminItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200",
                  "hover:bg-orange-500/10 group",
                  isActive 
                    ? "bg-orange-500/20 text-orange-400 border border-orange-500/30" 
                    : "text-orange-400/60 hover:text-orange-300"
                )}
              >
                <item.icon className={cn("w-5 h-5", isActive ? "text-orange-400" : "text-orange-400/40 group-hover:text-orange-400")} />
                <span className="font-mono text-sm font-medium">{item.label}</span>
              </Link>
            );
          })}
        </div>

        {/* Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-cyan-500/10">
          <div className="px-4 py-3 rounded-lg bg-cyan-500/5 border border-cyan-500/10">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <span className="text-xs font-mono text-green-400">SYSTEM ONLINE</span>
            </div>
            <span className="text-xs font-mono text-cyan-400/40">
              Precision. Discipline. Edge.
            </span>
          </div>
        </div>
      </motion.aside>
    </>
  );
}

export function MobileNav() {
  const pathname = usePathname();
  
  return (
    <nav className="fixed bottom-0 left-0 right-0 lg:hidden bg-black/95 backdrop-blur-xl border-t border-cyan-500/20 z-40">
      <div className="flex items-center justify-around py-2">
        {navItems.slice(0, 4).map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center gap-1 p-2 rounded-lg transition-all",
                isActive ? "text-cyan-400" : "text-cyan-400/40"
              )}
            >
              <item.icon className="w-5 h-5" />
              <span className="text-xs font-mono">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}