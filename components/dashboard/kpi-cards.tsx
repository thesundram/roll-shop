"use client";

import { getKPIs } from "@/lib/data";
import { Layers, Cpu, TrendingDown, Zap, AlertTriangle, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

const kpiConfig = [
  {
    label: "Total Rolls",
    key: "totalRolls",
    icon: Layers,
    color: "text-[oklch(0.62_0.18_240)]",
    bg: "bg-[oklch(0.62_0.18_240)]/10",
    suffix: "",
  },
  {
    label: "Active Rolls",
    key: "activeRolls",
    icon: CheckCircle2,
    color: "text-[oklch(0.72_0.18_145)]",
    bg: "bg-[oklch(0.72_0.18_145)]/10",
    suffix: "",
  },
  {
    label: "Total Grindings",
    key: "totalGrindings",
    icon: Cpu,
    color: "text-[oklch(0.74_0.18_55)]",
    bg: "bg-[oklch(0.74_0.18_55)]/10",
    suffix: "",
  },
  {
    label: "Total Tonnage",
    key: "totalTonnage",
    icon: Zap,
    color: "text-[oklch(0.62_0.18_240)]",
    bg: "bg-[oklch(0.62_0.18_240)]/10",
    suffix: " T",
    format: (v: number) => (v / 1000).toFixed(1) + "K",
  },
  {
    label: "Avg Grinding Loss",
    key: "avgGrindingLoss",
    icon: TrendingDown,
    color: "text-[oklch(0.70_0.16_185)]",
    bg: "bg-[oklch(0.70_0.16_185)]/10",
    suffix: " mm",
  },
  {
    label: "Near Scrap",
    key: "nearScrap",
    icon: AlertTriangle,
    color: "text-[oklch(0.58_0.22_25)]",
    bg: "bg-[oklch(0.58_0.22_25)]/10",
    suffix: " rolls",
  },
];

export default function KpiCards() {
  const kpis = getKPIs();

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3">
      {kpiConfig.map(({ label, key, icon: Icon, color, bg, suffix, format }) => {
        const raw = kpis[key as keyof typeof kpis] as number;
        const display = format ? format(raw) : raw.toLocaleString();
        return (
          <div
            key={key}
            className="bg-card border border-border rounded-lg p-4 flex flex-col gap-2 hover:border-primary/40 transition-colors"
          >
            <div className={cn("w-8 h-8 rounded-md flex items-center justify-center", bg)}>
              <Icon size={16} className={color} />
            </div>
            <div>
              <div className="text-xl font-bold text-foreground leading-none">
                {display}
                <span className="text-xs font-normal text-muted-foreground">{suffix}</span>
              </div>
              <div className="text-xs text-muted-foreground mt-1">{label}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
