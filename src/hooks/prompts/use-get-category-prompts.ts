import { GetCategoryPrompts } from "@/actions/prompts/get-category-prompts-action";
import { useQuery } from "@tanstack/react-query";

export const useGetCategoryPrompts = (categoryName: string) => {
  const { data: categoryPrompts, isLoading: isFetching } = useQuery({
    queryKey: [`prompts-category/${categoryName}`],
    queryFn: async () => await GetCategoryPrompts(categoryName),
    staleTime: 1000 * 60 * 60 * 24 // 24 hours

  })

  return { categoryPrompts, isFetching };
};
