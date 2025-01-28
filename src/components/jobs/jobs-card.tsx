"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { AnimatePresence, motion } from "framer-motion"
import { Briefcase, ChevronDown, Clock, DollarSign, Globe2, Shield, Star, TrendingUp, Users } from "lucide-react"
import { useState } from "react"

type Job = {
  id: string
  title: string
  price: {
    amount: number
    type: "Fixed" | "Hourly"
  }
  description: string
  skills: string[]
  client: {
    name: string
    score: number
    spent: string
    hireRate: number
    location: string
    jobsPosted: number
    activeHires: number
  }
  posted: string
}

const jobs: Job[] = [
  {
    id: "1",
    title: "Next.js Developer for Enterprise Platform",
    price: { amount: 150, type: "Hourly" },
    description:
      "Lead the development of our next-generation enterprise platform using cutting-edge technologies and best practices. Work with a team of experienced developers on challenging projects.",
    skills: ["Next.js", "React", "TypeScript", "AWS"],
    client: {
      name: "TechCorp Global",
      score: 4.9,
      spent: "100K+",
      hireRate: 85,
      location: "United States",
      jobsPosted: 50,
      activeHires: 12,
    },
    posted: "2 hours ago",
  },
  {
    id: "2",
    title: "Full Stack Architect - AI Integration",
    price: { amount: 25000, type: "Fixed" },
    description:
      "Architect and implement AI-powered features for our flagship product. Lead the technical direction and mentor junior developers.",
    skills: ["Python", "React", "Machine Learning"],
    client: {
      name: "Innovation Labs",
      score: 4.8,
      spent: "250K+",
      hireRate: 90,
      location: "Canada",
      jobsPosted: 75,
      activeHires: 8,
    },
    posted: "5 hours ago",
  },
  {
    id: "3",
    title: "Senior UI/UX Developer",
    price: { amount: 130, type: "Hourly" },
    description:
      "Create stunning user interfaces with exceptional attention to detail. Work on innovative projects and collaborate with world-class designers.",
    skills: ["Figma", "React", "Animation"],
    client: {
      name: "Design Masters",
      score: 4.7,
      spent: "50K+",
      hireRate: 78,
      location: "United Kingdom",
      jobsPosted: 30,
      activeHires: 5,
    },
    posted: "1 day ago",
  },
]

