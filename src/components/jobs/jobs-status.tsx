"use client"

import { useJobsStatusContext } from "@/contexts/jobs-status-context"
import { Clock, Loader, SlidersHorizontal } from "lucide-react"
import { useEffect, useState, useRef } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"

export default function JobsStatus() {
  const { isScraping, refreshingJobsInterval, jobs, setRefreshingJobsInterval } = useJobsStatusContext()
  const [countdown, setCountdown] = useState(refreshingJobsInterval)
  const [selectedIntervalMs, setSelectedIntervalMs] = useState(refreshingJobsInterval)
  const [isPulsing, setIsPulsing] = useState(false)
  const { toast } = useToast()
  const prevIsScrapingRef = useRef(isScraping)
  const notificationSound = useRef<HTMLAudioElement | null>(null)

  // Initialize audio safely
  useEffect(() => {
    if (typeof window !== "undefined") {
      notificationSound.current = new Audio("/notification.mp3")
      notificationSound.current.volume = 0.6
    }
  }, [])

  // Convert milliseconds to minutes for display
  const selectedMinutes = Math.floor(selectedIntervalMs / (60 * 1000))

  // Sanitized interval handling
  const handleIntervalChange = (value: string) => {
    const minutes = parseInt(value, 10)
    if (isNaN(minutes)) return

    const newInterval = minutes * 60 * 1000
    setSelectedIntervalMs(newInterval)
    setRefreshingJobsInterval(newInterval)
    setCountdown(newInterval)
  }

  // Robust time formatting
  const formatTime = (milliseconds: number) => {
    const totalSeconds = Math.max(0, Math.floor(milliseconds / 1000))
    const minutes = Math.floor(totalSeconds / 60)
    const seconds = totalSeconds % 60
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  // Notification system with state transition detection
  useEffect(() => {
    const wasScraping = prevIsScrapingRef.current
    const justFinished = wasScraping && !isScraping

    if (justFinished) {
      try {
        notificationSound.current?.play()
      } catch (error) {
        console.warn("Audio playback failed:", error)
      }

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
                Next: {formatTime(selectedIntervalMs)}
              </Badge>
            </div>
          </div>
        ),
        className: "bg-background border border-muted-foreground/20",
        duration: 5000
      })
    }

    prevIsScrapingRef.current = isScraping
  }, [isScraping, jobs.length, selectedIntervalMs, toast])

  // Countdown system with cleanup
  useEffect(() => {
    if (isScraping) return

    const interval = setInterval(() => {
      setCountdown(prev => {
        const newValue = prev - 1000
        return newValue > 0 ? newValue : selectedIntervalMs
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [isScraping, selectedIntervalMs])

  // Pulse effect management
  useEffect(() => {
    setIsPulsing(countdown <= 5000 && countdown > 1000)
  }, [countdown])

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
          <Select value={selectedMinutes.toString()} disabled={isScraping} onValueChange={handleIntervalChange}>
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
                <strong className={cn(
                  "text-foreground",
                  isPulsing && "animate-pulse duration-1000"
                )}>
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
