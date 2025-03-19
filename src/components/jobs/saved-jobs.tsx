"use client"

import { useGetSavedJobs } from "@/hooks/jobs/use-get-saved-jobs"
import { CalendarClock, Clock, DollarSign, Loader2, Star, Briefcase, Award } from "lucide-react"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "../ui/sheet"
import { Button } from "../ui/button"
import { useState } from "react"
import { Badge } from "../ui/badge"
import { Separator } from "../ui/separator"
import { ScrollArea } from "../ui/scroll-area"
import { formatDistanceToNow } from "date-fns"
import { useDeleteJob } from "@/hooks/jobs/use-remove-save-job"
import ProposalSheet from "./proposal-sheet"

export default function SavedJobs() {
  const [mounted, setMounted] = useState(false)
  const { savedJobs, isFetching } = useGetSavedJobs(mounted)
  const { removeJob, isRemoving } = useDeleteJob()

  function handleDeleteJob(title: string) {
    removeJob(title)
  }

  return (
    <Sheet onOpenChange={setMounted}>
      <SheetTrigger asChild>
        <Button className="gap-x-2" variant={"outline"} size={"sm"}>
          <Star className="size-4" />
          Saved Jobs
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-md">
        <SheetHeader className="pb-4">
          <SheetTitle className="flex items-center gap-2">
            <Star className="size-5 text-amber-500" />
            Saved Jobs
            {savedJobs && (
              <Badge variant="secondary" className="ml-2">
                {savedJobs.length}
              </Badge>
            )}
          </SheetTitle>
        </SheetHeader>

        <Separator />

        <ScrollArea className="h-[calc(100vh-8rem)] pr-4 -mr-4">
          {isFetching ? (
            <div className="flex items-center justify-center h-40">
              <Loader2 className="size-6 text-muted-foreground animate-spin" />
            </div>
          ) : savedJobs?.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-40 text-center">
              <Star className="size-10 text-muted-foreground mb-2 opacity-20" />
              <p className="text-muted-foreground">No saved jobs yet</p>
              <p className="text-xs text-muted-foreground mt-1">Jobs you save will appear here</p>
            </div>
          ) : (
            <div className="space-y-4 mt-4">
              {savedJobs?.map((job) => (
                <div key={job.id} className="bg-card rounded-lg border p-4 hover:shadow-sm transition-shadow">
                  <h3 className="font-medium line-clamp-2">{job.title}</h3>

                  <div className="grid grid-cols-2 gap-x-2 gap-y-3 mt-3">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <DollarSign className="size-3.5 flex-shrink-0" />
                      <span className="truncate">
                        {job.clientBudget !== "Not Specified" ? job.clientBudget : "Budget not specified"}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Briefcase className="size-3.5 flex-shrink-0" />
                      <span className="truncate">{job.jobType}</span>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Award className="size-3.5 flex-shrink-0" />
                      <span className="truncate">{job.experienceLevel}</span>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="size-3.5 flex-shrink-0" />
                      <span className="truncate">{job.duration}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-3 pt-4 border-t text-xs text-muted-foreground">
                    <div className="flex items-center gap-1.5">
                      <CalendarClock className="size-3.5" />
                      <span>Saved {formatDistanceToNow(new Date(job.createdAt), { addSuffix: true })}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <ProposalSheet title="Apply" job={job} />
                      <Button onClick={() => handleDeleteJob(job.title)} variant="destructive" size="sm" className="">
                        Delete
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </SheetContent>
    </Sheet>
  )
}
