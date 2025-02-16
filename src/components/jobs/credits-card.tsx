"use client"

import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { useGetCredits } from "@/hooks/credits/use-get-credits"
import { AlertCircle, ArrowRight, Sparkles } from "lucide-react"

type CreditsData = {
  credits: number | undefined
  creditsHanded: number | undefined
}

function calculatePercentage(current: number | undefined, total: number | undefined): number {
  if (!current || !total || total === 0) return 0
  return (current / total) * 100
}

function getCreditsMessage(data: CreditsData | undefined): string {
  if (!data) return "Unable to load credits"
  if (!data.credits || !data.creditsHanded) return "No credits information available"
  if (data.credits <= 0) return "No credits remaining"
  return `${data.credits} credits remaining`
}

function getUsedCreditsMessage(data: CreditsData | undefined): string {
  if (!data?.credits || !data?.creditsHanded) return "Credits usage unavailable"
  const used = data.creditsHanded - data.credits
  return `${used} credits used`
}

export default function AvailableCreditsCard() {
  const { data, isLoadingCredits } = useGetCredits()
  const hasValidData = data?.credits !== undefined && data?.creditsHanded !== undefined
  const percentage = calculatePercentage(data?.credits, data?.creditsHanded)
  const isOutOfCredits = hasValidData && data.credits <= 0

  return (
    <Card className="relative w-full max-w-md overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent" />

      <div className="relative p-6 space-y-6">
        <div className="flex items-center gap-3">
          <div className="rounded-full bg-primary/10 p-2.5">
            <Sparkles className="h-5 w-5 text-primary" />
          </div>
          <div className="space-y-1.5">
            <h3 className="font-semibold text-lg">Available Credits</h3>
            {isLoadingCredits ? (
              <Skeleton className="h-2 w-24" />
            ) : (
              <p className="text-sm text-muted-foreground">{getCreditsMessage(data)}</p>
            )}
          </div>
        </div>

        {!hasValidData ? (
          <Alert variant="destructive" className="bg-destructive/5 border-none">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>Unable to load credits information. Please try again later.</AlertDescription>
          </Alert>
        ) : (
          <div className="space-y-2">
            {isLoadingCredits ? (
              <Skeleton className="h-2 w-full" />
            ) : (
              <div className="h-2 bg-primary/10 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-300 ${isOutOfCredits ? "bg-destructive" : "bg-primary"}`}
                  style={{
                    width: `${percentage}%`,
                  }}
                />
              </div>
            )}
            {isLoadingCredits ? (
              <Skeleton className="h-2 w-32" />
            ) : (
              <p className="text-sm text-muted-foreground">{getUsedCreditsMessage(data)}</p>
            )}
          </div>
        )}

        <Button
          className="w-full group"
          disabled={isLoadingCredits || !hasValidData}
          variant={isOutOfCredits ? "destructive" : "default"}
        >
          {isOutOfCredits ? "Purchase Credits Now" : "Purchase Credits"}
          <ArrowRight className="h-4 w-4 ml-2 transition-transform group-hover:translate-x-1" />
        </Button>
      </div>
    </Card>
  )
}
