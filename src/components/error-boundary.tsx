"use client"

import { useEffect } from "react"
import { toast } from "sonner"

export function ErrorBoundary({ error }: { error: Error }) {
  useEffect(() => {
    toast.error("Something went wrong", {
      description: error.message
    })
  }, [error])

  return (
    <div className="flex flex-col items-center justify-center h-full gap-4 p-4 text-center">
      <h2 className="text-2xl font-bold text-destructive">Something went wrong!</h2>
      <p className="text-muted-foreground">{error.message}</p>
    </div>
  )
} 