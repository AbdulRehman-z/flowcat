import { AddPromptAction } from "@/actions/prompts/add-prompt-action"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

export const useAddPrompt = () => {
  const queryClient = useQueryClient();

  const { mutate: addPrompt, isPending: isAdding, isSuccess } = useMutation({
    mutationKey: ["prompts"],
    mutationFn: AddPromptAction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["prompts"] });
      toast.success("Prompt added successfully")

    },
    onError: (error) => {
      toast.error(error.message)
    }
  })

  return { addPrompt, isAdding, isSuccess }
}
