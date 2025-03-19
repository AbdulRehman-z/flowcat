"use server";

import { auth } from "@/auth";
import { creditsHistory, db } from "@/db";
import { PeriodToDateRange } from "@/lib/utils";
import { Period } from "@/types/jobs";
import { eachDayOfInterval, format } from "date-fns";
import { and, eq, gte, inArray, lte } from "drizzle-orm";

type Stats = Record<string, {
  success: number,
  failed: number,
}>


export const getCreditsUsageStatsAction = async (period: Period) => {
  const session = await auth()
  if (!session?.user.id) {
    throw new Error("Unauthorized")
  }

  const userId = session.user.id
  const dateRange = PeriodToDateRange(period)
  const historys = await db.select().from(creditsHistory).where(and(eq(creditsHistory.userId, userId), inArray(creditsHistory.status, ["success", "failed"]), lte(creditsHistory.createdAt, dateRange.endDate), gte(creditsHistory.createdAt, dateRange.startDate)))

  const stats: Stats = eachDayOfInterval({
    start: dateRange.startDate,
    end: dateRange.endDate
  }).map((date) => format(date, "dd-mm-yyyy")).reduce((acc, date) => {
    acc[date] = {
      success: 0,
      failed: 0
    }
    return acc
  }, {} as Stats)

  historys.forEach((history) => {
    const date = format(history.createdAt, "dd-mm-yyyy")
    if (history.status === "success") {
      stats[date].success += history.creditsConsumed
    } else {
      stats[date].failed += history.creditsConsumed
    }
  })


  const results = Object.entries(stats).map(([date, infos]) => ({ date, ...infos }))
  return results
}
