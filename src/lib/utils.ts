import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import type { FilterState } from "../types/filters"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function generateUrl(filters: FilterState): string {
  const params = new URLSearchParams()

  // Category
  if (filters.category) {
    params.append("category2_uid", "531770282580668418")
  }

  // Project Length
  if (filters.projectLength.length > 0) {
    const durationMap: Record<string, string> = {
      "less-month": "week",
      "1-3-months": "month",
      "3-6-months": "semester",
      "more-6-months": "ongoing",
    }
    const durations = filters.projectLength.map((d) => durationMap[d]).join(",")
    params.append("duration_v3", durations)
  }

  // Hours per week
  if (filters.hoursPerWeek.includes("less-30")) {
    params.append("workload", "as_needed")
  }
  if (filters.hoursPerWeek.includes("more-30")) {
    params.append("workload", "full_time")
  }

  // Job Duration
  if (filters.jobDuration.includes("contract-hire")) {
    params.append("contract_to_hire", "true")
  }

  // Experience Level
  if (filters.experienceLevel.length > 0) {
    params.append("contractor_tier", filters.experienceLevel.join(","))
  }

  // Job Type - Hourly Rate
  if (filters.jobType.hourly) {
    const { min, max } = filters.jobType.hourlyRate
    if (min || max) {
      params.append("hourly_rate", `${min || ""}-${max || ""}`)
    }
  }

  // Job Type - Fixed Price
  if (filters.jobType.fixedPrice.length > 0) {
    const priceMap: Record<string, string> = {
      "less-100": "0-99",
      "100-500": "100-499",
      "500-1k": "500-999",
      "1k-5k": "1000-4999",
      "5k-plus": "5000-",
    }
    const prices = filters.jobType.fixedPrice.map((p) => priceMap[p]).join(",")
    params.append("amount", prices)
  }

  // Proposals
  if (filters.proposals.length > 0) {
    const proposalMap: Record<string, string> = {
      "less-5": "0-4",
      "5-10": "5-9",
      "10-15": "10-14",
      "15-20": "15-19",
      "20-50": "20-49",
    }
    const proposalRanges = filters.proposals.map((p) => proposalMap[p]).join(",")
    params.append("proposals", proposalRanges)
  }

  // Client Info
  if (filters.clientInfo.includes("payment-verified")) {
    params.append("payment_verified", "1")
  }
  if (filters.clientInfo.includes("my-previous")) {
    params.append("previous_clients", "all")
  }

  // Client History
  if (filters.clientHistory.length > 0) {
    const hiresMap: Record<string, string> = {
      "no-hires": "0",
      "1-9-hires": "1-9",
      "10-plus-hires": "10-",
    }
    const hires = filters.clientHistory.map((h) => hiresMap[h]).join(",")
    params.append("client_hires", hires)
  }

  // Location
  if (filters.locations.length > 0) {
    params.append("location", filters.locations.join(","))
  }

  // Timezone
  if (filters.timeZones.length > 0) {
    params.append("timezone", filters.timeZones.join(","))
  }

  return `https://www.upwork.com/nx/search/jobs?${params.toString()}`
}

export function getFilterTags(filters: FilterState): string[] {
  const tags: string[] = []

  // Project Length
  const projectLengthLabels: Record<string, string> = {
    "less-month": "Less than one month",
    "1-3-months": "1 to 3 months",
    "3-6-months": "3 to 6 months",
    "more-6-months": "More than 6 months",
  }
  filters.projectLength.forEach((length) => {
    tags.push(projectLengthLabels[length])
  })

  // Hours per week
  filters.hoursPerWeek.forEach((hours) => {
    tags.push(hours === "less-30" ? "Less than 30 hrs/week" : "More than 30 hrs/week")
  })

  // Job Duration
  if (filters.jobDuration.includes("contract-hire")) {
    tags.push("Contract-to-hire")
  }

  // Experience Level
  const expLabels: Record<string, string> = {
    entry: "Entry Level",
    intermediate: "Intermediate",
    expert: "Expert",
  }
  filters.experienceLevel.forEach((level) => {
    tags.push(expLabels[level])
  })

  // Job Type - Hourly Rate
  if (filters.jobType.hourly && (filters.jobType.hourlyRate.min || filters.jobType.hourlyRate.max)) {
    const { min, max } = filters.jobType.hourlyRate
    tags.push(`$${min}-$${max}/hr`)
  }

  // Job Type - Fixed Price
  const priceLabels: Record<string, string> = {
    "fixed-price": "Fixed-Price",
    "less-100": "Less than $100",
    "100-500": "$100 to $500",
    "500-1k": "$500 - $1K",
    "1k-5k": "$1K - $5K",
    "5k-plus": "$5K+",
  }
  filters.jobType.fixedPrice.forEach((price) => {
    tags.push(priceLabels[price])
  })

  // Proposals
  const proposalLabels: Record<string, string> = {
    "less-5": "Less than 5 proposals",
    "5-10": "5 to 10 proposals",
    "10-15": "10 to 15 proposals",
    "15-20": "15 to 20 proposals",
    "20-50": "20 to 50 proposals",
  }
  filters.proposals.forEach((proposal) => {
    tags.push(proposalLabels[proposal])
  })

  // Client Info
  if (filters.clientInfo.includes("payment-verified")) {
    tags.push("Payment verified")
  }
  if (filters.clientInfo.includes("my-previous")) {
    tags.push("My previous clients")
  }

  // Client History
  const historyLabels: Record<string, string> = {
    "no-hires": "No hires",
    "1-9-hires": "1 to 9 hires",
    "10-plus-hires": "10+ hires",
  }
  filters.clientHistory.forEach((history) => {
    tags.push(historyLabels[history])
  })

  // Locations
  filters.locations.forEach((location) => {
    tags.push(location)
  })

  return tags
}
