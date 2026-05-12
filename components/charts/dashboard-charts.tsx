"use client";

import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

import { useDashboardStore } from "@/store/dashboardStore";

const COLORS = [
  "#FACC15", // Attention
  "#00FF28", // Normal
  "#FB923C", // Critical
  "#EF4444", // Escalation
];

export default function DashboardCharts() {
  const jobs = useDashboardStore((state) => state.jobs);

  // STATUS DISTRIBUTION
  const chartData = [
    {
      name: "Normal",
      value: jobs.filter((j) => j.agingBucket === "Normal").length,
    },

    {
      name: "Attention",
      value: jobs.filter((j) => j.agingBucket === "Attention").length,
    },

    {
      name: "Critical",
      value: jobs.filter((j) => j.agingBucket === "Critical").length,
    },

    {
      name: "Escalation",
      value: jobs.filter((j) => j.agingBucket === "Escalation").length,
    },
  ]

    // SORT HIGHEST FIRST
    .sort((a, b) => b.value - a.value);

  if (!jobs.length) return null;

  return (
    <div className="glass-card rounded-3xl p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold">Billing Status Distribution</h2>

          <p className="text-gray-400 mt-1">Pending billing jobs by status</p>
        </div>
      </div>

      <div className="w-full h-[400px] min-h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={140}
              innerRadius={80}
              paddingAngle={3}
              label={({ name, value }) => `${name}: ${value}`}
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index]} />
              ))}
            </Pie>

            <Tooltip
              contentStyle={{
                background: "#111827",
                border: "1px solid #374151",
                borderRadius: "12px",
                color: "#fff",
              }}
            />

            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* STATUS CARDS */}

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
        {chartData.map((item, index) => (
          <div
            key={item.name}
            className="
              bg-[#111827]
              rounded-2xl
              p-4
              border border-gray-800
            "
          >
            <div className="flex items-center gap-3">
              <div
                className="w-3 h-3 rounded-full"
                style={{
                  backgroundColor: COLORS[index],
                }}
              />

              <span className="text-gray-300 text-sm">{item.name}</span>
            </div>

            <h2 className="text-3xl font-bold mt-3">{item.value}</h2>
          </div>
        ))}
      </div>
    </div>
  );
}
