"use client";

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

import { useDashboardStore } from "@/store/dashboardStore";

const COLORS = ["#00FF28", "#FACC15", "#FB923C", "#EF4444"];

export default function DashboardCharts() {
  const jobs = useDashboardStore((state) => state.jobs);

  const buckets = [
    {
      name: "0-7",
      value: jobs.filter((j) => j.agingBucket === "0-7").length,
    },
    {
      name: "8-15",
      value: jobs.filter((j) => j.agingBucket === "8-15").length,
    },
    {
      name: "16-30",
      value: jobs.filter((j) => j.agingBucket === "16-30").length,
    },
    {
      name: "30+",
      value: jobs.filter((j) => j.agingBucket === "30+").length,
    },
  ];

  return (
    <div className="glass-card rounded-3xl p-6">
      <h2 className="text-2xl font-bold mb-6">Aging Distribution</h2>

      <div className="h-[350px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={buckets} dataKey="value" outerRadius={120} label>
              {buckets.map((_, index) => (
                <Cell key={index} fill={COLORS[index]} />
              ))}
            </Pie>

            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
