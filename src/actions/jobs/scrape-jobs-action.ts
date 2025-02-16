"use server";

import { ExecuteScraping } from "@/lib/jobs/execute-scraping";

export const ScrapeJobsAction = async () => {
  const jobs = await ExecuteScraping()
  return jobs
}
