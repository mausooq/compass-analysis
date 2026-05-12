import { create } from "zustand";
import { Job } from "@/types/job";

interface DashboardState {
  jobs: Job[];

  search: string;

  selectedPrefix: string;

  showBlankDates: boolean;

  aiSummary: string;

  sortBy: string;

  setJobs: (jobs: Job[]) => void;

  setSearch: (search: string) => void;

  setSelectedPrefix: (prefix: string) => void;

  setShowBlankDates: (value: boolean) => void;

  setAiSummary: (summary: string) => void;

  setSortBy: (value: string) => void;
}

export const useDashboardStore = create<DashboardState>((set) => ({

  jobs: [],

  search: "",

  selectedPrefix: "ALL",

  showBlankDates: false,

  aiSummary: "",

  sortBy: "pending-desc",

  setJobs: (jobs) => set({ jobs }),

  setSearch: (search) => set({ search }),

  setSelectedPrefix: (selectedPrefix) =>
    set({ selectedPrefix }),

  setShowBlankDates: (showBlankDates) =>
    set({ showBlankDates }),

  setAiSummary: (aiSummary) =>
    set({ aiSummary }),

  setSortBy: (sortBy) =>
    set({ sortBy }),

}));