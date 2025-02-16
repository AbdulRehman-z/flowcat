"use client";

import { Job } from "@/types/jobs";
import { createContext, Dispatch, ReactNode, SetStateAction, useContext, useState } from "react";

type JobsStatusContextType = {
  jobs: Job[];
  setJobs: Dispatch<SetStateAction<Job[]>>;
  isScraping: boolean;
  setIsScraping: Dispatch<SetStateAction<boolean>>;
  refreshingJobsInterval: number;
  setRefreshingJobsInterval: Dispatch<SetStateAction<number>>;
  totalJobs: number;
  setTotalJobs: Dispatch<SetStateAction<number>>;
}

const JobsContext = createContext<JobsStatusContextType | undefined>(undefined);

function JobsStatusContextProvider({ children }: { children: ReactNode }) {
  const [isScraping, setIsScraping] = useState(false);
  const [refreshingJobsInterval, setRefreshingJobsInterval] = useState(60000);
  const [totalJobs, setTotalJobs] = useState(0);
  const [jobs, setJobs] = useState<Job[]>([]);

  return (
    <JobsContext.Provider value={{ isScraping, refreshingJobsInterval, totalJobs, setIsScraping, setRefreshingJobsInterval, setTotalJobs, jobs, setJobs }}>
      {children}
    </JobsContext.Provider>
  );
}


export function useJobsStatusContext() {
  const context = useContext(JobsContext)
  if (context === undefined) {
    throw new Error("useJobsStatusContext must be used within a JobsStatusContextProvider")
  }
  return context
}

export default JobsStatusContextProvider;
