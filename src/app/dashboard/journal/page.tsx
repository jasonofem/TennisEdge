"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { DashboardHeader } from "@/components/dashboard/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { StatusBadge } from "@/components/dashboard/metric-card";
import { EmptyState } from "@/components/ui/empty-state";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Search, Filter, Download, ChevronLeft, ChevronRight, Plus } from "lucide-react";

// Sample journal data
const sampleEntries = [
  {
    id: "1",
    date: new Date("2026-05-20"),
    tournament: "ATP Masters Rome",
    player1: "Jannik Sinner",
    player2: "Carlos Alcaraz",
    underdog: "Carlos Alcaraz",
    odds: 2.85,
    units: 2,
    stakeAmount: 4000,
    edgePercent: 12.5,
    confidence: "HIGH",
    result: "won",
    profitLoss: 7400,
    notes: "Strong clay court form, good value",
  },
  {
    id: "2",
    date: new Date("2026-05-19"),
    tournament: "ATP 500 Dubai",
    player1: "Alexander Zverev",
    player2: "Daniil Medvedev",
    underdog: "Daniil Medvedev",
    odds: 2.45,
    units: 2,
    stakeAmount: 4000,
    edgePercent: 8.3,
    confidence: "MEDIUM",
    result: "lost",
    profitLoss: -4000,
    notes: "Match didn't go as expected",
  },
  {
    id: "3",
    date: new Date("2026-05-18"),
    tournament: "WTA 1000 Madrid",
    player1: "Iga Swiatek",
    player2: "Aryna Sabalenka",
    underdog: "Aryna Sabalenka",
    odds: 3.20,
    units: 1,
    stakeAmount: 2000,
    edgePercent: 6.8,
    confidence: "LOW",
    result: "won",
    profitLoss: 4400,
    notes: "Tiebreak victory",
  },
  {
    id: "4",
    date: new Date("2026-05-17"),
    tournament: "ATP 250 Munich",
    player1: "Holger Rune",
    player2: "Stefanos Tsitsipas",
    underdog: "Stefanos Tsitsipas",
    odds: 2.65,
    units: 3,
    stakeAmount: 6000,
    edgePercent: 15.2,
    confidence: "HIGH",
    result: "won",
    profitLoss: 9900,
    notes: "Dominant performance on clay",
  },
  {
    id: "5",
    date: new Date("2026-05-16"),
    tournament: "WTA 500 Stuttgart",
    player1: "Elena Rybakina",
    player2: "Coco Gauff",
    underdog: "Coco Gauff",
    odds: 2.30,
    units: 2,
    stakeAmount: 4000,
    edgePercent: 7.5,
    confidence: "MEDIUM",
    result: "pending",
    profitLoss: 0,
    notes: "Match in progress",
  },
];

