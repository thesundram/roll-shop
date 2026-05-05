"use client";

import { grindingLogs, rolls, getMachineName, getRollName, getShapeName, alerts } from "@/lib/data";
import { AlertTriangle, Info, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

export function RecentGrindings() {
  const recent = [...grindingLogs].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 6);
  return (
    <div className="bg-card border border-border rounded-lg p-4">
      <h3 className="text-sm font-semibold text-foreground mb-4">Recent Grinding Logs</h3>
      <div className="space-y-2">
        {recent.map((log) => (
          <div key={log.id} className="flex items-center justify-between py-2 border-b border-border/50 last:border-0">
            <div className="flex flex-col min-w-0">
              <div className="text-sm font-medium text-foreground truncate">{getRollName(log.rollId)}</div>
              <div className="text-xs text-muted-foreground">
                {getMachineName(log.machineId)} · {getShapeName(log.shapeId)}
              </div>
            </div>
            <div className="flex items-center gap-4 shrink-0 ml-3">
              <div className="text-right">
                <div className="text-xs text-muted-foreground">Loss</div>
                <div
                  className={cn(
                    "text-sm font-semibold",
                    log.grindingLoss > 4 ? "text-[oklch(0.58_0.22_25)]" : "text-[oklch(0.72_0.18_145)]"
                  )}
                >
                  {log.grindingLoss} mm
                </div>
              </div>
              <div className="text-right hidden sm:block">
                <div className="text-xs text-muted-foreground">Tonnage</div>
                <div className="text-sm font-medium text-foreground">{log.tonnageRolled.toLocaleString()} T</div>
              </div>
              <div className="text-right">
                <div className="text-xs text-muted-foreground">{log.date.slice(5)}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function AlertsPanel() {
  const recent = alerts.slice(0, 5);
  const iconMap = {
    danger: <AlertTriangle size={14} className="text-[oklch(0.58_0.22_25)]" />,
    warning: <AlertTriangle size={14} className="text-[oklch(0.74_0.18_55)]" />,
    info: <Info size={14} className="text-[oklch(0.70_0.16_185)]" />,
  };
  const bgMap = {
    danger: "bg-[oklch(0.58_0.22_25)]/10 border-[oklch(0.58_0.22_25)]/20",
    warning: "bg-[oklch(0.74_0.18_55)]/10 border-[oklch(0.74_0.18_55)]/20",
    info: "bg-[oklch(0.70_0.16_185)]/10 border-[oklch(0.70_0.16_185)]/20",
  };
  return (
    <div className="bg-card border border-border rounded-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-foreground">Active Alerts</h3>
        <span className="text-xs bg-destructive/15 text-destructive px-2 py-0.5 rounded-full font-medium">
          {alerts.filter((a) => !a.read).length} new
        </span>
      </div>
      <div className="space-y-2">
        {recent.map((alert) => (
          <div
            key={alert.id}
            className={cn(
              "flex items-start gap-2.5 p-2.5 rounded-md border text-xs",
              bgMap[alert.type],
              !alert.read && "ring-1 ring-inset ring-current/10"
            )}
          >
            <div className="mt-0.5 shrink-0">{iconMap[alert.type]}</div>
            <div className="flex-1 min-w-0">
              <p className="text-foreground leading-relaxed">{alert.message}</p>
              <p className="text-muted-foreground mt-0.5">
                {new Date(alert.timestamp).toLocaleString("en-GB", { dateStyle: "short", timeStyle: "short" })}
              </p>
            </div>
            {!alert.read && <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1 shrink-0" />}
          </div>
        ))}
      </div>
    </div>
  );
}

export function RollStatusSummary() {
  const statusGroups = {
    Active: rolls.filter((r) => r.status === "Active").length,
    "In-Use": rolls.filter((r) => r.status === "In-Use").length,
    "Under Maintenance": rolls.filter((r) => r.status === "Under Maintenance").length,
    Scrap: rolls.filter((r) => r.status === "Scrap").length,
  };
  const colorMap: Record<string, string> = {
    Active: "bg-[oklch(0.72_0.18_145)]",
    "In-Use": "bg-[oklch(0.62_0.18_240)]",
    "Under Maintenance": "bg-[oklch(0.74_0.18_55)]",
    Scrap: "bg-[oklch(0.58_0.22_25)]",
  };
  const total = rolls.length;
  return (
    <div className="bg-card border border-border rounded-lg p-4">
      <h3 className="text-sm font-semibold text-foreground mb-4">Roll Status Summary</h3>
      <div className="space-y-3">
        {Object.entries(statusGroups).map(([status, count]) => (
          <div key={status}>
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-muted-foreground">{status}</span>
              <span className="text-xs font-semibold text-foreground">{count} / {total}</span>
            </div>
            <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
              <div
                className={cn("h-full rounded-full", colorMap[status])}
                style={{ width: `${(count / total) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
