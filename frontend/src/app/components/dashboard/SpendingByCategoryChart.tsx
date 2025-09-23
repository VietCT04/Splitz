"use client";

import {
  PieChart,
  Pie,
  Tooltip,
  ResponsiveContainer,
  Cell,
  Legend,
} from "recharts";

const COLORS = ["#60a5fa", "#f97316", "#22c55e", "#a78bfa", "#f43f5e"];

export default function SpendingByCategoryChart({
  data,
}: {
  data: { name: string; value: number }[];
}) {
  return (
    <div className="rounded-xl border bg-white p-4 shadow-sm">
      <p className="mb-2 text-sm font-medium text-gray-800">
        Spending by category
      </p>
      <div className="h-56">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              outerRadius={80}
              label
            >
              {data.map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
