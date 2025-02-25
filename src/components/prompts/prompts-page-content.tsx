"use client"

import type { GetPromptsAction } from "@/actions/prompts/get-prompts-action"
import { useState } from "react"
import { EmptyCategoryState, EmptyFavouriteState, EmptyPromptState, NoPromptsFound } from "./empty-prompt-state"
import { PromptDetails } from "./prompt-details"
import { PromptsViewer } from "./user-prompts-viewer"
import CommunityDetails from "./community-details"
import { MyFavouritePromptDetails } from "./my-favourite-prompt-details"

type PromptsPageProps = {
  initialData: Awaited<ReturnType<typeof GetPromptsAction>>
}

export default function PromptsPageContent({ initialData }: PromptsPageProps) {
  const [selectedPromptId, setSelectedPromptId] = useState<string | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [selectedFavouritePromptId, setSelectedFavouritePromptId] = useState<string | null>(null)
  const [communityTabSelected, setCommunityTabSelected] = useState(false)
  const [myFavouritesTabSelected, setMyFavouritesTabSelected] = useState(false)
  const [userPromptsFound, setUserPromptsFound] = useState(false)
  const [favouritePromptsFound, setFavouritePromptsFound] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  return (
    <div className="grid h-full w-full grid-cols-1 md:grid-cols-4">
      {/* Sidebar */}
      <div className="col-span-1 overflow-hidden border-r border-border">
        <PromptsViewer
          selectedPromptId={selectedPromptId}
          setSelectedPrompt={setSelectedPromptId}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          initialData={initialData}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          communityTabSelected={communityTabSelected}
          setCommunityTabSelected={setCommunityTabSelected}
          userPromptsFound={userPromptsFound}
          setUserPromptsFound={setUserPromptsFound}
          favouritePromptsFound={favouritePromptsFound}
          setFavouritePromptsFound={setFavouritePromptsFound}
          selectedFavouritePromptId={selectedFavouritePromptId}
          setSelectedFavouritePromptId={setSelectedFavouritePromptId}
        />
      </div>

      {/* Main content */}
      <div className="col-span-1 md:col-span-3 overflow-auto bg-background">
        {myFavouritesTabSelected ? (
          selectedFavouritePromptId ? (
            <MyFavouritePromptDetails promptId={selectedFavouritePromptId} />
          ) : (
            <EmptyFavouriteState />
          )
        ) : communityTabSelected ? (
          selectedCategory ? (
            <CommunityDetails categoryName={selectedCategory} />
          ) : (
            <EmptyCategoryState />
          )
        ) : userPromptsFound ? (
          selectedPromptId ? (
            <PromptDetails promptId={selectedPromptId} />
          ) : (
            <EmptyPromptState />
          )
        ) : (
          <NoPromptsFound />
        )}
      </div>
    </div>
  )
}
