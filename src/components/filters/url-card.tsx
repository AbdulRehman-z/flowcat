"use client"

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { useApplyFilter } from "@/hooks/filters/use-apply-filters";
import { Check, Copy, Loader } from "lucide-react";
import { useState } from "react";

type UrlCardProps = {
  url: string;
}

export function UrlCard({ url }: UrlCardProps) {
  const [copied, setCopied] = useState(false);
  const { saveFilter, isSaving } = useApplyFilter()

  const copyUrl = async () => {
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function handleApplyFilters() {
    saveFilter(url)
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
        <Button onClick={handleApplyFilters} disabled={isSaving}>
          {isSaving ? (
            <>
              <Loader className="mr-2 h-4 w-4 animate-spin" />
              Applying...
            </>
          ) : (
            <>
              <Check className="mr-2 h-4 w-4" />
              Apply
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
