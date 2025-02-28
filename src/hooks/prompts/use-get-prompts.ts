import { GetPromptsAction } from "@/actions/prompts/get-prompts-action"
import { useQuery } from "@tanstack/react-query"

export const useGetPrompts = (initialData?: Awaited<ReturnType<typeof GetPromptsAction>>) => {
  const { data: prompts, isFetching: isFetchingPrompts } = useQuery({
    queryKey: [`prompts`],
    queryFn: GetPromptsAction,
    initialData,
    staleTime: Infinity
    // enabled: !!userId
  })

  return { prompts, isFetchingPrompts }
}
