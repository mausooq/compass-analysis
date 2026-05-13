export interface Job {

  JobNo: string;

  JobDate?: string;

  Customer: string;

  ETA?: string;

  ETD?: string;

  DLV?: string;

  PreparedBy?: string;

  prefix: string;

  pendingDays: number | null;

  agingBucket: string;
}