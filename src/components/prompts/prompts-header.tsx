import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Heart, Layers, Plus, Users } from "lucide-react"

export function PromptsHeader() {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">My Prompts</h1>
        <p className="text-muted-foreground">
          Create and manage your AI prompts
        </p>
      </div>
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" asChild>
          <Link href="/prompts/favorites">
            <Heart className="mr-2 h-4 w-4" />
            Favorites
          </Link>
        </Button>
        <Button variant="outline" size="sm" asChild>
          <Link href="/prompts/community">
            <Users className="mr-2 h-4 w-4" />
            Community
          </Link>
        </Button>
      </div>
    </div>
  )
} 