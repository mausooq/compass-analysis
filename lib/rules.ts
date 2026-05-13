export const RULES: Record<string, "ETA" | "ETD" | "DLV"> = {
  // Air
  AIMP: "ETA",
  AEXP: "ETD",
  AI: "ETA",
  AFIMP: "ETA",
  AE: "ETD",

  // Sea
  SEXP: "ETD",
  SCE: "ETD",
  SCEXP: "ETD",
  SIMP: "ETA",

  // Clearance
  CACRT: "ETA",
  CSEXP: "ETD",
  CSIMP: "ETA",
  AFCEXP: "ETD",

  // Crosstrade
  SCRT: "ETA",
  ACRT: "ETA",
  SXT: "ETD",
  AXT: "ETD",

  // Land
  LINL: "DLV",
  LCB: "DLV",
  CLF: "DLV",
};