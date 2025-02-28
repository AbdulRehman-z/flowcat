import { useGetCommunityPromptsCategory } from "@/hooks/prompts/use-get-community-prompts";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { TabsContent } from "@radix-ui/react-tabs";
import { MessageSquareText } from "lucide-react";
import { Dispatch, SetStateAction } from "react";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { CommunityPromptListSkeleton } from "./prompt-list-skeleton";

type CommunityPromptsTabContentProps = {
  selectedCategory: string | null;
  setSelectedCategory: Dispatch<SetStateAction<string | null>>;
  communitySelected: boolean;
}

export default function CommunityPromptsTabContent({ selectedCategory, setSelectedCategory, communitySelected }: CommunityPromptsTabContentProps) {
  const { communityPrompts, isFetchingCommunityPrompts } = useGetCommunityPromptsCategory(communitySelected)


  return (
    <TabsContent value="community-prompts" className="mt-6">
      <div className="">
        <ScrollArea className="h-full">
          {isFetchingCommunityPrompts ? (
            <CommunityPromptListSkeleton />
          ) : (
            <div className="space-y-2">
              {communityPrompts?.map((prompt) => (
                <Button
                  key={prompt.category}
                  variant="outline"
                  onClick={() => setSelectedCategory(prompt.category)}
                  className={cn("w-full shadow-none justify-between px-2 py-6 group", selectedCategory === prompt.category && "bg-accent", "duration-200")}
                >
                  <div className=" flex items-center gap-x-2">
                    <div className="rounded-lg bg-accent p-2 group-hover:bg-primary/10 ">
                      <MessageSquareText size={20} />
                    </div>
                    <span className="truncate font-semibold">
                      {prompt.category.charAt(0).toUpperCase() + prompt.category.slice(1)}
                    </span>
                  </div>
                  {prompt.noOfPromptsPerCategory > 0 && (
                    <Badge className="ml-auto rounded-full group-hover:bg-primary/10" variant={"secondary"}  >
                      {prompt.noOfPromptsPerCategory}
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
