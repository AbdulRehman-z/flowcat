import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Star, Trash } from "lucide-react"
import { cn } from "@/lib/utils"

interface PromptCardProps {
  prompt: {
    id: string
    name: string
    isDefault: boolean
  }
  onDelete: () => void
  onClick: () => void
}

export function PromptCard({ prompt, onDelete, onClick }: PromptCardProps) {
  return (
    <Card className="overflow-hidden transition-all hover:shadow-md">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg truncate" title={prompt.name}>
            {prompt.name}
          </CardTitle>
          {prompt.isDefault && (
            <Badge variant="default" className="ml-2">
              <Star className="h-3 w-3 mr-1" />
              Default
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="pb-2">
        <CardDescription className="line-clamp-2">
          Click to view and edit this prompt
        </CardDescription>
      </CardContent>
      <CardFooter className="flex justify-between pt-2">
        <Button variant="ghost" size="sm" onClick={onClick}>
          View Details
        </Button>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={(e) => {
            e.stopPropagation()
            onDelete()
          }}
          className="text-destructive hover:text-destructive/90"
        >
          <Trash className="h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  )
} 