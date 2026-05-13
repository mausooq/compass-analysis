import * as XLSX from "xlsx";
import { RULES } from "./rules";
import { differenceInDays } from "date-fns";

type ExcelRow = Record<string, any>;

export async function parseExcel(file: File) {
  // READ FILE
  const data = await file.arrayBuffer();

  const workbook = XLSX.read(data, {
    type: "array",
    cellDates: true,
  });

  // ONLY FIRST SHEET
  const firstSheet = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[firstSheet];

  // ✅ FIX: strongly typed output
  const rows = XLSX.utils.sheet_to_json<ExcelRow>(worksheet, {
    raw: false,
    defval: "",
  });

  // REMOVE DUPLICATES
  const uniqueMap = new Map<string, ExcelRow>();

  rows.forEach((row: ExcelRow) => {
    const jobNo = String(
      row["Job No"] ||
        row["JOB NO"] ||
        row["JobNo"] ||
        ""
    ).trim();

    if (!jobNo) return;

    if (!uniqueMap.has(jobNo)) {
      uniqueMap.set(jobNo, row);
    }
  });

  const uniqueRows = Array.from(uniqueMap.values());

  // FINAL DATA
  return uniqueRows.map((row: ExcelRow) => {
    const jobNo = String(
      row["Job No"] ||
        row["JOB NO"] ||
        row["JobNo"] ||
        ""
    ).trim();

    const prefix = jobNo.split("/")[1] || "";

    const rule = RULES[prefix];

    const eta = parseExcelDate(row["ETA"]);
    const etd = parseExcelDate(row["ETD"]);
    const dlv = parseExcelDate(row["DLV"]);

    let selectedDate: Date | null = null;

    if (rule === "ETA") selectedDate = eta;
    if (rule === "ETD") selectedDate = etd;
    if (rule === "DLV") selectedDate = dlv;

    let pendingDays: number | null = null;

    if (selectedDate) {
      const calculatedDays = differenceInDays(
        new Date(),
        selectedDate
      );

      pendingDays = calculatedDays < 0 ? 0 : calculatedDays;
    }

    return {
      JobNo: jobNo,

      Customer: String(
        row["Customer"] ||
          row["CUSTOMER"] ||
          ""
      ),

      ETA: eta,
      ETD: etd,
      DLV: dlv,

      prefix,
      pendingDays,

      agingBucket: getAgingBucket(pendingDays),
    };
  });
}

// DATE PARSER
function parseExcelDate(value: any): Date | null {
  if (!value) return null;

  // already date
  if (value instanceof Date) return value;

  // excel serial
  if (!isNaN(value)) {
    const parsed = XLSX.SSF.parse_date_code(Number(value));

    if (!parsed) return null;

    return new Date(parsed.y, parsed.m - 1, parsed.d);
  }

  // string date
  const date = new Date(value);

  return isNaN(date.getTime()) ? null : date;
}

// STATUS
function getAgingBucket(days: number | null) {
  if (days === null) return "No Date";
  if (days === 0) return "Upcoming";
  if (days <= 7) return "Normal";
  if (days <= 15) return "Attention";
  if (days <= 30) return "Critical";
  return "Escalation";
}