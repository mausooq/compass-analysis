"use client";

import { useDashboardStore } from "@/store/dashboardStore";

export default function SummaryCards() {
  const jobs = useDashboardStore((state) => state.jobs);

  const total = jobs.length;

  const pending = jobs.filter((j) => (j.pendingDays || 0) > 0).length;

  const above15 = jobs.filter((j) => (j.pendingDays || 0) > 15).length;

  const above30 = jobs.filter((j) => (j.pendingDays || 0) > 30).length;

const cards = [

  {
    title: "Total Jobs",
    value: total,
    color: "text-blue-600",
  },

  {
    title: "Pending",
    value: pending,
    color: "text-[#10B759]",
  },

  {
    title: "15+ Days",
    value: above15,
    color: "text-orange-500",
  },

  {
    title: "30+ Days",
    value: above30,
    color: "text-red-500",
  },
];

return (

  <div className="
    grid grid-cols-2
    lg:grid-cols-4
    gap-4
  ">

    {cards.map((card) => (

      <div
        key={card.title}
        className={`
          rounded-3xl
          p-6
          border
          transition-all
          hover:scale-[1.02]
          hover:shadow-lg

        `}
      >

        <p className="
          text-gray-200
          text-sm
          font-medium
        ">
          {card.title}
        </p>

        <h2 className={`
          text-4xl
          font-bold
          mt-3
          ${card.color}
        `}>
          {card.value}
        </h2>

      </div>

    ))}

  </div>
);
}
