import * as XLSX from "xlsx";

import { RULES } from "./rules";

import { differenceInDays } from "date-fns";

type ExcelRow = Record<string, any>;

export async function parseExcel(
  file: File
) {

  // READ FILE
  const data =
    await file.arrayBuffer();

  const workbook =
    XLSX.read(data, {
      type: "array",
      cellDates: true,
    });

  // FIRST SHEET
  const firstSheet =
    workbook.SheetNames[0];

  const worksheet =
    workbook.Sheets[firstSheet];

  // ROWS
  const rows =
    XLSX.utils.sheet_to_json<ExcelRow>(
      worksheet,
      {
        raw: false,
        defval: "",
      }
    );

  // REMOVE DUPLICATES
  const uniqueMap =
    new Map<string, ExcelRow>();

  rows.forEach((row) => {

    const jobNo = String(

      row["JobNo"] ||

      row["JOBNO"] ||

      row["Job No"] ||

      ""

    ).trim();

    if (!jobNo) return;

    if (!uniqueMap.has(jobNo)) {

      uniqueMap.set(
        jobNo,
        row
      );
    }
  });

  // UNIQUE DATA
  const uniqueRows =
    Array.from(
      uniqueMap.values()
    );

  // FINAL PARSED DATA
  return uniqueRows.map((row) => {

    // JOB NO
    const jobNo = String(

      row["JobNo"] ||

      row["JOBNO"] ||

      row["Job No"] ||

      ""

    ).trim();

    // PREFIX
    const prefix =
      jobNo.split("/")[1] || "";

    // RULE
    const rule =
      RULES[prefix];

    // DATES
    const jobDate =
      parseExcelDate(
        row["JobDate"]
      );

    const eta =
      parseExcelDate(
        row["ETA"]
      );

    const etd =
      parseExcelDate(
        row["ETD"]
      );

    // PREPARED BY
    const preparedBy = String(

      row["PreparedBy"] ||

      row["PREPAREDBY"] ||

      ""

    );

    // SELECT DATE
    let selectedDate:
      Date | null = null;

    if (rule === "ETA") {
      selectedDate = eta;
    }

    if (rule === "ETD") {
      selectedDate = etd;
    }

    // PENDING DAYS
    let pendingDays:
      number | null = null;

    if (selectedDate) {

      const calculatedDays =
        differenceInDays(
          new Date(),
          selectedDate
        );

      // NO NEGATIVE
      pendingDays =
        calculatedDays < 0
          ? 0
          : calculatedDays;
    }

    return {

      JobNo: jobNo,

      JobDate: jobDate,

      Customer: String(
        row["Customer"] || ""
      ),

      ETA: eta,

      ETD: etd,

      PreparedBy:
        preparedBy,

      prefix,

      pendingDays,

      agingBucket:
        getAgingBucket(
          pendingDays
        ),
    };
  });
}

// DATE PARSER
function parseExcelDate(
  value: any
): Date | null {

  if (!value)
    return null;

  // ALREADY DATE
  if (value instanceof Date) {
    return value;
  }

  // EXCEL SERIAL
  if (!isNaN(value)) {

    const parsed =
      XLSX.SSF.parse_date_code(
        Number(value)
      );

    if (!parsed)
      return null;

    return new Date(
      parsed.y,
      parsed.m - 1,
      parsed.d
    );
  }

  // STRING DATE
  const date =
    new Date(value);

  return isNaN(
    date.getTime()
  )
    ? null
    : date;
}

// STATUS
function getAgingBucket(
  days: number | null
) {

  if (days === null)
    return "No Date";

  if (days === 0)
    return "Upcoming";

  if (days <= 7)
    return "Normal";

  if (days <= 15)
    return "Attention";

  if (days <= 30)
    return "Critical";

  return "Escalation";
}