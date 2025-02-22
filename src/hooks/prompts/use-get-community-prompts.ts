import { GetCommunityPromptsCategory } from "@/actions/prompts/get-community-prompts";
import { useQuery } from "@tanstack/react-query";

export const useGetCommunityPromptsCategory = (communitySelected: boolean) => {
  const { data: communityPrompts, isLoading: isFetchingCommunityPrompts } = useQuery({
    queryKey: ["community-prompts"],
    queryFn: GetCommunityPromptsCategory,
    staleTime: 1000 * 60 * 5, // 5 minutes
    enabled: communitySelected,
  })

  return { communityPrompts, isFetchingCommunityPrompts };
};
