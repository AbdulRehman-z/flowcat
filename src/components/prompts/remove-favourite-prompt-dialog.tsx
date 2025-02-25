"use client"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { useRemoveFavouritePrompt } from "@/hooks/prompts/use-remove-favourite-prompt"
import { Dispatch, SetStateAction } from "react"

type RemoveFavouritePromptDialogProps = {
  isOpen: boolean,
  onClose: Dispatch<SetStateAction<boolean>>,
  promptId: string
}

export function RemoveFavouritePromptDialog({ promptId, isOpen, onClose }: RemoveFavouritePromptDialogProps) {
  const { removeFavourite, isRemoving } = useRemoveFavouritePrompt()

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently get removed from your favourites.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction asChild>
            <Button variant="destructive" onClick={() => removeFavourite(promptId)} disabled={isRemoving}>
              {isRemoving ? "Deleting..." : "Remove"}
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
