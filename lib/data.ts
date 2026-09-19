// ─── Types ────────────────────────────────────────────────────────────────────

export type RollType = "Work Roll" | "Intermediate Roll" | "Backup Roll";
export type RollStatus = "Active" | "Scrap" | "In-Use" | "Under Maintenance";
export type ShapeName = "CVC" | "Parabolic" | "Flat" | "Convex" | "Concave";

export interface Roll {
  id: string;
  rollNo: string;
  rollType: RollType;
  manufacturer: string;
  materialGrade: string;
  maxDia: number;
  minDia: number;
  currentDia: number;
  status: RollStatus;
  totalGrindings: number;
  totalTonnage: number;
}

export interface Machine {
  id: string;
  machineNo: string;
  machineType: string;
  location: string;
}

export interface Shape {
  id: string;
  shapeName: ShapeName;
  description: string;
}

export interface GrindingLog {
  id: string;
  date: string;
  machineId: string;
  rollId: string;
  shapeId: string;
  initialDia: number;
  finalDia: number;
  grindingLoss: number;
  tonnageRolled: number;
  operatorName: string;
  remarks: string;
  imageUrl?: string;
}

export interface Alert {
  id: string;
  type: "warning" | "danger" | "info";
  message: string;
  rollId?: string;
  timestamp: string;
  read: boolean;
}

// ─── Bearing Inspection ───────────────────────────────────────────────────────

export type BearingType = "Grease" | "Oil";

export interface Bearing {
  id: string;
  bearingNo: string;
  type: BearingType;
  location: string;
}

export interface BearingInspection {
  id: string;
  date: string;
  bearingType: BearingType;
  bearingId: string;
  // Grease-based checks
  purgeCheck?: string;
  greaseCondition?: string;
  sealIntegrity?: string;
  // Oil-based checks
  oilLevel?: string;
  oilCondition?: string;
  constantLevelOiler?: string;
  leakageCheck?: string;
  totalTonnage: number;
  totalHours: number;
  remarks: string;
  imageUrl?: string;
  inspectorName: string;
}

export const bearings: Bearing[] = [
  { id: "B01", bearingNo: "BRG-WR-101", type: "Grease", location: "Stand 1 – Work Side" },
  { id: "B02", bearingNo: "BRG-WR-102", type: "Grease", location: "Stand 1 – Drive Side" },
  { id: "B03", bearingNo: "BRG-IR-201", type: "Oil", location: "Stand 2 – Work Side" },
  { id: "B04", bearingNo: "BRG-IR-202", type: "Oil", location: "Stand 2 – Drive Side" },
  { id: "B05", bearingNo: "BRG-BR-301", type: "Oil", location: "Stand 3 – Work Side" },
  { id: "B06", bearingNo: "BRG-BR-302", type: "Oil", location: "Stand 3 – Drive Side" },
  { id: "B07", bearingNo: "BRG-WR-103", type: "Grease", location: "Stand 4 – Work Side" },
  { id: "B08", bearingNo: "BRG-WR-104", type: "Grease", location: "Stand 4 – Drive Side" },
];

export const bearingInspections: BearingInspection[] = [
  {
    id: "BI001",
    date: "2024-01-15",
    bearingType: "Grease",
    bearingId: "B01",
    purgeCheck: "Normal",
    greaseCondition: "Normal",
    sealIntegrity: "Intact",
    totalTonnage: 3800,
    totalHours: 8,
    remarks: "",
    inspectorName: "A. Kumar",
  },
  {
    id: "BI002",
    date: "2024-01-15",
    bearingType: "Oil",
    bearingId: "B03",
    oilLevel: "Correct",
    oilCondition: "Clear",
    constantLevelOiler: "OK",
    leakageCheck: "No Leakage",
    totalTonnage: 5200,
    totalHours: 8,
    remarks: "",
    inspectorName: "B. Singh",
  },
  {
    id: "BI003",
    date: "2024-01-14",
    bearingType: "Grease",
    bearingId: "B07",
    purgeCheck: "Excessive Purging",
    greaseCondition: "Darkened",
    sealIntegrity: "Torn",
    totalTonnage: 4100,
    totalHours: 8,
    remarks: "Seal replacement scheduled",
    inspectorName: "C. Patel",
  },
  {
    id: "BI004",
    date: "2024-01-14",
    bearingType: "Oil",
    bearingId: "B05",
    oilLevel: "Low",
    oilCondition: "Cloudy",
    constantLevelOiler: "Vent Blocked",
    leakageCheck: "Minor Leak",
    totalTonnage: 42000,
    totalHours: 24,
    remarks: "Topped up oil, cleared vent hole",
    inspectorName: "D. Sharma",
  },
];

