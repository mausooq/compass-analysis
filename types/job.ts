export interface Job {
  JobNo: string;
  Customer?: string;
  Shipper?: string;
  Consignee?: string;
  ETA?: string;
  ETD?: string;
  Status?: string;

  prefix: string;
  pendingDays: number | null;
  agingBucket: string;
}