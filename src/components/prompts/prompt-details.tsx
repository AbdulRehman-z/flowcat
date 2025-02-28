"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Separator } from "@/components/ui/separator"
import { useEditPrompt } from "@/hooks/prompts/use-edit-prompt"
import { useGetPrompt } from "@/hooks/prompts/use-get-prompt"
import { useLikePublicPrompt } from "@/hooks/prompts/use-like-prompt"
import { useSetDefault } from "@/hooks/prompts/use-set-default"
import type { CreateNewPromptSchemaType } from "@/schemas/prompts-schema"
import { format } from "date-fns"
import { AnimatePresence, motion } from "framer-motion"
import {
  ArrowLeft,
  Calendar,
  Copy,
  Globe2,
  Heart,
  Loader2,
  Lock,
  MoreHorizontal,
  Pencil,
  Star,
  Tag,
  Trash2
} from "lucide-react"
import { useEffect, useState } from "react"
import { toast } from "sonner"
import { DeletePromptDialog } from "./delete-prompt-dialog"
import { EditPromptDialog } from "./edit-prompt-dialog"

type PromptDetailsProps = {
  promptId: string
  initialData?: any
}

const PromptDetailsLoadingSkeleton = () => {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <div className="flex flex-col items-center space-y-4">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground">Loading prompt details...</p>
      </div>
    </div>
  )
}

export function PromptDetails({ promptId, initialData }: PromptDetailsProps) {
  const [isMounted, setIsMounted] = useState(false)
  const { promptData, isFetching: isFetchingPromptData } = useGetPrompt(promptId, initialData)
  const [isLiked, setIsLiked] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [category, setCategory] = useState<string>("")

  const { editPrompt, isEditing } = useEditPrompt(promptId)
  const { likePrompt, isLiking } = useLikePublicPrompt(promptId, category)
  const { setDefault, isPending } = useSetDefault(promptId)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) return null

  if (isFetchingPromptData) {
    return <PromptDetailsLoadingSkeleton />
  }

  if (!promptData) return null

  const createdAtDate = new Date(promptData.createdAt)
  const isValidDate = !isNaN(createdAtDate.getTime())

  const handleCopyPrompt = () => {
    if (promptData?.prompt) {
      navigator.clipboard.writeText(promptData.prompt)
      toast.success("Prompt copied to clipboard")
    }
  }

  const handleLikePrompt = (promptCategory: string) => {
    setCategory(promptCategory)
    likePrompt()
    setIsLiked(!isLiked)
    toast.success(isLiked ? "Removed from favorites" : "Added to favorites")
  }

  const handleEditSubmit = (formData: Partial<CreateNewPromptSchemaType>) => {
    editPrompt(formData)
    setIsEditDialogOpen(false)
  }

  const handleSetDefault = () => {
    setDefault()
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={promptId}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.2 }}
        className="p-6 max-w-4xl mx-auto space-y-8"
      >
        {/* Header with Navigation */}
        <div className="flex items-center justify-between">
          <Button variant="ghost" size="sm" onClick={() => window.history.back()} className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              size="sm"
              disabled={isLiking}
              onClick={() => handleLikePrompt(promptData.category)}
              className={`gap-2 transition-all ${isLiked ? 'bg-pink-100 text-pink-700 hover:bg-pink-200' : ''}`}
            >
              {isLiking ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Heart className={`h-4 w-4 ${isLiked ? 'fill-pink-700' : ''}`} />
              )}
              <span>{promptData.likes}</span>
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem onClick={handleCopyPrompt}>
                  <Copy className="mr-2 h-4 w-4" />
                  Copy Prompt
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setIsEditDialogOpen(true)}>
                  <Pencil className="mr-2 h-4 w-4" />
                  Edit Prompt
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="text-destructive focus:text-destructive"
                  onClick={() => setIsDeleteDialogOpen(true)}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete Prompt
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Main Content Card */}
        <Card className="overflow-hidden border-none shadow-lg">
          <div className="px-6 py-4 bg-gradient-to-r from-primary/5 to-primary/10">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <h1 className="text-2xl font-semibold tracking-tight flex items-center gap-2">
                  {promptData.name}
                  {promptData.isDefault && (
                    <Badge variant="default" className="bg-primary/20 text-primary">
                      <Star className="h-3 w-3 mr-1" /> Default
                    </Badge>
                  )}
                </h1>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {isValidDate ? format(createdAtDate, "MMMM d, yyyy") : "Invalid date"}
                  </div>
                  <span>•</span>
                  <div className="flex items-center gap-1">
                    {promptData.visibility === "Private" ? (
                      <Lock className="h-4 w-4" />
                    ) : (
                      <Globe2 className="h-4 w-4" />
                    )}
                    {promptData.visibility}
                  </div>
                </div>
              </div>
              <Button
                variant={promptData.isDefault ? "default" : "outline"}
                size="sm"
                onClick={handleSetDefault}
                disabled={promptData.isDefault || isPending}
                className="gap-2"
              >
                {isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Star className={`h-4 w-4 ${promptData.isDefault ? 'fill-current' : ''}`} />
                )}
                {promptData.isDefault ? "Default" : "Set as Default"}
              </Button>
            </div>
          </div>

          <Separator />

          <div className="p-6">
            <div className="prose prose-sm max-w-none">
              <div className="bg-muted/50 rounded-lg p-4 font-mono text-sm">
                {promptData.prompt}
              </div>
            </div>
          </div>

          {(promptData.category || promptData.tags.length > 0) && (
            <div className="px-6 pb-6 flex flex-wrap gap-3">
              {promptData.category && (
                <Badge variant="outline" className="gap-1">
                  <Tag className="h-3 w-3" />
                  {promptData.category}
                </Badge>
              )}
              {promptData.tags.map((tag, index) => (
                <Badge key={index} variant="secondary" className="bg-secondary/50">
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </Card>

        <EditPromptDialog
          isOpen={isEditDialogOpen}
          onClose={() => setIsEditDialogOpen(false)}
          onSubmit={handleEditSubmit}
          defaultValues={promptData}
          isLoading={isEditing}
        />

        <DeletePromptDialog
          isOpen={isDeleteDialogOpen}
          onClose={() => setIsDeleteDialogOpen(false)}
          promptId={promptId}
        />
      </motion.div>
    </AnimatePresence>
  )
}
