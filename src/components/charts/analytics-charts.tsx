"use client";

import { motion } from "framer-motion";
import { LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ChartProps {
  title: string;
  subtitle?: string;
  data: any[];
  type?: "line" | "area" | "bar" | "pie";
  dataKey: string;
  colors?: string[];
  height?: number;
}

const COLORS = ["#00f0ff", "#00ff88", "#a855f7", "#ff6b35", "#ff3366", "#06b6d4"];

export function AnalyticsChart({ title, subtitle, data, type = "line", dataKey, colors = COLORS, height = 300 }: ChartProps) {
  const chartColors = colors;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="border-cyan-500/20 bg-black/60 backdrop-blur-xl">
        <CardHeader>
          <CardTitle className="text-lg font-mono text-cyan-400">{title}</CardTitle>
          {subtitle && (
            <p className="text-xs font-mono text-cyan-400/50">{subtitle}</p>
          )}
        </CardHeader>
        <CardContent>
          <div style={{ height }}>
            <ResponsiveContainer width="100%" height="100%">
              {type === "line" ? (
                <LineChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,240,255,0.1)" />
                  <XAxis 
                    dataKey="name" 
                    stroke="rgba(0,240,255,0.5)" 
                    tick={{ fill: "rgba(0,240,255,0.7)", fontSize: 12 }}
                    tickLine={{ stroke: "rgba(0,240,255,0.3)" }}
                  />
                  <YAxis 
                    stroke="rgba(0,240,255,0.5)" 
                    tick={{ fill: "rgba(0,240,255,0.7)", fontSize: 12 }}
                    tickLine={{ stroke: "rgba(0,240,255,0.3)" }}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: "rgba(0,0,0,0.9)", 
                      border: "1px solid rgba(0,240,255,0.3)",
                      borderRadius: "8px",
                      color: "#00f0ff",
                      fontFamily: "JetBrains Mono, monospace",
                    }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey={dataKey} 
                    stroke={chartColors[0]} 
                    strokeWidth={3}
                    dot={{ fill: chartColors[0], strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6, fill: chartColors[0], strokeWidth: 2 }}
                  />
                </LineChart>
              ) : type === "area" ? (
                <AreaChart data={data}>
                  <defs>
                    <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={chartColors[0]} stopOpacity={0.3}/>
                      <stop offset="95%" stopColor={chartColors[0]} stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,240,255,0.1)" />
                  <XAxis 
                    dataKey="name" 
                    stroke="rgba(0,240,255,0.5)" 
                    tick={{ fill: "rgba(0,240,255,0.7)", fontSize: 12 }}
                  />
                  <YAxis 
                    stroke="rgba(0,240,255,0.5)" 
                    tick={{ fill: "rgba(0,240,255,0.7)", fontSize: 12 }}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: "rgba(0,0,0,0.9)", 
                      border: "1px solid rgba(0,240,255,0.3)",
                      borderRadius: "8px",
                      color: "#00f0ff",
                    }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey={dataKey} 
                    stroke={chartColors[0]} 
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorGradient)"
                  />
                </AreaChart>
              ) : type === "bar" ? (
                <BarChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,240,255,0.1)" />
                  <XAxis 
                    dataKey="name" 
                    stroke="rgba(0,240,255,0.5)" 
                    tick={{ fill: "rgba(0,240,255,0.7)", fontSize: 12 }}
                  />
                  <YAxis 
                    stroke="rgba(0,240,255,0.5)" 
                    tick={{ fill: "rgba(0,240,255,0.7)", fontSize: 12 }}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: "rgba(0,0,0,0.9)", 
                      border: "1px solid rgba(0,240,255,0.3)",
                      borderRadius: "8px",
                    }}
                  />
                  <Bar 
                    dataKey={dataKey} 
                    fill={chartColors[0]}
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              ) : (
                <PieChart>
                  <Pie
                    data={data}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey={dataKey}
                    label={({name, percent}) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {data.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={chartColors[index % chartColors.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: "rgba(0,0,0,0.9)", 
                      border: "1px solid rgba(0,240,255,0.3)",
                      borderRadius: "8px",
                    }}
                  />
                </PieChart>
              )}
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

interface MultiLineChartProps {
  title: string;
  subtitle?: string;
  data: any[];
  lines: { dataKey: string; color: string; name: string }[];
  height?: number;
}

export function MultiLineChart({ title, subtitle, data, lines, height = 300 }: MultiLineChartProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="border-cyan-500/20 bg-black/60 backdrop-blur-xl">
        <CardHeader>
          <CardTitle className="text-lg font-mono text-cyan-400">{title}</CardTitle>
          {subtitle && (
            <p className="text-xs font-mono text-cyan-400/50">{subtitle}</p>
          )}
        </CardHeader>
        <CardContent>
          <div style={{ height }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,240,255,0.1)" />
                <XAxis 
                  dataKey="name" 
                  stroke="rgba(0,240,255,0.5)" 
                  tick={{ fill: "rgba(0,240,255,0.7)", fontSize: 12 }}
                />
                <YAxis 
                  stroke="rgba(0,240,255,0.5)" 
                  tick={{ fill: "rgba(0,240,255,0.7)", fontSize: 12 }}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: "rgba(0,0,0,0.9)", 
                    border: "1px solid rgba(0,240,255,0.3)",
                    borderRadius: "8px",
                  }}
                />
                <Legend />
                {lines.map((line) => (
                  <Line 
                    key={line.dataKey}
                    type="monotone" 
                    dataKey={line.dataKey} 
                    stroke={line.color}
                    strokeWidth={2}
                    dot={{ fill: line.color, r: 3 }}
                    name={line.name}
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}