export function getBearingName(id: string) {
  return bearings.find((b) => b.id === id)?.bearingNo ?? id;
}

export function getBearingById(id: string) {
  return bearings.find((b) => b.id === id);
}

// ─── Master Data ──────────────────────────────────────────────────────────────

export const machines: Machine[] = [
  { id: "M01", machineNo: "GRD-01", machineType: "CNC Grinder", location: "Bay A" },
  { id: "M02", machineNo: "GRD-02", machineType: "CNC Grinder", location: "Bay A" },
  { id: "M03", machineNo: "GRD-03", machineType: "Manual Grinder", location: "Bay B" },
  { id: "M04", machineNo: "GRD-04", machineType: "CNC Grinder", location: "Bay B" },
];

export const shapes: Shape[] = [
  { id: "S01", shapeName: "CVC", description: "Continuously Variable Crown" },
  { id: "S02", shapeName: "Parabolic", description: "Parabolic crown profile" },
  { id: "S03", shapeName: "Flat", description: "Flat grinding profile" },
  { id: "S04", shapeName: "Convex", description: "Convex crown profile" },
  { id: "S05", shapeName: "Concave", description: "Concave crown profile" },
];

export const rolls: Roll[] = [
  { id: "R001", rollNo: "WR-2401", rollType: "Work Roll", manufacturer: "Nippon Steel", materialGrade: "HSS", maxDia: 650, minDia: 580, currentDia: 628, status: "Active", totalGrindings: 12, totalTonnage: 45200 },
  { id: "R002", rollNo: "WR-2402", rollType: "Work Roll", manufacturer: "Nippon Steel", materialGrade: "HSS", maxDia: 650, minDia: 580, currentDia: 597, status: "Active", totalGrindings: 28, totalTonnage: 98400 },
  { id: "R003", rollNo: "WR-2403", rollType: "Work Roll", manufacturer: "Sandvik", materialGrade: "HiCr", maxDia: 650, minDia: 580, currentDia: 583, status: "Active", totalGrindings: 41, totalTonnage: 143600 },
  { id: "R004", rollNo: "WR-2404", rollType: "Work Roll", manufacturer: "Sandvik", materialGrade: "HiCr", maxDia: 650, minDia: 580, currentDia: 580, status: "Scrap", totalGrindings: 44, totalTonnage: 156200 },
  { id: "R005", rollNo: "IR-1801", rollType: "Intermediate Roll", manufacturer: "Hitachi", materialGrade: "ICDP", maxDia: 520, minDia: 460, currentDia: 502, status: "Active", totalGrindings: 8, totalTonnage: 62000 },
  { id: "R006", rollNo: "IR-1802", rollType: "Intermediate Roll", manufacturer: "Hitachi", materialGrade: "ICDP", maxDia: 520, minDia: 460, currentDia: 478, status: "In-Use", totalGrindings: 19, totalTonnage: 118500 },
  { id: "R007", rollNo: "IR-1803", rollType: "Intermediate Roll", manufacturer: "Kubota", materialGrade: "ICDP", maxDia: 520, minDia: 460, currentDia: 462, status: "Active", totalGrindings: 31, totalTonnage: 187000 },
  { id: "R008", rollNo: "BR-1201", rollType: "Backup Roll", manufacturer: "Danieli", materialGrade: "Forged Steel", maxDia: 1400, minDia: 1250, currentDia: 1365, status: "Active", totalGrindings: 5, totalTonnage: 320000 },
  { id: "R009", rollNo: "BR-1202", rollType: "Backup Roll", manufacturer: "Danieli", materialGrade: "Forged Steel", maxDia: 1400, minDia: 1250, currentDia: 1310, status: "In-Use", totalGrindings: 11, totalTonnage: 685000 },
  { id: "R010", rollNo: "WR-2405", rollType: "Work Roll", manufacturer: "Nippon Steel", materialGrade: "HSS", maxDia: 650, minDia: 580, currentDia: 641, status: "Active", totalGrindings: 4, totalTonnage: 14800 },
  { id: "R011", rollNo: "WR-2406", rollType: "Work Roll", manufacturer: "Sandvik", materialGrade: "HiCr", maxDia: 650, minDia: 580, currentDia: 612, status: "Under Maintenance", totalGrindings: 21, totalTonnage: 73500 },
  { id: "R012", rollNo: "IR-1804", rollType: "Intermediate Roll", manufacturer: "Kubota", materialGrade: "ICDP", maxDia: 520, minDia: 460, currentDia: 491, status: "Active", totalGrindings: 14, totalTonnage: 87300 },
];

