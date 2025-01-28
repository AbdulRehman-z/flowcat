"use client"

import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface FilterTagsProps {
  tags: string[]
  onRemove: (tag: string) => void
  onClear: () => void
}

export function FilterTags({ tags = [], onRemove, onClear }: FilterTagsProps) {
  if (tags.length === 0) return null

  return (
    <div className="flex flex-wrap gap-2 p-4 border-b">
      {tags.map((tag) => (
        <Badge key={tag} variant="secondary" className="flex items-center gap-1 text-sm font-medium">
          {tag}
          <Button variant="ghost" size="sm" className="h-4 w-4 p-0 hover:bg-transparent" onClick={() => onRemove(tag)}>
            <X className="h-3 w-3" />
            <span className="sr-only">Remove {tag}</span>
          </Button>
        </Badge>
      ))}
      <Button
        variant="ghost"
        size="sm"
        className="text-sm font-medium text-muted-foreground hover:text-primary"
        onClick={onClear}
      >
        Clear filters
      </Button>
    </div>
  )
}

