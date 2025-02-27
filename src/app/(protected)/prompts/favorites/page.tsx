import { Suspense } from "react"
import { Metadata } from "next"
import { getFavoritePrompts } from "@/actions/prompts"
import { FavoritePromptsList } from "@/components/prompts/favorite-prompts-list"
import { FavoritePromptsHeader } from "@/components/prompts/favorite-prompts-header"
import { PromptsLoading } from "@/components/prompts/prompts-loading"

export const metadata: Metadata = {
  title: "Favorite Prompts | AI Assistant",
  description: "Your favorite AI prompts",
}

export default async function FavoritePromptsPage() {
  const favoritePrompts = await getFavoritePrompts()

  return (
    <div className="container py-8 px-4 md:px-6 flex flex-col gap-y-10 mx-auto">
      <FavoritePromptsHeader />
      <Suspense fallback={<PromptsLoading />}>
        <FavoritePromptsList initialPrompts={favoritePrompts} />
      </Suspense>
    </div>
  )
}
