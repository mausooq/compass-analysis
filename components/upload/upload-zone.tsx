"use client";

import { useDropzone } from "react-dropzone";
import { UploadCloud } from "lucide-react";
import { parseExcel } from "@/lib/parser";
import { useDashboardStore } from "@/store/dashboardStore";

export default function UploadZone() {
  const setJobs = useDashboardStore((state) => state.setJobs);
  const setAiSummary = useDashboardStore((state) => state.setAiSummary);

  const onDrop = async (acceptedFiles: File[]) => {
    try {
      const file = acceptedFiles[0];
      if (!file) return;

      // CLEAR OLD DATA
      setJobs([]);

      // CLEAR OLD AI
      setAiSummary("");

      // PARSE EXCEL
      const parsed = await parseExcel(file);

      // NORMALIZE DATA (FIX TYPE ERRORS)
      const jobs = parsed.map((job: any) => ({
        ...job,

        // FIX Customer (was {} causing build error)
        Customer:
          typeof job.Customer === "string"
            ? job.Customer
            : job.Customer?.name
            ? job.Customer.name
            : String(job.Customer ?? ""),

        // DATE FIELDS
        ETA: job.ETA ? job.ETA.toISOString() : undefined,
        ETD: job.ETD ? job.ETD.toISOString() : undefined,
        DLV: job.DLV ? job.DLV.toISOString() : undefined,
      }));

      // SET NEW DATA
      setJobs(jobs);
    } catch (error) {
      console.error("Upload Error:", error);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [
        ".xlsx",
      ],
    },
    multiple: false,
    onDrop,
  });

  return (
    <div
      {...getRootProps()}
      className={`
        glass-card
        border border-dashed
        rounded-3xl
        p-10
        text-center
        cursor-pointer
        transition-all
        duration-300
        hover:border-[#00FF28]
        hover:scale-[1.01]
        ${isDragActive ? "border-[#00FF28] bg-[#00FF28]/10" : "border-gray-700"}
      `}
    >
      <input {...getInputProps()} />

      <UploadCloud className="mx-auto h-14 w-14 text-[#00FF28]" />

      <h2 className="text-2xl font-bold mt-4">
        Upload Outstanding Report
      </h2>

      <p className="text-gray-400 mt-2">
        Drag & drop Excel file here
      </p>

      <p className="text-xs text-gray-500 mt-4">
        Uploading a new file will replace existing data
      </p>
    </div>
  );
}