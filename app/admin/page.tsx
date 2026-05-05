"use client";

import AppShell from "@/components/app-shell";
import PageHeader from "@/components/page-header";
import { rolls, machines, shapes, grindingLogs } from "@/lib/data";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PlusCircle, Pencil, Trash2, Server, Layers, Triangle, Settings2, ChevronDown } from "lucide-react";

type AdminTab = "rolls" | "machines" | "shapes" | "system";

const TABS = [
  { key: "rolls" as const, label: "Roll Master", icon: Layers },
  { key: "machines" as const, label: "Machine Master", icon: Server },
  { key: "shapes" as const, label: "Shape Master", icon: Triangle },
  { key: "system" as const, label: "System Settings", icon: Settings2 },
];

function TableWrapper({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden">
      <div className="overflow-x-auto">{children}</div>
    </div>
  );
}

function ActionButtons() {
  return (
    <div className="flex gap-1.5">
      <button className="p-1.5 text-muted-foreground hover:text-primary transition-colors rounded-md hover:bg-primary/10"><Pencil size={13} /></button>
      <button className="p-1.5 text-muted-foreground hover:text-destructive transition-colors rounded-md hover:bg-destructive/10"><Trash2 size={13} /></button>
    </div>
  );
}

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<AdminTab>("rolls");
  const [showAddRoll, setShowAddRoll] = useState(false);

  return (
    <AppShell>
      <div className="p-4 md:p-6 pt-16 lg:pt-6">
        <PageHeader
          title="Admin Panel"
          description="Manage master data, system configurations and user access"
        />

        {/* Stats bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          {[
            { label: "Total Rolls", value: rolls.length },
            { label: "Grinding Machines", value: machines.length },
            { label: "Shape Profiles", value: shapes.length },
            { label: "Log Entries", value: grindingLogs.length },
          ].map(({ label, value }) => (
            <div key={label} className="bg-card border border-border rounded-lg p-3">
              <div className="text-2xl font-bold text-foreground">{value}</div>
              <div className="text-xs text-muted-foreground mt-0.5">{label}</div>
            </div>
          ))}
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-1 mb-5 bg-secondary/50 p-1 rounded-lg w-fit">
          {TABS.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={cn(
                "flex items-center gap-2 px-3 py-2 rounded-md text-xs font-medium transition-all",
                activeTab === key
                  ? "bg-card text-foreground shadow-sm border border-border"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Icon size={13} />
              {label}
            </button>
          ))}
        </div>

        {/* Roll Master Tab */}
        {activeTab === "rolls" && (
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-semibold text-foreground">Roll Master Table</h2>
              <Button size="sm" className="gap-1.5 h-8" onClick={() => setShowAddRoll(!showAddRoll)}>
                <PlusCircle size={13} /> Add Roll
              </Button>
            </div>

            {showAddRoll && (
              <div className="bg-card border border-primary/30 rounded-lg p-4 mb-4">
                <h3 className="text-sm font-semibold text-foreground mb-4">New Roll Entry</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {[
                    { label: "Roll No", placeholder: "WR-2407" },
                    { label: "Manufacturer", placeholder: "Nippon Steel" },
                    { label: "Material Grade", placeholder: "HSS" },
                    { label: "Max Diameter (mm)", placeholder: "650", type: "number" },
                    { label: "Min Diameter (mm)", placeholder: "580", type: "number" },
                  ].map(({ label, placeholder, type }) => (
                    <div key={label} className="flex flex-col gap-1.5">
                      <label className="text-xs text-muted-foreground">{label}</label>
                      <Input type={type || "text"} placeholder={placeholder} className="bg-secondary border-border text-sm h-8" />
                    </div>
                  ))}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs text-muted-foreground">Roll Type</label>
                    <div className="relative">
                      <select className="w-full appearance-none bg-secondary border border-border text-foreground text-sm rounded-md px-3 py-1.5 pr-8 focus:outline-none focus:ring-1 focus:ring-primary h-8">
                        <option>Work Roll</option>
                        <option>Intermediate Roll</option>
                        <option>Backup Roll</option>
                      </select>
                      <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                    </div>
                  </div>
                </div>
                <div className="flex gap-2 mt-4">
                  <Button size="sm" className="h-8">Save Roll</Button>
                  <Button size="sm" variant="outline" className="h-8" onClick={() => setShowAddRoll(false)}>Cancel</Button>
                </div>
              </div>
            )}

            <TableWrapper>
              <table className="w-full text-xs">
                <thead>
                  <tr className="bg-secondary/50 border-b border-border">
                    {["Roll No", "Type", "Manufacturer", "Grade", "Max Ø", "Min Ø", "Curr Ø", "Status", "Actions"].map((h) => (
                      <th key={h} className="text-left text-muted-foreground font-medium py-2.5 px-3 whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {rolls.map((r) => (
                    <tr key={r.id} className="border-b border-border/30 hover:bg-secondary/40 transition-colors">
                      <td className="py-2.5 px-3 font-semibold text-foreground">{r.rollNo}</td>
                      <td className="py-2.5 px-3 text-muted-foreground">{r.rollType.replace(" Roll", "")}</td>
                      <td className="py-2.5 px-3 text-muted-foreground">{r.manufacturer}</td>
                      <td className="py-2.5 px-3 text-muted-foreground">{r.materialGrade}</td>
                      <td className="py-2.5 px-3 text-muted-foreground">{r.maxDia}</td>
                      <td className="py-2.5 px-3 text-muted-foreground">{r.minDia}</td>
                      <td className="py-2.5 px-3 text-foreground">{r.currentDia}</td>
                      <td className="py-2.5 px-3">
                        <span className={cn("px-2 py-0.5 rounded-full text-[10px] font-medium", r.status === "Active" ? "bg-[oklch(0.72_0.18_145)]/15 text-[oklch(0.72_0.18_145)]" : r.status === "Scrap" ? "bg-destructive/15 text-destructive" : r.status === "In-Use" ? "bg-primary/15 text-primary" : "bg-[oklch(0.74_0.18_55)]/15 text-[oklch(0.74_0.18_55)]")}>
                          {r.status}
                        </span>
                      </td>
                      <td className="py-2.5 px-3"><ActionButtons /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </TableWrapper>
          </div>
        )}

        {/* Machine Master Tab */}
        {activeTab === "machines" && (
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-semibold text-foreground">Machine Master Table</h2>
              <Button size="sm" className="gap-1.5 h-8">
                <PlusCircle size={13} /> Add Machine
              </Button>
            </div>
            <TableWrapper>
              <table className="w-full text-xs">
                <thead>
                  <tr className="bg-secondary/50 border-b border-border">
                    {["ID", "Machine No", "Type", "Location", "Actions"].map((h) => (
                      <th key={h} className="text-left text-muted-foreground font-medium py-2.5 px-3">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {machines.map((m) => (
                    <tr key={m.id} className="border-b border-border/30 hover:bg-secondary/40 transition-colors">
                      <td className="py-2.5 px-3 text-muted-foreground font-mono">{m.id}</td>
                      <td className="py-2.5 px-3 font-semibold text-foreground">{m.machineNo}</td>
                      <td className="py-2.5 px-3 text-muted-foreground">{m.machineType}</td>
                      <td className="py-2.5 px-3 text-muted-foreground">{m.location}</td>
                      <td className="py-2.5 px-3"><ActionButtons /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </TableWrapper>
          </div>
        )}

        {/* Shape Master Tab */}
        {activeTab === "shapes" && (
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-semibold text-foreground">Shape Profile Master</h2>
              <Button size="sm" className="gap-1.5 h-8">
                <PlusCircle size={13} /> Add Shape
              </Button>
            </div>
            <TableWrapper>
              <table className="w-full text-xs">
                <thead>
                  <tr className="bg-secondary/50 border-b border-border">
                    {["ID", "Shape Name", "Description", "Actions"].map((h) => (
                      <th key={h} className="text-left text-muted-foreground font-medium py-2.5 px-3">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {shapes.map((s) => (
                    <tr key={s.id} className="border-b border-border/30 hover:bg-secondary/40 transition-colors">
                      <td className="py-2.5 px-3 text-muted-foreground font-mono">{s.id}</td>
                      <td className="py-2.5 px-3 font-semibold text-foreground">{s.shapeName}</td>
                      <td className="py-2.5 px-3 text-muted-foreground">{s.description}</td>
                      <td className="py-2.5 px-3"><ActionButtons /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </TableWrapper>
          </div>
        )}

        {/* System Settings Tab */}
        {activeTab === "system" && (
          <div className="space-y-4">
            <h2 className="text-sm font-semibold text-foreground">System Configuration</h2>

            {[
              {
                section: "Alert Thresholds",
                fields: [
                  { label: "Max Grinding Loss Alert (mm)", value: "4", hint: "Alert when single grinding exceeds this value" },
                  { label: "Near-Scrap Buffer (mm)", value: "5", hint: "Alert when remaining dia is below this threshold" },
                  { label: "Min Daily Rolls per Machine", value: "4", hint: "Alert if daily roll count falls below target" },
                ],
              },
              {
                section: "Production Targets",
                fields: [
                  { label: "Daily Tonnage Target (T)", value: "20000", hint: "Target total daily tonnage rolled" },
                  { label: "Max Avg Grinding Loss (mm)", value: "4.5", hint: "Alert if average loss exceeds this" },
                ],
              },
            ].map(({ section, fields }) => (
              <div key={section} className="bg-card border border-border rounded-lg p-4">
                <h3 className="text-sm font-semibold text-foreground mb-4">{section}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {fields.map(({ label, value, hint }) => (
                    <div key={label} className="flex flex-col gap-1.5">
                      <label className="text-xs font-medium text-muted-foreground">{label}</label>
                      <Input defaultValue={value} className="bg-secondary border-border text-sm h-8" />
                      {hint && <span className="text-[10px] text-muted-foreground">{hint}</span>}
                    </div>
                  ))}
                </div>
                <div className="mt-4">
                  <Button size="sm" className="h-8">Save {section}</Button>
                </div>
              </div>
            ))}

            {/* User Roles */}
            <div className="bg-card border border-border rounded-lg p-4">
              <h3 className="text-sm font-semibold text-foreground mb-4">User Access Roles</h3>
              <div className="space-y-2">
                {[
                  { role: "Operator", access: "Log entry, view own entries", color: "bg-primary/15 text-primary" },
                  { role: "Supervisor", access: "All operator rights + daily reports + alerts", color: "bg-[oklch(0.70_0.16_185)]/15 text-[oklch(0.70_0.16_185)]" },
                  { role: "Manager", access: "All supervisor rights + analytics + inventory", color: "bg-[oklch(0.74_0.18_55)]/15 text-[oklch(0.74_0.18_55)]" },
                  { role: "Admin", access: "Full system access including master data", color: "bg-[oklch(0.58_0.22_25)]/15 text-destructive" },
                ].map(({ role, access, color }) => (
                  <div key={role} className="flex items-center justify-between py-2.5 border-b border-border/30 last:border-0">
                    <div className="flex items-center gap-3">
                      <span className={cn("text-xs font-semibold px-2.5 py-1 rounded-full", color)}>{role}</span>
                      <span className="text-xs text-muted-foreground">{access}</span>
                    </div>
                    <button className="text-xs text-primary hover:underline">Edit</button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
