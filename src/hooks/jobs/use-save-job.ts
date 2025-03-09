import { SaveJobAction } from "@/actions/jobs/save-job-action"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { use } from "react"
import { toast } from "sonner"

export const useSaveJob = () => {
  const queryClient = useQueryClient()

  const { mutate: saveJob, isPending: isSaving } = useMutation({
    mutationKey: ['saved-jobs'],
    mutationFn: SaveJobAction,
    onSuccess: () => {
      toast.success('Job saved successfully')
      queryClient.invalidateQueries({
        queryKey: ['saved-jobs']
      })
    },
    onError: () => {
      toast.error('Failed to save job')
    }
  })

  return {
    saveJob,
    isSaving
  }
}
