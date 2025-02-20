import { DeletePromptAction } from "@/actions/prompts/delete-prompt-action"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

export const useDeletePrompt = (promptId: string) => {
  const queryClient = useQueryClient()

  const { mutate: deletePrompt, isPending: isDeleting, isSuccess } = useMutation({
    // mutationKey: [`prompt-${promptId}`],
    mutationFn: DeletePromptAction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["prompts"] })
      // queryClient.invalidateQueries({ queryKey: [`prompt-${promptId}`] })

      toast.success("Prompt deleted successfully")

    },
    onError: (error) => {
      toast.error(error.message)
    }
  })

  return { deletePrompt, isDeleting, isSuccess }
}
