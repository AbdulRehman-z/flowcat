"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useAddPrompt } from "@/hooks/prompts/use-add-prompt"
import { SELECT_CATEGORY_ITEM } from "@/lib/constants"
import { createNewPromptSchema, CreateNewPromptSchemaType } from "@/schemas/prompts-schema"
import { zodResolver } from "@hookform/resolvers/zod"
import { GalleryVerticalEnd, Plus, RotateCcw, Save, X } from "lucide-react"
import { useCallback, useState } from "react"
import { useForm } from "react-hook-form"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "../ui/form"
import { Input } from "../ui/input"

export function AddPromptDialog() {
  const { addPrompt, isAdding } = useAddPrompt()
  const [tagInput, setTagInput] = useState("")
  const form = useForm<CreateNewPromptSchemaType>({
    resolver: zodResolver(createNewPromptSchema),
    defaultValues: {
      name: "",
      prompt: "",
      tags: [],
      visibility: "Private",
      isDefault: true,
      category: ""
    }
  })

  const selectedTags = form.watch("tags")
  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault()
      const newTag = tagInput.trim()
      if (newTag && !selectedTags.includes(newTag)) {
        form.setValue("tags", [...selectedTags, newTag])
        setTagInput("")
      }
    }
  }

  const handleRemoveTag = (tag: string) => {
    form.setValue("tags", selectedTags.filter((t) => t !== tag))
  }

  const onSubmit = useCallback((data: CreateNewPromptSchemaType) => {
    addPrompt(data)

  }, [addPrompt])


  return (
    <Dialog onOpenChange={() => form.reset()} >
      <DialogTrigger asChild className="w-full">
        <Button variant="secondary" size={"lg"}>
          <Plus size={20} />
          Add new prompt</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader className="flex flex-row items-center gap-2 border-b pb-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <GalleryVerticalEnd className="h-5 w-5" />
          </div>
          <DialogTitle>Create New Prompt</DialogTitle>
        </DialogHeader>
        <div className="space-y-6 pt-4">
          <Form {...form} >
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                disabled={isAdding}
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-1">
                      Name
                      <p className="text-sm">(Required)</p>
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="Prompt name" {...field} />
                    </FormControl>
                    <FormDescription>
                      Provide a name for your workflow.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                disabled={isAdding}
                control={form.control}
                name="prompt"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-1">
                      Prompt
                      <p className="text-sm">(Required)</p>
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter your prompt here..."
                        className="min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Provide a well written prompt for your workflow.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                disabled={isAdding}
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {
                          SELECT_CATEGORY_ITEM.map((item) => (
                            <SelectItem key={item.label} value={item.value} className={item.color}>
                              {item.label}
                            </SelectItem>
                          ))
                        }
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                disabled={isAdding}
                control={form.control}
                name="tags"
                render={() => (
                  <FormItem>
                    <FormLabel>Tags</FormLabel>
                    <div className="space-y-2">
                      <FormControl>
                        <Input
                          placeholder="Add tags (press Enter or comma to add)"
                          value={tagInput}
                          onChange={(e) => setTagInput(e.target.value)}
                          onKeyDown={handleAddTag}
                        />
                      </FormControl>
                      {selectedTags.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {selectedTags.map((tag) => (
                            <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                              {tag}
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-3 w-3 p-0 hover:bg-transparent"
                                onClick={() => handleRemoveTag(tag)}
                              >
                                <X className="h-2 w-2" />
                              </Button>
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                disabled={isAdding}
                control={form.control}
                name="visibility"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Visibility</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        value={field.value}
                        className="flex gap-4"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="Private" id="private" />
                          <Label htmlFor="private">Private</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="Public" id="public" />
                          <Label htmlFor="public">Public</Label>
                        </div>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                disabled={isAdding}
                control={form.control}
                name="isDefault"
                render={({ field }) => (
                  <FormItem className="flex items-center space-x-2">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel>Set as default prompt</FormLabel>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex items-center justify-end gap-2 border-t pt-4">
                <Button
                  disabled={isAdding}
                  type="button"
                  variant="outline"
                  className="gap-2"
                  onClick={() => { form.reset() }}
                >
                  <RotateCcw className="h-4 w-4" />
                  Reset
                </Button>
                <Button
                  disabled={isAdding}
                  type="submit"
                  className="gap-2"
                >
                  <Save className="h-4 w-4" />
                  {isAdding ? 'Adding...' : 'Add'}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  )
}
