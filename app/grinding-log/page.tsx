"use client";

import AppShell from "@/components/app-shell";
import PageHeader from "@/components/page-header";
import { rolls, machines, shapes, grindingLogs, getMachineName, getRollName, getShapeName } from "@/lib/data";
import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { PlusCircle, CheckCircle2, AlertTriangle, Search, ChevronDown, ImagePlus, X, Paperclip } from "lucide-react";

type FormData = {
  date: string;
  machineId: string;
  rollId: string;
  shapeId: string;
  initialDia: string;
  finalDia: string;
  tonnageRolled: string;
  operatorName: string;
  remarks: string;
};

const emptyForm: FormData = {
  date: new Date().toISOString().split("T")[0],
  machineId: "",
  rollId: "",
  shapeId: "",
  initialDia: "",
  finalDia: "",
  tonnageRolled: "",
  operatorName: "",
  remarks: "",
};

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

function Select({ value, onChange, children, placeholder }: { value: string; onChange: (v: string) => void; children: React.ReactNode; placeholder: string }) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full appearance-none bg-secondary border border-border text-foreground text-sm rounded-md px-3 py-2 pr-8 focus:outline-none focus:ring-1 focus:ring-primary"
      >
        <option value="">{placeholder}</option>
        {children}
      </select>
      <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
    </div>
  );
}

