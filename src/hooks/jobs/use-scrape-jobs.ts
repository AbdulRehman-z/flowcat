import { ScrapeJobsAction } from "@/actions/jobs/scrape-jobs-action"
import { useJobsStatusContext } from "@/contexts/jobs-status-context"
import { Job } from "@/types/jobs"
import { useQuery } from "@tanstack/react-query"

export const useScrapeJobs = (initialData?: Job[], url: string) => {
  const { refreshingJobsInterval } = useJobsStatusContext()

  const { data: jobs, isLoading, isRefetching } = useQuery({
    queryKey: ["jobs"],
    queryFn: () => ScrapeJobsAction(url),
    refetchOnWindowFocus: false,
    // refetchOnMount: true,
    staleTime: refreshingJobsInterval,
    refetchInterval: refreshingJobsInterval,
    // initialData
  })

  return { jobs, isLoading, isRefetching }
}
