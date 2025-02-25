import { GetFavouritePromptsAction } from "@/actions/prompts/get-favourite-prompts-action"
import { useQuery } from "@tanstack/react-query"

export const useGetFavouritePrompts = () => {
  const { data: favouritePrompts, isFetching } = useQuery({
    queryKey: ['favouritePrompts'],
    queryFn: GetFavouritePromptsAction,
    staleTime: Infinity,
  })
  return { favouritePrompts, isFetching }
}
