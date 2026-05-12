"use client";
import SummaryCards from "@/components/cards/summary-cards";
import DashboardCharts from "@/components/charts/dashboard-charts";
import FilterBar from "@/components/filters/filter-bar";
import JobsTable from "@/components/tables/jobs-table";
import UploadZone from "@/components/upload/upload-zone";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#18191e] text-white">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-5xl font-bold text-[#00FF28]">
            COMPASS ANALYSIS
          </h1>

          <p className="text-gray-400 mt-2">
            Logistics Billing Analytics Dashboard
          </p>
        </div>

        <div className="space-y-6">
          <UploadZone />

          <SummaryCards />

          <FilterBar />

          <DashboardCharts />

          <JobsTable />
        </div>
      </div>
    </main>
  );
}
