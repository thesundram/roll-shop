"use client";

import AppShell from "@/components/app-shell";
import PageHeader from "@/components/page-header";
import { rolls, getRollLogs, getMachineName, getShapeName, computeRemainingLife } from "@/lib/data";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts";
import { ChevronDown, TrendingDown, Zap, Settings } from "lucide-react";

const tooltipStyle = {
  backgroundColor: "oklch(0.17 0.01 240)",
  border: "1px solid oklch(0.24 0.01 240)",
  borderRadius: "6px",
  color: "oklch(0.92 0.01 220)",
  fontSize: "12px",
};
const axisStyle = { fill: "oklch(0.58 0.01 220)", fontSize: 11 };

export default function RollHistoryPage() {
  const [selectedRollId, setSelectedRollId] = useState(rolls[0]?.id ?? "");
  const roll = rolls.find((r) => r.id === selectedRollId)!;
  const logs = getRollLogs(selectedRollId);

  const chartData = logs
    .sort((a, b) => a.date.localeCompare(b.date))
    .map((log, idx) => ({
      grind: `G${idx + 1}`,
      date: log.date.slice(5),
      dia: log.finalDia,
      loss: log.grindingLoss,
      tonnage: log.tonnageRolled,
      cumulativeTonnage: logs
        .slice(0, idx + 1)
        .reduce((s, l) => s + l.tonnageRolled, 0),
    }));

  const avgLoss = logs.length
    ? +(logs.reduce((s, l) => s + l.grindingLoss, 0) / logs.length).toFixed(2)
    : 0;

  return (
    <AppShell>
      <div className="p-4 md:p-6 pt-16 lg:pt-6">
        <PageHeader
          title="Roll Lifecycle Tracker"
          description="Individual roll history – diameter evolution, grinding loss trend, tonnage accumulation"
        />

        {/* Roll Selector */}
        <div className="flex flex-wrap gap-2 mb-6">
          <div className="bg-card border border-border rounded-lg p-3 flex items-center gap-3 flex-1 min-w-64">
            <div className="text-xs text-muted-foreground shrink-0">Select Roll:</div>
            <div className="relative flex-1">
              <select
                value={selectedRollId}
                onChange={(e) => setSelectedRollId(e.target.value)}
                className="w-full appearance-none bg-secondary border border-border text-foreground text-sm rounded-md px-3 py-2 pr-8 focus:outline-none focus:ring-1 focus:ring-primary"
              >
                {rolls.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.rollNo} – {r.rollType} ({r.status})
                  </option>
                ))}
              </select>
              <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Roll Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          {[
            { label: "Current Diameter", value: `${roll.currentDia} mm`, icon: Settings, color: "text-primary", bg: "bg-primary/10" },
            { label: "Total Grindings", value: roll.totalGrindings, icon: Settings, color: "text-[oklch(0.70_0.16_185)]", bg: "bg-[oklch(0.70_0.16_185)]/10" },
            { label: "Life Consumed", value: `${((roll.maxDia - roll.currentDia) / (roll.maxDia - roll.minDia) * 100).toFixed(0)}%`, icon: TrendingDown, color: "text-[oklch(0.74_0.18_55)]", bg: "bg-[oklch(0.74_0.18_55)]/10" },
            { label: "Est. Remaining Life", value: `${(computeRemainingLife(roll) / 1000).toFixed(1)}K T`, icon: Zap, color: "text-[oklch(0.72_0.18_145)]", bg: "bg-[oklch(0.72_0.18_145)]/10" },
          ].map(({ label, value, icon: Icon, color, bg }) => (
            <div key={label} className="bg-card border border-border rounded-lg p-4">
              <div className={cn("w-8 h-8 rounded-md flex items-center justify-center mb-2", bg)}>
                <Icon size={15} className={color} />
              </div>
              <div className="text-lg font-bold text-foreground">{value}</div>
              <div className="text-xs text-muted-foreground mt-0.5">{label}</div>
            </div>
          ))}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
          {/* Diameter Evolution */}
          <div className="bg-card border border-border rounded-lg p-4">
            <h3 className="text-sm font-semibold text-foreground mb-3">Diameter Evolution</h3>
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={chartData} margin={{ top: 4, right: 8, left: -8, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.24 0.01 240)" />
                  <XAxis dataKey="grind" tick={axisStyle} />
                  <YAxis domain={[roll.minDia - 5, roll.maxDia + 5]} tick={axisStyle} />
                  <Tooltip contentStyle={tooltipStyle} formatter={(v) => [`${v} mm`, "Diameter"]} labelFormatter={(l) => `Grinding ${l}`} />
                  <ReferenceLine y={roll.minDia} stroke="oklch(0.58 0.22 25)" strokeDasharray="4 2" label={{ value: "Min Dia", fill: "oklch(0.58 0.22 25)", fontSize: 10 }} />
                  <Line type="monotone" dataKey="dia" stroke="oklch(0.62 0.18 240)" strokeWidth={2} dot={{ r: 4, fill: "oklch(0.62 0.18 240)" }} name="Diameter (mm)" />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-48 flex items-center justify-center text-muted-foreground text-sm">No grinding history for this roll</div>
            )}
          </div>

          {/* Grinding Loss Trend */}
          <div className="bg-card border border-border rounded-lg p-4">
            <h3 className="text-sm font-semibold text-foreground mb-3">Grinding Loss per Cycle</h3>
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={chartData} margin={{ top: 4, right: 8, left: -8, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.24 0.01 240)" />
                  <XAxis dataKey="grind" tick={axisStyle} />
                  <YAxis tick={axisStyle} />
                  <Tooltip contentStyle={tooltipStyle} formatter={(v) => [`${v} mm`, "Loss"]} />
                  <ReferenceLine y={avgLoss} stroke="oklch(0.70 0.16 185)" strokeDasharray="4 2" label={{ value: `Avg ${avgLoss}`, fill: "oklch(0.70 0.16 185)", fontSize: 10 }} />
                  <Line type="monotone" dataKey="loss" stroke="oklch(0.65 0.22 25)" strokeWidth={2} dot={{ r: 4, fill: "oklch(0.65 0.22 25)" }} name="Grinding Loss (mm)" />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-48 flex items-center justify-center text-muted-foreground text-sm">No data available</div>
            )}
          </div>
        </div>

        {/* Cumulative Tonnage */}
        {chartData.length > 0 && (
          <div className="bg-card border border-border rounded-lg p-4 mb-6">
            <h3 className="text-sm font-semibold text-foreground mb-3">Cumulative Tonnage Rolled</h3>
            <ResponsiveContainer width="100%" height={180}>
              <LineChart data={chartData} margin={{ top: 4, right: 8, left: -8, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.24 0.01 240)" />
                <XAxis dataKey="grind" tick={axisStyle} />
                <YAxis tick={axisStyle} tickFormatter={(v) => `${(v / 1000).toFixed(0)}K`} />
                <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => [`${v.toLocaleString()} T`, "Cumulative Tonnage"]} />
                <Line type="monotone" dataKey="cumulativeTonnage" stroke="oklch(0.70 0.16 185)" strokeWidth={2} fill="oklch(0.70 0.16 185)/10" dot={{ r: 3 }} name="Cumulative Tonnage" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Grinding History Table */}
        <div className="bg-card border border-border rounded-lg overflow-hidden">
          <div className="px-4 py-3 border-b border-border bg-secondary/50">
            <h3 className="text-sm font-semibold text-foreground">Grinding History – {roll.rollNo}</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-border/50">
                  {["#", "Date", "Machine", "Shape", "Init Ø", "Final Ø", "Loss", "Tonnage", "Operator", "Remarks"].map((h) => (
                    <th key={h} className="text-left text-muted-foreground font-medium py-2.5 px-3 whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {logs.sort((a, b) => b.date.localeCompare(a.date)).map((log, idx) => (
                  <tr key={log.id} className="border-b border-border/20 hover:bg-secondary/40 transition-colors">
                    <td className="py-2.5 px-3 text-muted-foreground">{logs.length - idx}</td>
                    <td className="py-2.5 px-3 text-foreground font-medium">{log.date}</td>
                    <td className="py-2.5 px-3 text-muted-foreground">{getMachineName(log.machineId)}</td>
                    <td className="py-2.5 px-3 text-muted-foreground">{getShapeName(log.shapeId)}</td>
                    <td className="py-2.5 px-3 text-foreground">{log.initialDia}</td>
                    <td className="py-2.5 px-3 text-foreground">{log.finalDia}</td>
                    <td className="py-2.5 px-3">
                      <span className={cn("font-bold", log.grindingLoss > 4 ? "text-destructive" : "text-[oklch(0.72_0.18_145)]")}>
                        {log.grindingLoss} mm
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-foreground">{log.tonnageRolled.toLocaleString()}</td>
                    <td className="py-2.5 px-3 text-muted-foreground">{log.operatorName || "—"}</td>
                    <td className="py-2.5 px-3 text-muted-foreground max-w-40 truncate">{log.remarks || "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {logs.length === 0 && (
              <div className="text-center text-muted-foreground text-sm py-10">No grinding records found for this roll</div>
            )}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
