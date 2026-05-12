import * as XLSX from "xlsx-js-style";

export function exportStyledExcel(
  jobs: any[]
) {

  // TITLE ROW
  const title = [
    ["COMPASS ANALYSIS"]
  ];

  // DATE ROW
  const dateRow = [
    [
      `Generated: ${new Date().toLocaleString()}`
    ]
  ];

  // EMPTY ROW
  const empty = [[]];

  // HEADERS
  const headers = [[
    "Job No",
    "Prefix",
    "Customer",
    "Pending Days",
    "Status",
  ]];

  // DATA
  const data = jobs.map((job) => [

    job.JobNo,

    job.prefix,

    job.Customer,

    job.pendingDays ?? "-",

    job.agingBucket,
  ]);

  // COMBINE
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
    { wch: 25 },
    { wch: 12 },
    { wch: 40 },
    { wch: 15 },
    { wch: 18 },
  ];

  // TITLE STYLE
  ws["A1"].s = {

    font: {
      bold: true,
      sz: 15,
      color: {
        rgb: "10B759"
      },
    },

    alignment: {
      horizontal: "center",
    },
  };

  // HEADER STYLE
  const headerRow = 4;

  ["A", "B", "C", "D", "E"]
    .forEach((col) => {

      ws[`${col}${headerRow}`].s = {

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
        },
      };
    });

  // ROW COLORS
  data.forEach((row, index) => {

    const excelRow =
      index + 5;

    const status =
      row[4];

    let bgColor =
      "FFFFFF";

    let textColor =
      "000000";

    if (status === "Normal") {
      bgColor = "DCFCE7";
      textColor = "166534";
    }

    if (status === "Attention") {
      bgColor = "FEF9C3";
      textColor = "854D0E";
    }

    if (status === "Critical") {
      bgColor = "FED7AA";
      textColor = "9A3412";
    }

    if (status === "Escalation") {
      bgColor = "FECACA";
      textColor = "991B1B";
    }

    ["A", "B", "C", "D", "E"]
      .forEach((col) => {

        ws[`${col}${excelRow}`].s = {

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
        };
      });
  });

  // WORKBOOK
  const wb =
    XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(
    wb,
    ws,
    "Pending Jobs"
  );

  // DOWNLOAD
  XLSX.writeFile(
    wb,
    `Compass_Analysis_${Date.now()}.xlsx`
  );
}