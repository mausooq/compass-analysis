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

export default function DashboardCharts() {

  const {
    jobs,
    search,
    selectedPrefix,
    showBlankDates,
  } = useDashboardStore();

  // APPLY SAME FILTERS AS TABLE
  const filteredJobs = jobs.filter((job) => {

    const matchesSearch =

      job.JobNo
        ?.toLowerCase()
        .includes(
          search.toLowerCase()
        ) ||

      job.Customer
        ?.toLowerCase()
        .includes(
          search.toLowerCase()
        );

    const matchesPrefix =

      selectedPrefix === "ALL" ||

      job.prefix ===
        selectedPrefix;

    const matchesBlank =

      showBlankDates ||

      job.pendingDays !==
        null;

    return (

      matchesSearch &&

      matchesPrefix &&

      matchesBlank
    );
  });

  // MODERN COLORS
  const COLORS = {

    Normal: "#22C55E",

    Attention: "#EAB308",

    Critical: "#F97316",

    Escalation: "#EF4444",
  };

  // CHART DATA
  const chartData = [

    {
      name: "Normal",

      value:
        filteredJobs.filter(
          (j) =>
            j.agingBucket ===
            "Normal"
        ).length,
    },

    {
      name: "Attention",

      value:
        filteredJobs.filter(
          (j) =>
            j.agingBucket ===
            "Attention"
        ).length,
    },

    {
      name: "Critical",

      value:
        filteredJobs.filter(
          (j) =>
            j.agingBucket ===
            "Critical"
        ).length,
    },

    {
      name: "Escalation",

      value:
        filteredJobs.filter(
          (j) =>
            j.agingBucket ===
            "Escalation"
        ).length,
    },

  ].filter(
    (item) => item.value > 0
  );

  if (!filteredJobs.length)
    return null;

  return (

    <div
      className="
        glass-card
        rounded-3xl
        p-6
        border border-white/10
      "
    >

      {/* HEADER */}

      <div
        className="
          flex flex-col lg:flex-row
          items-start lg:items-center
          justify-between
          gap-4
          mb-8
        "
      >

        <div>

          <h2
            className="
              text-3xl
              font-bold
              bg-gradient-to-r
              from-[#10B759]
              to-[#34D399]
              bg-clip-text
              text-transparent
            "
          >
            Billing Status Analytics
          </h2>

          <p className="text-gray-400 mt-2">
            Real-time pending billing overview
          </p>

        </div>

        <div
          className="
            px-4 py-2
            rounded-2xl
            bg-[#10B759]/10
            border border-[#10B759]/20
          "
        >

          <span className="text-[#10B759] font-semibold">
            {filteredJobs.length} Active Jobs
          </span>

        </div>

      </div>

      {/* CHART */}

      <div
        className="
          w-full
          h-[420px]
          relative
        "
      >

        <ResponsiveContainer
          width="100%"
          height="100%"
        >

          <PieChart>

            <Pie
              data={chartData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={150}
              innerRadius={90}
              paddingAngle={4}
              cornerRadius={12}
            >

              {chartData.map(
                (entry) => (

                  <Cell
                    key={entry.name}
                    fill={
                      COLORS[
                        entry.name as keyof typeof COLORS
                      ]
                    }
                    stroke="transparent"
                  />
                )
              )}

            </Pie>

            <Tooltip
              contentStyle={{

                background:
                  "rgba(17,24,39,0.95)",

                border:
                  "1px solid rgba(255,255,255,0.08)",

                borderRadius:
                  "18px",

                color: "#fff",

                backdropFilter:
                  "blur(10px)",

                padding: "12px",
              }}
            />

            <Legend />

          </PieChart>

        </ResponsiveContainer>

        {/* CENTER TEXT */}

        <div
          className="
            absolute
            inset-0
            flex
            flex-col
            items-center
            justify-center
            pointer-events-none
          "
        >

          <h2 className="text-5xl font-bold">
            {filteredJobs.length}
          </h2>

          <p className="text-gray-400 mt-2">
            Total Jobs
          </p>

        </div>

      </div>

      {/* STATUS CARDS */}

      <div
        className="
          grid
          grid-cols-2
          lg:grid-cols-4
          gap-5
          mt-8
        "
      >

        {chartData.map((item) => (

          <div
            key={item.name}
            className="
              relative
              overflow-hidden

              rounded-3xl
              p-5

              bg-white/5
              border border-white/10

              backdrop-blur-xl

              hover:scale-[1.03]
              transition-all
              duration-300
            "
          >

            {/* GLOW */}

            <div
              className="
                absolute
                top-0
                right-0
                w-24
                h-24
                rounded-full
                blur-3xl
                opacity-20
              "
              style={{
                background:
                  COLORS[
                    item.name as keyof typeof COLORS
                  ],
              }}
            />

            <div className="relative z-10">

              <div
                className="
                  flex
                  items-center
                  gap-3
                "
              >

                <div
                  className="
                    w-4
                    h-4
                    rounded-full
                  "
                  style={{
                    background:
                      COLORS[
                        item.name as keyof typeof COLORS
                      ],
                  }}
                />

                <span className="text-gray-300 text-sm">
                  {item.name}
                </span>

              </div>

              <h2 className="text-4xl font-bold mt-4">
                {item.value}
              </h2>

            </div>

          </div>
        ))}

      </div>

    </div>
  );
}