"use client";

import Image from "next/image";

import DashboardCharts from "@/components/charts/dashboard-charts";
import FilterBar from "@/components/filters/filter-bar";
import JobsTable from "@/components/tables/jobs-table";
import UploadZone from "@/components/upload/upload-zone";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#18191e] text-white">

      <div className="max-w-7xl mx-auto px-4 py-8">

        {/* HEADER */}
        <div className="mb-10 flex items-center justify-between">

          {/* LOGO */}
          <div className="flex items-center gap-4">

            <div
              className="
                w-16 h-16
                rounded-2xl
                overflow-hidden

                bg-white/5
                border border-white/10

                flex items-center justify-center

                shadow-lg
              "
            >

              <Image
                src="/logo1.png"
                alt="Compass Logo"
                width={52}
                height={52}
                priority
              />

            </div>

            <div>

              <h1
                className="
                  text-4xl
                  font-black

                  bg-gradient-to-r
                  from-[#00FF28]
                  to-[#7CFF8A]

                  bg-clip-text
                  text-transparent
                "
              >
                Compass Analysis
              </h1>

              <p className="text-gray-400 mt-1">
                Billing & Pending Job Dashboard
              </p>

            </div>

          </div>

        </div>

        {/* CONTENT */}
        <div className="space-y-6">

          <UploadZone />

          <FilterBar />

          <DashboardCharts />

          <JobsTable />

        </div>

      </div>

    </main>
  );
}