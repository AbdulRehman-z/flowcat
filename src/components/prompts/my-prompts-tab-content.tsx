import { GetPromptsAction } from "@/actions/prompts/get-prompts-action";
import { useGetPrompts } from "@/hooks/prompts/use-get-prompts";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { TabsContent } from "@radix-ui/react-tabs";
import { MessageSquareText, Search } from "lucide-react";
import { Dispatch, SetStateAction, useState } from "react";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { PromptListSkeleton } from "./prompt-list-skeleton";

type MyPromptsTabContentProps = {
  initialData: Awaited<ReturnType<typeof GetPromptsAction>>
  selectedPromptId: string | null
  setSelectedPrompt: Dispatch<SetStateAction<string | null>>
  setPromptsFound: Dispatch<SetStateAction<boolean>>
}


export default function MyPromptsTabContent({ initialData, selectedPromptId, setSelectedPrompt, setPromptsFound }: MyPromptsTabContentProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const { prompts, isFetchingPrompts } = useGetPrompts(initialData)

  const filteredPrompts = prompts.filter((prompt) => prompt.name.toLowerCase().includes(searchQuery.toLowerCase()))

  if (!isFetchingPrompts && !filteredPrompts.length) {
    setPromptsFound(false)
  } else {
    setPromptsFound(true)
  }

  return (
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

        <ScrollArea className="h-full">
          {isFetchingPrompts ? (
            <PromptListSkeleton />
          ) : (
            <div className="space-y-1">
              {filteredPrompts.map((prompt) => (
                <Button
                  key={prompt.id}
                  variant="ghost"
                  onClick={() => setSelectedPrompt(prompt.id)}
                  className={cn("w-full justify-between px-2", selectedPromptId === prompt.id && "bg-accent")}
                >
                  <div className=" flex items-center gap-x-2">
                    <div className="rounded-lg bg-primary/10 p-1">
                      <MessageSquareText size={18} />
                    </div>
                    <span className=" truncate">{prompt.name}</span>
                  </div>
                  {prompt.isDefault && (
                    <Badge variant={selectedPromptId! === prompt.id ? "default" : "secondary"} className="ml-auto rounded-full">
                      Default
                    </Badge>
                  )}
                </Button>
              ))}
            </div>
          )}
        </ScrollArea>
      </div>
    </TabsContent>);
}
