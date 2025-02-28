import { MessageSquareText, MessageSquareWarning } from "lucide-react"
import { AddPromptDialog } from "./add-prompt-dialog"

export function EmptyPromptState() {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center">
      <div className="flex flex-col items-center text-center space-y-4">
        <div className="rounded-xl bg-primary/10 p-4">
          <MessageSquareText className="h-8 w-8" />
        </div>
        <h1 className="text-2xl font-semibold tracking-tight">Select a prompt</h1>
        <p className="text-muted-foreground max-w-[400px]">
          Choose a prompt from the sidebar to view its details and configuration
        </p>
      </div>
    </div>
  )
}

export function NoPromptsFound() {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center">
      <div className="flex flex-col items-center text-center space-y-4">
        <div className="rounded-xl bg-primary/10 p-4">
          <MessageSquareWarning className="h-8 w-8" />
        </div>
        <h1 className="text-2xl font-semibold tracking-tight">Empty prompt list</h1>
        <p className="text-muted-foreground max-w-[400px]">
          No prompts found. Create a new prompt to get started.
        </p>
        <AddPromptDialog />
      </div>
    </div>
  )
}


export function EmptyCategoryState() {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center">
      <div className="flex flex-col items-center text-center space-y-4">
        <div className="rounded-xl bg-primary/10 p-4">
          <MessageSquareText className="h-8 w-8" />
        </div>
        <h1 className="text-2xl font-semibold tracking-tight">Select a category</h1>
        <p className="text-muted-foreground max-w-[400px]">
          Choose a category from the sidebar to view its details and configuration
        </p>
      </div>
    </div>
  )
}

export function EmptyFavouriteState() {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center">
      <div className="flex flex-col items-center text-center space-y-4">
        <div className="rounded-xl bg-primary/10 p-4">
          <MessageSquareText className="h-8 w-8" />
        </div>
        <h1 className="text-2xl font-semibold tracking-tight">Select a favourite</h1>
        <p className="text-muted-foreground max-w-[400px]">
          Choose a favourite from the sidebar to view its details and configuration
        </p>
      </div>
    </div>
  )
}
