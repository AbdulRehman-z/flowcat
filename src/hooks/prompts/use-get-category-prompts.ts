import { GetCategoryPrompts } from "@/actions/prompts/get-category-prompts";
import { useQuery } from "@tanstack/react-query";

export const useGetCategoryPrompts = (categoryName: string) => {
  const { data: categoryPrompts, isFetching } = useQuery({
    queryKey: [`categoryPrompts-${categoryName}`],
    queryFn: async () => await GetCategoryPrompts(categoryName),
  })

  return { categoryPrompts, isFetching };
};
