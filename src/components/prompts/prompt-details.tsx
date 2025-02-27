"use client"

import { deletePrompt } from "@/actions/prompts"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useEditPrompt } from "@/hooks/prompts/use-edit-prompt"
import { useGetPrompt } from "@/hooks/prompts/use-get-prompt"
import { useLikePublicPrompt } from "@/hooks/prompts/use-like-prompt"
import { toast } from "@/hooks/use-toast"
import type { CreateNewPromptSchemaType } from "@/schemas/prompts-schema"
import { format } from "date-fns"
import { AnimatePresence, motion } from "framer-motion"
import { ArrowLeft, Calendar, Copy, Edit, Globe2, Heart, Loader2, Lock, MoreHorizontal, Pencil, Save, Trash2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"; // Added useEffect
import { DeletePromptDialog } from "./delete-prompt-dialog"

type PromptDetailsProps = {
  promptId: string
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

export function PromptDetails({ promptId }: PromptDetailsProps) {
  const [isLiked, setIsLiked] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [promptText, setPromptText] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()

  const { promptData, isFetchingPromptData } = useGetPrompt(promptId)
  const { editPrompt, isEditing: isEditingPrompt } = useEditPrompt(promptId)
  const { likePrompt, isLiking } = useLikePublicPrompt(promptId, "")

  // Initialize prompt text when data loads
  useEffect(() => {
    if (promptData?.prompt) {
      setPromptText(promptData.prompt)
    }
  }, [promptData])

  const handleCopyPrompt = () => {
    if (promptData?.prompt) {
      navigator.clipboard.writeText(promptData.prompt)
      toast({
        title: "Prompt copied to clipboard",
      })
    }
  }

  const handleLikePrompt = async () => {
    try {
      await likePrompt()
      setIsLiked(!isLiked)
      toast({
        title: isLiked ? "Removed from favorites" : "Added to favorites",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update likes",
        variant: "destructive",
      })
    }
  }

  const handleEditSubmit = async (formData: Partial<CreateNewPromptSchemaType>) => {
    try {
      await editPrompt(formData)
      setIsEditDialogOpen(false)
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update prompt",
        variant: "destructive",
      })
    }
  }

  const handleDelete = async () => {
    try {
      await deletePrompt(promptId)
      toast({
        title: "Prompt deleted",
        description: "Your prompt has been deleted successfully.",
      })
      router.push("/prompts")
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete prompt. Please try again.",
        variant: "destructive",
      })
    }
  }

  if (isFetchingPromptData) {
    return <PromptDetailsLoadingSkeleton />
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
                {format(new Date(promptData.createdAt), "MMMM d, yyyy")} {/* Fixed date */}
                <span className="px-1">•</span>
                {promptData.visibility === "Private" ?
                  <Lock className="h-4 w-4" /> :
                  <Globe2 className="h-4 w-4" />}
                {promptData.visibility}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="secondary"
                size="sm"
                disabled={isLiking}
                className="gap-2"
                onClick={handleLikePrompt}
              >
                <Heart className={isLiked ? "fill-primary" : ""} size={16} />
                <span>{promptData.likes + (isLiked ? 1 : 0)}</span> {/* Live update likes */}
              </Button>
              <Button variant="secondary" size="sm" className="gap-2" onClick={handleCopyPrompt}>
                <Copy size={16} />
                Copy
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onSelect={() => setIsEditDialogOpen(true)}>
                    <Pencil className="mr-2 h-4 w-4" />
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="text-destructive"
                    onSelect={() => setIsDeleteDialogOpen(true)}
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {/* ... rest of the JSX remains similar with proper state handling ... */}

          <DeletePromptDialog
            isOpen={isDeleteDialogOpen}
            onClose={() => setIsDeleteDialogOpen(false)}
            onConfirm={handleDelete} // Pass handleDelete to dialog
            promptId={promptId}
          />

          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push("/prompts")}
              className="gap-1"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Prompts
            </Button>

            <div className="flex items-center gap-2">
              {isEditing ? (
                <Button
                  variant="default"
                  size="sm"
                  onClick={handleSave}
                  disabled={isSubmitting}
                  className="gap-1"
                >
                  {isSubmitting ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Save className="h-4 w-4" />
                  )}
                  Save
                </Button>
              ) : (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsEditing(true)}
                  className="gap-1"
                >
                  <Edit className="h-4 w-4" />
                  Edit
                </Button>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
