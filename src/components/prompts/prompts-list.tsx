"use client"

import getPrompts, { deletePrompt } from "@/actions/prompts"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "@/hooks/use-toast"
import { Plus, Search } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import CreatePromptForm from "./create-prompt-form"
import { PromptCard } from "./prompt-card"

interface PromptsListProps {
  initialPrompts: {
    id: string
    name: string
    isDefault: boolean
  }[]
}

export function PromptsList({ initialPrompts }: PromptsListProps) {
  const [prompts, setPrompts] = useState(initialPrompts)
  const [searchQuery, setSearchQuery] = useState("")
  const [isCreating, setIsCreating] = useState(false)
  const router = useRouter()

  const filteredPrompts = prompts.filter(prompt =>
    prompt.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleDelete = async (id: string) => {
    try {
      await deletePrompt(id)
      setPrompts(prompts.filter(prompt => prompt.id !== id))
      toast({
        title: "Prompt deleted",
        description: "Your prompt has been deleted successfully.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete prompt. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleRefresh = async () => {
    try {
      const refreshedPrompts = await getPrompts()
      setPrompts(refreshedPrompts)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to refresh prompts. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search prompts..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Dialog open={isCreating} onOpenChange={setIsCreating}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Create Prompt
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Create New Prompt</DialogTitle>
              <DialogDescription>
                Create a new prompt to use with the AI assistant.
              </DialogDescription>
            </DialogHeader>
            <CreatePromptForm
              onSuccess={() => {
                setIsCreating(false)
                handleRefresh()
              }}
            />
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">All Prompts</TabsTrigger>
          <TabsTrigger value="default">Default Prompts</TabsTrigger>
        </TabsList>
        <TabsContent value="all" className="mt-10">
          {filteredPrompts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <p className="text-muted-foreground">No prompts found.</p>
              <Button variant="secondary" className="mt-4" onClick={() => setIsCreating(true)}>
                Create your first prompt
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPrompts.map((prompt) => (
                <PromptCard
                  key={prompt.id}
                  prompt={prompt}
                  onDelete={() => handleDelete(prompt.id)}
                  onClick={() => router.push(`/prompts/${prompt.id}`)}
                />
              ))}
            </div>
          )}
        </TabsContent>
        <TabsContent value="default" className="">
          {filteredPrompts.filter(p => p.isDefault).length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <p className="text-muted-foreground">No default prompts found.</p>
              <Button variant="outline" className="mt-4" onClick={() => setIsCreating(true)}>
                Create a default prompt
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPrompts
                .filter(p => p.isDefault)
                .map((prompt) => (
                  <PromptCard
                    key={prompt.id}
                    prompt={prompt}
                    onDelete={() => handleDelete(prompt.id)}
                    onClick={() => router.push(`/prompts/${prompt.id}`)}
                  />
                ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