export const grindingLogs: GrindingLog[] = [
  { id: "GL001", date: "2024-01-15", machineId: "M01", rollId: "R001", shapeId: "S01", initialDia: 632, finalDia: 628, grindingLoss: 4, tonnageRolled: 3800, operatorName: "A. Kumar", remarks: "" },
  { id: "GL002", date: "2024-01-15", machineId: "M02", rollId: "R005", shapeId: "S02", initialDia: 506, finalDia: 502, grindingLoss: 4, tonnageRolled: 5200, operatorName: "B. Singh", remarks: "" },
  { id: "GL003", date: "2024-01-15", machineId: "M01", rollId: "R002", shapeId: "S03", initialDia: 601, finalDia: 597, grindingLoss: 4, tonnageRolled: 4100, operatorName: "A. Kumar", remarks: "Slight surface crack repaired" },
  { id: "GL004", date: "2024-01-14", machineId: "M03", rollId: "R003", shapeId: "S01", initialDia: 587, finalDia: 583, grindingLoss: 4, tonnageRolled: 3600, operatorName: "C. Patel", remarks: "" },
  { id: "GL005", date: "2024-01-14", machineId: "M02", rollId: "R006", shapeId: "S02", initialDia: 482, finalDia: 478, grindingLoss: 4, tonnageRolled: 6100, operatorName: "B. Singh", remarks: "" },
  { id: "GL006", date: "2024-01-14", machineId: "M04", rollId: "R008", shapeId: "S03", initialDia: 1370, finalDia: 1365, grindingLoss: 5, tonnageRolled: 42000, operatorName: "D. Sharma", remarks: "Schedule maintenance grind" },
  { id: "GL007", date: "2024-01-13", machineId: "M01", rollId: "R010", shapeId: "S04", initialDia: 645, finalDia: 641, grindingLoss: 4, tonnageRolled: 3200, operatorName: "A. Kumar", remarks: "" },
  { id: "GL008", date: "2024-01-13", machineId: "M03", rollId: "R007", shapeId: "S01", initialDia: 466, finalDia: 462, grindingLoss: 4, tonnageRolled: 5900, operatorName: "C. Patel", remarks: "" },
  { id: "GL009", date: "2024-01-13", machineId: "M02", rollId: "R012", shapeId: "S02", initialDia: 495, finalDia: 491, grindingLoss: 4, tonnageRolled: 5500, operatorName: "B. Singh", remarks: "" },
  { id: "GL010", date: "2024-01-12", machineId: "M01", rollId: "R011", shapeId: "S03", initialDia: 617, finalDia: 612, grindingLoss: 5, tonnageRolled: 3900, operatorName: "A. Kumar", remarks: "Higher loss - surface damage" },
  { id: "GL011", date: "2024-01-12", machineId: "M04", rollId: "R009", shapeId: "S01", initialDia: 1315, finalDia: 1310, grindingLoss: 5, tonnageRolled: 58000, operatorName: "D. Sharma", remarks: "" },
  { id: "GL012", date: "2024-01-11", machineId: "M01", rollId: "R001", shapeId: "S02", initialDia: 636, finalDia: 632, grindingLoss: 4, tonnageRolled: 3600, operatorName: "A. Kumar", remarks: "" },
  { id: "GL013", date: "2024-01-10", machineId: "M02", rollId: "R005", shapeId: "S01", initialDia: 510, finalDia: 506, grindingLoss: 4, tonnageRolled: 5000, operatorName: "B. Singh", remarks: "" },
  { id: "GL014", date: "2024-01-10", machineId: "M03", rollId: "R002", shapeId: "S03", initialDia: 605, finalDia: 601, grindingLoss: 4, tonnageRolled: 4300, operatorName: "C. Patel", remarks: "" },
  { id: "GL015", date: "2024-01-09", machineId: "M01", rollId: "R003", shapeId: "S01", initialDia: 591, finalDia: 587, grindingLoss: 4, tonnageRolled: 3700, operatorName: "A. Kumar", remarks: "" },
];

export const alerts: Alert[] = [
  { id: "A001", type: "danger", message: "Roll WR-2403 approaching scrap diameter (583mm / min 580mm)", rollId: "R003", timestamp: "2024-01-15T08:32:00", read: false },
  { id: "A002", type: "warning", message: "Roll IR-1803 low on remaining life – estimated 2 grindings left", rollId: "R007", timestamp: "2024-01-15T09:15:00", read: false },
  { id: "A003", type: "warning", message: "GRD-03 productivity below threshold – 2 rolls/day (target: 4)", timestamp: "2024-01-15T10:00:00", read: false },
  { id: "A004", type: "danger", message: "Roll WR-2404 scrapped – removed from active inventory", rollId: "R004", timestamp: "2024-01-14T14:22:00", read: true },
  { id: "A005", type: "info", message: "Scheduled maintenance grind completed for BR-1201", rollId: "R008", timestamp: "2024-01-14T11:45:00", read: true },
  { id: "A006", type: "warning", message: "Excess grinding loss detected on WR-2406 – 5mm (threshold: 4mm)", rollId: "R011", timestamp: "2024-01-12T16:30:00", read: true },
];

