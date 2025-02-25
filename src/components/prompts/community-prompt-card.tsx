"use client"

import type { GetCategoryPrompts } from "@/actions/prompts/get-category-prompts-action"
import { useLikePublicPrompt } from "@/hooks/prompts/use-like-prompt"
import { format } from "date-fns"
import { Expand, Heart, Star, Wand2 } from "lucide-react"
import { Badge } from "../ui/badge"
import { Button } from "../ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../ui/card"
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "../ui/sheet"
import { Separator } from "../ui/separator"
import { useState } from "react"
import { toast } from "sonner"
import { useEditPrompt } from "@/hooks/prompts/use-edit-prompt"

type CommunityPromptCardProps = {
  item: Awaited<ReturnType<typeof GetCategoryPrompts>>[0]
}

export default function CommunityPromptCard({ item }: CommunityPromptCardProps) {
  const { likePrompt, isLiking } = useLikePublicPrompt(item.category, item.id)
  const { editPrompt, isEditing } = useEditPrompt(item.id)
  const [isOpen, setIsOpen] = useState(false)

  const handleLikePrompt = () => {
    likePrompt()
  }

  const handleAddToFavorites = () => {
    toast.success("Added to favorites")
    // Add your favorites logic here
  }

  const handleSetAsDefault = () => {
    editPrompt(item)
    toast.success("Set as default prompt")
    // Add your set default logic here
  }

  return (
    <>
      <Card className="group relative">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <Badge variant="secondary">{item.category}</Badge>
            <div className="flex items-center gap-2">
              <Button
                disabled={isLiking}
                variant="ghost"
                size="sm"
                className="gap-2 hover:bg-secondary"
                onClick={handleLikePrompt}
              >
                <Heart className={item.isLikedByUser ? "fill-primary" : ""} size={16} />
                <span>{item.likes}</span>
              </Button>
              <Sheet open={isOpen} onOpenChange={setIsOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="sm" className="hover:bg-secondary">
                    <Expand size={16} />
                  </Button>
                </SheetTrigger>
                <SheetContent className="w-full sm:max-w-lg">
                  <SheetHeader className="space-y-4">
                    <div className="flex items-center justify-between">
                      <SheetTitle>Prompt Details</SheetTitle>
                      <Badge variant="secondary">{item.category}</Badge>
                    </div>
                    <SheetDescription className="flex items-center justify-between text-sm">
                      <span>Created {format(new Date(item.createdAt), "MMM d yyyy")}</span>
                      <Button
                        disabled={isLiking}
                        variant="ghost"
                        size="sm"
                        className="gap-2"
                        onClick={handleLikePrompt}
                      >
                        <Heart className={item.isLikedByUser ? "fill-primary" : ""} size={16} />
                        <span>{item.likes} likes</span>
                      </Button>
                    </SheetDescription>
                  </SheetHeader>
                  <Separator className="my-6" />
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium">Prompt</h4>
                      <p className="text-sm text-muted-foreground whitespace-pre-wrap">{item.prompt}</p>
                    </div>
                  </div>
                  <SheetFooter className="absolute bottom-0 left-0 right-0 p-6 bg-background border-t">
                    <div className="flex w-full gap-4">
                      <Button className="flex-1 gap-2" variant="outline" onClick={handleAddToFavorites}>
                        <Star size={16} />
                        Add to Favorites
                      </Button>
                      <Button className="flex-1 gap-2" disabled={isEditing} onClick={handleSetAsDefault}>
                        <Wand2 size={16} />
                        Set as Default
                      </Button>
                    </div>
                  </SheetFooter>
                </SheetContent>
              </Sheet>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground line-clamp-3">{item.prompt}</p>
        </CardContent>
        <CardFooter>
          <p className="text-xs text-muted-foreground">Created {format(new Date(item.createdAt), "MMM d yyyy")}</p>
        </CardFooter>
      </Card>
    </>
  )
}
