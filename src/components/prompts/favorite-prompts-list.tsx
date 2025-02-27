"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { removeFromFavorites } from "@/actions/prompts"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Heart, Search, Star } from "lucide-react"
import { format } from "date-fns"
import { toast } from "@/hooks/use-toast"
interface FavoritePromptsListProps {
  initialPrompts: {
    id: string
    name: string
    prompt: string
    category: string
    tags: string[]
    visibility: string
    createdAt: Date
    favouritedAt: Date
    isDefault: boolean
  }[]
}

export function FavoritePromptsList({ initialPrompts }: FavoritePromptsListProps) {
  const [prompts, setPrompts] = useState(initialPrompts)
  const [searchQuery, setSearchQuery] = useState("")
  const router = useRouter()
  
  const filteredPrompts = prompts.filter(prompt => 
    prompt.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    prompt.category.toLowerCase().includes(searchQuery.toLowerCase())
  )
  
  const handleRemoveFromFavorites = async (id: string) => {
    try {
      await removeFromFavorites(id)
      setPrompts(prompts.filter(prompt => prompt.id !== id))
      toast({
        title: "Removed from favorites",
        description: "Prompt has been removed from your favorites.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to remove from favorites. Please try again.",
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
          placeholder="Search favorites..."
          className="pl-8"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      
      {filteredPrompts.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <p className="text-muted-foreground">No favorite prompts found.</p>
          <Button variant="outline" className="mt-4" onClick={() => router.push("/prompts/community")}>
            Explore community prompts
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPrompts.map((prompt) => (
            <Card key={prompt.id} className="overflow-hidden transition-all hover:shadow-md">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg truncate" title={prompt.name}>
                    {prompt.name}
                  </CardTitle>
                  <div className="flex items-center gap-1">
                    {prompt.isDefault && (
                      <Badge variant="default" className="ml-2">
                        <Star className="h-3 w-3 mr-1" />
                        Default
                      </Badge>
                    )}
                  </div>
                </div>
                <CardDescription className="flex items-center text-xs gap-2 mt-1">
                  <Badge variant="outline">{prompt.category}</Badge>
                  <span>•</span>
                  <span>Added {format(new Date(prompt.favouritedAt), "MMM d, yyyy")}</span>
                </CardDescription>
              </CardHeader>
              <CardContent className="pb-2">
                <p className="text-sm line-clamp-2">{prompt.prompt}</p>
              </CardContent>
              <CardFooter className="flex justify-between pt-2">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => router.push(`/prompts/${prompt.id}`)}
                >
                  View Details
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => handleRemoveFromFavorites(prompt.id)}
                  className="text-destructive hover:text-destructive/90"
                >
                  <Heart className="h-4 w-4 fill-current" />
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
} 