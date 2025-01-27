"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Sparkles, ArrowRight, Coins } from "lucide-react"
import { Badge } from "@/components/ui/badge"

export function RelatedCard() {
  const totalCredits = 85
  const maxCredits = 100

  return (
    <Card className="relative overflow-hidden max-w-xl h-full group">
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_0%_0%,rgba(120,119,198,0.3),rgba(255,255,255,0))]" />
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent" />

      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-colors duration-500" />

      <div className="relative p-6 h-full flex flex-col justify-between">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl animate-pulse" />
                <div className="relative rounded-full bg-gradient-to-br from-primary/80 to-primary p-2.5">
                  <Sparkles className="h-5 w-5 text-primary-foreground" />
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-lg">Related Skills</h3>
                <p className="text-sm text-muted-foreground">Trending in your expertise</p>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {["React", "Next.js", "TypeScript", "Tailwind CSS"].map((skill) => (
              <Badge
                key={skill}
                variant="secondary"
                className="bg-primary/5 text-primary hover:bg-primary/10 transition-colors"
              >
                {skill}
              </Badge>
            ))}
          </div>

          {/* Credits Display */}
          <div className="bg-gradient-to-br from-primary/[0.08] to-primary/[0.03] rounded-lg p-4 border border-primary/10">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Available Credits</span>
              <div className="flex items-center gap-1">
                <Coins className="h-4 w-4 text-primary" />
                <span className="font-semibold text-primary">{totalCredits}</span>
              </div>
            </div>
            <div className="h-2 bg-primary/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-primary to-primary/80 rounded-full transition-all duration-500"
                style={{ width: `${(totalCredits / maxCredits) * 100}%` }}
              />
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              {maxCredits - totalCredits} more credits until next tier
            </p>
          </div>
        </div>

        <Button className="w-full group mt-4">
          View Matching Jobs
          <ArrowRight className="h-4 w-4 ml-2 transition-transform group-hover:translate-x-1" />
        </Button>
      </div>
    </Card>
  )
}
