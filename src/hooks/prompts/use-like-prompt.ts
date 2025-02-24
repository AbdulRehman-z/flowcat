import { LikePrompt } from "@/actions/prompts/like-prompt-action"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

export const useLikePublicPrompt = (category: string) => {
  const queryClient = useQueryClient()

  const { mutate: likePrompt, isPending: isLiking } = useMutation({
    mutationFn: LikePrompt,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [`prompts-category/${category}`]
      })
      toast.success("Prompt liked successfully")
    },
    onError: (error) => {
      toast.error(error.message)
    }
  })

  return { likePrompt, isLiking }
}
