import { Suspense } from "react"
import { Metadata } from "next"
import { PromptsList } from "@/components/prompts/prompts-list"
import { PromptsHeader } from "@/components/prompts/prompts-header"
import { PromptsLoading } from "@/components/prompts/prompts-loading"
import getPrompts from "@/actions/prompts"

export const metadata: Metadata = {
  title: "Prompts | AI Assistant",
  description: "Manage your AI prompts",
}

export default async function PromptsPage() {
  const prompts = await getPrompts()

  return (
    <div className="container py-8 px-4 flex flex-col gap-y-10 md:px-6  mx-auto">
      <PromptsHeader />
      <Suspense fallback={<PromptsLoading />}>
        <PromptsList initialPrompts={prompts} />
      </Suspense>
    </div>
  )
}
