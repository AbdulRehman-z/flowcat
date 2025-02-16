"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useJobsStatusContext } from "@/contexts/jobs-status-context";
import { useScrapeJobs } from "@/hooks/jobs/use-scrape-jobs";
import { cn } from "@/lib/utils";
import type { Job } from "@/types/jobs";
import { Award, Briefcase, Clock, DollarSign } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";
import JobsSkeleton from "./jobs-skeleton";
import ProposalSheet from "./proposal-sheet";

// type JobsCardProps = {
//   initialData: Job[];
// };

export default function JobsCard() {
  const { jobs, isRefetching } = useScrapeJobs();
  const { setIsScraping, setJobs, jobs: savedJobs } = useJobsStatusContext();

  // Improved state management: Update only when necessary
  if (jobs && jobs.length > 0 && jobs !== savedJobs) {
    setJobs(jobs);
  }

  if (isRefetching) {
    setIsScraping(isRefetching)
  }

  return (
    <Card className="w-full mx-auto max-w-5xl max-h-fit bg-background/95 shadow-none">
      <CardHeader className="border-b p-4">
        <div>
          <h2 className="text-xl font-semibold">Featured Opportunities</h2>
          <p className="text-sm text-muted-foreground">
            Exclusive positions from top clients
          </p>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <ScrollArea className="h-[430px] pr-4 -mr-4">
          <div className="grid gap-4">
            {isRefetching ? (
              <JobsSkeleton />
            ) : (
              jobs?.length > 0 && (
                <Accordion type="single" collapsible className="space-y-2">
                  {savedJobs.map((job, index) => (
                    <AccordionItem
                      key={index}
                      value={`item-${index}`}
                      className={cn(
                        "border rounded-lg bg-card group relative",
                        "after:absolute after:inset-0 after:opacity-0 after:pointer-events-none",
                        "after:bg-[radial-gradient(800px_circle_at_var(--mouse-x)_var(--mouse-y),rgba(0,0,0,0.05),transparent_40%)] dark:after:bg-[radial-gradient(800px_circle_at_var(--mouse-x)_var(--mouse-y),rgba(255,255,255,0.06),transparent_40%)]",
                        "hover:after:opacity-100 after:transition-opacity after:duration-500"
                      )}
                      style={{
                        "--mouse-x": "50%",
                        "--mouse-y": "50%",
                      } as React.CSSProperties}
                      onMouseMove={(e) => {
                        const rect = e.currentTarget.getBoundingClientRect();
                        const x = e.clientX - rect.left;
                        const y = e.clientY - rect.top;
                        e.currentTarget.style.setProperty(
                          "--mouse-x",
                          `${x}px`
                        );
                        e.currentTarget.style.setProperty(
                          "--mouse-y",
                          `${y}px`
                        );
                      }}
                    >
                      <AccordionTrigger className="min-h-8 px-4 hover:no-underline">
                        <div className="flex items-center justify-between w-full gap-4 px-2">
                          <div className="flex items-center gap-4">
                            <span className="font-medium text-sm">
                              {job.title}
                            </span>
                            <Badge variant="secondary" className="h-5">
                              {job.platform}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-4 text-muted-foreground text-sm">
                            <span className="flex items-center gap-1">
                              <Clock className="size-3" />
                              {job.posted}
                            </span>
                            <span className="flex items-center gap-1">
                              <DollarSign className="size-3" />
                              {job.jobType.split(":")[0]}
                            </span>
                          </div>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="px-4 py-3">
                        <div className="grid gap-6">
                          <div className="grid gap-4">
                            <div className="flex items-center gap-4 text-sm">
                              <div className="flex items-center gap-1">
                                <DollarSign className="h-4 w-4 text-muted-foreground" />
                                <span>Budget: {job.clientBudget}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Briefcase className="size-4 text-muted-foreground" />
                                <span>Duration: {job.duration}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Award className="h-4 w-4 text-muted-foreground" />
                                <span>Level: {job.experienceLevel}</span>
                              </div>
                            </div>
                            {job.tokens.length > 0 && (
                              <div className="flex flex-wrap gap-2">
                                {job.tokens.map((token, i) => (
                                  <Badge key={i} variant="secondary">
                                    {token}
                                  </Badge>
                                ))}
                              </div>
                            )}
                          </div>
                          <div className="ml-auto space-x-2">
                            <ProposalSheet job={job} />
                            <Button variant="outline">Save</Button>
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              )
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
