"use client";

import { exportStyledExcel } from "@/lib/exportExcel";
import { useDashboardStore } from "@/store/dashboardStore";

export default function ActionButtons() {
  const jobs = useDashboardStore((state) => state.jobs);

  return (
    <div className="flex gap-4">
      <button
        onClick={() => exportStyledExcel(jobs)}
        className="bg-[#00FF28] text-black px-5 py-3 rounded-2xl font-semibold"
      >
        Export Excel
      </button>

      <button className="bg-[#111827] px-5 py-3 rounded-2xl">
        Generate AI Email
      </button>
    </div>
  );
}
