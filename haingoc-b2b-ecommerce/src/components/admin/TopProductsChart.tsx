"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { reportData } from "~/data/admin/reports";
import { formatVND } from "~/lib/format";

const CHART_PRIMARY = "#2563eb";
const AXIS_COLOR = "#6b7280";
const GRID_COLOR = "#e5e7eb";

export function TopProductsChart() {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={reportData.topProducts}>
        <CartesianGrid strokeDasharray="3 3" stroke={GRID_COLOR} />
        <XAxis
          dataKey="productName"
          tick={{ fontSize: 10, fill: AXIS_COLOR }}
          angle={-45}
          textAnchor="end"
          height={80}
        />
        <YAxis
          tickFormatter={(v: number) => `${(v / 1_000_000).toFixed(0)}M`}
          tick={{ fontSize: 12, fill: AXIS_COLOR }}
        />
        <Tooltip formatter={(v) => formatVND(typeof v === "number" ? v : null)} />
        <Bar dataKey="revenue" fill={CHART_PRIMARY} radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
