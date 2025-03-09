import { GetSavedJobsAction } from "@/actions/jobs/get-saved-jobs-action"
import { useQuery } from "@tanstack/react-query"

export const useGetSavedJobs = (mounted: boolean) => {
  const { data: savedJobs, isFetching } = useQuery({
    queryKey: ["saved-jobs"],
    queryFn: GetSavedJobsAction,
    enabled: mounted,
    staleTime: Infinity,
  })

  return {
    savedJobs,
    isFetching
  }
}
