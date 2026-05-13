"use client";

import { Checkbox } from "@/components/ui/checkbox";

import { Input } from "@/components/ui/input";

import {
  Search,
  SlidersHorizontal,
} from "lucide-react";

import { motion } from "framer-motion";

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

    ...new Set(
      jobs
        .map((j) => j.prefix)
        .filter(Boolean)
    ),
  ];

  return (

    <motion.div

      initial={{
        opacity: 0,
        y: 15,
      }}

      animate={{
        opacity: 1,
        y: 0,
      }}

      transition={{
        duration: 0.3,
      }}

      className="
        glass-card

        rounded-[30px]

        border
        border-white/10

        p-5

        sticky
        top-4
        z-50

        backdrop-blur-2xl

        shadow-2xl
      "
    >

      {/* TOP */}

      <div
        className="
          flex
          items-center
          justify-between

          mb-5
        "
      >

        <div className="flex items-center gap-3">

          <div
            className="
              w-11
              h-11

              rounded-2xl

              bg-[#00FF28]/10

              flex
              items-center
              justify-center
            "
          >

            <SlidersHorizontal
              className="
                w-5
                h-5
                text-[#00FF28]
              "
            />

          </div>

          <div>

            <h2
              className="
                text-xl
                font-bold
              "
            >
              Filters
            </h2>

            <p className="text-gray-400 text-sm">
              Search & filter pending jobs
            </p>

          </div>

        </div>

      </div>

      {/* CONTENT */}

      <div
        className="
          flex
          flex-col
          xl:flex-row

          gap-5
        "
      >

        {/* SEARCH */}

        <div className="relative flex-1">

          <Search
            className="
              absolute
              left-4
              top-1/2
              -translate-y-1/2

              w-5
              h-5

              text-gray-500
            "
          />

          <Input
            placeholder="Search Job No / Customer..."

            value={search}

            onChange={(e) =>
              setSearch(
                e.target.value
              )
            }

            className="
              h-12

              pl-12

              rounded-2xl

              bg-[#111827]

              border
              border-white/10

              text-white

              placeholder:text-gray-500

              focus-visible:ring-2
              focus-visible:ring-[#00FF28]/40
            "
          />

        </div>

        {/* PREFIX FILTERS */}

        <div
          className="
            flex
            flex-wrap

            gap-2
          "
        >

          {prefixes.map(
            (prefix) => (

              <button
                key={prefix}

                onClick={() =>
                  setSelectedPrefix(
                    prefix
                  )
                }

                className={`
                  px-4
                  py-2.5

                  rounded-2xl

                  text-sm
                  font-medium

                  transition-all
                  duration-300

                  border

                  ${
                    selectedPrefix ===
                    prefix

                      ? `
                        bg-[#00FF28]
                        text-black

                        border-[#00FF28]

                        shadow-lg
                        shadow-[#00FF28]/20
                      `

                      : `
                        bg-[#111827]

                        text-gray-300

                        border-white/10

                        hover:border-[#00FF28]/40
                        hover:text-white
                      `
                  }
                `}
              >

                {prefix}

              </button>

            )
          )}

        </div>

      </div>

      {/* FOOTER */}

      <div
        className="
          flex
          items-center
          justify-between

          mt-5
          pt-5

          border-t
          border-white/10
        "
      >

        {/* CHECKBOX */}

        <div
          className="
            flex
            items-center
            gap-3
          "
        >

          <Checkbox
            checked={
              showBlankDates
            }

            onCheckedChange={(v) =>
              setShowBlankDates(
                !!v
              )
            }

            className="
              border-white/20
              data-[state=checked]:bg-[#00FF28]
              data-[state=checked]:border-[#00FF28]
            "
          />

          <span
            className="
              text-sm
              text-gray-300
            "
          >
            Show Blank ETA / ETD
          </span>

        </div>

        {/* TOTAL PREFIX */}

        <div
          className="
            text-xs
            text-gray-500
          "
        >

          {prefixes.length - 1} prefixes

        </div>

      </div>

    </motion.div>
  );
}