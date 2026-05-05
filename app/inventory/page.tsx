"use client";

import AppShell from "@/components/app-shell";
import PageHeader from "@/components/page-header";
import { rolls, computeRemainingLife, type RollType, type RollStatus } from "@/lib/data";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Search, AlertTriangle, CheckCircle2, Clock, Trash2 } from "lucide-react";

const statusConfig: Record<RollStatus, { label: string; className: string; icon: React.ReactNode }> = {
  Active: {
    label: "Active",
    className: "bg-[oklch(0.72_0.18_145)]/15 text-[oklch(0.72_0.18_145)] border-[oklch(0.72_0.18_145)]/30",
    icon: <CheckCircle2 size={11} />,
  },
  "In-Use": {
    label: "In-Use",
    className: "bg-[oklch(0.62_0.18_240)]/15 text-[oklch(0.62_0.18_240)] border-[oklch(0.62_0.18_240)]/30",
    icon: <Clock size={11} />,
  },
  "Under Maintenance": {
    label: "Maintenance",
    className: "bg-[oklch(0.74_0.18_55)]/15 text-[oklch(0.74_0.18_55)] border-[oklch(0.74_0.18_55)]/30",
    icon: <Clock size={11} />,
  },
  Scrap: {
    label: "Scrap",
    className: "bg-[oklch(0.58_0.22_25)]/15 text-[oklch(0.58_0.22_25)] border-[oklch(0.58_0.22_25)]/30",
    icon: <Trash2 size={11} />,
  },
};

