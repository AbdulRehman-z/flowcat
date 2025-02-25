import { useGetFavouritePrompts } from "@/hooks/prompts/use-get-favourite-prompts";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { TabsContent } from "@radix-ui/react-tabs";
import { MessageSquareText, Search } from "lucide-react";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { NoPromptsFound } from "./empty-prompt-state";
import { PromptListSkeleton } from "./prompt-list-skeleton";

type MyFavouritePromptsTabContentProps = {
  selectedFavouritePromptId: string | null
  setSelectedFavouritePromptId: Dispatch<SetStateAction<string | null>>
  favouritePromptsFound: boolean
  setFavouritePromptsFound: Dispatch<SetStateAction<boolean>>
}

export default function MyFavouritePromptsTabContent({
  selectedFavouritePromptId,
  setSelectedFavouritePromptId,
  favouritePromptsFound,
  setFavouritePromptsFound
}: MyFavouritePromptsTabContentProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const { favouritePrompts = [], isFetching: isLoading } = useGetFavouritePrompts()
  // Filter prompts based on search query
  const filteredPrompts = favouritePrompts.filter(prompt =>
    prompt.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Update found state when favouritePrompts change
  useEffect(() => {
    setFavouritePromptsFound(filteredPrompts.length > 0);
  }, [filteredPrompts.length, setFavouritePromptsFound]);

  if (isLoading) return <PromptListSkeleton />;

  return (
    <TabsContent value="my-favourites" className="mt-4">
      <div className="space-y-4">
        <div className="flex gap-x-2">
          <Input
            placeholder="Search favouritePrompts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-9"
          />
          <Button variant="outline" size="icon" className="h-9 w-9">
            <Search className="h-4 w-4" />
          </Button>
        </div>

        <ScrollArea className="h-[500px]">
          {favouritePromptsFound ? (
            <div className="space-y-1">
              {filteredPrompts.map((prompt) => (
                <Button
                  key={prompt.id}
                  variant="ghost"
                  onClick={() => setSelectedFavouritePromptId(prompt.id)}
                  className={cn(
                    "w-full justify-between px-2",
                    selectedFavouritePromptId === prompt.id && "bg-accent"
                  )}
                >
                  <div className="flex items-center gap-x-2">
                    <div className="rounded-lg bg-primary/10 p-1">
                      <MessageSquareText size={18} />
                    </div>
                    <span className="truncate">{prompt.name}</span>
                  </div>
                  {prompt.isDefault && (
                    <Badge
                      variant={selectedFavouritePromptId === prompt.id ? "default" : "secondary"}
                      className="ml-auto rounded-full"
                    >
                      Default
                    </Badge>
                  )}
                </Button>
              ))}
            </div>
          ) : (
            <NoPromptsFound />
          )}
        </ScrollArea>
      </div>
    </TabsContent>
  );
}
