"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { deletePrompt } from "@/actions/prompts"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Loader2 } from "lucide-react"
import { toast } from "@/hooks/use-toast"
interface DeletePromptDialogProps {
  isOpen: boolean
  onClose: () => void
  promptId: string
}

export function DeletePromptDialog({ isOpen, onClose, promptId }: DeletePromptDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false)
  const router = useRouter()
  
  const handleDelete = async () => {
    try {
      setIsDeleting(true)
      await deletePrompt(promptId)
      toast({
        title: "Prompt deleted",
        description: "Your prompt has been deleted successfully.",
      })
      router.push("/prompts")
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete prompt. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsDeleting(false)
      onClose()
    }
  }
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Prompt</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this prompt? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="button" variant="destructive" onClick={handleDelete} disabled={isDeleting}>
            {isDeleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
