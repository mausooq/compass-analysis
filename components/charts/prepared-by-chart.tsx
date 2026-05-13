"use client";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from "chart.js";

import { Line } from "react-chartjs-2";

import { useDashboardStore } from "@/store/dashboardStore";

import { useState } from "react";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
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

  // APPLY GLOBAL FILTERS
  const filteredJobs = jobs.filter((job) => {

    const matchesSearch =
      job.JobNo
        ?.toLowerCase()
        .includes(search.toLowerCase()) ||

      job.Customer
        ?.toLowerCase()
        .includes(search.toLowerCase());

    const matchesPrefix =
      selectedPrefix === "ALL" ||
      job.prefix === selectedPrefix;

    const matchesBlank =
      showBlankDates ||
      job.pendingDays !== null;

    const matchesUser =
      selectedUser === "ALL" ||
      job.PreparedBy === selectedUser;

    return (
      matchesSearch &&
      matchesPrefix &&
      matchesBlank &&
      matchesUser
    );
  });

  // PREPARED BY LIST
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

  // SORT
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

    .slice(0, 10);

  // LABELS
  const labels =
    sorted.map(([name]) => name);

  // CHART DATA
  const data = {

    labels,

    datasets: [

      {
        label: "Normal",

        data: sorted.map(
          ([, value]) => value.Normal
        ),

        borderColor: "#22C55E",

        backgroundColor:
          "rgba(34,197,94,0.15)",

        tension: 0.4,

        pointRadius: 4,

        borderWidth: 3,
      },

      {
        label: "Attention",

        data: sorted.map(
          ([, value]) => value.Attention
        ),

        borderColor: "#FACC15",

        backgroundColor:
          "rgba(250,204,21,0.15)",

        tension: 0.4,

        pointRadius: 4,

        borderWidth: 3,
      },

      {
        label: "Critical",

        data: sorted.map(
          ([, value]) => value.Critical
        ),

        borderColor: "#FB923C",

        backgroundColor:
          "rgba(251,146,60,0.15)",

        tension: 0.4,

        pointRadius: 4,

        borderWidth: 3,
      },

      {
        label: "Escalation",

        data: sorted.map(
          ([, value]) => value.Escalation
        ),

        borderColor: "#EF4444",

        backgroundColor:
          "rgba(239,68,68,0.15)",

        tension: 0.4,

        pointRadius: 4,

        borderWidth: 3,
      },
    ],
  };

  const options: any = {

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
      },
    },

    scales: {

      x: {

        ticks: {
          color: "#D1D5DB",
        },

        grid: {
          color:
            "rgba(255,255,255,0.05)",
        },
      },

      y: {

        beginAtZero: true,

        ticks: {
          color: "#D1D5DB",
        },

        grid: {
          color:
            "rgba(255,255,255,0.05)",
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

      <div className="h-[500px]">

        <Line
          data={data}
          options={options}
        />

      </div>

    </div>
  );
}