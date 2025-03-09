import { RemoveSavedJobAction } from "@/actions/jobs/remove-save-job-action"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

export const useDeleteJob = () => {

  const queryClient = useQueryClient()
  const { mutate: removeJob, isPending: isRemoving } = useMutation({
    mutationKey: ['saved-jobs'],
    mutationFn: RemoveSavedJobAction,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['saved-jobs']
      })
      toast.success('Job removed successfully')
    },
    onError: () => {
      toast.error('Failed to remove job')
    }
  })

  return {
    removeJob,
    isRemoving
  }
}
