"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Gift, Copy, Share2, Sparkles } from "lucide-react"
import { useState } from "react"

export function ReferralCard() {
  const [copied, setCopied] = useState(false)
  const referralLink = "upwork.com/ref/user123" // Example link

  const copyLink = () => {
    navigator.clipboard.writeText(referralLink)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <Card className="relative overflow-hidden h-full group max-w-xl">
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(120,119,198,0.3),rgba(255,255,255,0))]" />
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent" />

      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-colors duration-500" />
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-primary/5 rounded-full blur-2xl group-hover:bg-primary/10 transition-colors duration-500" />

      <div className="relative p-6 h-full flex flex-col justify-between">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl animate-pulse" />
              <div className="relative rounded-full bg-gradient-to-br from-primary/80 to-primary p-2.5">
                <Gift className="h-5 w-5 text-primary-foreground" />
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-lg">Refer & Earn Rewards</h3>
              <p className="text-sm text-muted-foreground">Share with friends, earn together</p>
            </div>
          </div>

          <div className="bg-gradient-to-br from-primary/[0.08] to-primary/[0.03] rounded-lg p-4 border border-primary/10">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Reward per referral</span>
              <div className="flex items-center gap-1">
                <Sparkles className="h-4 w-4 text-primary" />
                <span className="font-semibold text-primary">10 Credits</span>
              </div>
            </div>
            <div className="h-2 bg-primary/10 rounded-full overflow-hidden">
              <div className="h-full w-3/5 bg-gradient-to-r from-primary to-primary/80 rounded-full" />
            </div>
            <p className="text-xs text-muted-foreground mt-2">6/10 referrals until bonus reward</p>
          </div>
        </div>

        <div className="space-y-3 pt-4">
          <div className="flex gap-2">
            <Button
              variant="outline"
              className="flex-1 bg-background/50 backdrop-blur-sm border-primary/20 hover:bg-background/80"
              onClick={copyLink}
            >
              <span className="truncate">{referralLink}</span>
              <Copy className="h-4 w-4 ml-2 shrink-0" />
            </Button>
            <Button variant="outline" size="icon" className="bg-background/50 backdrop-blur-sm border-primary/20">
              <Share2 className="h-4 w-4" />
            </Button>
          </div>
          {copied && (
            <p className="text-center text-sm text-primary animate-in fade-in slide-in-from-bottom-1">
              Link copied to clipboard!
            </p>
          )}
        </div>
      </div>
    </Card>
  )
}