export default function JournalPage() {
  const [entries, setEntries] = useState(sampleEntries);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const entriesPerPage = 10;

  const filteredEntries = entries.filter(entry => {
    const matchesSearch = 
      entry.player1.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.player2.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.tournament.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || entry.result === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filteredEntries.length / entriesPerPage);
  const paginatedEntries = filteredEntries.slice(
    (currentPage - 1) * entriesPerPage,
    currentPage * entriesPerPage
  );

  const exportToCSV = () => {
    const headers = ["Date", "Tournament", "Player 1", "Player 2", "Underdog", "Odds", "Units", "Stake", "Edge %", "Result", "P/L", "Notes"];
    const rows = entries.map(entry => [
      formatDate(entry.date),
      entry.tournament,
      entry.player1,
      entry.player2,
      entry.underdog,
      entry.odds,
      entry.units,
      entry.stakeAmount,
      entry.edgePercent,
      entry.result,
      entry.profitLoss,
      entry.notes,
    ]);
    
    const csv = [headers, ...rows].map(row => row.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "tennis-edge-journal.csv";
    a.click();
  };

  return (
    <div className="min-h-screen">
      <DashboardHeader 
        title="Betting Journal" 
        subtitle="Complete history of all predictions"
      />

      <div className="p-6 space-y-6">
        {/* Stats Row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="border-green-500/20 bg-black/60 backdrop-blur-xl p-4">
            <div className="text-sm font-mono text-cyan-400/60">Total Won</div>
            <div className="text-2xl font-bold font-mono text-green-400">
              {entries.filter(e => e.result === "won").length}
            </div>
          </Card>
          <Card className="border-red-500/20 bg-black/60 backdrop-blur-xl p-4">
            <div className="text-sm font-mono text-cyan-400/60">Total Lost</div>
            <div className="text-2xl font-bold font-mono text-red-400">
              {entries.filter(e => e.result === "lost").length}
            </div>
          </Card>
          <Card className="border-cyan-500/20 bg-black/60 backdrop-blur-xl p-4">
            <div className="text-sm font-mono text-cyan-400/60">Pending</div>
            <div className="text-2xl font-bold font-mono text-cyan-400">
              {entries.filter(e => e.result === "pending").length}
            </div>
          </Card>
          <Card className="border-purple-500/20 bg-black/60 backdrop-blur-xl p-4">
            <div className="text-sm font-mono text-cyan-400/60">Total P/L</div>
            <div className="text-2xl font-bold font-mono text-purple-400">
              {formatCurrency(entries.reduce((sum, e) => sum + (e.profitLoss || 0), 0))}
            </div>
          </Card>
        </div>

        {/* Filters and Search */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-cyan-400/40" />
              <Input
                placeholder="Search matches..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-full sm:w-64"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="h-12 px-4 rounded-lg border-2 border-cyan-500/30 bg-black/50 text-sm font-mono text-white focus:border-cyan-400 focus:outline-none"
            >
              <option value="all">All Status</option>
              <option value="won">Won</option>
              <option value="lost">Lost</option>
              <option value="pending">Pending</option>
              <option value="void">Void</option>
            </select>
          </div>
          <Button onClick={exportToCSV} variant="outline" size="sm" className="font-mono">
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
        </div>

        {/* Journal Table */}
        {paginatedEntries.length > 0 ? (
          <Card className="border-cyan-500/20 bg-black/60 backdrop-blur-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Match</th>
                    <th>Underdog</th>
                    <th>Odds</th>
                    <th>Units</th>
                    <th>Stake</th>
                    <th>Edge</th>
                    <th>Result</th>
                    <th>P/L</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedEntries.map((entry) => (
                    <motion.tr
                      key={entry.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="group hover:bg-cyan-500/5 transition-colors"
                    >
                      <td className="text-cyan-400/70">{formatDate(entry.date)}</td>
                      <td>
                        <div className="flex flex-col">
                          <span className="text-xs text-cyan-400/50">{entry.tournament}</span>
                          <span className={entry.underdog === entry.player1 ? "text-green-400" : "text-white"}>
                            {entry.player1} vs {entry.player2}
                          </span>
                        </div>
                      </td>
                      <td className="text-green-400">{entry.underdog}</td>
                      <td className="text-white">{entry.odds.toFixed(2)}</td>
                      <td>
                        <Badge variant={entry.confidence.toLowerCase() as any}>{entry.units}</Badge>
                      </td>
                      <td className="text-white">{formatCurrency(entry.stakeAmount)}</td>
                      <td className="text-cyan-400">+{entry.edgePercent}%</td>
                      <td>
                        <StatusBadge 
                          label={entry.result.toUpperCase()} 
                          status={entry.result as any} 
                        />
                      </td>
                      <td className={entry.profitLoss > 0 ? "text-green-400" : entry.profitLoss < 0 ? "text-red-400" : "text-gray-400"}>
                        {entry.profitLoss > 0 ? "+" : ""}{formatCurrency(entry.profitLoss)}
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between p-4 border-t border-cyan-500/10">
              <span className="text-sm font-mono text-cyan-400/60">
                Showing {(currentPage - 1) * entriesPerPage + 1} to {Math.min(currentPage * entriesPerPage, filteredEntries.length)} of {filteredEntries.length}
              </span>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <span className="text-sm font-mono text-white px-4">
                  {currentPage} / {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </Card>
        ) : (
          <EmptyState
            title="NO ENTRIES FOUND"
            description="No journal entries match your current filters"
            variant="no-data"
          />
        )}
      </div>
    </div>
  );
}