import { MessageSquareText } from "lucide-react"

export function EmptyPromptState() {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center">
      <div className="flex flex-col items-center text-center space-y-4">
        <div className="rounded-xl bg-primary/10 p-4">
          <MessageSquareText className="h-8 w-8" />
        </div>
        <h1 className="text-2xl font-semibold tracking-tight">Select a Prompt</h1>
        <p className="text-muted-foreground max-w-[400px]">
          Choose a prompt from the sidebar to view its details and configuration
        </p>
      </div>
    </div>
  )
}
