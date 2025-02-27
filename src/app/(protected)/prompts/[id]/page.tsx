import { Suspense } from "react"
import { Metadata } from "next"
import { notFound } from "next/navigation"
import { getPrompt } from "@/actions/prompts"
import { PromptDetails } from "@/components/prompts/prompt-details"
import { PromptDetailsSkeleton } from "@/components/prompts/prompt-details-skeleton"

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const prompt = await getPrompt(params.id)
  
  if (!prompt) {
    return {
      title: "Prompt Not Found",
    }
  }
  
  return {
    title: `${prompt.name} | Prompts`,
    description: `Details for prompt: ${prompt.name}`,
  }
}

export default async function PromptPage({ params }: { params: { id: string } }) {
  const prompt = await getPrompt(params.id)
  
  if (!prompt) {
    notFound()
  }
  
  return (
    <div className="container py-8 px-4 md:px-6 max-w-5xl mx-auto">
      <Suspense fallback={<PromptDetailsSkeleton />}>
        <PromptDetails prompt={prompt} promptId={params.id} />
      </Suspense>
    </div>
  )
} 