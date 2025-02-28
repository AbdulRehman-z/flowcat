import { SetDefaultPrompt } from "@/actions/prompts/set-default-prompt-action"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

export const useSetDefault = (promptId: string) => {
  const queryClient = useQueryClient()

  const { mutate: setDefault, isPending } = useMutation({
    mutationFn: () => SetDefaultPrompt(promptId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`prompt-${promptId}`] })
      toast.success("Default prompt updated successfully")
    },
    onError: () => {
      toast.error("Failed to set default prompt")
    }
  })

  return { setDefault, isPending }
}
