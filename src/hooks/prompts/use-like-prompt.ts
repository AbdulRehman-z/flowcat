import { useState } from "react"
import { toast } from "@/hooks/use-toast"
import { LikePublicPromptAction } from "@/actions/prompts/like-public-prompt-action"

export function useLikePublicPrompt(promptId: string, category: string) {
  const [isLiking, setIsLiking] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const likePrompt = async () => {
    try {
      setIsLiking(true)
      await LikePublicPromptAction(promptId)
      return true
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to like prompt"
      setError(err instanceof Error ? err : new Error(errorMessage))
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      })
      return false
    } finally {
      setIsLiking(false)
    }
  }

  return { likePrompt, isLiking, error }
}
