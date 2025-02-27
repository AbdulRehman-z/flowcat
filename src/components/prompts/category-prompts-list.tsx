"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { addToFavorites, toggleLikePrompt } from "@/actions/prompts"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { toast } from "@/hooks/use-toast"
import { Heart, Search, ThumbsUp } from "lucide-react"
import { format } from "date-fns"

interface CategoryPromptsListProps {
  initialPrompts: {
    id: string
    prompt: string
    category: string
    tags: string[]
    createdAt: Date
    likes: number
    isLikedByUser: boolean
  }[]
  category: string
}

export function CategoryPromptsList({ initialPrompts, category }: CategoryPromptsListProps) {
  const [prompts, setPrompts] = useState(initialPrompts)
  const [searchQuery, setSearchQuery] = useState("")
  const router = useRouter()
  
  const filteredPrompts = prompts.filter(prompt => 
    prompt.prompt.toLowerCase().includes(searchQuery.toLowerCase()) ||
    prompt.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  )
  
  const handleLike = async (id: string) => {
    try {
      await toggleLikePrompt(id)
      setPrompts(prompts.map(prompt => 
        prompt.id === id 
          ? { 
              ...prompt, 
              isLikedByUser: !prompt.isLikedByUser, 
              likes: prompt.isLikedByUser ? prompt.likes - 1 : prompt.likes + 1 
            } 
          : prompt
      ))
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to like prompt. Please try again.",
        variant: "destructive",
      })
    }
  }
  
  const handleAddToFavorites = async (id: string) => {
    try {
      await addToFavorites(id)
      toast({
        title: "Added to favorites",
        description: "Prompt has been added to your favorites.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add to favorites. Please try again.",
        variant: "destructive",
      })
    }
  }
  
  return (
    <div className="space-y-6">
      <div className="relative w-full max-w-sm">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder={`Search ${category} prompts...`}
          className="pl-8"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      
      {filteredPrompts.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <p className="text-muted-foreground">No prompts found in this category.</p>
          <Button variant="outline" className="mt-4" onClick={() => router.push("/prompts/community")}>
            Explore other categories
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPrompts.map((prompt) => (
            <Card key={prompt.id} className="overflow-hidden transition-all hover:shadow-md">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">
                  {category} Prompt
                </CardTitle>
                <CardDescription className="flex items-center text-xs gap-2 mt-1">
                  <span>Created {format(new Date(prompt.createdAt), "MMM d, yyyy")}</span>
                  <span>•</span>
                  <span>{prompt.likes} likes</span>
                </CardDescription>
              </CardHeader>
              <CardContent className="pb-2">
                <p className="text-sm line-clamp-3">{prompt.prompt}</p>
                <div className="flex flex-wrap gap-1 mt-2">
                  {prompt.tags.map((tag, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="flex justify-between pt-2">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => router.push(`/prompts/${prompt.id}`)}
                >
                  View Details
                </Button>
                <div className="flex items-center gap-2">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => handleLike(prompt.id)}
                    className={prompt.isLikedByUser ? "text-primary" : ""}
                  >
                    <ThumbsUp className={`h-4 w-4 ${prompt.isLikedByUser ? "fill-current" : ""}`} />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => handleAddToFavorites(prompt.id)}
                  >
                    <Heart className="h-4 w-4" />
                  </Button>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
} 