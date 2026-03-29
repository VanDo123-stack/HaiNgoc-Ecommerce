"use client";

import {
  LineChart,
  Line,
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

export function RevenueChart() {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={reportData.monthlyRevenue}>
        <CartesianGrid strokeDasharray="3 3" stroke={GRID_COLOR} />
        <XAxis dataKey="month" tick={{ fontSize: 12, fill: AXIS_COLOR }} />
        <YAxis
          tickFormatter={(v: number) => `${(v / 1_000_000).toFixed(0)}M`}
          tick={{ fontSize: 12, fill: AXIS_COLOR }}
        />
        <Tooltip
          formatter={(v) => formatVND(typeof v === "number" ? v : null)}
          labelFormatter={(label) => `Tháng ${String(label)}`}
        />
        <Line
          type="monotone"
          dataKey="revenue"
          stroke={CHART_PRIMARY}
          strokeWidth={2}
          dot={false}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
