"use client";

import { create } from "zustand";
import { ConversionJob } from "@/types/formats";

interface ConversionStore {
  jobs: ConversionJob[];
  isFFmpegLoaded: boolean;
  isFFmpegLoading: boolean;
  addJob: (job: ConversionJob) => void;
  updateJob: (id: string, updates: Partial<ConversionJob>) => void;
  removeJob: (id: string) => void;
  clearJobs: () => void;
  setFFmpegLoaded: (loaded: boolean) => void;
  setFFmpegLoading: (loading: boolean) => void;
}

export const useConversionStore = create<ConversionStore>((set) => ({
  jobs: [],
  isFFmpegLoaded: false,
  isFFmpegLoading: false,
  addJob: (job) => set((state) => ({ jobs: [...state.jobs, job] })),
  updateJob: (id, updates) =>
    set((state) => ({
      jobs: state.jobs.map((j) => (j.id === id ? { ...j, ...updates } : j)),
    })),
  removeJob: (id) =>
    set((state) => ({
      jobs: state.jobs.filter((j) => j.id !== id),
    })),
  clearJobs: () => set({ jobs: [] }),
  setFFmpegLoaded: (loaded) => set({ isFFmpegLoaded: loaded }),
  setFFmpegLoading: (loading) => set({ isFFmpegLoading: loading }),
}));
