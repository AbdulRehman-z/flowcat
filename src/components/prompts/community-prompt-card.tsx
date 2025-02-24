import { GetCategoryPrompts } from "@/actions/prompts/get-category-prompts-action";
import { format } from "date-fns";
import { Heart } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../ui/card";
import { useLikePublicPrompt } from "@/hooks/prompts/use-like-prompt";

type CommunityPromptCardProps = {
  item: Awaited<ReturnType<typeof GetCategoryPrompts>>[0],
};

export default function CommunityPromptCard({ item }: CommunityPromptCardProps) {
  const [isLiked, setIsLiked] = useState(false)
  const { likePrompt, isLiking } = useLikePublicPrompt(item.category)

  const handleLikePrompt = () => {
    setIsLiked(!isLiked)
    likePrompt(item.id)
    toast.success(isLiked ? "Removed from favorites" : "Added to favorites")
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <Badge variant="secondary">{item.category}</Badge>
          <Button disabled={isLiking} variant="secondary" size="sm" className="gap-2" onClick={handleLikePrompt}>
            <Heart className={isLiked ? "fill-primary" : ""} size={16} />
            <span>{item.likes}</span>
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground line-clamp-3">{item.prompt}</p>
      </CardContent>
      <CardFooter>
        <p className="text-xs text-muted-foreground">
          Created {format(new Date(item.createdAt), "MMM d yyyy")}
        </p>
      </CardFooter>
    </Card>
  );
}
