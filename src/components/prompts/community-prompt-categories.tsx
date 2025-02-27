"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, ArrowRight } from "lucide-react"

interface CommunityPromptCategoriesProps {
  initialCategories: {
    category: string
    noOfPromptsPerCategory: number
  }[]
}

export function CommunityPromptCategories({ initialCategories }: CommunityPromptCategoriesProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const router = useRouter()
  
  const filteredCategories = initialCategories.filter(category => 
    category.category.toLowerCase().includes(searchQuery.toLowerCase())
  )
  
  return (
    <div className="space-y-6">
      <div className="relative w-full max-w-sm">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search categories..."
          className="pl-8"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      
      {filteredCategories.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <p className="text-muted-foreground">No categories found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCategories.map((category) => (
            <Card 
              key={category.category} 
              className="overflow-hidden transition-all hover:shadow-md cursor-pointer"
              onClick={() => router.push(`/prompts/community/${category.category}`)}
            >
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">{category.category}</CardTitle>
                <CardDescription>
                  {category.noOfPromptsPerCategory} {category.noOfPromptsPerCategory === 1 ? 'prompt' : 'prompts'}
                </CardDescription>
              </CardHeader>
              <CardContent className="pb-2">
                <p className="text-sm">
                  Explore community prompts in the {category.category} category.
                </p>
              </CardContent>
              <CardFooter className="pt-2">
                <Button variant="ghost" size="sm" className="ml-auto">
                  View Prompts
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
} 