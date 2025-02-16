import AvailableCreditsCard from "@/components/jobs/credits-card";
// import { AvaliableCreditsCard } from "@/components/jobs/credits-card";
import JobsCard from "@/components/jobs/jobs-card";
import JobsSkeleton from "@/components/jobs/jobs-skeleton";
import JobsStatus from "@/components/jobs/jobs-status";
import { ReferralCard } from "@/components/jobs/referal-card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Star, TrendingUp } from "lucide-react";
import { Suspense } from "react";

export default async function Page() {
  // const initialData = await ScrapeJobsAction();

  return (
    <div className="h-full w-full bg-background">
      <div className="container px-10 pt-5 pb-2">
        {/* Tabs */}
        <div className="mb-6 opacity-100">
          <div className="container mx-auto px-4">
            <div className="flex items-center gap-4 justify-end">
              <Button variant="outline" size="sm">
                <Star className="h-4 w-4 mr-2" />
                Saved Jobs
              </Button>
              <Button variant="default" size="sm">
                <TrendingUp className="h-4 w-4 mr-2" />
                Upgrade Pro
              </Button>
            </div>
          </div>
          <Tabs defaultValue="all" className="w-full">
            <TabsList>
              <TabsTrigger value="all">All Jobs</TabsTrigger>
              <TabsTrigger value="recommended">Recommended</TabsTrigger>
              <TabsTrigger value="applied">Applied</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
          {/* Jobs Section */}
          <div className="lg:col-span-2">
            <JobsStatus />
            <div className="rounded-xl border bg-card">
              <JobsCard />
            </div>
          </div>

          {/* Sidebar Content */}
          <div className="space-y-6">
            {/* Credits Section */}
            <div className="rounded-xl border flex bg-card p-6">
              <h2 className="text-lg font-semibold">Available Credits</h2>
              <AvailableCreditsCard />
            </div>

            {/* Referrals Section */}
            <div className="rounded-xl border bg-card flex p-6">
              <h2 className="text-lg font-semibold">Referral Program</h2>
              <ReferralCard />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
