import { EditPromptAction } from "@/actions/prompts/edit-prompt-action"
import { CreateNewPromptSchemaType } from "@/schemas/prompts-schema"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

export const useEditPrompt = (promptId: string) => {
  const queryClient = useQueryClient()

  const { mutate: editPrompt, isPending: isEditing, isSuccess } = useMutation({
    mutationKey: [`prompt-${promptId}`],
    mutationFn: (data: Partial<CreateNewPromptSchemaType>) => EditPromptAction(promptId, data),
    onSuccess: () => {
      toast.success("Prompt updated successfully")

      queryClient.invalidateQueries({ queryKey: ["prompts"] })
      queryClient.invalidateQueries({ queryKey: [`prompt-${promptId}`] })
      queryClient.invalidateQueries({ queryKey: ["community-prompts"] })

    },
    onError: (error) => {
      toast.error(error.message)
    }
  })

  return { editPrompt, isEditing, isSuccess }
}
