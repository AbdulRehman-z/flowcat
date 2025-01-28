"use client"

import { useState } from "react"
import { Check, Copy } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"

interface UrlCardProps {
  url: string
}

export function UrlCard({ url }: UrlCardProps) {
  const [copied, setCopied] = useState(false)

  const copyUrl = async () => {
    await navigator.clipboard.writeText(url)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <Card className="w-[576px] max-w-xl">
      <CardContent className="p-4">
        <div className="bg-muted p-3 rounded-lg break-all">
          <code className="text-sm font-mono text-muted-foreground">{url}</code>
        </div>
      </CardContent>
      <CardFooter className="justify-between">
        <Button variant="outline" onClick={copyUrl} className="text-sm font-medium">
          {copied ? (
            <>
              <Check className="mr-2 h-4 w-4" />
              Copied
            </>
          ) : (
            <>
              <Copy className="mr-2 h-4 w-4" />
              Copy URL
            </>
          )}
        </Button>
        <Button className="text-sm font-medium">Save Filters</Button>
      </CardFooter>
    </Card>
  )
}
