"use client";

import { useDashboardStore } from "@/store/dashboardStore";


export default function JobsTable() {
  const { jobs, search, selectedPrefix, showBlankDates, sortBy, setSortBy } =
    useDashboardStore();

  // FILTER + SORT
  const filteredJobs = jobs

    .filter((job) => {
      const matchesSearch =
        job.JobNo?.toLowerCase().includes(search.toLowerCase()) ||
        job.Customer?.toLowerCase().includes(search.toLowerCase());

      const matchesPrefix =
        selectedPrefix === "ALL" || job.prefix === selectedPrefix;

      const matchesBlank = showBlankDates || job.pendingDays !== null;

      return matchesSearch && matchesPrefix && matchesBlank;
    })

    .sort((a, b) => {
      switch (sortBy) {
        case "pending-desc":
          return (b.pendingDays || 0) - (a.pendingDays || 0);

        case "pending-asc":
          return (a.pendingDays || 0) - (b.pendingDays || 0);

        case "customer":
          return a.Customer.localeCompare(b.Customer);

        case "prefix":
          return a.prefix.localeCompare(b.prefix);

        default:
          return 0;
      }
    });

  // EMPTY STATE
  if (!filteredJobs.length) {
    return (
      <div className="glass-card rounded-3xl p-10 text-center">
        <p className="text-gray-400">No jobs found</p>
      </div>
    );
  }

  // PENDING COLORS
  const getColor = (days: number | null) => {
    if (days === null) return "text-gray-400";

    if (days <= 7) return "text-green-400";

    if (days <= 15) return "text-yellow-400";

    if (days <= 30) return "text-orange-400";

    return "text-red-400";
  };

  // STATUS COLORS
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Normal":
        return "bg-green-500/20 text-green-400";

      case "Attention":
        return "bg-yellow-500/20 text-yellow-400";

      case "Critical":
        return "bg-orange-500/20 text-orange-400";

      case "Escalation":
        return "bg-red-500/20 text-red-400";

      default:
        return "bg-gray-500/20 text-gray-400";
    }
  };

  return (
    <div className="glass-card rounded-3xl overflow-hidden">
      {/* TOP BAR */}

     <div
  className="
    flex flex-col lg:flex-row
    items-start lg:items-start
    justify-between
    gap-4
    p-5
    border-b border-gray-800
  "
>

  {/* LEFT */}
  <div>

    <h2 className="text-2xl font-bold">
      Pending Billing Jobs
    </h2>

    <p className="text-gray-400 text-sm mt-1">
      Total: {filteredJobs.length} jobs
    </p>

  </div>

  {/* RIGHT */}
  <div className="flex flex-col gap-3 w-full lg:w-auto">

    {/* SORT */}
    <select
      value={sortBy}
      onChange={(e) =>
        setSortBy(e.target.value)
      }
      className="
        bg-[#111827]
        border border-gray-700
        rounded-xl
        px-4 py-2
        text-sm
        outline-none
        min-w-[220px]
      "
    >

      <option value="pending-desc">
        Highest Pending
      </option>

      <option value="pending-asc">
        Lowest Pending
      </option>

      <option value="customer">
        Customer A-Z
      </option>

      <option value="prefix">
        Prefix
      </option>

    </select>

    {/* EXPORT BUTTON */}
    <button
      onClick={() =>
        exportStyledExcel(
          filteredJobs
        )
      }
      className="
        flex items-center
        justify-center
        gap-2

        bg-[#10B759]
        hover:bg-[#13d266]

        text-black
        font-semibold

        px-5 py-2.5

        rounded-2xl

        shadow-lg
        shadow-[#10B759]/20

        transition-all
        duration-300

        hover:scale-[1.02]
      "
    >

      Export Excel

    </button>

  </div>

</div>
      {/* TABLE */}

      <div className="overflow-auto max-h-[700px]">
        <table className="w-full text-sm">
          <thead className="bg-[#111827] sticky top-0 z-20">
            <tr>
              <th className="text-left p-4">Job No</th>

              <th className="text-left p-4">Prefix</th>

              <th className="text-left p-4">Customer</th>

              <th className="text-left p-4">Pending Days</th>

              <th className="text-left p-4">Status</th>
            </tr>
          </thead>

          <tbody>
            {filteredJobs.map((job, index) => (
              <tr
                key={index}
                className="
                  border-t border-gray-800
                  hover:bg-[#111827]/60
                  transition-all
                "
              >
                {/* JOB */}

                <td className="p-4 font-medium">{job.JobNo}</td>

                {/* PREFIX */}

                <td className="p-4">
                  <span
                    className="
                    bg-[#00FF28]/20
                    text-[#00FF28]
                    px-3 py-1
                    rounded-full
                    text-xs
                    font-semibold
                  "
                  >
                    {job.prefix}
                  </span>
                </td>

                {/* CUSTOMER */}

                <td className="p-4">{job.Customer}</td>

                {/* PENDING */}

                <td
                  className={`
                    p-4 font-bold text-lg
                    ${getColor(job.pendingDays)}
                  `}
                >
                  {job.pendingDays ?? "-"}
                </td>

                {/* STATUS */}

                <td className="p-4">
                  <span
                    className={`
                      px-3 py-1
                      rounded-full
                      text-xs
                      font-semibold
                      ${getStatusColor(job.agingBucket)}
                    `}
                  >
                    {job.agingBucket}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
