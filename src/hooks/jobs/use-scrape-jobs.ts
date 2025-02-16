import { ScrapeJobsAction } from "@/actions/jobs/scrape-jobs-action"
import { useJobsStatusContext } from "@/contexts/jobs-status-context"
import { useQuery } from "@tanstack/react-query"




export const useScrapeJobs = () => {
  const { refreshingJobsInterval } = useJobsStatusContext()
  console.log({ refreshingJobsInterval })


  const { data: jobs, isRefetching: isRefetching } = useQuery({
    queryKey: ["jobs"],
    queryFn: ScrapeJobsAction,
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    staleTime: refreshingJobsInterval,
    refetchInterval: refreshingJobsInterval,
  })

  return { jobs, isRefetching }
}
