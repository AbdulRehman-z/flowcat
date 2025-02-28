"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useAddPrompt } from "@/hooks/prompts/use-add-prompt"
import { SELECT_CATEGORY_ITEM } from "@/lib/constants"
import { createNewPromptSchema, CreateNewPromptSchemaType } from "@/schemas/prompts-schema"
import { zodResolver } from "@hookform/resolvers/zod"
import { AlertCircle, GalleryVerticalEnd, Loader, Plus, RotateCcw, Save, Tag, X } from "lucide-react"
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
      addTag()
    }
  }

  const addTag = () => {
    const newTag = tagInput.trim()
    if (newTag && !selectedTags.includes(newTag)) {
      form.setValue("tags", [...selectedTags, newTag])
      setTagInput("")
    }
  }

  const handleRemoveTag = (tag: string) => {
    form.setValue("tags", selectedTags.filter((t) => t !== tag))
  }

  const onSubmit = useCallback((data: CreateNewPromptSchemaType) => {
    addPrompt(data)
  }, [addPrompt])


  const resetForm = () => {
    form.reset()
    setTagInput("")
  }

  return (
    <Dialog onOpenChange={resetForm}>
      <DialogTrigger asChild className="w-full">
        <Button variant="secondary" size="lg">
          <Plus className="mr-2 h-5 w-5" />
          Add new prompt
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[650px] max-h-[90vh] overflow-y-auto">
        <DialogHeader className="flex flex-row items-center gap-3 border-b pb-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <GalleryVerticalEnd className="h-5 w-5" />
          </div>
          <div>
            <DialogTitle>Create New Prompt</DialogTitle>
            <DialogDescription className="mt-1">
              Design a custom prompt to enhance your workflow
            </DialogDescription>
          </div>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                disabled={isAdding}
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-1 text-base">
                      Name
                      <span className="text-xs text-muted-foreground">(Required)</span>
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="Enter a descriptive name" {...field} />
                    </FormControl>
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
                    <FormLabel className="text-base">Category</FormLabel>
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
            </div>

            <FormField
              disabled={isAdding}
              control={form.control}
              name="prompt"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center justify-between">
                    <FormLabel className="flex items-center gap-1 text-base">
                      Prompt
                      <span className="text-xs text-muted-foreground">(Required)</span>
                    </FormLabel>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-8 gap-1 px-2">
                            <AlertCircle className="h-4 w-4" />
                            <span className="text-xs">Tips</span>
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent className="max-w-sm p-4">
                          <p className="font-medium mb-2">Prompt Writing Tips:</p>
                          <ul className="text-sm space-y-1 list-disc pl-4">
                            <li>Be specific about the format you want</li>
                            <li>Provide examples when possible</li>
                            <li>Include any context the AI would need</li>
                            <li>Break complex tasks into steps</li>
                          </ul>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <FormControl>
                    <Textarea
                      placeholder="Write your prompt here..."
                      className="min-h-[160px] font-mono text-sm"
                      {...field}
                    />
                  </FormControl>
                  <div className="flex justify-between items-center mt-1">
                    <FormMessage />
                    <div className="text-xs text-muted-foreground">
                      {field.value.length} characters
                    </div>
                  </div>
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                disabled={isAdding}
                control={form.control}
                name="tags"
                render={() => (
                  <FormItem>
                    <FormLabel className="text-base">Tags</FormLabel>
                    <div className="space-y-2">
                      <div className="flex gap-2">
                        <FormControl>
                          <Input
                            placeholder="Add tags (press Enter or comma)"
                            value={tagInput}
                            onChange={(e) => setTagInput(e.target.value)}
                            onKeyDown={handleAddTag}
                          />
                        </FormControl>
                        <Button
                          type="button"
                          size="icon"
                          variant="outline"
                          onClick={addTag}
                          disabled={!tagInput.trim()}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                      {selectedTags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-2">
                          {selectedTags.map((tag) => (
                            <Badge key={tag} variant="secondary" className="flex items-center gap-1 pr-1">
                              <Tag className="h-3 w-3" />
                              {tag}
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="h-4 w-4 p-0 hover:bg-transparent"
                                onClick={() => handleRemoveTag(tag)}
                              >
                                <X className="h-3 w-3" />
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

              <div className="space-y-4">
                <FormField
                  disabled={isAdding}
                  control={form.control}
                  name="visibility"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base">Visibility</FormLabel>
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
                    <FormItem className="flex items-start space-x-2">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          id="isDefault"
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel htmlFor="isDefault">Set as default prompt</FormLabel>
                        <FormDescription className="text-xs">
                          This prompt will be used as the default when creating new conversations
                        </FormDescription>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 border-t pt-4 mt-6">
              <Button
                disabled={isAdding}
                type="button"
                variant="outline"
                className="gap-2"
                onClick={resetForm}
              >
                <RotateCcw className="h-4 w-4" />
                Reset
              </Button>
              <Button
                disabled={isAdding}
                type="submit"
                className="gap-2"
              >
                {isAdding ? (
                  <>
                    <Loader size={20} />
                    Adding...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    Create Prompt
                  </>
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
