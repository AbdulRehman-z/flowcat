"use client"

import type { GetPromptsAction } from "@/actions/prompts/get-prompts-action"
import { useGetPrompts } from "@/hooks/prompts/use-get-prompts"
import type { CreateNewPromptSchemaType } from "@/schemas/prompts-schema"
import { MessageSquareText, Search } from "lucide-react"
import type { Dispatch, SetStateAction } from "react"
import { AddPromptDialog } from "../jobs/add-prompt-dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PromptListSkeleton } from "./prompt-list-skeleton"
import { cn } from "@/lib/utils"

type UserPromptsViewerProps = {
  initialData: Awaited<ReturnType<typeof GetPromptsAction>>
  selectedPrompt: string | null
  setSelectedPrompt: Dispatch<SetStateAction<string | null>>
  searchQuery: string
  setSearchQuery: Dispatch<SetStateAction<string>>
}

export function UserPromptsViewer({
  initialData,
  selectedPrompt,
  setSelectedPrompt,
  searchQuery,
  setSearchQuery,
}: UserPromptsViewerProps) {
  const { prompts, isFetchingPrompts } = useGetPrompts(initialData)

  const filteredPrompts = prompts.filter((prompt) => prompt.name.toLowerCase().includes(searchQuery.toLowerCase()))

  return (
    <div className="flex min-h-full bg-gray-400 flex-col justify-between p-4">
      <div className="flex flex-col space-y-4">
        <h1 className="text-xl font-semibold tracking-tight">Prompt Library</h1>
        <Tabs defaultValue="my-prompts" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="my-prompts" className="flex items-center gap-2">
              My prompts
            </TabsTrigger>
            <TabsTrigger value="community" className="flex items-center gap-2">
              Community
            </TabsTrigger>
          </TabsList>

          <TabsContent value="my-prompts" className="mt-4">
            <div className="space-y-4">
              <div className="flex gap-x-2">
                <Input
                  placeholder="Search prompts..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="h-9"
                />
                <Button variant="outline" size="icon" className="h-9 w-9">
                  <Search className="h-4 w-4" />
                </Button>
              </div>

              <ScrollArea className="h-[500px]">
                {isFetchingPrompts ? (
                  <PromptListSkeleton />
                ) : (
                  <div className="space-y-1">
                    {filteredPrompts.map((prompt) => (
                      <Button
                        key={prompt.id}
                        variant="ghost"
                        onClick={() => setSelectedPrompt(prompt.id)}
                        className={cn("w-full justify-between px-2", selectedPrompt === prompt.id && "bg-accent")}
                      >
                        <div className=" flex items-center gap-x-2">
                          <div className="rounded-lg bg-primary/10 p-1">
                            <MessageSquareText size={18} />
                          </div>
                          <span className=" truncate">{prompt.name}</span>
                        </div>
                        {prompt.isDefault && (
                          <Badge variant={selectedPrompt === prompt.id ? "default" : "secondary"} className="ml-auto">
                            Default
                          </Badge>
                        )}
                      </Button>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <div className="">
        <AddPromptDialog />
      </div>
    </div>
  )
}
