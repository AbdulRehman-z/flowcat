import { Logo } from "@/components/logo";
import { Separator } from "@/components/ui/separator";
import { LoaderIcon } from "lucide-react";

export default function Loading() {
  return (
    <div className="h-full w-full flex flex-col items-center justify-center gap-4">
      <Logo />
      <Separator className="max-w-xs" />
      <div className="flex items-center gap-2 justify-center">
        <LoaderIcon size={16} className="animate-spin stroke-primary" />
        <p className="text-muted-foreground">Hold your horses! Loading relevant data...</p>
      </div>
    </div>
  )
}
