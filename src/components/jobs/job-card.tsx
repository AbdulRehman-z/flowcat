import { cn } from "@/lib/utils";
import { Job } from "@/types/jobs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Award, Briefcase, Clock, DollarSign } from "lucide-react";
import { CSSProperties } from "react";
import { Button } from "../ui/button";
import ProposalSheet from "./proposal-sheet";
import { Badge } from "../ui/badge";

type JobCardProps = {
  savedJobs: Job[];
};

export default function JobCard({ savedJobs }: JobCardProps) {

  return (
    <>
      {savedJobs?.length > 0 && (
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
              } as CSSProperties}
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
                    <Badge className="h-5" variant="secondary">
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
                          <Badge key={i}>
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
      )}
    </>
  );
}