function DiaMeter({ current, min, max }: { current: number; min: number; max: number }) {
  const range = max - min;
  const used = max - current;
  const remaining = current - min;
  const pct = (remaining / range) * 100;
  return (
    <div>
      <div className="flex justify-between text-[10px] text-muted-foreground mb-1">
        <span>{current} mm</span>
        <span>{remaining.toFixed(0)} mm left</span>
      </div>
      <div className="h-1.5 bg-secondary rounded-full overflow-hidden w-24">
        <div
          className={cn("h-full rounded-full transition-all", pct < 15 ? "bg-[oklch(0.58_0.22_25)]" : pct < 30 ? "bg-[oklch(0.74_0.18_55)]" : "bg-[oklch(0.62_0.18_240)]")}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

export default function InventoryPage() {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<"All" | RollType>("All");
  const [statusFilter, setStatusFilter] = useState<"All" | RollStatus>("All");
  const [selectedRoll, setSelectedRoll] = useState<typeof rolls[0] | null>(null);

  const filtered = rolls.filter((r) => {
    const matchSearch = !search || r.rollNo.toLowerCase().includes(search.toLowerCase()) || r.manufacturer.toLowerCase().includes(search.toLowerCase()) || r.materialGrade.toLowerCase().includes(search.toLowerCase());
    const matchType = typeFilter === "All" || r.rollType === typeFilter;
    const matchStatus = statusFilter === "All" || r.status === statusFilter;
    return matchSearch && matchType && matchStatus;
  });

  return (
    <AppShell>
      <div className="p-4 md:p-6 pt-16 lg:pt-6">
        <PageHeader
          title="Roll Inventory"
          description="Complete roll master inventory with lifecycle status and diameter tracking"
        />

        {/* Summary */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
          {(["Active", "In-Use", "Under Maintenance", "Scrap"] as RollStatus[]).map((s) => {
            const count = rolls.filter((r) => r.status === s).length;
            const cfg = statusConfig[s];
            return (
              <div
                key={s}
                className={cn("border rounded-lg p-3 cursor-pointer transition-all", cfg.className, statusFilter === s ? "ring-1 ring-current" : "")}
                onClick={() => setStatusFilter(statusFilter === s ? "All" : s)}
              >
                <div className="flex items-center gap-1.5 mb-1">{cfg.icon}<span className="text-xs font-medium">{cfg.label}</span></div>
                <div className="text-2xl font-bold">{count}</div>
              </div>
            );
          })}
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <div className="relative flex-1 min-w-48">
            <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search roll no, manufacturer..." className="pl-8 bg-secondary border-border text-sm h-8" />
          </div>
          <div className="flex gap-1">
            {(["All", "Work Roll", "Intermediate Roll", "Backup Roll"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTypeFilter(t as typeof typeFilter)}
                className={cn("px-2.5 py-1 rounded text-xs transition-colors", typeFilter === t ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground hover:text-foreground")}
              >
                {t === "All" ? "All Types" : t.replace(" Roll", "")}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
          {/* Table */}
          <div className={cn("xl:col-span-2 bg-card border border-border rounded-lg overflow-hidden", selectedRoll && "xl:col-span-2")}>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="bg-secondary/50 border-b border-border">
                    {["Roll No", "Type", "Manufacturer", "Grade", "Curr Ø", "Life", "Grindings", "Tonnage", "Status"].map((h) => (
                      <th key={h} className="text-left text-muted-foreground font-medium py-2.5 px-3 whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((roll) => {
                    const remaining = computeRemainingLife(roll);
                    const isNearScrap = roll.currentDia - roll.minDia <= 5;
                    const cfg = statusConfig[roll.status];
                    return (
                      <tr
                        key={roll.id}
                        onClick={() => setSelectedRoll(selectedRoll?.id === roll.id ? null : roll)}
                        className={cn("border-b border-border/30 hover:bg-secondary/50 cursor-pointer transition-colors", selectedRoll?.id === roll.id && "bg-primary/5 border-l-2 border-l-primary")}
                      >
                        <td className="py-2.5 px-3 font-semibold text-foreground">{roll.rollNo}</td>
                        <td className="py-2.5 px-3 text-muted-foreground">{roll.rollType.replace(" Roll", "")}</td>
                        <td className="py-2.5 px-3 text-muted-foreground">{roll.manufacturer}</td>
                        <td className="py-2.5 px-3 text-muted-foreground">{roll.materialGrade}</td>
                        <td className="py-2.5 px-3">
                          <DiaMeter current={roll.currentDia} min={roll.minDia} max={roll.maxDia} />
                        </td>
                        <td className="py-2.5 px-3">
                          <span className={cn("font-medium", remaining < 50000 ? "text-[oklch(0.58_0.22_25)]" : "text-foreground")}>
                            {(remaining / 1000).toFixed(0)}K T
                          </span>
                        </td>
                        <td className="py-2.5 px-3 text-muted-foreground">{roll.totalGrindings}</td>
                        <td className="py-2.5 px-3 text-muted-foreground">{(roll.totalTonnage / 1000).toFixed(0)}K</td>
                        <td className="py-2.5 px-3">
                          <span className={cn("flex items-center gap-1 px-2 py-0.5 rounded-full border text-[10px] font-medium w-fit", cfg.className)}>
                            {cfg.icon}{cfg.label}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              {filtered.length === 0 && (
                <div className="text-center text-muted-foreground text-sm py-12">No rolls match your filters</div>
              )}
            </div>
          </div>

          {/* Detail Panel */}
          {selectedRoll && (
            <div className="bg-card border border-border rounded-lg p-4">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-bold text-foreground">{selectedRoll.rollNo}</h3>
                  <p className="text-xs text-muted-foreground">{selectedRoll.rollType}</p>
                </div>
                <button onClick={() => setSelectedRoll(null)} className="text-muted-foreground hover:text-foreground text-lg leading-none">×</button>
              </div>

              <div className="space-y-3 text-xs">
                {[
                  ["Manufacturer", selectedRoll.manufacturer],
                  ["Material Grade", selectedRoll.materialGrade],
                  ["Max Diameter", `${selectedRoll.maxDia} mm`],
                  ["Min Diameter", `${selectedRoll.minDia} mm`],
                  ["Current Diameter", `${selectedRoll.currentDia} mm`],
                  ["Total Grindings", selectedRoll.totalGrindings],
                  ["Total Tonnage", `${selectedRoll.totalTonnage.toLocaleString()} T`],
                ].map(([label, value]) => (
                  <div key={label as string} className="flex justify-between py-2 border-b border-border/30">
                    <span className="text-muted-foreground">{label}</span>
                    <span className="text-foreground font-medium">{value}</span>
                  </div>
                ))}
              </div>

              <div className="mt-4">
                <div className="text-xs text-muted-foreground mb-1.5">Diameter Remaining</div>
                <div className="h-2 bg-secondary rounded-full overflow-hidden">
                  <div
                    className={cn("h-full rounded-full", selectedRoll.currentDia - selectedRoll.minDia <= 5 ? "bg-destructive" : selectedRoll.currentDia - selectedRoll.minDia <= 20 ? "bg-[oklch(0.74_0.18_55)]" : "bg-primary")}
                    style={{ width: `${((selectedRoll.currentDia - selectedRoll.minDia) / (selectedRoll.maxDia - selectedRoll.minDia)) * 100}%` }}
                  />
                </div>
                <div className="flex justify-between text-[10px] text-muted-foreground mt-1">
                  <span>Min: {selectedRoll.minDia}</span>
                  <span className="font-medium text-foreground">{selectedRoll.currentDia} mm</span>
                  <span>Max: {selectedRoll.maxDia}</span>
                </div>
              </div>

              <div className="mt-4 p-3 bg-secondary/50 rounded-md border border-border">
                <div className="text-xs text-muted-foreground mb-1">Est. Remaining Life</div>
                <div className="text-2xl font-bold text-foreground">
                  {(computeRemainingLife(selectedRoll) / 1000).toFixed(1)}K <span className="text-sm font-normal text-muted-foreground">tonnes</span>
                </div>
              </div>

              {selectedRoll.currentDia - selectedRoll.minDia <= 5 && (
                <div className="mt-3 flex items-center gap-2 p-2.5 bg-destructive/10 border border-destructive/30 rounded-md text-xs text-destructive">
                  <AlertTriangle size={13} />
                  Near scrap limit – schedule replacement
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
}
