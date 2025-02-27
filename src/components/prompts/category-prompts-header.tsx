import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

interface CategoryPromptsHeaderProps {
  category: string
}

export function CategoryPromptsHeader({ category }: CategoryPromptsHeaderProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{category} Prompts</h1>
        <p className="text-muted-foreground">
          Explore {category.toLowerCase()} prompts shared by the community
        </p>
      </div>
      <Button variant="outline" size="sm" asChild>
        <Link href="/prompts/community">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Categories
        </Link>
      </Button>
    </div>
  )
} 