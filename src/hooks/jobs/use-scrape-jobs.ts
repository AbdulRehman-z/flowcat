import { ScrapeJobsAction } from "@/actions/jobs/scrape-jobs-action"
import { useQuery } from "@tanstack/react-query"

export const useScrapeJobs = () => {
  const { data: jobs, isPending: isScraping } = useQuery({
    queryKey: ["jobs"],
    queryFn: ScrapeJobsAction,
    refetchInterval: 1000 * 60 * 5, // 5 minutes
  })

  return { jobs, isScraping }
}
