import * as XLSX from "xlsx-js-style";

export function exportStyledExcel(
  jobs: any[]
) {

  // TITLE
  const title = [
    ["COMPASS ANALYSIS"]
  ];

  // GENERATED DATE
  const dateRow = [[
    `Generated: ${new Date().toLocaleString()}`
  ]];

  // EMPTY ROW
  const empty = [[]];

  // HEADERS
  const headers = [[
    "Job No",
    "Job Date",
    "Customer",
    "ETD",
    "ETA",
    "Prepared By",
    "Prefix",
    "Pending Days",
    "Status",
  ]];

  // FORMAT DATE
  const formatDate = (
    value: any
  ) => {

    if (!value)
      return "-";

    const date =
      new Date(value);

    if (
      isNaN(
        date.getTime()
      )
    ) {
      return "-";
    }

    return date.toLocaleDateString(
      "en-GB"
    );
  };

  // DATA
  const data = jobs.map(
    (job) => [

      job.JobNo,

      formatDate(
        job.JobDate
      ),

      job.Customer,

      formatDate(
        job.ETD
      ),

      formatDate(
        job.ETA
      ),

      job.PreparedBy || "-",

      job.prefix,

      job.pendingDays ?? "-",

      job.agingBucket,
    ]
  );

  // FINAL DATA
  const finalData = [
    ...title,
    ...dateRow,
    ...empty,
    ...headers,
    ...data,
  ];

  // SHEET
  const ws =
    XLSX.utils.aoa_to_sheet(
      finalData
    );

  // COLUMN WIDTHS
  ws["!cols"] = [

    { wch: 28 }, // Job No

    { wch: 15 }, // Job Date

    { wch: 40 }, // Customer

    { wch: 15 }, // ETD

    { wch: 15 }, // ETA

    { wch: 20 }, // Prepared By

    { wch: 12 }, // Prefix

    { wch: 15 }, // Pending Days

    { wch: 18 }, // Status
  ];

  // MERGE TITLE
  ws["!merges"] = [
    {
      s: { r: 0, c: 0 },
      e: { r: 0, c: 8 },
    },
  ];

  // TITLE STYLE
  ws["A1"].s = {

    font: {
      bold: true,
      sz: 18,
      color: {
        rgb: "10B759"
      },
    },

    alignment: {
      horizontal: "center",
      vertical: "center",
    },
  };

  // HEADER STYLE
  const headerRow = 4;

  [
    "A",
    "B",
    "C",
    "D",
    "E",
    "F",
    "G",
    "H",
    "I",
  ].forEach((col) => {

    ws[
      `${col}${headerRow}`
    ].s = {

      font: {
        bold: true,
        color: {
          rgb: "FFFFFF"
        },
      },

      fill: {
        fgColor: {
          rgb: "10B759"
        },
      },

      alignment: {
        horizontal: "center",
        vertical: "center",
      },

      border: {

        top: {
          style: "thin",
          color: {
            rgb: "D1D5DB"
          },
        },

        bottom: {
          style: "thin",
          color: {
            rgb: "D1D5DB"
          },
        },

        left: {
          style: "thin",
          color: {
            rgb: "D1D5DB"
          },
        },

        right: {
          style: "thin",
          color: {
            rgb: "D1D5DB"
          },
        },
      },
    };
  });

  // ROW COLORS
  data.forEach(
    (row, index) => {

      const excelRow =
        index + 5;

      const status =
        row[8];

      let bgColor =
        "FFFFFF";

      let textColor =
        "000000";

      // STATUS COLORS
      if (
        status ===
        "Normal"
      ) {

        bgColor =
          "DCFCE7";

        textColor =
          "166534";
      }

      if (
        status ===
        "Attention"
      ) {

        bgColor =
          "FEF9C3";

        textColor =
          "854D0E";
      }

      if (
        status ===
        "Critical"
      ) {

        bgColor =
          "FED7AA";

        textColor =
          "9A3412";
      }

      if (
        status ===
        "Escalation"
      ) {

        bgColor =
          "FECACA";

        textColor =
          "991B1B";
      }

      [
        "A",
        "B",
        "C",
        "D",
        "E",
        "F",
        "G",
        "H",
        "I",
      ].forEach((col) => {

        ws[
          `${col}${excelRow}`
        ].s = {

          fill: {
            fgColor: {
              rgb: bgColor
            },
          },

          font: {
            color: {
              rgb: textColor
            },
          },

          border: {

            top: {
              style: "thin",
              color: {
                rgb: "E5E7EB"
              },
            },

            bottom: {
              style: "thin",
              color: {
                rgb: "E5E7EB"
              },
            },

            left: {
              style: "thin",
              color: {
                rgb: "E5E7EB"
              },
            },

            right: {
              style: "thin",
              color: {
                rgb: "E5E7EB"
              },
            },
          },
        };
      });
    }
  );

  // WORKBOOK
  const wb =
    XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(
    wb,
    ws,
    "Pending Jobs"
  );

  // EXPORT
  XLSX.writeFile(
    wb,
    `Compass_Analysis_${Date.now()}.xlsx`
  );
}