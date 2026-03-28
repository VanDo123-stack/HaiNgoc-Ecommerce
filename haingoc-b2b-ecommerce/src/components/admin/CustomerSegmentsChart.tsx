"use client";

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { reportData } from "~/data/admin/reports";

const CHART_PRIMARY = "#2563eb";
const CHART_MUTED = "#9ca3af";
const COLORS = [CHART_PRIMARY, CHART_MUTED, "#d1d5db"];

const data = [
  { name: "Khách mới", value: reportData.customerSegments.new },
  { name: "Khách quay lại", value: reportData.customerSegments.returning },
  { name: "Không hoạt động", value: reportData.customerSegments.inactive },
];

export function CustomerSegmentsChart() {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          outerRadius={100}
          innerRadius={50}
          label
        >
          {data.map((_, i) => (
            <Cell key={i} fill={COLORS[i]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
}
