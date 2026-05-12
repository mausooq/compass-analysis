"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { useDashboardStore } from "@/store/dashboardStore";

export default function FilterBar() {
  const {
    jobs,
    search,
    selectedPrefix,
    showBlankDates,
    setSearch,
    setSelectedPrefix,
    setShowBlankDates,
  } = useDashboardStore();

  const prefixes = [
    "ALL",
    ...new Set(jobs.map((j) => j.prefix).filter(Boolean)),
  ];

  return (
    <div className="glass-card rounded-3xl p-4 sticky top-4 z-50">
      <div className="flex flex-col lg:flex-row gap-4">
        <Input
          placeholder="Search Job / Customer..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="bg-[#111827] border-gray-700"
        />

        <div className="flex flex-wrap gap-2">
          {prefixes.map((prefix) => (
            <button
              key={prefix}
              onClick={() => setSelectedPrefix(prefix)}
              className={`
                px-4 py-2 rounded-xl text-sm transition-all
                ${
                  selectedPrefix === prefix
                    ? "bg-[#00FF28] text-black"
                    : "bg-[#111827]"
                }
              `}
            >
              {prefix}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <Checkbox
            checked={showBlankDates}
            onCheckedChange={(v) => setShowBlankDates(!!v)}
          />

          <span className="text-sm text-gray-300">Show Blank ETA/ETD</span>
        </div>
      </div>
    </div>
  );
}
