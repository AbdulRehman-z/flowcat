import { GetPromptAction } from "@/actions/prompts/get-prompt-action"
import { useQuery } from "@tanstack/react-query"

export const useGetPrompt = (promptId: string | null, initialData?: any) => {
  return useQuery({
    queryKey: [`prompt-${promptId}`],
    queryFn: () => GetPromptAction(promptId!),
    enabled: promptId !== null,
    initialData,
    staleTime: 1000 * 60 * 5 // 5 minutes
  })
}
