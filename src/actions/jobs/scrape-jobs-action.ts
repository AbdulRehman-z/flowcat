"use server";

import { ExecuteScraping } from "@/lib/jobs/execute-scraping";

export const ScrapeJobsAction = async (url: string) => {
  console.log({ url })
  const jobs = await ExecuteScraping(url);
  return jobs;
}
