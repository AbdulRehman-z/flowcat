"use client"

import type { GetPromptsAction } from "@/actions/prompts/get-prompts-action"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { type Dispatch, type SetStateAction } from "react"
import { AddPromptDialog } from "../jobs/add-prompt-dialog"
import CommunityPromptsTabContent from "./community-prompts-tab-content"
import MyPromptsTabContent from "./my-prompts-tab-content"

type promptsViewerProps = {
  initialData: Awaited<ReturnType<typeof GetPromptsAction>>
  selectedPromptId: string | null
  setSelectedPrompt: Dispatch<SetStateAction<string | null>>
  selectedCategory: string | null
  setSelectedCategory: Dispatch<SetStateAction<string | null>>
  searchQuery: string
  setSearchQuery: Dispatch<SetStateAction<string>>
  communityTabSelected: boolean
  setCommunityTabSelected: Dispatch<SetStateAction<boolean>>
  userPromptsFound: boolean
  setUserPromptsFound: Dispatch<SetStateAction<boolean>>
}

export function PromptsViewer({
  initialData,
  selectedPromptId,
  setSelectedPrompt,
  selectedCategory,
  setSelectedCategory,
  searchQuery,
  setSearchQuery,
  communityTabSelected,
  setCommunityTabSelected,
  userPromptsFound,
  setUserPromptsFound,
}: promptsViewerProps) {

  function handleTabChange(value: string) {
    if (value === "my-prompts") {
      setCommunityTabSelected(false)
    } else if (value === "community-prompts") {
      setCommunityTabSelected(true)
    }
  }

  return (
    <div className="flex min-h-full  flex-col justify-between p-4">
      <div className="flex flex-col space-y-6">
        <h1 className="text-xl font-semibold tracking-tight">Prompt Library</h1>
        <Tabs defaultValue="my-prompts" className="w-full" onValueChange={handleTabChange}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="my-prompts" className="flex items-center gap-2" >
              My prompts
            </TabsTrigger>
            <TabsTrigger value="community-prompts" className="flex items-center gap-2" >
              Community
            </TabsTrigger>
          </TabsList>

          <MyPromptsTabContent initialData={initialData} selectedPromptId={selectedPromptId} setSelectedPrompt={setSelectedPrompt} promptsFound={userPromptsFound} setPromptsFound={setUserPromptsFound} />

          <CommunityPromptsTabContent selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory} communitySelected={communityTabSelected} />
        </Tabs>
      </div>

      <div className="mb-6">
        <AddPromptDialog />
      </div>
    </div>
  )
}
