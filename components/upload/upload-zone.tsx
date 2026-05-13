"use client";

import { useDropzone } from "react-dropzone";

import {
  FileSpreadsheet,
  UploadCloud,
  Sparkles,
} from "lucide-react";

import { motion } from "framer-motion";

import { parseExcel } from "@/lib/parser";

import { useDashboardStore } from "@/store/dashboardStore";

export default function UploadZone() {
  const setJobs =
    useDashboardStore(
      (state) => state.setJobs
    );

  const setAiSummary =
    useDashboardStore(
      (state) => state.setAiSummary
    );

  const onDrop = async (
    acceptedFiles: File[]
  ) => {
    try {
      const file =
        acceptedFiles[0];

      if (!file) return;

      // CLEAR OLD DATA
      setJobs([]);

      setAiSummary("");

      // PARSE
      const parsed =
        await parseExcel(file);

      // NORMALIZE
      const jobs =
        parsed.map(
          (job: any) => ({
            ...job,

            Customer:
              typeof job.Customer ===
              "string"
                ? job.Customer
                : String(
                    job.Customer ?? ""
                  ),

            ETA: job.ETA
              ? job.ETA.toISOString()
              : undefined,

            ETD: job.ETD
              ? job.ETD.toISOString()
              : undefined,

            DLV: job.DLV
              ? job.DLV.toISOString()
              : undefined,
          })
        );

      setJobs(jobs);

    } catch (error) {
      console.error(
        "Upload Error:",
        error
      );
    }
  };

  const {
    getRootProps,
    getInputProps,
    isDragActive,
  } = useDropzone({
    accept: {
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet":
        [".xlsx"],
    },

    multiple: false,

    onDrop,
  });

  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 20,
      }}

      animate={{
        opacity: 1,
        y: 0,
      }}

      transition={{
        duration: 0.4,
      }}

      className="flex justify-center"
    >
      <div
        {...getRootProps()}

        className={`
          relative
          overflow-hidden

          w-full
          max-w-3xl

          rounded-[30px]

          border
          border-dashed

          px-10
          py-12

          text-center

          cursor-pointer

          transition-all
          duration-300

          backdrop-blur-2xl

          group

          shadow-2xl

          ${
            isDragActive
              ? `
                border-[#10B759]
                bg-[#10B759]/10
                scale-[1.02]
              `
              : `
                border-white/10
                bg-white/[0.04]

                hover:border-[#10B759]/40
                hover:bg-[#10B759]/5
                hover:scale-[1.01]
              `
          }
        `}
      >
        <input
          {...getInputProps()}
        />

        {/* GLOW */}
        <div
          className="
            absolute
            top-0
            left-1/2
            -translate-x-1/2

            w-[320px]
            h-[320px]

            bg-[#10B759]/10

            blur-3xl
            rounded-full

            opacity-60

            pointer-events-none
          "
        />

        {/* CONTENT */}
        <div className="relative z-10">

          {/* ICON */}
          <div
            className="
              mx-auto

              w-20
              h-20

              rounded-3xl

              flex
              items-center
              justify-center

              bg-gradient-to-br
              from-[#10B759]
              to-[#34D399]

              shadow-xl
              shadow-[#10B759]/30

              transition-all
              duration-300

              group-hover:rotate-3
            "
          >
            <UploadCloud
              className="
                h-10
                w-10
                text-black
              "
            />
          </div>

          {/* TITLE */}
          <h2
            className="
              text-3xl
              font-black

              mt-6

              bg-gradient-to-r
              from-white
              to-gray-300

              bg-clip-text
              text-transparent
            "
          >
            Upload Outstanding Report
          </h2>

          {/* SUBTITLE */}
          <p
            className="
              text-gray-400
              mt-3

              text-sm
              leading-7

              max-w-xl
              mx-auto
            "
          >
            Upload your Excel report to instantly
            analyze pending billing jobs,
            aging status, ETA/ETD delays,
            and operational insights.
          </p>

          {/* FOOTER */}
          <p
            className="
              text-xs
              text-gray-500

              mt-8
            "
          >
            Drag & drop or click to browse
          </p>
        </div>
      </div>
    </motion.div>
  );
}