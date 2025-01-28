"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { X } from "lucide-react"

interface TagsFilterProps {
  tags: string[]
  onAddTag: (tag: string) => void
  onRemoveTag: (tag: string) => void
}

export function TagsFilter({ tags, onAddTag, onRemoveTag }: TagsFilterProps) {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget
    const input = form.elements.namedItem("tag") as HTMLInputElement
    if (input.value.trim()) {
      onAddTag(input.value.trim())
      input.value = ""
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label className="text-base font-semibold leading-none tracking-tight">Tags</Label>
        <form onSubmit={handleSubmit} className="flex gap-2">
          <Input name="tag" placeholder="Add a tag..." className="h-8 w-[200px]" />
          <Button type="submit" variant="secondary" size="sm">
            Add
          </Button>
        </form>
      </div>
      <Separator />
      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => (
          <Badge key={tag} variant="secondary" className="flex items-center gap-1 text-sm">
            {tag}
            <Button
              variant="ghost"
              size="icon"
              className="h-4 w-4 p-0 hover:bg-transparent"
              onClick={() => onRemoveTag(tag)}
            >
              <X className="h-3 w-3" />
              <span className="sr-only">Remove {tag}</span>
            </Button>
          </Badge>
        ))}
        {tags.length === 0 && (
          <span className="text-sm text-muted-foreground">No tags added yet. Add tags to filter your search.</span>
        )}
      </div>
    </div>
  )
}

