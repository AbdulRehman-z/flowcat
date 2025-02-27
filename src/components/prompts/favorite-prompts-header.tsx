import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

export function FavoritePromptsHeader() {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Favorite Prompts</h1>
        <p className="text-muted-foreground">
          Your collection of favorite prompts
        </p>
      </div>
      <Button variant="outline" size="sm" asChild>
        <Link href="/prompts">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to My Prompts
        </Link>
      </Button>
    </div>
  )
} 