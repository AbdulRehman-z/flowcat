import { editPrompt as editPromptAction } from "@/actions/prompts"
import { useState } from "react"
import { toast } from "@/hooks/use-toast"
import { CreateNewPromptSchemaType } from "@/schemas/prompts-schema"

export function useEditPrompt(promptId: string) {
  const [isEditing, setIsEditing] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const editPrompt = async (data: Partial<CreateNewPromptSchemaType>) => {
    try {
      setIsEditing(true)
      await editPromptAction(promptId, data)
      toast({
        title: "Prompt updated",
        description: "Your prompt has been updated successfully.",
      })
      return true
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to update prompt"
      setError(err instanceof Error ? err : new Error(errorMessage))
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      })
      return false
    } finally {
      setIsEditing(false)
    }
  }

  return { editPrompt, isEditing, error }
}
