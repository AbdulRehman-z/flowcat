"use client"

import { cn } from "@/lib/utils"
import { Job } from "@/types/jobs"
import { useCompletion } from "@ai-sdk/react"
import { AnimatePresence, motion } from "framer-motion"
import { Loader2, RefreshCw, Save, Volume2 } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "../ui/sheet"
import { Textarea } from "../ui/textarea"
import { PROMPT_TASTES, AI_MODELS } from "@/lib/constants"
import { Label } from "../ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger } from "../ui/select"
import { Slider } from "../ui/slider"


type ProposalSheetProps = {
  job: Job
}

export default function ProposalSheet({ job }: ProposalSheetProps) {
  const [promptTaste, setPromptTaste] = useState(PROMPT_TASTES[0]);
  const [wordCount, setWordCount] = useState(200);
  const [model, setModel] = useState("gpt-3.5");
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [selectedPropmt, setSelectedPropmt] = useState()

  const {
    completion,
    setCompletion,
    input,
    handleInputChange,
    handleSubmit: handleGenerationSubmit,
    isLoading,
  } = useCompletion({
    api: "/api/generate",
    body: {
      model,
      maxWords: wordCount,
      jobDetails: selectedJob,
      promptTaste,
    },
    onResponse: () => {
      toast.success("Generating proposal...");
    },
    onFinish: () => {
      toast.success("Proposal generated successfully!");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const handleGenerate = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim()) {
      toast.error("please provide a prompt!");
      return;
    }
    handleGenerationSubmit(e);
  };

  const handleSpeak = () => {
    if (!completion) return;
    console.log("speaking");

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

  return (
    <>
      <Sheet
        onOpenChange={(open) => {
          if (open) {
            setSelectedJob(job);
          } else {
            setSelectedJob(null);
            setCompletion("");
          }
        }}
      >
        <SheetTrigger asChild>
          <Button variant="outline">Generate Proposal</Button>
        </SheetTrigger>
        <SheetContent className="w-full  sm:max-w-[600px]">
          <form onSubmit={handleGenerate} className="h-full">
            <SheetHeader>
              <SheetTitle>Generate Proposal</SheetTitle>
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
                      <span>Select Taste</span> {/* Replaced SelectValue */}
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
                      <span>Select Model</span> {/* Replaced SelectValue */}
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
                {/* Prompt Input */}
                <div className="grid gap-2">
                  <Label htmlFor="prompt">Prompt</Label>
                  <Input
                    id="prompt"
                    value={input}
                    onChange={handleInputChange}
                    placeholder="Enter your prompt here..."
                  />
                </div>

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
                >
                  <Volume2 className={cn("h-4 w-4", isSpeaking && "text-primary")} />
                </Button>
                <Button variant="outline" size="icon" disabled={!completion}>
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
