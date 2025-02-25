import { RemoveFavourite } from "@/actions/prompts/remove-favourite"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

export const useRemoveFavouritePrompt = () => {
  const queryClient = useQueryClient()

  const { mutate: removeFavourite, isPending: isRemoving } = useMutation({
    mutationFn: RemoveFavourite,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["favourite-prompts"] })
      toast.success("Prompt deleted successfully")
    },
    onError: (error) => {
      toast.error(error.message)
    }
  })

  return { removeFavourite, isRemoving }
}
