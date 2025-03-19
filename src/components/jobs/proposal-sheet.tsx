"use client"

import { useGetPrompt } from "@/hooks/prompts/use-get-prompt"
import { useGetPrompts } from "@/hooks/prompts/use-get-prompts"
import { AI_MODELS, PROMPT_TASTES } from "@/lib/constants"
import { cn } from "@/lib/utils"
import { Job } from "@/types/jobs"
import { useCompletion } from "@ai-sdk/react"
import { AnimatePresence } from "framer-motion"
import { CheckCircle, CopyCheck, CopyIcon, FileText, Loader2, MessageCircleMore, RefreshCw, Save, Star, Volume2, Wand2 } from "lucide-react"
import { FormEvent, useEffect, useReducer, useRef } from "react"
import { toast } from "sonner"
import { z } from "zod"
import { Badge } from "../ui/badge"
import { Button } from "../ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card"
import { Label } from "../ui/label"
import { ScrollArea } from "../ui/scroll-area"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "../ui/sheet"
import { Slider } from "../ui/slider"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs"
import { Textarea } from "../ui/textarea"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip"
import { useUpdateProposalGenerationStatus } from "@/hooks/billings/use-update-proposal-generation-status"

type ProposalSheetProps = {
  job: Job,
  title: string
}

// Validation schema
const proposalFormSchema = z.object({
  promptId: z.string().min(1, "Please select a prompt"),
  promptTaste: z.string().min(1, "Please select a taste profile"),
  model: z.string().min(1, "Please select an AI model"),
  wordCount: z.number().min(50).max(700),
})

type ProposalFormData = z.infer<typeof proposalFormSchema>

type SavedProposal = {
  id: string
  content: string
  jobTitle: string
  clientName: string
  date: string
}

// Define state interface
interface State {
  activeTab: string
  promptTaste: string
  wordCount: number
  model: string
  isSpeaking: boolean
  selectedJob: Job | null
  prompt: string
  promptId: string
  isSheetOpen: boolean
  validationErrors: Record<string, string>
  savedProposals: SavedProposal[]
  isCopied: boolean
  isStreaming: boolean
}

// Define action types
type Action =
  | { type: 'SET_ACTIVE_TAB', payload: string }
  | { type: 'SET_PROMPT_TASTE', payload: string }
  | { type: 'SET_WORD_COUNT', payload: number }
  | { type: 'SET_MODEL', payload: string }
  | { type: 'SET_IS_SPEAKING', payload: boolean }
  | { type: 'SET_SELECTED_JOB', payload: Job | null }
  | { type: 'SET_PROMPT', payload: string }
  | { type: 'SET_PROMPT_ID', payload: string }
  | { type: 'SET_IS_SHEET_OPEN', payload: boolean }
  | { type: 'SET_VALIDATION_ERRORS', payload: Record<string, string> }
  | { type: 'UPDATE_VALIDATION_ERROR', field: string, value: string }
  | { type: 'CLEAR_VALIDATION_ERROR', field: string }
  | { type: 'SET_SAVED_PROPOSALS', payload: SavedProposal[] }
  | { type: 'ADD_SAVED_PROPOSAL', payload: SavedProposal }
  | { type: 'DELETE_SAVED_PROPOSAL', id: string }
  | { type: 'SET_IS_COPIED', payload: boolean }
  | { type: 'SET_IS_STREAMING', payload: boolean }
  | { type: 'RESET_FORM' }

