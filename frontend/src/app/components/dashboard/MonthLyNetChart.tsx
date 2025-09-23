"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function MonthlyNetChart({
  data,
}: {
  data: { day: string; value: number }[];
}) {
  return (
    <div className="rounded-xl border bg-white p-4 shadow-sm">
      <p className="mb-2 text-sm font-medium text-gray-800">Monthly net</p>
      <div className="h-56">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <XAxis dataKey="day" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="value" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
