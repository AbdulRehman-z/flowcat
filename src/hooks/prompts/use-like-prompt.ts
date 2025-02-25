import { LikePrompt } from "@/actions/prompts/like-prompt-action";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const useLikePublicPrompt = (category: string, promptId: string) => {
  const queryClient = useQueryClient()

  const { mutate: likePrompt, isPending: isLiking } = useMutation({
    mutationFn: () => LikePrompt(promptId),
    onMutate: async (promptId) => {
      // Optimistic update
      await queryClient.cancelQueries({
        queryKey: [`prompts-category/${category}`]
      });

      const previousPrompts = queryClient.getQueryData([`prompts-category/${category}`]);

      queryClient.setQueryData([`prompts-category/${category}`], (old: any) =>
        old.map(prompt =>
          prompt.id === promptId
            ? {
              ...prompt,
              likes: prompt.isLikedByUser ? prompt.likes - 1 : prompt.likes + 1,
              isLikedByUser: !prompt.isLikedByUser
            }
            : prompt
        )
      );

      return { previousPrompts };
    },
    onError: (err, promptId, context) => {
      queryClient.setQueryData(
        [`prompts-category/${category}`],
        context?.previousPrompts
      );
      toast.error("Failed to update like status");
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: [`prompts-category/${category}`]
      });
    }
  });

  return { likePrompt, isLiking };
}
