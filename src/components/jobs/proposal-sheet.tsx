"use client"

import { useGetPrompt } from "@/hooks/prompts/use-get-prompt"
import { useGetPrompts } from "@/hooks/prompts/use-get-prompts"
import { AI_MODELS, PROMPT_TASTES } from "@/lib/constants"
import { cn } from "@/lib/utils"
import { Job } from "@/types/jobs"
import { useCompletion } from "@ai-sdk/react"
import { AnimatePresence, motion } from "framer-motion"
import { Loader2, RefreshCw, Save, Volume2 } from "lucide-react"
import { FormEvent, useEffect, useState } from "react"
import { toast } from "sonner"
import { Button } from "../ui/button"
import { Label } from "../ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "../ui/sheet"
import { Slider } from "../ui/slider"
import { Textarea } from "../ui/textarea"
import { Input } from "../ui/input"
import { Value } from "@radix-ui/react-select"

type ProposalSheetProps = {
  job: Job
}

export default function ProposalSheet({ job }: ProposalSheetProps) {
  const [promptTaste, setPromptTaste] = useState(PROMPT_TASTES[0]);
  const [wordCount, setWordCount] = useState(200);
  const [model, setModel] = useState("gpt-3.5");
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [prompt, setPrompt] = useState<string>("");
  const [promptId, setPromptId] = useState("");
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const { prompts, isFetchingPrompts } = useGetPrompts();
  const { promptData, isFetching } = useGetPrompt(promptId);

  // Update prompt when promptData changes
  useEffect(() => {
    if (promptData?.prompt) {
      setPrompt(promptData.prompt);
    }
  }, [promptData]);

  // Set selectedJob when job prop changes
  useEffect(() => {
    if (job) {
      setSelectedJob(job);
    }
  }, [job]);

  const {
    completion,
    setCompletion,
    complete,
    input,
    handleInputChange,
    isLoading,
  } = useCompletion({
    api: "/api/generate",
    body: {
      model,
      maxWords: wordCount,
      jobDetails: selectedJob,
      promptTaste,
      prompt,
    },
    onResponse: () => {
      toast.success("Generating proposal...");
    },
    onFinish: () => {
      toast.success("Proposal generated successfully!");
    },
    onError: (error) => {
      console.error("Generation error:", error);
      toast.error(error.message || "An error occurred during generation");
    },
  });

  const handlePromptSelect = (value: string) => {
    setPromptId(value);
  };

  const handleGenerate = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!selectedJob) {
      toast.error("Job details are missing");
      return;
    }

  };

  const handleSpeak = () => {
    if (!completion) return;

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(completion);
    utterance.onend = () => setIsSpeaking(false);
    window.speechSynthesis.speak(utterance);
    setIsSpeaking(true);
  };

  const handleSave = () => {
    if (!completion) return;

    try {
      const savedProposals = JSON.parse(localStorage.getItem('savedProposals') || '[]');
      savedProposals.push({
        id: Date.now().toString(),
        content: completion,
        jobTitle: selectedJob?.title || 'Untitled Job',
        date: new Date().toISOString()
      });
      localStorage.setItem('savedProposals', JSON.stringify(savedProposals));
      toast.success("Proposal saved successfully!");
    } catch (error) {
      toast.error("Failed to save proposal");
    }
  };

  return (
    <>
      <Sheet
        open={isSheetOpen}
        onOpenChange={(open) => {
          setIsSheetOpen(open);
          if (open) {
            setSelectedJob(job);
          } else {
            // Only reset if closing
            if (!open) {
              setCompletion("");
            }
          }
        }}
      >
        <SheetTrigger asChild>
          <Button>Cook Proposal</Button>
        </SheetTrigger>
        <SheetContent className="w-full sm:max-w-[600px]">
          <form onSubmit={handleGenerate} className="h-full">
            <SheetHeader>
              <SheetTitle>Cook Proposal</SheetTitle>
              <SheetDescription>
                Generate an AI-powered proposal for this job opportunity
              </SheetDescription>
            </SheetHeader>
            <div className="space-y-10 py-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="grid gap-2">
                  <Label>Taste</Label>
                  <Select value={promptTaste} onValueChange={setPromptTaste}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Taste" />
                    </SelectTrigger>
                    <SelectContent>
                      {PROMPT_TASTES.map((prompt) => (
                        <SelectItem key={prompt} value={prompt}>
                          {prompt}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="gap-2 grid">
                  <Label>AI Model</Label>
                  <Select value={model} onValueChange={setModel}>
                    <SelectTrigger>
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
                </div>

                <div className="col-span-full grid gap-2">
                  <Label>Word Count: {wordCount}</Label>
                  <Slider
                    value={[wordCount]}
                    min={50}
                    max={700}
                    step={1}
                    onValueChange={([value]) => setWordCount(value)}
                    className="w-full"
                  />
                </div>
              </div>

              <div className="relative h-full space-y-5">
                {/* Prompt Selection */}
                <div className="grid gap-2">
                  <Label>Select Prompt</Label>
                  <Select value={promptId} onValueChange={handlePromptSelect}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select desired prompt from library" />
                    </SelectTrigger>
                    <SelectContent>
                      {isFetchingPrompts ? (
                        <SelectItem value="loading" disabled>Loading prompts...</SelectItem>
                      ) : prompts && prompts.length > 0 ? (
                        prompts.map((prompt) => (
                          <SelectItem key={prompt.id} value={prompt.id}>
                            {prompt.name}
                          </SelectItem>
                        ))
                      ) : (
                        <SelectItem value="empty" disabled>No prompts available</SelectItem>
                      )}
                    </SelectContent>
                  </Select>

                  {isFetching && <p className="text-sm text-muted-foreground">Loading prompt content...</p>}
                </div>
                <Input
                  readOnly
                  value={promptData?.prompt}
                  onChange={handleInputChange}
                />

                <Textarea
                  value={completion}
                  placeholder="Your AI-generated proposal will appear here..."
                  className="resize-none min-h-[500px]"
                  readOnly
                />
                <AnimatePresence>
                  {isLoading && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="absolute inset-0 bg-background/80 flex items-center justify-center"
                    >
                      <Loader2 className="h-8 w-8 animate-spin" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
            <SheetFooter className="flex justify-between sm:justify-between w-full">
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  disabled={!completion}
                  onClick={handleSpeak}
                  type="button"
                >
                  <Volume2 className={cn("h-4 w-4", isSpeaking && "text-primary")} />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  disabled={!completion}
                  onClick={handleSave}
                  type="button"
                >
                  <Save className="h-4 w-4" />
                </Button>
              </div>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4" />
                    {completion ? "Regenerate" : "Generate"}
                  </>
                )}
              </Button>
            </SheetFooter>
          </form>
        </SheetContent>
      </Sheet>
    </>
  );
}