// ─── Helper Functions ─────────────────────────────────────────────────────────

export function getMachineName(id: string) {
  return machines.find((m) => m.id === id)?.machineNo ?? id;
}

export function getRollName(id: string) {
  return rolls.find((r) => r.id === id)?.rollNo ?? id;
}

export function getShapeName(id: string) {
  return shapes.find((s) => s.id === id)?.shapeName ?? id;
}

export function getRollById(id: string) {
  return rolls.find((r) => r.id === id);
}

export function computeRemainingLife(roll: Roll): number {
  const totalReduction = roll.maxDia - roll.currentDia;
  if (totalReduction <= 0) return roll.maxDia - roll.minDia;
  const wearRate = roll.totalTonnage / totalReduction;
  const remainingReduction = roll.currentDia - roll.minDia;
  return Math.round(wearRate * remainingReduction);
}

export function getRollLogs(rollId: string) {
  return grindingLogs.filter((l) => l.rollId === rollId);
}

export function getDailyReport(date: string) {
  const dayLogs = grindingLogs.filter((l) => l.date === date);
  return machines.map((machine) => {
    const ml = dayLogs.filter((l) => l.machineId === machine.id);
    return {
      machine,
      totalRolls: ml.length,
      totalGrindingLoss: ml.reduce((s, l) => s + l.grindingLoss, 0),
      avgLoss: ml.length ? +(ml.reduce((s, l) => s + l.grindingLoss, 0) / ml.length).toFixed(2) : 0,
      totalTonnage: ml.reduce((s, l) => s + l.tonnageRolled, 0),
      logs: ml,
    };
  });
}

export function getKPIs() {
  const totalRolls = rolls.length;
  const activeRolls = rolls.filter((r) => r.status === "Active" || r.status === "In-Use").length;
  const totalGrindings = grindingLogs.length;
  const totalTonnage = grindingLogs.reduce((s, l) => s + l.tonnageRolled, 0);
  const avgGrindingLoss = +(grindingLogs.reduce((s, l) => s + l.grindingLoss, 0) / grindingLogs.length).toFixed(2);
  const scrapRolls = rolls.filter((r) => r.status === "Scrap").length;
  const nearScrap = rolls.filter((r) => r.status !== "Scrap" && (r.currentDia - r.minDia) <= 5).length;
  return { totalRolls, activeRolls, totalGrindings, totalTonnage, avgGrindingLoss, scrapRolls, nearScrap };
}

// Chart data helpers
export function getGrindingTrend() {
  const dates = [...new Set(grindingLogs.map((l) => l.date))].sort();
  return dates.map((date) => {
    const dl = grindingLogs.filter((l) => l.date === date);
    return {
      date: date.slice(5), // MM-DD
      rolls: dl.length,
      tonnage: dl.reduce((s, l) => s + l.tonnageRolled, 0),
      avgLoss: +(dl.reduce((s, l) => s + l.grindingLoss, 0) / dl.length).toFixed(2),
    };
  });
}

export function getMachineProductivity() {
  return machines.map((m) => {
    const ml = grindingLogs.filter((l) => l.machineId === m.id);
    return {
      machine: m.machineNo,
      rolls: ml.length,
      tonnage: ml.reduce((s, l) => s + l.tonnageRolled, 0),
      avgLoss: ml.length ? +(ml.reduce((s, l) => s + l.grindingLoss, 0) / ml.length).toFixed(2) : 0,
    };
  });
}

export function getRollTypeStats() {
  const types: RollType[] = ["Work Roll", "Intermediate Roll", "Backup Roll"];
  return types.map((type) => {
    const typeRolls = rolls.filter((r) => r.rollType === type);
    const typeLogs = grindingLogs.filter((l) => typeRolls.some((r) => r.id === l.rollId));
    return {
      type: type.replace(" Roll", ""),
      count: typeRolls.length,
      grindings: typeLogs.length,
      avgLoss: typeLogs.length ? +(typeLogs.reduce((s, l) => s + l.grindingLoss, 0) / typeLogs.length).toFixed(2) : 0,
      tonnage: typeLogs.reduce((s, l) => s + l.tonnageRolled, 0),
    };
  });
}

export function getShapeStats() {
  return shapes.map((shape) => {
    const sl = grindingLogs.filter((l) => l.shapeId === shape.id);
    return {
      shape: shape.shapeName,
      count: sl.length,
      avgLoss: sl.length ? +(sl.reduce((s, l) => s + l.grindingLoss, 0) / sl.length).toFixed(2) : 0,
    };
  });
}
