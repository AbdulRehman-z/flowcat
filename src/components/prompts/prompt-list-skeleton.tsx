import { Skeleton } from "@/components/ui/skeleton"

export function PromptListSkeleton() {
  return (
    <div className="space-y-2">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="flex items-center gap-2 p-2">
          <Skeleton className="h-8 w-8 rounded-lg" />
          <Skeleton className="h-4 flex-1" />
        </div>
      ))}
    </div>
  )
}


export function CommunityPromptListSkeleton() {
  return (
    <div className="space-y-2 w-full">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="flex w-full items-center ">
          <Skeleton className="size-10 w-full rounded-lg" />
        </div>
      ))}
    </div>
  )
}
