"use client";

import { Sidebar, MobileNav } from "@/components/dashboard/sidebar";
import { LoadingScreen } from "@/components/ui/loading";
import { useState, useEffect } from "react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <Sidebar />
      <MobileNav />
      <main className="lg:pl-64 pb-20 lg:pb-0">
        {children}
      </main>
    </div>
  );
}