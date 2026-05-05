"use client";

import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  getGrindingTrend,
  getMachineProductivity,
  getRollTypeStats,
  getShapeStats,
} from "@/lib/data";

const COLORS = [
  "oklch(0.62 0.18 240)",
  "oklch(0.70 0.16 185)",
  "oklch(0.74 0.18 55)",
  "oklch(0.65 0.22 25)",
  "oklch(0.68 0.14 290)",
];

const tooltipStyle = {
  backgroundColor: "oklch(0.17 0.01 240)",
  border: "1px solid oklch(0.24 0.01 240)",
  borderRadius: "6px",
  color: "oklch(0.92 0.01 220)",
  fontSize: "12px",
};

const axisStyle = { fill: "oklch(0.58 0.01 220)", fontSize: 11 };

function ChartCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-card border border-border rounded-lg p-4">
      <h3 className="text-sm font-semibold text-foreground mb-4">{title}</h3>
      {children}
    </div>
  );
}

export function GrindingTrendChart() {
  const data = getGrindingTrend();
  return (
    <ChartCard title="Daily Grinding Activity (Last 7 Days)">
      <ResponsiveContainer width="100%" height={200}>
        <LineChart data={data} margin={{ top: 4, right: 8, left: -16, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.24 0.01 240)" />
          <XAxis dataKey="date" tick={axisStyle} />
          <YAxis tick={axisStyle} />
          <Tooltip contentStyle={tooltipStyle} cursor={{ stroke: "oklch(0.62 0.18 240)", strokeWidth: 1 }} />
          <Legend wrapperStyle={{ fontSize: 11 }} />
          <Line type="monotone" dataKey="rolls" stroke="oklch(0.62 0.18 240)" strokeWidth={2} dot={{ r: 3 }} name="Rolls Ground" />
          <Line type="monotone" dataKey="avgLoss" stroke="oklch(0.65 0.22 25)" strokeWidth={2} dot={{ r: 3 }} name="Avg Loss (mm)" />
        </LineChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}

export function MachineProductivityChart() {
  const data = getMachineProductivity();
  return (
    <ChartCard title="Machine Productivity">
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={data} margin={{ top: 4, right: 8, left: -16, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.24 0.01 240)" />
          <XAxis dataKey="machine" tick={axisStyle} />
          <YAxis tick={axisStyle} />
          <Tooltip contentStyle={tooltipStyle} />
          <Legend wrapperStyle={{ fontSize: 11 }} />
          <Bar dataKey="rolls" fill="oklch(0.62 0.18 240)" name="Rolls Ground" radius={[3, 3, 0, 0]} />
          <Bar dataKey="avgLoss" fill="oklch(0.70 0.16 185)" name="Avg Loss (mm)" radius={[3, 3, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}

export function RollTypeChart() {
  const data = getRollTypeStats();
  return (
    <ChartCard title="Roll Type – Grinding Loss Comparison">
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={data} margin={{ top: 4, right: 8, left: -16, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.24 0.01 240)" />
          <XAxis dataKey="type" tick={axisStyle} />
          <YAxis tick={axisStyle} />
          <Tooltip contentStyle={tooltipStyle} />
          <Legend wrapperStyle={{ fontSize: 11 }} />
          <Bar dataKey="grindings" fill="oklch(0.62 0.18 240)" name="Total Grindings" radius={[3, 3, 0, 0]} />
          <Bar dataKey="avgLoss" fill="oklch(0.74 0.18 55)" name="Avg Loss (mm)" radius={[3, 3, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}

export function ShapeDistributionChart() {
  const data = getShapeStats().filter((s) => s.count > 0);
  return (
    <ChartCard title="Shape Usage Distribution">
      <div className="flex items-center gap-4">
        <ResponsiveContainer width="100%" height={180}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={50}
              outerRadius={80}
              paddingAngle={3}
              dataKey="count"
              nameKey="shape"
            >
              {data.map((entry, index) => (
                <Cell key={entry.shape} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip contentStyle={tooltipStyle} formatter={(v, n) => [v, n]} />
          </PieChart>
        </ResponsiveContainer>
        <div className="flex flex-col gap-2 shrink-0">
          {data.map((entry, index) => (
            <div key={entry.shape} className="flex items-center gap-2 text-xs">
              <div
                className="w-2.5 h-2.5 rounded-sm shrink-0"
                style={{ background: COLORS[index % COLORS.length] }}
              />
              <span className="text-muted-foreground">{entry.shape}</span>
              <span className="text-foreground font-medium ml-auto pl-2">{entry.count}</span>
            </div>
          ))}
        </div>
      </div>
    </ChartCard>
  );
}

export function TonnageTrendChart() {
  const data = getGrindingTrend();
  return (
    <ChartCard title="Daily Tonnage Trend">
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={data} margin={{ top: 4, right: 8, left: -8, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.24 0.01 240)" />
          <XAxis dataKey="date" tick={axisStyle} />
          <YAxis tick={axisStyle} />
          <Tooltip contentStyle={tooltipStyle} formatter={(v) => [`${v.toLocaleString()} T`, "Tonnage"]} />
          <Bar dataKey="tonnage" fill="oklch(0.70 0.16 185)" name="Tonnage" radius={[3, 3, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}
