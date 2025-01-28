"use client"

import { motion } from "framer-motion"
import { RelatedCard } from "@/components/jobs/credits-card"
import { JobCard } from "@/components/jobs/jobs-card"
import { ReferralCard } from "@/components/jobs/referal-card"

export default function Page() {
  return (
    <div className="h-full w-full relative overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col items-center justify-center gap-8"
        >
          {/* Content grid */}
          <div className="w-full max-w-7xl space-y-12">
            <motion.div
              className="grid grid-cols-1 lg:grid-cols-2 gap-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              <div className="relative group">
                <RelatedCard />
              </div>

              <div className="relative group">
                <ReferralCard />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              <JobCard />
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
