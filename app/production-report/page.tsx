"use client";

import AppShell from "@/components/app-shell";
import PageHeader from "@/components/page-header";
import { getDailyReport, getMachineName, getRollName, getShapeName, grindingLogs } from "@/lib/data";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { FileText, Printer } from "lucide-react";

const tooltipStyle = {
  backgroundColor: "oklch(0.17 0.01 240)",
  border: "1px solid oklch(0.24 0.01 240)",
  borderRadius: "6px",
  color: "oklch(0.92 0.01 220)",
  fontSize: "12px",
};

const axisStyle = { fill: "oklch(0.58 0.01 220)", fontSize: 11 };

export default function ProductionReportPage() {
  const availableDates = [...new Set(grindingLogs.map((l) => l.date))].sort().reverse();
  const [selectedDate, setSelectedDate] = useState(availableDates[0] || "");
  const [rollTypeFilter, setRollTypeFilter] = useState("All");

  const report = getDailyReport(selectedDate);
  const totalRolls = report.reduce((s, r) => s + r.totalRolls, 0);
  const totalTonnage = report.reduce((s, r) => s + r.totalTonnage, 0);
  const totalLoss = report.reduce((s, r) => s + r.totalGrindingLoss, 0);
  const overallAvgLoss = totalRolls ? +(totalLoss / totalRolls).toFixed(2) : 0;

  const chartData = report.map((r) => ({
    machine: r.machine.machineNo,
    rolls: r.totalRolls,
    tonnage: r.totalTonnage,
    avgLoss: r.avgLoss,
  }));

  return (
    <AppShell>
      <div className="p-4 md:p-6 pt-16 lg:pt-6">
        <PageHeader
          title="Daily Production Report"
          description="Machine-wise grinding production summary"
          actions={
            <Button variant="outline" size="sm" className="gap-2">
              <Printer size={14} />
              Print
            </Button>
          }
        />

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3 mb-6 bg-card border border-border rounded-lg p-3">
          <div className="flex items-center gap-2">
            <label className="text-xs text-muted-foreground font-medium shrink-0">Date:</label>
            <Input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="bg-secondary border-border text-sm h-8 w-40"
            />
          </div>
          <div className="flex items-center gap-2">
            <label className="text-xs text-muted-foreground font-medium">Available:</label>
            <div className="flex gap-1 flex-wrap">
              {availableDates.slice(0, 5).map((d) => (
                <button
                  key={d}
                  onClick={() => setSelectedDate(d)}
                  className={cn(
                    "px-2 py-0.5 rounded text-xs transition-colors",
                    selectedDate === d
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-muted-foreground hover:text-foreground"
                  )}
                >
                  {d.slice(5)}
                </button>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-1 ml-auto">
            {["All", "Work Roll", "Intermediate Roll", "Backup Roll"].map((t) => (
              <button
                key={t}
                onClick={() => setRollTypeFilter(t)}
                className={cn(
                  "px-2.5 py-1 rounded text-xs transition-colors",
                  rollTypeFilter === t
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-muted-foreground hover:text-foreground"
                )}
              >
                {t === "All" ? t : t.replace(" Roll", "")}
              </button>
            ))}
          </div>
        </div>

        {/* Summary Banner */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          {[
            { label: "Total Rolls Ground", value: totalRolls, unit: "" },
            { label: "Total Tonnage", value: totalTonnage.toLocaleString(), unit: " T" },
            { label: "Total Grinding Loss", value: totalLoss, unit: " mm" },
            { label: "Avg Grinding Loss", value: overallAvgLoss, unit: " mm" },
          ].map(({ label, value, unit }) => (
            <div key={label} className="bg-card border border-border rounded-lg p-3 text-center">
              <div className="text-xl font-bold text-foreground">{value}{unit}</div>
              <div className="text-xs text-muted-foreground mt-0.5">{label}</div>
            </div>
          ))}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="bg-card border border-border rounded-lg p-4">
            <h3 className="text-sm font-semibold mb-3 text-foreground">Rolls Ground per Machine</h3>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={chartData} margin={{ top: 4, right: 8, left: -16, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.24 0.01 240)" />
                <XAxis dataKey="machine" tick={axisStyle} />
                <YAxis tick={axisStyle} />
                <Tooltip contentStyle={tooltipStyle} />
                <Bar dataKey="rolls" fill="oklch(0.62 0.18 240)" name="Rolls" radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="bg-card border border-border rounded-lg p-4">
            <h3 className="text-sm font-semibold mb-3 text-foreground">Avg Grinding Loss per Machine</h3>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={chartData} margin={{ top: 4, right: 8, left: -16, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.24 0.01 240)" />
                <XAxis dataKey="machine" tick={axisStyle} />
                <YAxis tick={axisStyle} />
                <Tooltip contentStyle={tooltipStyle} formatter={(v) => [`${v} mm`, "Avg Loss"]} />
                <Bar dataKey="avgLoss" fill="oklch(0.65 0.22 25)" name="Avg Loss" radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Machine-wise Detail Table */}
        {report.map((r) => (
          <div key={r.machine.id} className="bg-card border border-border rounded-lg mb-4 overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 bg-secondary/50 border-b border-border">
              <div className="flex items-center gap-3">
                <FileText size={15} className="text-primary" />
                <span className="font-semibold text-sm text-foreground">{r.machine.machineNo}</span>
                <span className="text-xs text-muted-foreground">{r.machine.machineType} · {r.machine.location}</span>
              </div>
              <div className="flex items-center gap-4 text-xs">
                <span className="text-muted-foreground">Rolls: <span className="text-foreground font-semibold">{r.totalRolls}</span></span>
                <span className="text-muted-foreground">Loss: <span className={cn("font-semibold", r.avgLoss > 4 ? "text-destructive" : "text-[oklch(0.72_0.18_145)]")}>{r.avgLoss} mm avg</span></span>
                <span className="text-muted-foreground">Tonnage: <span className="text-foreground font-semibold">{r.totalTonnage.toLocaleString()} T</span></span>
              </div>
            </div>

            {r.logs.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-border/50">
                      {["Roll No", "Type", "Shape", "Init Ø (mm)", "Final Ø (mm)", "Grinding Loss", "Tonnage (T)", "Operator", "Remarks"].map((h) => (
                        <th key={h} className="text-left text-muted-foreground font-medium py-2 px-3 whitespace-nowrap">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {r.logs.map((log) => {
                      const roll = null;
                      return (
                        <tr key={log.id} className="border-b border-border/20 hover:bg-secondary/40 transition-colors">
                          <td className="py-2 px-3 font-medium text-foreground">{getRollName(log.rollId)}</td>
                          <td className="py-2 px-3 text-muted-foreground">—</td>
                          <td className="py-2 px-3 text-muted-foreground">{getShapeName(log.shapeId)}</td>
                          <td className="py-2 px-3 text-foreground">{log.initialDia}</td>
                          <td className="py-2 px-3 text-foreground">{log.finalDia}</td>
                          <td className="py-2 px-3">
                            <span className={cn("font-bold", log.grindingLoss > 4 ? "text-destructive" : "text-[oklch(0.72_0.18_145)]")}>
                              {log.grindingLoss} mm
                            </span>
                          </td>
                          <td className="py-2 px-3 text-foreground">{log.tonnageRolled.toLocaleString()}</td>
                          <td className="py-2 px-3 text-muted-foreground">{log.operatorName || "—"}</td>
                          <td className="py-2 px-3 text-muted-foreground">{log.remarks || "—"}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                  <tfoot>
                    <tr className="bg-secondary/30">
                      <td colSpan={5} className="px-3 py-2 text-xs font-semibold text-muted-foreground">Total</td>
                      <td className="px-3 py-2 text-xs font-bold text-foreground">{r.totalGrindingLoss} mm</td>
                      <td className="px-3 py-2 text-xs font-bold text-foreground">{r.totalTonnage.toLocaleString()} T</td>
                      <td colSpan={2} />
                    </tr>
                  </tfoot>
                </table>
              </div>
            ) : (
              <div className="px-4 py-6 text-sm text-muted-foreground text-center">
                No grinding activity on this date
              </div>
            )}
          </div>
        ))}
      </div>
    </AppShell>
  );
}
