"use server";

import { initializeScraper, loginToUpwork, scrapeJobs } from "@/lib/jobs/upwork-auth";

export const ScrapeJobsAction = async () => {
  const { browser, page } = await initializeScraper()
  const login = await loginToUpwork(browser, page)
  console.log({ login })
  // const results = await scrapeJobs(page)
  // console.log()
}
