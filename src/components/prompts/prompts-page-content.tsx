"use client"

import type { GetPromptsAction } from "@/actions/prompts/get-prompts-action"
import { useState } from "react"
import { EmptyPromptState } from "./empty-prompt-state"
import { PromptDetails } from "./prompt-details"
import { UserPromptsViewer } from "./user-prompts-viewer"

type UserPromptsPageProps = {
  initialData: Awaited<ReturnType<typeof GetPromptsAction>>
}

export default function UserPromptsPageContent({ initialData }: UserPromptsPageProps) {
  const [selectedPrompt, setSelectedPrompt] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")

  return (
    <div className="grid h-full w-full grid-cols-1 md:grid-cols-4">
      {/* Sidebar */}
      <div className="col-span-1 overflow-hidden border-r border-border">
        <UserPromptsViewer
          selectedPrompt={selectedPrompt}
          setSelectedPrompt={setSelectedPrompt}
          initialData={initialData}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />
      </div>

      {/* Main content */}
      <div className="col-span-1 md:col-span-3 overflow-auto bg-background">
        {selectedPrompt ? (
          <PromptDetails promptId={selectedPrompt} />
        ) : (
          <EmptyPromptState />
        )}
      </div>
    </div>
  )
}
