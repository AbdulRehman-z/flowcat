"use client"

import { useJobsStatusContext } from "@/contexts/jobs-status-context"
import { Clock, Loader, SlidersHorizontal } from "lucide-react"
import { useEffect, useState, useRef } from "react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"

export default function JobsStatus() {
  // Retrieve necessary state and functions from the context.
  const { isScraping, refreshingJobsInterval, jobs, setRefreshingJobsInterval } = useJobsStatusContext()
  const { toast } = useToast()

  // Ref to track the previous state of isScraping for notification detection.
  const prevIsScrapingRef = useRef(isScraping)
  // Ref for the notification sound.
  const notificationSound = useRef<HTMLAudioElement | null>(null)

  // targetTime: the absolute timestamp (in ms) for the next refresh.
  const [targetTime, setTargetTime] = useState(Date.now() + refreshingJobsInterval)
  // countdown: the remaining time (in ms) until the next refresh.
  const [countdown, setCountdown] = useState(refreshingJobsInterval)
  // isPulsing: flag to enable the pulsing effect when time is nearly up.
  const [isPulsing, setIsPulsing] = useState(false)

  // Initialize the notification sound on the client.
  useEffect(() => {
    if (typeof window !== "undefined") {
      notificationSound.current = new Audio("/notification.mp3")
      notificationSound.current.volume = 0.6
    }
  }, [])

  // Whenever the refresh interval changes, reset the target time and countdown.
  useEffect(() => {
    const newTarget = Date.now() + refreshingJobsInterval
    setTargetTime(newTarget)
    setCountdown(refreshingJobsInterval)
  }, [refreshingJobsInterval])

  // Handler for updating the refresh interval via the dropdown.
  const handleIntervalChange = (value: string) => {
    const minutes = parseInt(value, 10)
    if (isNaN(minutes)) return

    const newInterval = minutes * 60 * 1000
    // Update the context and reset local timer states.
    setRefreshingJobsInterval(newInterval)
    setTargetTime(Date.now() + newInterval)
    setCountdown(newInterval)
  }

  // Utility to format time (ms) into a "M:SS" string.
  const formatTime = (milliseconds: number) => {
    const totalSeconds = Math.ceil(milliseconds / 1000)
    const minutes = Math.floor(totalSeconds / 60)
    const seconds = totalSeconds % 60
    return `${minutes}:${seconds.toString().padStart(2, "0")}`
  }

  // Single effect to update the countdown and manage the pulsing effect.
  // It computes the remaining time based on the absolute targetTime.
  useEffect(() => {
    // Do not update the countdown while scraping is in progress.
    if (isScraping) return

    const interval = setInterval(() => {
      const now = Date.now()
      const remaining = targetTime - now

      if (remaining <= 0) {
        // When the countdown reaches zero, reset the timer.
        const newTarget = Date.now() + refreshingJobsInterval
        setTargetTime(newTarget)
        setCountdown(refreshingJobsInterval)
        setIsPulsing(false)
      } else {
        setCountdown(remaining)
        // Enable pulsing when remaining time is between 1 and 6 seconds.
        setIsPulsing(remaining <= 6000 && remaining > 1000)
      }
    }, 100) // 100ms interval for a smooth UI

    return () => clearInterval(interval)
  }, [targetTime, isScraping, refreshingJobsInterval])

  // Effect to trigger notifications when scraping transitions from active to complete.
  useEffect(() => {
    const wasScraping = prevIsScrapingRef.current

    if (wasScraping && !isScraping) {
      // Play the notification sound.
      try {
        notificationSound.current?.play()
      } catch (error) {
        console.warn("Audio playback failed:", error)
      }

      // Display a toast with job details.
      toast({
        title: "Refresh Complete",
        description: (
          <div className="flex flex-col gap-2">
            <p>Successfully updated job listings</p>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="font-mono px-2 py-1">
                {jobs.length} Jobs Found
              </Badge>
              <Badge variant="outline" className="font-mono px-2 py-1">
                Next: {formatTime(refreshingJobsInterval)}
              </Badge>
            </div>
          </div>
        ),
        className: "bg-background border border-muted-foreground/20",
        duration: 5000,
      })
    }

    // Update the previous scraping state.
    prevIsScrapingRef.current = isScraping
  }, [isScraping, jobs.length, refreshingJobsInterval, toast])

  // Compute the currently selected interval (in minutes) for the dropdown.
  const selectedMinutes = Math.floor(refreshingJobsInterval / (60 * 1000))

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4 p-4 bg-background/50 border rounded-lg">
      {/* Status Section */}
      <div className="flex-1">
        <h2 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
          {isScraping ? (
            <>
              <Loader className="h-4 w-4 animate-spin" />
              <span>Scraping jobs...</span>
            </>
          ) : (
            <>
              <SlidersHorizontal className="h-4 w-4" />
              <span>
                Showing <strong className="text-foreground">{jobs.length}</strong> jobs
              </span>
            </>
          )}
        </h2>
      </div>

      {/* Control Section */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 text-sm">
        <div className="flex gap-2 items-center">
          {/* Dropdown to select refresh interval */}
          <Select
            value={selectedMinutes.toString()}
            disabled={isScraping}
            onValueChange={handleIntervalChange}
          >
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Refresh every" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">1 minute</SelectItem>
              <SelectItem value="3">3 minutes</SelectItem>
              <SelectItem value="5">5 minutes</SelectItem>
              <SelectItem value="10">10 minutes</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex gap-2 items-center bg-muted/50 px-3 py-1.5 rounded-md">
          <Clock className="h-4 w-4" />
          <span>
            {isScraping ? (
              <span className="flex items-center gap-1">
                <Loader className="h-4 w-4 animate-spin" />
                <span>Refreshing...</span>
              </span>
            ) : (
              <span>
                Refreshing in{" "}
                <strong className={cn("text-foreground", isPulsing && "animate-pulse duration-1000")}>
                  {formatTime(countdown)}
                </strong>
              </span>
            )}
          </span>
        </div>
      </div>
    </div>
  )
}
