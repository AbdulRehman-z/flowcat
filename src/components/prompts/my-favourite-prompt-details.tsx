"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { useGetPrompt } from "@/hooks/prompts/use-get-prompt"
import { format } from "date-fns"
import { AnimatePresence, motion } from "framer-motion"
import { Calendar, Copy, Globe2, Heart, Loader2, Lock, MessageSquare, Tag } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"
import { RemoveFavouritePromptDialog } from "./remove-favourite-prompt-dialog"

type MyFavouritePromptDetailsProps = {
  promptId: string
}

const MyFavouritePromptDetailsLoadingSkeleton = () => {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <div className="flex flex-col items-center space-y-4">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground">Loading prompt details...</p>
      </div>
    </div>
  )
}

export function MyFavouritePromptDetails({ promptId }: MyFavouritePromptDetailsProps) {
  // states
  const [isLiked, setIsLiked] = useState(false)
  const [isRemoveDialogOpen, setIsRemoveDialogOpen] = useState(false)

  // hooks
  const { promptData, isFetchingPromptData } = useGetPrompt(promptId)
  // handlers
  const handleCopyPrompt = () => {
    if (promptData?.prompt) {
      navigator.clipboard.writeText(promptData.prompt)
      toast.success("Prompt copied to clipboard")
    }
  }

  const handleLikePrompt = () => {
    setIsLiked(!isLiked)
    toast.success(isLiked ? "Removed from favorites" : "Added to favorites")
  }



  if (isFetchingPromptData) {
    return <MyFavouritePromptDetailsLoadingSkeleton />
  }

  if (!promptData) return null

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={promptId}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.2 }}
        className="p-6 max-w-4xl mx-auto"
      >
        <div className="space-y-6">
          {/* Header Section */}
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-semibold tracking-tight">{promptData.name}</h1>
                {promptData.isDefault && <Badge variant="secondary">Default</Badge>}
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                {format(new Date(new Date().getTime()), "MMMM d, yyyy")}
                <span className="px-1">•</span>
                {promptData.visibility === "Private" ? <Lock className="h-4 w-4" /> : <Globe2 className="h-4 w-4" />}
                {promptData.visibility}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="secondary" size="sm" className="gap-2" onClick={handleLikePrompt}>
                <Heart className={isLiked ? "fill-primary" : ""} size={16} />
                <span>{5}</span>
              </Button>
              <Button variant="secondary" size="sm" className="gap-2" onClick={handleCopyPrompt}>
                <Copy size={16} />
                Copy
              </Button>
            </div>
          </div>

          <Separator />

          {/* Main Content */}
          <Card className="relative overflow-hidden">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="p-6 space-y-4"
            >
              <div className="flex items-start gap-3">
                <div className="rounded-full bg-primary/10 p-2">
                  <MessageSquare className="h-4 w-4 text-primary" />
                </div>
                <div className="flex-1 space-y-4">
                  <div className="prose prose-sm max-w-none">
                    <p className="text-sm leading-relaxed">{promptData.prompt}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </Card>

          {/* Tags Section */}
          {(promptData.category || promptData.tags.length > 0) && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex items-start gap-4"
            >
              {promptData.category && (
                <div className="flex items-center gap-2">
                  <Tag className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">{promptData.category}</span>
                </div>
              )}
              <div className="flex flex-wrap gap-2">
                {promptData.tags.map((tag, index) => (
                  <Badge key={index} variant="secondary" className="rounded-full">
                    {tag}
                  </Badge>
                ))}
              </div>
            </motion.div>
          )}

          <RemoveFavouritePromptDialog
            isOpen={isRemoveDialogOpen}
            onClose={() => setIsRemoveDialogOpen(false)}
            promptId={promptId}
          />
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
