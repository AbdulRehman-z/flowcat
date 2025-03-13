"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useJobsStatusContext } from "@/contexts/jobs-status-context";
import { useGetUrl } from "@/hooks/filters/use-get-url";
import { useScrapeJobs } from "@/hooks/jobs/use-scrape-jobs";
import { Job } from "@/types/jobs";
import { Accordion } from "../ui/accordion";
import JobCard from "./job-card";
import JobsSkeleton from "./jobs-skeleton";

type JobsCardProps = {
  initialData?: Job[];
};

export default function JobsCard({ initialData }: JobsCardProps) {
  const { url } = useGetUrl();
  const { jobs, isLoading, isRefetching } = useScrapeJobs(initialData, url!);
  const { setIsScraping, setJobs, jobs: savedJobs } = useJobsStatusContext();

  if (jobs && jobs.length > 0 && jobs !== savedJobs) {
    setJobs(jobs);
  }

  setIsScraping(!!isLoading || !!isRefetching);

  return (
    <Card className="min-w-full mx-auto  max-h-fit bg-background/95 shadow-none">
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
            {isLoading ? (
              <JobsSkeleton />
            ) : (
              savedJobs.map((job, index) => (
                <Accordion key={index} type="single" collapsible className="space-y-2">
                  <JobCard job={job} index={index} />
                </Accordion>
              ))
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
