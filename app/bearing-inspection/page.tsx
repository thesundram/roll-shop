"use client";

import AppShell from "@/components/app-shell";
import PageHeader from "@/components/page-header";
import {
  bearings,
  bearingInspections,
  getBearingName,
  type BearingType,
} from "@/lib/data";
import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import {
  PlusCircle,
  CheckCircle2,
  AlertTriangle,
  Search,
  ChevronDown,
  ImagePlus,
  X,
  Droplets,
  Waves,
} from "lucide-react";

type FormData = {
  date: string;
  bearingType: BearingType | "";
  bearingId: string;
  purgeCheck: string;
  greaseCondition: string;
  sealIntegrity: string;
  oilLevel: string;
  oilCondition: string;
  constantLevelOiler: string;
  leakageCheck: string;
  totalTonnage: string;
  totalHours: string;
  remarks: string;
  inspectorName: string;
};

const emptyForm: FormData = {
  date: new Date().toISOString().split("T")[0],
  bearingType: "",
  bearingId: "",
  purgeCheck: "",
  greaseCondition: "",
  sealIntegrity: "",
  oilLevel: "",
  oilCondition: "",
  constantLevelOiler: "",
  leakageCheck: "",
  totalTonnage: "",
  totalHours: "",
  remarks: "",
  inspectorName: "",
};

// Fields whose values indicate an abnormal / attention-required condition.
const ABNORMAL_VALUES = new Set([
  "Excessive Purging",
  "Darkened",
  "Emulsified",
  "Hardened",
  "Torn",
  "Cracked",
  "Displaced",
  "Low",
  "High",
  "Cloudy",
  "Discolored",
  "Foaming",
  "Empty",
  "Vent Blocked",
  "Wrong Side",
  "Minor Leak",
  "Active Leak",
]);

function isAbnormal(value: string) {
  return ABNORMAL_VALUES.has(value);
}

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-medium text-muted-foreground">
        {label} {required && <span className="text-destructive">*</span>}
      </label>
      {children}
    </div>
  );
}

function Select({
  value,
  onChange,
  children,
  placeholder,
  flagAbnormal,
}: {
  value: string;
  onChange: (v: string) => void;
  children: React.ReactNode;
  placeholder: string;
  flagAbnormal?: boolean;
}) {
  const abnormal = flagAbnormal && isAbnormal(value);
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={cn(
          "w-full appearance-none bg-secondary border text-foreground text-sm rounded-md px-3 py-2 pr-8 focus:outline-none focus:ring-1 focus:ring-primary",
          abnormal ? "border-destructive text-destructive" : "border-border"
        )}
      >
        <option value="">{placeholder}</option>
        {children}
      </select>
      <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
    </div>
  );
}