// Define reducer function
function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'SET_ACTIVE_TAB':
      return { ...state, activeTab: action.payload }
    case 'SET_PROMPT_TASTE':
      return { ...state, promptTaste: action.payload }
    case 'SET_WORD_COUNT':
      return { ...state, wordCount: action.payload }
    case 'SET_MODEL':
      return { ...state, model: action.payload }
    case 'SET_IS_SPEAKING':
      return { ...state, isSpeaking: action.payload }
    case 'SET_SELECTED_JOB':
      return { ...state, selectedJob: action.payload }
    case 'SET_PROMPT':
      return { ...state, prompt: action.payload }
    case 'SET_PROMPT_ID':
      return { ...state, promptId: action.payload }
    case 'SET_IS_SHEET_OPEN':
      return { ...state, isSheetOpen: action.payload }
    case 'SET_VALIDATION_ERRORS':
      return { ...state, validationErrors: action.payload }
    case 'UPDATE_VALIDATION_ERROR':
      return {
        ...state,
        validationErrors: {
          ...state.validationErrors,
          [action.field]: action.value
        }
      }
    case 'CLEAR_VALIDATION_ERROR':
      const updatedErrors = { ...state.validationErrors }
      delete updatedErrors[action.field]
      return { ...state, validationErrors: updatedErrors }
    case 'SET_SAVED_PROPOSALS':
      return { ...state, savedProposals: action.payload }
    case 'ADD_SAVED_PROPOSAL':
      return {
        ...state,
        savedProposals: [action.payload, ...state.savedProposals]
      }
    case 'DELETE_SAVED_PROPOSAL':
      return {
        ...state,
        savedProposals: state.savedProposals.filter(p => p.id !== action.id)
      }
    case 'SET_IS_COPIED':
      return { ...state, isCopied: action.payload }
    case 'SET_IS_STREAMING':
      return { ...state, isStreaming: action.payload }
    case 'RESET_FORM':
      return {
        ...state,
        activeTab: 'generate',
        promptId: '',
        prompt: '',
        validationErrors: {}
      }
    default:
      return state
  }
}

