import { Suspense } from "react"
import { Metadata } from "next"
import { notFound } from "next/navigation"
import { getPromptsByCategory } from "@/actions/prompts"
import { CategoryPromptsList } from "@/components/prompts/category-prompts-list"
import { CategoryPromptsHeader } from "@/components/prompts/category-prompts-header"
import { PromptsLoading } from "@/components/prompts/prompts-loading"

export async function generateMetadata({ params }: { params: { category: string } }): Promise<Metadata> {
  return {
    title: `${params.category} Prompts | Community`,
    description: `Explore ${params.category} prompts shared by the community`,
  }
}

export default async function CategoryPromptsPage({ params }: { params: { category: string } }) {
  const prompts = await getPromptsByCategory(params.category)

  if (!prompts || prompts.length === 0) {
    notFound()
  }

  return (
    <div className="container py-8 px-4 md:px-6 flex flex-col gap-y-10  mx-auto">
      <CategoryPromptsHeader category={params.category} />
      <Suspense fallback={<PromptsLoading />}>
        <CategoryPromptsList initialPrompts={prompts} category={params.category} />
      </Suspense>
    </div>
  )
}