export default function BearingInspectionPage() {
  const [form, setForm] = useState<FormData>(emptyForm);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
  const [logs, setLogs] = useState(bearingInspections);
  const [search, setSearch] = useState("");
  const [filterDate, setFilterDate] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const set = (key: keyof FormData, value: string) => {
    setForm((prev) => {
      const next = { ...prev, [key]: value };
      // Auto-fill bearing type from master when bearing selected
      if (key === "bearingId" && value) {
        const bearing = bearings.find((b) => b.id === value);
        if (bearing) next.bearingType = bearing.type;
      }
      // Reset bearing selection if type changes and current bearing doesn't match
      if (key === "bearingType") {
        const bearing = bearings.find((b) => b.id === prev.bearingId);
        if (bearing && bearing.type !== value) next.bearingId = "";
      }
      return next;
    });
    setErrors((e) => ({ ...e, [key]: undefined }));
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setImagePreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const validate = (): boolean => {
    const errs: Partial<Record<keyof FormData, string>> = {};
    if (!form.date) errs.date = "Required";
    if (!form.bearingType) errs.bearingType = "Required";
    if (!form.bearingId) errs.bearingId = "Required";
    if (form.bearingType === "Grease") {
      if (!form.purgeCheck) errs.purgeCheck = "Required";
      if (!form.greaseCondition) errs.greaseCondition = "Required";
      if (!form.sealIntegrity) errs.sealIntegrity = "Required";
    }
    if (form.bearingType === "Oil") {
      if (!form.oilLevel) errs.oilLevel = "Required";
      if (!form.oilCondition) errs.oilCondition = "Required";
      if (!form.constantLevelOiler) errs.constantLevelOiler = "Required";
      if (!form.leakageCheck) errs.leakageCheck = "Required";
    }
    if (!form.totalTonnage) errs.totalTonnage = "Required";
    if (!form.totalHours) errs.totalHours = "Required";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    const newLog = {
      id: `BI${String(logs.length + 1).padStart(3, "0")}`,
      date: form.date,
      bearingType: form.bearingType as BearingType,
      bearingId: form.bearingId,
      purgeCheck: form.bearingType === "Grease" ? form.purgeCheck : undefined,
      greaseCondition: form.bearingType === "Grease" ? form.greaseCondition : undefined,
      sealIntegrity: form.bearingType === "Grease" ? form.sealIntegrity : undefined,
      oilLevel: form.bearingType === "Oil" ? form.oilLevel : undefined,
      oilCondition: form.bearingType === "Oil" ? form.oilCondition : undefined,
      constantLevelOiler: form.bearingType === "Oil" ? form.constantLevelOiler : undefined,
      leakageCheck: form.bearingType === "Oil" ? form.leakageCheck : undefined,
      totalTonnage: parseInt(form.totalTonnage),
      totalHours: parseFloat(form.totalHours),
      remarks: form.remarks,
      imageUrl: imagePreview ?? undefined,
      inspectorName: form.inspectorName,
    };
    setLogs([newLog, ...logs]);
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setForm(emptyForm);
      setImagePreview(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }, 2500);
  };

  const availableBearings = form.bearingType
    ? bearings.filter((b) => b.type === form.bearingType)
    : bearings;

  const hasFlag =
    isAbnormal(form.purgeCheck) ||
    isAbnormal(form.greaseCondition) ||
    isAbnormal(form.sealIntegrity) ||
    isAbnormal(form.oilLevel) ||
    isAbnormal(form.oilCondition) ||
    isAbnormal(form.constantLevelOiler) ||
    isAbnormal(form.leakageCheck);

  const filteredLogs = logs.filter((l) => {
    const matchSearch =
      !search ||
      getBearingName(l.bearingId).toLowerCase().includes(search.toLowerCase()) ||
      l.inspectorName.toLowerCase().includes(search.toLowerCase()) ||
      l.bearingType.toLowerCase().includes(search.toLowerCase());
    const matchDate = !filterDate || l.date === filterDate;
    return matchSearch && matchDate;
  });

  const logHasIssue = (l: (typeof logs)[number]) =>
    [l.purgeCheck, l.greaseCondition, l.sealIntegrity, l.oilLevel, l.oilCondition, l.constantLevelOiler, l.leakageCheck].some(
      (v) => v && isAbnormal(v)
    );

  const formatDate = (d: string) => {
    const [y, m, day] = d.split("-");
    return `${day}/${m}/${y.slice(2)}`;
  };

  return (
    <AppShell>
      <div className="p-4 md:p-6 pt-16 lg:pt-6">
        <PageHeader
          title="Bearing Inspection"
          description="Record visual inspection details for grease and oil-based bearings."
        />

        <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">
          {/* Form */}
          <div className="xl:col-span-2">
            <div className="bg-card border border-border rounded-lg p-5">
              <h2 className="text-sm font-semibold text-foreground mb-5 flex items-center gap-2">
                <PlusCircle size={16} className="text-primary" />
                New Inspection Entry
              </h2>

              {submitted && (
                <div className="flex items-center gap-2 bg-[oklch(0.72_0.18_145)]/10 border border-[oklch(0.72_0.18_145)]/30 text-[oklch(0.72_0.18_145)] rounded-md px-3 py-2 text-sm mb-4">
                  <CheckCircle2 size={16} />
                  Bearing inspection saved successfully!
                </div>
              )}

              {hasFlag && (
                <div className="flex items-center gap-2 bg-destructive/10 border border-destructive/30 text-destructive rounded-md px-3 py-2 text-sm mb-4">
                  <AlertTriangle size={16} />
                  Attention: One or more checks indicate an abnormal condition.
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <Field label="Inspection Date" required>
                    <Input
                      type="date"
                      value={form.date}
                      onChange={(e) => set("date", e.target.value)}
                      className={cn("bg-secondary border-border text-sm", errors.date && "border-destructive")}
                    />
                    {errors.date && <span className="text-xs text-destructive">{errors.date}</span>}
                  </Field>
                  <Field label="Inspector Name">
                    <Input
                      value={form.inspectorName}
                      onChange={(e) => set("inspectorName", e.target.value)}
                      placeholder="Name"
                      className="bg-secondary border-border text-sm"
                    />
                  </Field>
                </div>

                <Field label="Type of Bearing" required>
                  <div className="grid grid-cols-2 gap-2">
                    {(["Grease", "Oil"] as BearingType[]).map((t) => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => set("bearingType", t)}
                        className={cn(
                          "flex items-center justify-center gap-2 rounded-md border px-3 py-2 text-sm font-medium transition-colors",
                          form.bearingType === t
                            ? "border-primary bg-primary/15 text-primary"
                            : "border-border bg-secondary text-muted-foreground hover:text-foreground"
                        )}
                      >
                        {t === "Grease" ? <Waves size={14} /> : <Droplets size={14} />}
                        {t}-Based
                      </button>
                    ))}
                  </div>
                  {errors.bearingType && <span className="text-xs text-destructive">{errors.bearingType}</span>}
                </Field>

                <Field label="Bearing No" required>
                  <Select value={form.bearingId} onChange={(v) => set("bearingId", v)} placeholder="Select bearing...">
                    {availableBearings.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.bearingNo} – {b.location}
                      </option>
                    ))}
                  </Select>
                  {errors.bearingId && <span className="text-xs text-destructive">{errors.bearingId}</span>}
                </Field>

                {/* Visual Inspection */}
                {form.bearingType === "Grease" && (
                  <div className="space-y-3 rounded-md border border-border bg-secondary/30 p-3">
                    <div className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                      <Waves size={13} className="text-primary" />
                      Visual Inspection – Grease-Based
                    </div>

                    <Field label="Purge Visual Check" required>
                      <Select value={form.purgeCheck} onChange={(v) => set("purgeCheck", v)} placeholder="Select..." flagAbnormal>
                        <option value="Normal">Normal (slight purging)</option>
                        <option value="Excessive Purging">Excessive Purging (over-greasing)</option>
                      </Select>
                      {errors.purgeCheck && <span className="text-xs text-destructive">{errors.purgeCheck}</span>}
                    </Field>

                    <Field label="Grease Color &amp; Texture" required>
                      <Select value={form.greaseCondition} onChange={(v) => set("greaseCondition", v)} placeholder="Select..." flagAbnormal>
                        <option value="Normal">Normal</option>
                        <option value="Darkened">Darkened (oxidation)</option>
                        <option value="Emulsified">Emulsified (water ingress)</option>
                        <option value="Hardened">Hardened (heat cracking)</option>
                      </Select>
                      {errors.greaseCondition && <span className="text-xs text-destructive">{errors.greaseCondition}</span>}
                    </Field>

                    <Field label="Seal Integrity" required>
                      <Select value={form.sealIntegrity} onChange={(v) => set("sealIntegrity", v)} placeholder="Select..." flagAbnormal>
                        <option value="Intact">Intact</option>
                        <option value="Torn">Torn</option>
                        <option value="Cracked">Cracked</option>
                        <option value="Displaced">Displaced</option>
                      </Select>
                      {errors.sealIntegrity && <span className="text-xs text-destructive">{errors.sealIntegrity}</span>}
                    </Field>
                  </div>
                )}

                {form.bearingType === "Oil" && (
                  <div className="space-y-3 rounded-md border border-border bg-secondary/30 p-3">
                    <div className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                      <Droplets size={13} className="text-primary" />
                      Visual Inspection – Oil-Based
                    </div>

                    <Field label="Oil Level Gauge / Sight Glass" required>
                      <Select value={form.oilLevel} onChange={(v) => set("oilLevel", v)} placeholder="Select..." flagAbnormal>
                        <option value="Correct">Correct (at rolling element mid-line)</option>
                        <option value="Low">Low</option>
                        <option value="High">High</option>
                      </Select>
                      {errors.oilLevel && <span className="text-xs text-destructive">{errors.oilLevel}</span>}
                    </Field>

                    <Field label="Oil Color &amp; Clarity" required>
                      <Select value={form.oilCondition} onChange={(v) => set("oilCondition", v)} placeholder="Select..." flagAbnormal>
                        <option value="Clear">Clear</option>
                        <option value="Cloudy">Cloudy (water contamination)</option>
                        <option value="Discolored">Discolored (thermal degradation)</option>
                        <option value="Foaming">Foaming (air entrainment)</option>
                      </Select>
                      {errors.oilCondition && <span className="text-xs text-destructive">{errors.oilCondition}</span>}
                    </Field>

                    <Field label="Constant Level Oilers" required>
                      <Select value={form.constantLevelOiler} onChange={(v) => set("constantLevelOiler", v)} placeholder="Select..." flagAbnormal>
                        <option value="OK">OK (filled, vent clear, correct side)</option>
                        <option value="Empty">Empty / Needs Refill</option>
                        <option value="Vent Blocked">Vent Hole Blocked</option>
                        <option value="Wrong Side">Installed on Wrong Side</option>
                      </Select>
                      {errors.constantLevelOiler && <span className="text-xs text-destructive">{errors.constantLevelOiler}</span>}
                    </Field>

                    <Field label="Leakage Check" required>
                      <Select value={form.leakageCheck} onChange={(v) => set("leakageCheck", v)} placeholder="Select..." flagAbnormal>
                        <option value="No Leakage">No Leakage</option>
                        <option value="Minor Leak">Minor Leak / Weeping</option>
                        <option value="Active Leak">Active Leak / Dripping</option>
                      </Select>
                      {errors.leakageCheck && <span className="text-xs text-destructive">{errors.leakageCheck}</span>}
                    </Field>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-3">
                  <Field label="Total Tonnage (T)" required>
                    <Input
                      type="number"
                      value={form.totalTonnage}
                      onChange={(e) => set("totalTonnage", e.target.value)}
                      placeholder="e.g. 5000"
                      className={cn("bg-secondary border-border text-sm", errors.totalTonnage && "border-destructive")}
                    />
                    {errors.totalTonnage && <span className="text-xs text-destructive">{errors.totalTonnage}</span>}
                  </Field>
                  <Field label="Total Hrs" required>
                    <Input
                      type="number"
                      step="0.1"
                      value={form.totalHours}
                      onChange={(e) => set("totalHours", e.target.value)}
                      placeholder="e.g. 8"
                      className={cn("bg-secondary border-border text-sm", errors.totalHours && "border-destructive")}
                    />
                    {errors.totalHours && <span className="text-xs text-destructive">{errors.totalHours}</span>}
                  </Field>
                </div>

                <Field label="Photo / Image Upload">
                  <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageSelect} className="hidden" id="bearing-image-upload" />
                  {imagePreview ? (
                    <div className="relative w-full h-32 rounded-md border border-border overflow-hidden group">
                      <img src={imagePreview} alt="Inspection photo preview" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => {
                          setImagePreview(null);
                          if (fileInputRef.current) fileInputRef.current.value = "";
                        }}
                        className="absolute top-1.5 right-1.5 bg-black/60 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        aria-label="Remove image"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ) : (
                    <label
                      htmlFor="bearing-image-upload"
                      className="flex flex-col items-center justify-center gap-1.5 w-full h-24 rounded-md border border-dashed border-border bg-secondary/40 text-muted-foreground text-xs cursor-pointer hover:border-primary hover:text-primary transition-colors"
                    >
                      <ImagePlus size={18} />
                      Click to upload photo
                    </label>
                  )}
                </Field>

                <Field label="Remarks">
                  <textarea
                    value={form.remarks}
                    onChange={(e) => set("remarks", e.target.value)}
                    placeholder="Optional notes..."
                    rows={2}
                    className="w-full bg-secondary border border-border rounded-md px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary resize-none"
                  />
                </Field>

                <Button type="submit" className="w-full" size="sm">
                  Save Inspection
                </Button>
              </form>
            </div>
          </div>

          {/* Log Table */}
          <div className="xl:col-span-3">
            <div className="bg-card border border-border rounded-lg p-4">
              <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-4">
                <h2 className="text-sm font-semibold text-foreground shrink-0">Inspection Records</h2>
                <div className="flex items-center gap-2 flex-1">
                  <div className="relative flex-1">
                    <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      placeholder="Search bearing, type, inspector..."
                      className="pl-8 bg-secondary border-border text-sm h-8"
                    />
                  </div>
                  <Input
                    type="date"
                    value={filterDate}
                    onChange={(e) => setFilterDate(e.target.value)}
                    className="bg-secondary border-border text-sm h-8 w-36"
                  />
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-border">
                      {["Date", "Bearing No", "Type", "Key Findings", "Tonnage", "Hrs", "Inspector", "Photo"].map((h) => (
                        <th key={h} className="text-left text-muted-foreground font-medium py-2 px-2 whitespace-nowrap first:pl-0">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredLogs.map((log) => {
                      const issue = logHasIssue(log);
                      const findings =
                        log.bearingType === "Grease"
                          ? [log.purgeCheck, log.greaseCondition, log.sealIntegrity]
                          : [log.oilLevel, log.oilCondition, log.constantLevelOiler, log.leakageCheck];
                      return (
                        <tr key={log.id} className="border-b border-border/30 hover:bg-secondary/50 transition-colors">
                          <td className="py-2 px-2 text-muted-foreground">{formatDate(log.date)}</td>
                          <td className="py-2 px-2 font-medium text-foreground">{getBearingName(log.bearingId)}</td>
                          <td className="py-2 px-2 text-muted-foreground">
                            <span className="inline-flex items-center gap-1">
                              {log.bearingType === "Grease" ? <Waves size={11} /> : <Droplets size={11} />}
                              {log.bearingType}
                            </span>
                          </td>
                          <td className="py-2 px-2">
                            <span className={cn("font-medium", issue ? "text-destructive" : "text-[oklch(0.72_0.18_145)]")}>
                              {issue ? "Attention Required" : "Normal"}
                            </span>
                            <div className="text-muted-foreground text-[10px] truncate max-w-40">{findings.filter(Boolean).join(" · ")}</div>
                          </td>
                          <td className="py-2 px-2 text-foreground">{log.totalTonnage.toLocaleString()}</td>
                          <td className="py-2 px-2 text-foreground">{log.totalHours}</td>
                          <td className="py-2 px-2 text-muted-foreground">{log.inspectorName || "—"}</td>
                          <td className="py-2 px-2">
                            {log.imageUrl ? (
                              <img src={log.imageUrl} alt="Inspection photo thumbnail" className="w-8 h-8 rounded object-cover border border-border" />
                            ) : (
                              <span className="text-muted-foreground">—</span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
                {filteredLogs.length === 0 && (
                  <div className="text-center text-muted-foreground text-sm py-8">No inspection records found</div>
                )}
              </div>

              <div className="mt-3 text-xs text-muted-foreground">
                Showing {filteredLogs.length} of {logs.length} entries
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
