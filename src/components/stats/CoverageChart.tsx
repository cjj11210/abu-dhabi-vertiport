"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Cell,
} from "recharts";
import type { CoverageStats } from "@/lib/models/types";

interface Props {
  stats: CoverageStats;
}

export default function CoverageChart({ stats }: Props) {
  const data = [
    { name: "Blocked", value: stats.potentialSitesBlocked, color: "#ef4444" },
    { name: "Allowed", value: stats.potentialSitesAllowed, color: "#22c55e" },
  ];

  if (stats.potentialSitesTotal === 0) return null;

  return (
    <div className="h-[100px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} layout="vertical" barSize={20}>
          <XAxis
            type="number"
            domain={[0, stats.potentialSitesTotal]}
            tick={{ fontSize: 10 }}
            hide
          />
          <YAxis
            type="category"
            dataKey="name"
            tick={{ fontSize: 11, fill: "#64748b" }}
            width={55}
          />
          <Bar dataKey="value" radius={[0, 4, 4, 0]}>
            {data.map((entry, index) => (
              <Cell key={index} fill={entry.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
