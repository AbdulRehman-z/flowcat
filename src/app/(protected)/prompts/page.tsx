import { GetPromptsAction } from "@/actions/prompts/get-prompts-action"
import PromptsPageContent from "@/components/prompts/prompts-page-content"
import { Suspense } from "react"
import { LoadingOverlay } from "@/components/loading-overlay"

export default async function Page() {
  const initialData = await GetPromptsAction()

  return (
    <div className="flex h-full w-full">
      <div className="w-full bg-background p-6">
        <Suspense fallback={<LoadingOverlay />}>
          <PromptsPageContent initialData={initialData} />
        </Suspense>
      </div>
    </div>
  )
}