export default function GrindingLogPage() {
  const [form, setForm] = useState<FormData>(emptyForm);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [logs, setLogs] = useState(grindingLogs);
  const [search, setSearch] = useState("");
  const [filterDate, setFilterDate] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setImagePreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const set = (key: keyof FormData, value: string) => {
    setForm((prev) => {
      const next = { ...prev, [key]: value };
      // Auto-fill initial dia from roll master
      if (key === "rollId" && value) {
        const roll = rolls.find((r) => r.id === value);
        if (roll) next.initialDia = String(roll.currentDia);
      }
      return next;
    });
    setErrors((e) => ({ ...e, [key]: undefined }));
  };

  const grindingLoss =
    form.initialDia && form.finalDia
      ? (parseFloat(form.initialDia) - parseFloat(form.finalDia)).toFixed(2)
      : "—";

  const validate = (): boolean => {
    const errs: Partial<FormData> = {};
    if (!form.date) errs.date = "Required";
    if (!form.machineId) errs.machineId = "Required";
    if (!form.rollId) errs.rollId = "Required";
    if (!form.shapeId) errs.shapeId = "Required";
    if (!form.initialDia) errs.initialDia = "Required";
    if (!form.finalDia) errs.finalDia = "Required";
    if (form.initialDia && form.finalDia && parseFloat(form.finalDia) >= parseFloat(form.initialDia)) {
      errs.finalDia = "Must be less than initial dia";
    }
    if (!form.tonnageRolled) errs.tonnageRolled = "Required";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    const newLog = {
      id: `GL${String(logs.length + 1).padStart(3, "0")}`,
      date: form.date,
      machineId: form.machineId,
      rollId: form.rollId,
      shapeId: form.shapeId,
      initialDia: parseFloat(form.initialDia),
      finalDia: parseFloat(form.finalDia),
      grindingLoss: parseFloat(grindingLoss as string),
      tonnageRolled: parseInt(form.tonnageRolled),
      operatorName: form.operatorName,
      remarks: form.remarks,
      imageUrl: imagePreview ?? undefined,
    };
    setLogs([newLog, ...logs]);
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setForm(emptyForm);
      removeImage();
    }, 2500);
  };

  const selectedRoll = rolls.find((r) => r.id === form.rollId);
  const isNearScrap = selectedRoll && form.finalDia
    ? parseFloat(form.finalDia) - selectedRoll.minDia <= 5
    : false;

  const filteredLogs = logs.filter((l) => {
    const matchSearch =
      !search ||
      getRollName(l.rollId).toLowerCase().includes(search.toLowerCase()) ||
      getMachineName(l.machineId).toLowerCase().includes(search.toLowerCase()) ||
      l.operatorName.toLowerCase().includes(search.toLowerCase());
    const matchDate = !filterDate || l.date === filterDate;
    return matchSearch && matchDate;
  });

  return (
    <AppShell>
      <div className="p-4 md:p-6 pt-16 lg:pt-6">
        <PageHeader
          title="Grinding Log Entry"
          description="Record roll grinding operations. Auto-calculates grinding loss."
        />

        <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">
          {/* Form */}
          <div className="xl:col-span-2">
            <div className="bg-card border border-border rounded-lg p-5">
              <h2 className="text-sm font-semibold text-foreground mb-5 flex items-center gap-2">
                <PlusCircle size={16} className="text-primary" />
                New Grinding Entry
              </h2>

              {submitted && (
                <div className="flex items-center gap-2 bg-[oklch(0.72_0.18_145)]/10 border border-[oklch(0.72_0.18_145)]/30 text-[oklch(0.72_0.18_145)] rounded-md px-3 py-2 text-sm mb-4">
                  <CheckCircle2 size={16} />
                  Grinding log saved successfully!
                </div>
              )}

              {isNearScrap && (
                <div className="flex items-center gap-2 bg-destructive/10 border border-destructive/30 text-destructive rounded-md px-3 py-2 text-sm mb-4">
                  <AlertTriangle size={16} />
                  Warning: Roll approaching scrap diameter!
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <Field label="Grinding Date" required>
                    <Input type="date" value={form.date} onChange={(e) => set("date", e.target.value)} className={cn("bg-secondary border-border text-sm", errors.date && "border-destructive")} />
                    {errors.date && <span className="text-xs text-destructive">{errors.date}</span>}
                  </Field>
                  <Field label="Operator Name">
                    <Input value={form.operatorName} onChange={(e) => set("operatorName", e.target.value)} placeholder="Name" className="bg-secondary border-border text-sm" />
                  </Field>
                </div>

                <Field label="Grinding Machine" required>
                  <Select value={form.machineId} onChange={(v) => set("machineId", v)} placeholder="Select machine...">
                    {machines.map((m) => (
                      <option key={m.id} value={m.id}>{m.machineNo} – {m.location}</option>
                    ))}
                  </Select>
                  {errors.machineId && <span className="text-xs text-destructive">{errors.machineId}</span>}
                </Field>

                <Field label="Roll No" required>
                  <Select value={form.rollId} onChange={(v) => set("rollId", v)} placeholder="Select roll...">
                    {rolls.filter((r) => r.status !== "Scrap").map((r) => (
                      <option key={r.id} value={r.id}>{r.rollNo} ({r.rollType}) – Ø{r.currentDia}mm</option>
                    ))}
                  </Select>
                  {errors.rollId && <span className="text-xs text-destructive">{errors.rollId}</span>}
                </Field>

                {selectedRoll && (
                  <div className="bg-secondary/50 rounded-md p-3 text-xs space-y-1 border border-border">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Type:</span>
                      <span className="text-foreground font-medium">{selectedRoll.rollType}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Grade:</span>
                      <span className="text-foreground font-medium">{selectedRoll.materialGrade}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Min Dia:</span>
                      <span className="text-foreground font-medium">{selectedRoll.minDia} mm</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Remaining:</span>
                      <span className={cn("font-medium", (selectedRoll.currentDia - selectedRoll.minDia) <= 5 ? "text-destructive" : "text-[oklch(0.72_0.18_145)]")}>
                        {(selectedRoll.currentDia - selectedRoll.minDia).toFixed(1)} mm
                      </span>
                    </div>
                  </div>
                )}

                <Field label="Grinding Shape" required>
                  <Select value={form.shapeId} onChange={(v) => set("shapeId", v)} placeholder="Select shape...">
                    {shapes.map((s) => (
                      <option key={s.id} value={s.id}>{s.shapeName} – {s.description}</option>
                    ))}
                  </Select>
                  {errors.shapeId && <span className="text-xs text-destructive">{errors.shapeId}</span>}
                </Field>

                <div className="grid grid-cols-2 gap-3">
                  <Field label="Initial Diameter (mm)" required>
                    <Input
                      type="number"
                      step="0.1"
                      value={form.initialDia}
                      onChange={(e) => set("initialDia", e.target.value)}
                      placeholder="e.g. 650"
                      className={cn("bg-secondary border-border text-sm", errors.initialDia && "border-destructive")}
                    />
                    {errors.initialDia && <span className="text-xs text-destructive">{errors.initialDia}</span>}
                  </Field>
                  <Field label="Final Diameter (mm)" required>
                    <Input
                      type="number"
                      step="0.1"
                      value={form.finalDia}
                      onChange={(e) => set("finalDia", e.target.value)}
                      placeholder="e.g. 646"
                      className={cn("bg-secondary border-border text-sm", errors.finalDia && "border-destructive")}
                    />
                    {errors.finalDia && <span className="text-xs text-destructive">{errors.finalDia}</span>}
                  </Field>
                </div>

                {/* Auto-calculated loss */}
                <div className="bg-secondary/30 border border-border rounded-md p-3 flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Grinding Loss (auto)</span>
                  <span className={cn("text-lg font-bold", parseFloat(grindingLoss as string) > 4 ? "text-destructive" : "text-[oklch(0.72_0.18_145)]")}>
                    {grindingLoss} mm
                  </span>
                </div>

                <Field label="Tonnage Rolled (T)" required>
                  <Input
                    type="number"
                    value={form.tonnageRolled}
                    onChange={(e) => set("tonnageRolled", e.target.value)}
                    placeholder="e.g. 5000"
                    className={cn("bg-secondary border-border text-sm", errors.tonnageRolled && "border-destructive")}
                  />
                  {errors.tonnageRolled && <span className="text-xs text-destructive">{errors.tonnageRolled}</span>}
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

                <Field label="Photo / Image Upload">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageSelect}
                    className="hidden"
                    id="grinding-image-upload"
                  />
                  {imagePreview ? (
                    <div className="relative w-full h-32 rounded-md border border-border overflow-hidden group">
                      <img src={imagePreview} alt="Grinding entry photo preview" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={removeImage}
                        className="absolute top-1.5 right-1.5 bg-black/60 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        aria-label="Remove image"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ) : (
                    <label
                      htmlFor="grinding-image-upload"
                      className="flex flex-col items-center justify-center gap-1.5 w-full h-24 rounded-md border border-dashed border-border bg-secondary/30 text-muted-foreground hover:text-foreground hover:border-primary/50 transition-colors cursor-pointer"
                    >
                      <ImagePlus size={18} />
                      <span className="text-xs">Click to upload photo</span>
                    </label>
                  )}
                </Field>

                <Button type="submit" className="w-full" size="sm">
                  Save Grinding Log
                </Button>
              </form>
            </div>
          </div>

          {/* Log Table */}
          <div className="xl:col-span-3">
            <div className="bg-card border border-border rounded-lg p-4">
              <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-4">
                <h2 className="text-sm font-semibold text-foreground shrink-0">Grinding Logs</h2>
                <div className="flex items-center gap-2 flex-1">
                  <div className="relative flex-1">
                    <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      placeholder="Search roll, machine, operator..."
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
                      {["Date", "Machine", "Roll No", "Shape", "Init Ø", "Final Ø", "Loss", "Tonnage", "Operator", "Photo"].map((h) => (
                        <th key={h} className="text-left text-muted-foreground font-medium py-2 px-2 whitespace-nowrap first:pl-0">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredLogs.map((log) => (
                      <tr key={log.id} className="border-b border-border/30 hover:bg-secondary/50 transition-colors">
                        <td className="py-2 px-2 text-muted-foreground">
                          {(() => {
                            const [y, m, d] = log.date.split("-");
                            return `${d}/${m}/${y.slice(2)}`;
                          })()}
                        </td>
                        <td className="py-2 px-2 font-medium text-foreground">{getMachineName(log.machineId)}</td>
                        <td className="py-2 px-2 font-medium text-foreground">{getRollName(log.rollId)}</td>
                        <td className="py-2 px-2 text-muted-foreground">{getShapeName(log.shapeId)}</td>
                        <td className="py-2 px-2 text-muted-foreground">{log.initialDia}</td>
                        <td className="py-2 px-2 text-muted-foreground">{log.finalDia}</td>
                        <td className="py-2 px-2">
                          <span className={cn("font-semibold", log.grindingLoss > 4 ? "text-destructive" : "text-[oklch(0.72_0.18_145)]")}>
                            {log.grindingLoss} mm
                          </span>
                        </td>
                        <td className="py-2 px-2 text-foreground">{log.tonnageRolled.toLocaleString()}</td>
                        <td className="py-2 px-2 text-muted-foreground">{log.operatorName || "—"}</td>
                        <td className="py-2 px-2">
                          {log.imageUrl ? (
                            <img
                              src={log.imageUrl || "/placeholder.svg"}
                              alt="Grinding entry attachment"
                              className="w-8 h-8 rounded object-cover border border-border"
                            />
                          ) : (
                            <Paperclip size={14} className="text-muted-foreground/40" />
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {filteredLogs.length === 0 && (
                  <div className="text-center text-muted-foreground text-sm py-8">No logs found</div>
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