export function JobCard() {
  const [expandedId, setExpandedId] = useState<string | null>(null)

  // const {jobs,is } = useScrapeJobs()

  return (
    <Card className="w-full mx-auto max-w-5xl max-h-fit bg-background/95 shadow-sm">
      <CardHeader className="border-b p-4">
        <div>
          <h2 className="text-xl font-semibold">Featured Opportunities</h2>
          <p className="text-sm text-muted-foreground">Exclusive positions from top clients</p>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <ScrollArea className="h-[450px] pr-4 -mr-4">
          <div className="grid gap-4">
            {jobs.map((job) => (
              <Card
                key={job.id}
                className={`group transition-all duration-300 ${expandedId === job.id ? "shadow-lg border-primary/20" : "hover:border-primary/10"
                  }`}
              >
                {/* Main Job Content */}
                <div
                  className="p-4 cursor-pointer"
                  onClick={() => setExpandedId(expandedId === job.id ? null : job.id)}
                >
                  <div className="flex items-center gap-6">
                    {/* Price Section */}
                    <div className="shrink-0 w-32 text-center p-3 rounded-lg bg-primary/5">
                      <div className="flex items-center justify-center gap-1 text-lg font-semibold text-primary">
                        <DollarSign className="h-4 w-4" />
                        {job.price.amount.toLocaleString()}
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {job.price.type === "Hourly" ? "per hour" : "fixed price"}
                      </span>
                    </div>

                    {/* Title & Description */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium mb-1 line-clamp-1">{job.title}</h3>
                      <p className="text-sm text-muted-foreground line-clamp-1">{job.description}</p>
                    </div>

                    {/* Expand/Collapse Icon */}
                    <div className="shrink-0 flex items-center gap-4">
                      <Button
                        variant="outline"
                        onClick={(e) => {
                          e.stopPropagation()
                          // Your apply logic here
                        }}
                      >
                        Apply Now
                      </Button>
                      <ChevronDown
                        className={`h-5 w-5 text-muted-foreground transition-transform duration-300 ${expandedId === job.id ? "rotate-180" : ""
                          }`}
                      />
                    </div>
                  </div>
                </div>

                {/* Expandable Content */}
                <AnimatePresence>
                  {expandedId === job.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      <div className="px-4 pb-4">
                        <div className="pt-4 border-t">
                          {/* Job Details */}
                          <div className="grid md:grid-cols-[2fr,1fr] gap-6">
                            <div className="space-y-4">
                              {/* Full Description */}
                              <div>
                                <h4 className="text-sm font-medium mb-2">Description</h4>
                                <p className="text-sm text-muted-foreground">{job.description}</p>
                              </div>

                              {/* Skills */}
                              <div>
                                <h4 className="text-sm font-medium mb-2">Required Skills</h4>
                                <div className="flex flex-wrap gap-1.5">
                                  {job.skills.map((skill) => (
                                    <Badge
                                      key={skill}
                                      variant="secondary"
                                      className="bg-primary/5 text-primary hover:bg-primary/10"
                                    >
                                      {skill}
                                    </Badge>
                                  ))}
                                </div>
                              </div>

                              {/* Job Info */}
                              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                <span className="flex items-center gap-1">
                                  <Briefcase className="w-3 h-3" />
                                  {job.client.name}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Clock className="w-3 h-3" />
                                  {job.posted}
                                </span>
                              </div>
                            </div>

                            {/* Client Stats Card */}
                            <div className="relative">
                              <div className="absolute inset-0 bg-gradient-to-br from-primary to-primary/90 opacity-[0.08] blur-2xl" />
                              <div className="relative rounded-lg border border-primary/10 p-4">
                                <div className="space-y-4">
                                  {/* Client Score */}
                                  <div className="flex items-center justify-between pb-2 border-b border-primary/10">
                                    <span className="text-sm font-medium">Client Rating</span>
                                    <div className="flex items-center gap-1">
                                      {[...Array(5)].map((_, i) => (
                                        <Star
                                          key={i}
                                          className={`h-4 w-4 ${i < Math.floor(job.client.score)
                                            ? "fill-primary text-primary"
                                            : "fill-muted text-muted"
                                            }`}
                                        />
                                      ))}
                                      <span className="ml-1 font-bold">{job.client.score}</span>
                                    </div>
                                  </div>

                                  {/* Stats Grid */}
                                  <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-3">
                                      <div className="flex items-center gap-2">
                                        <Shield className="w-4 h-4 text-primary" />
                                        <div>
                                          <div className="text-xs text-muted-foreground">Total Spent</div>
                                          <div className="font-medium">{job.client.spent}</div>
                                        </div>
                                      </div>
                                      <div className="flex items-center gap-2">
                                        <Users className="w-4 h-4 text-primary" />
                                        <div>
                                          <div className="text-xs text-muted-foreground">Active Hires</div>
                                          <div className="font-medium">{job.client.activeHires}</div>
                                        </div>
                                      </div>
                                    </div>
                                    <div className="space-y-3">
                                      <div className="flex items-center gap-2">
                                        <TrendingUp className="w-4 h-4 text-primary" />
                                        <div>
                                          <div className="text-xs text-muted-foreground">Hire Rate</div>
                                          <div className="font-medium">{job.client.hireRate}%</div>
                                        </div>
                                      </div>
                                      <div className="flex items-center gap-2">
                                        <Globe2 className="w-4 h-4 text-primary" />
                                        <div>
                                          <div className="text-xs text-muted-foreground">Location</div>
                                          <div className="font-medium">{job.client.location}</div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </Card>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
