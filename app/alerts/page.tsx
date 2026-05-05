"use client";

import AppShell from "@/components/app-shell";
import PageHeader from "@/components/page-header";
import { alerts as initialAlerts, getRollById } from "@/lib/data";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { AlertTriangle, Info, CheckCircle2, Bell, BellOff } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AlertsPage() {
  const [items, setItems] = useState(initialAlerts);
  const [filter, setFilter] = useState<"all" | "unread" | "danger" | "warning" | "info">("all");

  const markRead = (id: string) => setItems((prev) => prev.map((a) => a.id === id ? { ...a, read: true } : a));
  const markAllRead = () => setItems((prev) => prev.map((a) => ({ ...a, read: true })));

  const filtered = items.filter((a) => {
    if (filter === "unread") return !a.read;
    if (filter === "danger" || filter === "warning" || filter === "info") return a.type === filter;
    return true;
  });

  const unread = items.filter((a) => !a.read).length;

  const iconMap = {
    danger: <AlertTriangle size={16} className="text-[oklch(0.58_0.22_25)]" />,
    warning: <AlertTriangle size={16} className="text-[oklch(0.74_0.18_55)]" />,
    info: <Info size={16} className="text-[oklch(0.70_0.16_185)]" />,
  };

  const bgMap = {
    danger: "border-l-[oklch(0.58_0.22_25)] bg-[oklch(0.58_0.22_25)]/5",
    warning: "border-l-[oklch(0.74_0.18_55)] bg-[oklch(0.74_0.18_55)]/5",
    info: "border-l-[oklch(0.70_0.16_185)] bg-[oklch(0.70_0.16_185)]/5",
  };

  return (
    <AppShell>
      <div className="p-4 md:p-6 pt-16 lg:pt-6">
        <PageHeader
          title="Alerts & Notifications"
          description="System alerts for roll health, machine performance and operational exceptions"
          actions={
            unread > 0 ? (
              <Button variant="outline" size="sm" className="gap-2" onClick={markAllRead}>
                <CheckCircle2 size={14} />
                Mark All Read
              </Button>
            ) : undefined
          }
        />

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          {[
            { label: "Total Alerts", count: items.length, color: "text-foreground", bg: "bg-secondary" },
            { label: "Unread", count: unread, color: "text-primary", bg: "bg-primary/10" },
            { label: "Critical", count: items.filter((a) => a.type === "danger").length, color: "text-[oklch(0.58_0.22_25)]", bg: "bg-[oklch(0.58_0.22_25)]/10" },
            { label: "Warnings", count: items.filter((a) => a.type === "warning").length, color: "text-[oklch(0.74_0.18_55)]", bg: "bg-[oklch(0.74_0.18_55)]/10" },
          ].map(({ label, count, color, bg }) => (
            <div key={label} className="bg-card border border-border rounded-lg p-3">
              <div className={cn("text-2xl font-bold", color)}>{count}</div>
              <div className="text-xs text-muted-foreground mt-0.5">{label}</div>
            </div>
          ))}
        </div>

        {/* Filter */}
        <div className="flex gap-1 mb-4 flex-wrap">
          {([
            { key: "all", label: "All" },
            { key: "unread", label: "Unread" },
            { key: "danger", label: "Critical" },
            { key: "warning", label: "Warnings" },
            { key: "info", label: "Info" },
          ] as const).map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setFilter(key)}
              className={cn("px-3 py-1.5 rounded text-xs transition-colors", filter === key ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground hover:text-foreground")}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Alert List */}
        <div className="space-y-2">
          {filtered.map((alert) => {
            const roll = alert.rollId ? getRollById(alert.rollId) : null;
            return (
              <div
                key={alert.id}
                className={cn(
                  "bg-card border border-l-4 border-border rounded-lg p-4 flex items-start gap-3 transition-all",
                  bgMap[alert.type],
                  !alert.read && "ring-1 ring-inset ring-primary/10"
                )}
              >
                <div className="mt-0.5 shrink-0">{iconMap[alert.type]}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-3">
                    <p className={cn("text-sm leading-relaxed", alert.read ? "text-muted-foreground" : "text-foreground font-medium")}>
                      {alert.message}
                    </p>
                    {!alert.read && (
                      <button
                        onClick={() => markRead(alert.id)}
                        className="shrink-0 text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors"
                      >
                        <BellOff size={12} />
                        Dismiss
                      </button>
                    )}
                  </div>
                  <div className="flex items-center gap-3 mt-1.5">
                    <span className="text-xs text-muted-foreground">
                      {new Date(alert.timestamp).toLocaleString("en-GB", { dateStyle: "medium", timeStyle: "short" })}
                    </span>
                    {roll && (
                      <span className="text-xs bg-secondary text-muted-foreground px-2 py-0.5 rounded">
                        Roll: {roll.rollNo}
                      </span>
                    )}
                    <span
                      className={cn(
                        "text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full",
                        alert.type === "danger"
                          ? "bg-[oklch(0.58_0.22_25)]/15 text-[oklch(0.58_0.22_25)]"
                          : alert.type === "warning"
                          ? "bg-[oklch(0.74_0.18_55)]/15 text-[oklch(0.74_0.18_55)]"
                          : "bg-[oklch(0.70_0.16_185)]/15 text-[oklch(0.70_0.16_185)]"
                      )}
                    >
                      {alert.type}
                    </span>
                    {alert.read && <span className="text-[10px] text-muted-foreground">Read</span>}
                  </div>
                </div>
              </div>
            );
          })}
          {filtered.length === 0 && (
            <div className="text-center py-16 text-muted-foreground">
              <Bell size={32} className="mx-auto mb-3 opacity-30" />
              <p className="text-sm">No alerts in this category</p>
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
}
