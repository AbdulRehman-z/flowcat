import { Suspense } from "react"
import { Metadata } from "next"
import { getCommunityPromptCategories } from "@/actions/prompts"
import { CommunityPromptCategories } from "@/components/prompts/community-prompt-categories"
import { CommunityPromptsHeader } from "@/components/prompts/community-prompts-header"
import { PromptsLoading } from "@/components/prompts/prompts-loading"

export const metadata: Metadata = {
  title: "Community Prompts | AI Assistant",
  description: "Explore prompts shared by the community",
}

export default async function CommunityPromptsPage() {
  const categories = await getCommunityPromptCategories()

  return (
    <div className="container py-8 px-4 md:px-6  mx-auto flex flex-col gap-y-10">
      <CommunityPromptsHeader />
      <Suspense fallback={<PromptsLoading />}>
        <CommunityPromptCategories initialCategories={categories} />
      </Suspense>
    </div>
  )
}
