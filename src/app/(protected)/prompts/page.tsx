import { GetPromptsAction } from "@/actions/prompts/get-prompts-action"
import UserPromptsPageContent from "@/components/prompts/prompts-page-content"
import { Suspense } from "react"

export default async function Page() {
  const initialData = await GetPromptsAction()

  return (
    <div className="flex h-full w-full">
      < div className="w-full bg-background" >
        <Suspense fallback={<div>Loading...</div>}>
          <UserPromptsPageContent initialData={initialData} />
        </Suspense>
      </div >
    </div >
  )
}
