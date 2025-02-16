import { AddPromptDialog } from "@/components/jobs/add-prompt-dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Heart, MessageCircle, Save, Search } from "lucide-react"

export default function Page() {

  return (
    <div className="flex h-full w-full">
      {/* Left Sidebar */}
      < div className="w-[400px] border-r bg-background" >
        <div className="p-4 space-y-4">
          <h1 className="text-xl font-semibold">Prompt Library</h1>

          <Tabs defaultValue="my-prompts" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="my-prompts" className="flex text items-center gap-2">
                My prompts
              </TabsTrigger>
              <TabsTrigger value="community" className="flex text items-center gap-2">
                Community
              </TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="flex gap-x-2">
            <Input
              placeholder="Search your prompts..."
            />
            <Button variant="outline" size="icon">
              <Search className="h-4 w-4 text-muted-foreground" />
            </Button>
          </div>

          <ScrollArea className="h-full">
            <div className="space-y-1">
              {/* {prompts.map((prompt) => (

              ))} */}
            </div>
          </ScrollArea>
          <div className="mx-auto mt-auto">
            <AddPromptDialog />
          </div>
        </div>
      </div >

      {/* Main Content */}
      < div className="flex" >
        <div className="max-w-7xl p-6">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold">Laws of motion according to Newton</h1>
              <p className="text-sm text-muted-foreground">40 prompts</p>
            </div>
          </div>

          <div className="space-y-4">
            {topics.map((topic) => (
              <div key={topic.title} className="rounded-lg border bg-card p-4 shadow-sm">
                <div className="mb-4 flex items-start justify-between">
                  <h3 className="font-medium">{topic.title}</h3>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon">
                      <Heart className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <Save className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <p className="mb-4 text-sm text-muted-foreground">{topic.description}</p>
                <div className="flex gap-2">
                  {topic.tags.map((tag) => (
                    <Badge key={tag} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div >
    </div >
  )
}

const prompts = [
  {
    id: 1,
    title: "Process of photosynthesis in plants",
    icon: MessageCircle,
    count: "13",
    items: [
      { id: 1, title: "Effect of Increasing Force on Acceleration" },
      { id: 2, title: "Impact of Doubling Mass on Acceleration" },
      { id: 3, title: "Acceleration Changes When Driving" },
    ],
  },
  {
    id: 2,
    title: "Laws of motion according to Newton",
    icon: MessageCircle,
    count: "40",
    items: [
      { id: 4, title: "Rocket Acceleration in Space vs. Earth" },
      { id: 5, title: "Effect of Mass on Acceleration" },
    ],
  },
  {
    id: 3,
    title: "Story about a robot",
    icon: MessageCircle,
    items: [
      { id: 6, title: "AI and Consciousness" },
      { id: 7, title: "Robot Ethics" },
    ],
  },
]

const topics = [
  {
    title: "Effect of Increasing Force on Acceleration",
    description:
      "Increasing the force applied to an object will increase its acceleration, assuming the mass remains constant. According to Newton's second law of motion (F = ma), acceleration is directly proportional to the force applied. Thus, if you double the force, the acceleration will also double, leading to a greater change in the object's velocity.",
    tags: ["Physics Fundamentals", "Newton's Laws of Motion", "Force and Acceleration"],
  },
  {
    title: "Impact of Doubling Mass on Acceleration",
    description:
      "If an object's mass is doubled while the force applied remains the same, its acceleration will be halved. According to the laws of motion according to Newton (a = F/m), acceleration is inversely proportional to mass. Thus, increasing the mass results in a smaller acceleration for the same amount of force.",
    tags: ["Physics Fundamentals", "Newton's Laws of Motion"],
  },
]
