"use client";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";

import { Bar } from "react-chartjs-2";

import { useDashboardStore } from "@/store/dashboardStore";

import { useState } from "react";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Tooltip,
  Legend
);

export default function PreparedByChart() {

  const {
    jobs,
    search,
    selectedPrefix,
    showBlankDates,
  } = useDashboardStore();

  // LOCAL FILTER
  const [selectedUser, setSelectedUser] =
    useState("ALL");

  // APPLY FILTERS
  const filteredJobs = jobs.filter((job) => {

    const matchesSearch =

      job.JobNo
        ?.toLowerCase()
        .includes(search.toLowerCase())

      ||

      job.Customer
        ?.toLowerCase()
        .includes(search.toLowerCase());

    const matchesPrefix =

      selectedPrefix === "ALL"

      ||

      job.prefix === selectedPrefix;

    const matchesBlank =

      showBlankDates

      ||

      job.pendingDays !== null;

    const matchesUser =

      selectedUser === "ALL"

      ||

      job.PreparedBy === selectedUser;

    return (

      matchesSearch &&
      matchesPrefix &&
      matchesBlank &&
      matchesUser
    );
  });

  // USERS
  const preparedUsers = [

    "ALL",

    ...new Set(
      jobs
        .map((j) => j.PreparedBy)
        .filter(Boolean)
    ),
  ];

  // GROUPING
  const grouped:
    Record<
      string,
      {
        Normal: number;
        Attention: number;
        Critical: number;
        Escalation: number;
      }
    > = {};

  filteredJobs.forEach((job) => {

    const preparedBy =
      job.PreparedBy || "Unknown";

    if (!grouped[preparedBy]) {

      grouped[preparedBy] = {

        Normal: 0,
        Attention: 0,
        Critical: 0,
        Escalation: 0,
      };
    }

    const status =
      job.agingBucket;

    if (
      status === "Normal" ||
      status === "Attention" ||
      status === "Critical" ||
      status === "Escalation"
    ) {

      grouped[preparedBy][status] += 1;
    }
  });

  // SORT TOTAL
  const sorted = Object.entries(grouped)

    .sort((a, b) => {

      const totalA =

        a[1].Normal +
        a[1].Attention +
        a[1].Critical +
        a[1].Escalation;

      const totalB =

        b[1].Normal +
        b[1].Attention +
        b[1].Critical +
        b[1].Escalation;

      return totalB - totalA;
    })

    .slice(0, 15);

  // LABELS
  const labels =
    sorted.map(([name]) => name);

  // CHART DATA
  const data = {

    labels,

  datasets: [

  {
    label: "Escalation",

    data: sorted.map(
      ([, value]) => value.Escalation
    ),

    backgroundColor:
      "#FF2D55",

    borderColor:
      "#FF5C7C",

    borderWidth: 1,

    borderRadius: 12,
  },

  {
    label: "Critical",

    data: sorted.map(
      ([, value]) => value.Critical
    ),

    backgroundColor:
      "#FF9F0A",

    borderColor:
      "#FFB340",

    borderWidth: 1,

    borderRadius: 12,
  },

  {
    label: "Attention",

    data: sorted.map(
      ([, value]) => value.Attention
    ),

    backgroundColor:
      "#FFD60A",

    borderColor:
      "#FFE14A",

    borderWidth: 1,

    borderRadius: 12,
  },

  {
    label: "Normal",

    data: sorted.map(
      ([, value]) => value.Normal
    ),

    backgroundColor:
      "#32D74B",

    borderColor:
      "#5CFF72",

    borderWidth: 1,

    borderRadius: 12,
  },
]
  };

  const options: any = {

    indexAxis: "y",

    responsive: true,

    maintainAspectRatio: false,

    plugins: {

      legend: {

        position: "top",

        labels: {

          color: "#D1D5DB",

          usePointStyle: true,

          padding: 20,
        },
      },

      tooltip: {

        backgroundColor:
          "#111827",

        borderColor:
          "#374151",

        borderWidth: 1,

        callbacks: {

          label: function(
            context: any
          ) {

            return `${context.dataset.label}: ${context.raw} jobs`;
          },

          afterBody: function(
            context: any
          ) {

            const index =
              context[0].dataIndex;

            const item =
              sorted[index][1];

            return [

              `Normal: ${item.Normal}`,

              `Attention: ${item.Attention}`,

              `Critical: ${item.Critical}`,

              `Escalation: ${item.Escalation}`,
            ];
          },
        },
      },
    },

    scales: {

      x: {

        beginAtZero: true,

        ticks: {

          color: "#D1D5DB",
        },

        grid: {

          color:
            "rgba(255,255,255,0.05)",
        },

        title: {

          display: true,

          text: "Number of Jobs",

          color: "#9CA3AF",
        },
      },

      y: {

        ticks: {

          color: "#D1D5DB",

          font: {

            size: 12,
          },
        },

        grid: {

          color:
            "rgba(255,255,255,0.03)",
        },

        title: {

          display: true,

          text: "Prepared By",

          color: "#9CA3AF",
        },
      },
    },
  };

  if (!jobs.length) return null;

  return (

    <div
      className="
        glass-card
        rounded-[32px]
        p-6
        border border-white/10
      "
    >

      {/* HEADER */}

      <div
        className="
          flex
          flex-col
          lg:flex-row
          lg:items-center
          lg:justify-between
          gap-4
          mb-8
        "
      >

        <div>

          <h2
            className="
              text-3xl
              font-bold
              text-white
            "
          >
            Prepared By Analytics
          </h2>

          <p className="text-gray-400 mt-2">
            Status-wise jobs by prepared staff
          </p>

        </div>

        {/* FILTER */}

        <select
          value={selectedUser}

          onChange={(e) =>
            setSelectedUser(
              e.target.value
            )
          }

          className="
            bg-white/5
            border
            border-white/10
            text-white
            rounded-2xl
            px-4
            py-3
            outline-none
            backdrop-blur-xl
            min-w-[220px]
          "
        >

          {preparedUsers.map((user) => (

            <option
              key={user}
              value={user}
              className="bg-[#111827]"
            >

              {user}

            </option>

          ))}

        </select>

      </div>

      {/* CHART */}

      <div className="h-[650px]">

        <Bar
          data={data}
          options={options}
        />

      </div>

    </div>
  );
}