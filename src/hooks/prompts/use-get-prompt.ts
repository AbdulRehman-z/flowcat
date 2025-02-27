import { getPrompt } from "@/actions/prompts"
import { useState, useEffect } from "react"

export function useGetPrompt(promptId: string) {
  const [promptData, setPromptData] = useState<any>(null)
  const [isFetchingPromptData, setIsFetchingPromptData] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const fetchPrompt = async () => {
      try {
        setIsFetchingPromptData(true)
        const data = await getPrompt(promptId)
        setPromptData(data)
      } catch (err) {
        setError(err instanceof Error ? err : new Error("Failed to fetch prompt"))
      } finally {
        setIsFetchingPromptData(false)
      }
    }

    fetchPrompt()
  }, [promptId])

  return { promptData, isFetchingPromptData, error }
}