export default function ProposalSheet({ job, title }: ProposalSheetProps) {
  const { updateStatus, isUpdating } = useUpdateProposalGenerationStatus()



  // Initialize state with useReducer
  const initialState: State = {
    activeTab: 'generate',
    promptTaste: PROMPT_TASTES[0],
    wordCount: 200,
    model: 'gemini-2.0-flash',
    isSpeaking: false,
    selectedJob: null,
    prompt: '',
    promptId: '',
    isSheetOpen: false,
    validationErrors: {},
    savedProposals: [],
    isCopied: false,
    isStreaming: false
  }

  const [state, dispatch] = useReducer(reducer, initialState)
  const textAreaRef = useRef<HTMLTextAreaElement>(null)
  const speechSynthesisRef = useRef<SpeechSynthesisUtterance | null>(null)

  const { prompts, isFetchingPrompts } = useGetPrompts()
  const { promptData, isFetching } = useGetPrompt(state.promptId)

  // Load saved proposals
  useEffect(() => {
    if (state.isSheetOpen) {
      try {
        const saved = JSON.parse(localStorage.getItem('savedProposals') || '[]')
        dispatch({ type: 'SET_SAVED_PROPOSALS', payload: saved })
      } catch (error) {
        console.error("Failed to load saved proposals:", error)
      }
    }
  }, [state.isSheetOpen])

  // Update prompt when promptData changes
  useEffect(() => {
    if (promptData?.prompt) {
      dispatch({ type: 'SET_PROMPT', payload: promptData.prompt })
    }
  }, [promptData])

  // Set selectedJob when job prop changes
  useEffect(() => {
    if (job) {
      dispatch({ type: 'SET_SELECTED_JOB', payload: job })
    }
  }, [job])

  // Cleanup speech synthesis when component unmounts
  useEffect(() => {
    return () => {
      if (speechSynthesisRef.current) {
        window.speechSynthesis.cancel()
      }
    }
  }, [])

  const {
    completion,
    setCompletion,
    complete,
    isLoading,
  } = useCompletion({
    api: "/api/generate",
    body: {
      model: state.model,
      maxWords: state.wordCount,
      jobDetails: state.selectedJob,
      promptTaste: state.promptTaste,
      prompt: state.prompt,
    },
    onResponse: () => {
      dispatch({ type: 'SET_IS_STREAMING', payload: true })
      dispatch({ type: 'SET_ACTIVE_TAB', payload: 'review' })
      toast.success("Generating proposal...")
    },
    onFinish: () => {
      dispatch({ type: 'SET_IS_STREAMING', payload: false })
      toast.success("Proposal generated successfully!")
      updateStatus("success")
    },
    onError: (error) => {
      dispatch({ type: 'SET_IS_STREAMING', payload: false })
      console.error("Generation error:", error)
      toast.error(error.message || "An error occurred during generation")
      updateStatus("failed")
    },
  })

  // Auto-scroll during streaming
  useEffect(() => {
    if (state.isStreaming && textAreaRef.current) {
      textAreaRef.current.scrollTop = textAreaRef.current.scrollHeight
    }
  }, [completion, state.isStreaming])

  // // Smooth typing effect for streaming content
  // useEffect(() => {
  //   if (state.isStreaming && textAreaRef.current) {
  //     const timeout = setTimeout(() => {
  //       textAreaRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  //     }, 100);

  //     return () => clearTimeout(timeout);
  //   }
  // }, [completion, state.isStreaming]);

  const handlePromptSelect = (value: string) => {
    dispatch({ type: 'SET_PROMPT_ID', payload: value })
    dispatch({ type: 'CLEAR_VALIDATION_ERROR', field: 'promptId' })
  }

  const validateForm = (): boolean => {
    try {
      // Use zod to validate the form data
      const formData: ProposalFormData = {
        promptId: state.promptId,
        promptTaste: state.promptTaste,
        model: state.model,
        wordCount: state.wordCount
      }

      proposalFormSchema.parse(formData)
      dispatch({ type: 'SET_VALIDATION_ERRORS', payload: {} })
      return true
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errors: Record<string, string> = {}
        error.errors.forEach(err => {
          if (err.path[0]) {
            errors[err.path[0].toString()] = err.message
          }
        })
        dispatch({ type: 'SET_VALIDATION_ERRORS', payload: errors })
      } else {
        toast.error("Validation failed")
      }
      return false
    }
  }

  const handleGenerate = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!state.selectedJob) {
      toast.error("Job details are missing")
      return
    }

    // Validate the form
    if (!validateForm()) {
      toast.error("Please fill all required fields")
      return
    }

    // Call the complete function with the prompt
    await complete(state.prompt)
  }

  const handleSpeak = () => {
    if (!completion) return

    if (state.isSpeaking) {
      window.speechSynthesis.cancel()
      dispatch({ type: 'SET_IS_SPEAKING', payload: false })
      return
    }

    try {
      // Cancel any existing speech
      window.speechSynthesis.cancel()

      // Create a new utterance
      const utterance = new SpeechSynthesisUtterance(completion)
      speechSynthesisRef.current = utterance

      // Set event handlers
      utterance.onend = () => dispatch({ type: 'SET_IS_SPEAKING', payload: false })
      utterance.onerror = (event) => {
        console.error("Speech synthesis error:", event)
        toast.error("Speech synthesis failed")
        dispatch({ type: 'SET_IS_SPEAKING', payload: false })
      }

      // Start speaking
      window.speechSynthesis.speak(utterance)
      dispatch({ type: 'SET_IS_SPEAKING', payload: true })
    } catch (error) {
      console.error("Speech synthesis error:", error)
      toast.error("Speech synthesis failed")
    }
  }

  const handleCopy = () => {
    if (!completion) return

    navigator.clipboard.writeText(completion)
    dispatch({ type: 'SET_IS_COPIED', payload: true })
    toast.success("Copied to clipboard!")

    // Reset copy state after 2 seconds
    setTimeout(() => dispatch({ type: 'SET_IS_COPIED', payload: false }), 2000)
  }

  const handleSave = () => {
    if (!completion) return

    try {
      const newProposal: SavedProposal = {
        id: Date.now().toString(),
        content: completion,
        jobTitle: state.selectedJob?.title || 'Untitled Job',
        clientName: state.selectedJob?.clientName || 'Unknown Client',
        date: new Date().toISOString()
      }

      dispatch({ type: 'ADD_SAVED_PROPOSAL', payload: newProposal })

      // Update localStorage
      const updatedProposals = [newProposal, ...state.savedProposals]
      localStorage.setItem('savedProposals', JSON.stringify(updatedProposals))

      toast.success("Proposal saved successfully!")
      dispatch({ type: 'SET_ACTIVE_TAB', payload: 'saved' })
    } catch (error) {
      toast.error("Failed to save proposal")
    }
  }

  const deleteSavedProposal = (id: string) => {
    try {
      dispatch({ type: 'DELETE_SAVED_PROPOSAL', id })

      // Update localStorage
      const updated = state.savedProposals.filter(p => p.id !== id)
      localStorage.setItem('savedProposals', JSON.stringify(updated))

      toast.success("Proposal deleted")
    } catch (error) {
      toast.error("Failed to delete proposal")
    }
  }

  return (
    <>
      <Sheet
        open={state.isSheetOpen}
        onOpenChange={(open) => {
          dispatch({ type: 'SET_IS_SHEET_OPEN', payload: open })
          if (open) {
            dispatch({ type: 'SET_SELECTED_JOB', payload: job })
            dispatch({ type: 'SET_ACTIVE_TAB', payload: 'generate' })
          } else {
            // Only reset if closing
            if (!open) {
              setCompletion("")
            }
          }
        }}
      >
        <SheetTrigger asChild>
          <Button size={"sm"} className="gap-x-2">
            <MessageCircleMore className=" size-4" />
            {title}
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-full sm:max-w-3xl overflow-y-auto">
          <SheetHeader className="mb-6">
            <SheetTitle>Create Proposal</SheetTitle>
            <SheetDescription>
              Generate a personalized proposal for <Badge variant="outline">{job.title}</Badge>
            </SheetDescription>
          </SheetHeader>

          <Tabs value={state.activeTab} onValueChange={(value) => dispatch({ type: 'SET_ACTIVE_TAB', payload: value })} className="w-full">
            <TabsList className="grid grid-cols-3 mb-6">
              <TabsTrigger value="generate">Generate</TabsTrigger>
              <TabsTrigger value="review" disabled={!completion}>Review</TabsTrigger>
              <TabsTrigger value="saved">Saved ({state.savedProposals.length})</TabsTrigger>
            </TabsList>

            {/* Generation Tab */}
            <TabsContent value="generate">
              <form onSubmit={handleGenerate} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="grid gap-2">
                    <Label>Tone <span className="text-destructive">*</span></Label>
                    <Select
                      value={state.promptTaste}
                      onValueChange={(val) => {
                        dispatch({ type: 'SET_PROMPT_TASTE', payload: val })
                        dispatch({ type: 'CLEAR_VALIDATION_ERROR', field: 'promptTaste' })
                      }}
                    >
                      <SelectTrigger className={state.validationErrors.promptTaste ? "border-destructive" : ""}>
                        <SelectValue placeholder="Select Tone" />
                      </SelectTrigger>
                      <SelectContent>
                        {PROMPT_TASTES.map((prompt) => (
                          <SelectItem key={prompt} value={prompt}>
                            {prompt}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {state.validationErrors.promptTaste && (
                      <p className="text-sm text-destructive">{state.validationErrors.promptTaste}</p>
                    )}
                  </div>

                  <div className="grid gap-2">
                    <Label>AI Model <span className="text-destructive">*</span></Label>
                    <Select
                      value={state.model}
                      onValueChange={(val) => {
                        dispatch({ type: 'SET_MODEL', payload: val })
                        dispatch({ type: 'CLEAR_VALIDATION_ERROR', field: 'model' })
                      }}
                    >
                      <SelectTrigger className={state.validationErrors.model ? "border-destructive" : ""}>
                        <SelectValue placeholder="Select Model" />
                      </SelectTrigger>
                      <SelectContent>
                        {AI_MODELS.map((model) => (
                          <SelectItem key={model.id} value={model.id}>
                            {model.name} ({model.provider})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {state.validationErrors.model && (
                      <p className="text-sm text-destructive">{state.validationErrors.model}</p>
                    )}
                  </div>
                </div>

                <div className="grid gap-2">
                  <div className="flex justify-between items-center">
                    <Label>Word Count</Label>
                    <Badge variant="outline">{state.wordCount} words</Badge>
                  </div>
                  <Slider
                    value={[state.wordCount]}
                    min={50}
                    max={700}
                    step={10}
                    onValueChange={([value]) => dispatch({ type: 'SET_WORD_COUNT', payload: value })}
                    className="w-full"
                  />
                </div>

                <div className="grid gap-2">
                  <Label>Job Details</Label>
                  <Card>
                    <CardHeader className="py-3">
                      <CardTitle className="text-base">{job.title}</CardTitle>
                      <CardDescription>{job.clientName}</CardDescription>
                    </CardHeader>
                    <CardContent className="py-2">
                      <p className="text-sm">{job.description?.substring(0, 250)}...</p>
                    </CardContent>
                    {/* <CardFooter className="py-3 flex gap-2 flex-wrap">
                      {job.skills?.map((skill, i) => (
                        <Badge key={i} variant="secondary">{skill}</Badge>
                      ))}
                    </CardFooter> */}
                  </Card>
                </div>

                <div className="grid gap-2">
                  <Label>Select Prompt Template <span className="text-destructive">*</span></Label>
                  <Select
                    value={state.promptId}
                    onValueChange={handlePromptSelect}
                  >
                    <SelectTrigger className={state.validationErrors.promptId ? "border-destructive" : ""}>
                      <SelectValue placeholder="Select a prompt template" />
                    </SelectTrigger>
                    <SelectContent>
                      {isFetchingPrompts ? (
                        <div className="flex items-center justify-center p-2">
                          <Loader2 className="size-4 animate-spin mr-2" />
                          Loading prompts...
                        </div>
                      ) : prompts?.length ? (
                        prompts.map((p) => (
                          <SelectItem key={p.id} value={p.id} className="flex items-center justify-between">
                            <div className="flex items-center">
                              {p.name}
                              {p.isDefault && (
                                <Badge variant="outline" className="ml-2 text-xs">
                                  <Star className="size-3 mr-1 fill-primary" />
                                  Default
                                </Badge>
                              )}
                            </div>
                          </SelectItem>
                        ))
                      ) : (
                        <div className="p-2 text-center text-muted-foreground">
                          No prompts available
                        </div>
                      )}
                    </SelectContent>
                  </Select>
                  {state.validationErrors.promptId && (
                    <p className="text-sm text-destructive">{state.validationErrors.promptId}</p>
                  )}
                </div>

                {promptData && (
                  <div className="grid gap-2">
                    <Label>Template Preview</Label>
                    <ScrollArea className="h-[150px] rounded-md border p-4">
                      {
                        isFetching ? <div className="text-center">
                          <Loader2 className="size-8 animate-spin" />
                        </div> :
                          <div className="text-sm font-mono text-muted-foreground">
                            {promptData.prompt}
                          </div>
                      }
                    </ScrollArea>
                  </div>
                )}

                <SheetFooter className="flex justify-end gap-2 pt-4">
                  <Button
                    type="submit"
                    disabled={isLoading || !state.promptId}
                    className="w-full md:w-auto"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-1 size-4 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Wand2 className="mr-1 size-4" />
                        Generate Proposal
                      </>
                    )}
                  </Button>
                </SheetFooter>
              </form>
            </TabsContent>

            {/* Review Tab */}
            <TabsContent value="review">
              <div className="space-y-6">
                <Card>
                  <CardHeader className="py-3">
                    <CardTitle className="text-base">Generated Proposal</CardTitle>
                    <CardDescription>
                      Edit as needed before saving or submitting
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="py-2 relative">
                    <AnimatePresence>
                      <Textarea
                        ref={textAreaRef}
                        value={completion}
                        onChange={(e) => setCompletion(e.target.value)}
                        className={`min-h-[400px] font-mono text-base leading-relaxed resize-none focus-visible:ring-0  transition-all duration-200 ease-in-out ${state.isStreaming ? 'relative' : ''}`}
                        readOnly={state.isStreaming}
                      />
                      {state.isStreaming && (
                        <p className="absolute bottom-4 right-4 p-2 bg-primary text-primary-foreground rounded-md font-mono text-sm animate-pulse shadow-md">
                          Generating...
                        </p>
                      )}
                    </AnimatePresence>
                  </CardContent>
                  <CardFooter className="py-3 flex items-center gap-2">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={handleSpeak}
                            disabled={!completion}
                          >
                            <Volume2 className={cn("size-4 mr-1", state.isSpeaking && "text-primary")} />
                            {state.isSpeaking ? "Stop" : "Listen"}
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Listen to your proposal</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>

                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={handleCopy}
                            disabled={!completion}
                          >
                            {state.isCopied ? (
                              <>
                                <CopyCheck className="size-4 mr-1" />
                                Copied
                              </>
                            ) : (
                              <>
                                <CopyIcon className="size-4 mr-1" />
                                Copy
                              </>
                            )}
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Copy to clipboard</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>

                    <Button
                      variant="default"
                      size="sm"
                      onClick={handleSave}
                      disabled={!completion}
                    >
                      <Save className="size-4 mr-1" />
                      Save Proposal
                    </Button>

                    {state.selectedJob?.applyUrl && (
                      <Button
                        variant="default"
                        size="sm"
                        className="bg-green-600 hover:bg-green-700"
                        onClick={() => window.open(state.selectedJob!.applyUrl, '_blank')}
                        disabled={!completion}
                      >
                        <CheckCircle className="size-4 mr-1" />
                        Apply Now
                      </Button>
                    )}

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => dispatch({ type: 'SET_ACTIVE_TAB', payload: 'generate' })}
                      className="ml-auto"
                    >
                      <RefreshCw className="size-4 mr-1" />
                      Regenerate
                    </Button>
                  </CardFooter>
                </Card>
              </div>
            </TabsContent>

            {/* Saved Proposals Tab */}
            <TabsContent value="saved">
              <div className="space-y-4">
                {state.savedProposals.length > 0 ? (
                  <ScrollArea className="h-[500px] pr-4">
                    <div className="space-y-4">
                      {state.savedProposals.map((proposal) => (
                        <Card key={proposal.id} className="relative">
                          <CardHeader className="py-3">
                            <CardTitle className="text-base">{proposal.jobTitle}</CardTitle>
                            <CardDescription>
                              {proposal.clientName} • {new Date(proposal.date).toLocaleDateString()}
                            </CardDescription>
                          </CardHeader>
                          <CardContent className="py-2">
                            <p className="text-sm line-clamp-3">
                              {proposal.content.substring(0, 200)}...
                            </p>
                          </CardContent>
                          <CardFooter className="py-3 flex justify-between">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setCompletion(proposal.content)
                                dispatch({ type: 'SET_ACTIVE_TAB', payload: 'review' })
                              }}
                            >
                              <FileText className="size-4 mr-1" />
                              View & Edit
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => deleteSavedProposal(proposal.id)}
                            >
                              Delete
                            </Button>
                          </CardFooter>
                        </Card>
                      ))}
                    </div>
                  </ScrollArea>
                ) : (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <FileText className="h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium">No saved proposals</h3>
                    <p className="text-sm text-muted-foreground mt-1 mb-4">
                      Generate a proposal and save it to see it here.
                    </p>
                    <Button onClick={() => dispatch({ type: 'SET_ACTIVE_TAB', payload: 'generate' })}>
                      Create New Proposal
                    </Button>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </SheetContent>
      </Sheet>
    </>
  )
}
