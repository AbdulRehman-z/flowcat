import { GetAvailableCredits } from "@/actions/credits/get-credits-action";
import AvailableCreditsCard from "@/components/jobs/credits-card";
import JobsCard from "@/components/jobs/jobs-card";
import JobsStatus from "@/components/jobs/jobs-status";
import { ReferralCard } from "@/components/jobs/referal-card";
import SavedJobs from "@/components/jobs/saved-jobs";
import { Button } from "@/components/ui/button";
import { TrendingUp } from "lucide-react";


export default async function Page() {
  // const initialData = await ScrapeJobsAction();
  const initialCreditsData = await GetAvailableCredits()
  return (
    <div className="h-full w-full bg-background">
      <div className="container min-w-full px-10 pt-5 pb-2">
        <div className="mb-6 opacity-100">
          <div className="flex items-center gap-4 justify-end">
            <SavedJobs />
            <Button variant="default" className="gap-x-2" size="sm">
              <TrendingUp className="size-4 " />
              Upgrade Pro
            </Button>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid  grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
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
              <AvailableCreditsCard initialData={initialCreditsData} />
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
