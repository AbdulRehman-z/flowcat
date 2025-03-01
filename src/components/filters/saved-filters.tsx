"use client";

import { useGetSavedFilters } from "@/hooks/filters/use-get-saved-filters";
import { SavedFilter } from "@/types/filters";
import { Loader2, Filter, ExternalLink, Clock, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";
import { useRouter } from "next/navigation";
import { DeleteSavedFilterAction } from "@/actions/filters/delete-saved-filter-action";
import { ScrollArea } from "@/components/ui/scroll-area";

type SavedFiltersProps = {
  onSelectFilter: (filter: SavedFilter) => void;
};

export function SavedFilters({ onSelectFilter }: SavedFiltersProps) {
  const { savedFilters, isLoading, error, refetch } = useGetSavedFilters();
  const router = useRouter();

  const handleDelete = async (id: string) => {
    try {
      await DeleteSavedFilterAction(id);
      toast.success("Filter deleted successfully");
      refetch();
    } catch (error) {
      toast.error("Failed to delete filter");
    }
  };

  const handleApply = (filter: SavedFilter) => {
    onSelectFilter(filter);
    toast.success(`Filter "${filter.name}" applied`);
  };

  const handleViewJobs = (url: string) => {
    router.push(`/jobs?url=${encodeURIComponent(url)}`);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-center">
        <p className="text-destructive mb-4">Failed to load saved filters</p>
        <Button onClick={refetch}>Try Again</Button>
      </div>
    );
  }

  if (!savedFilters || savedFilters.length === 0) {
    return (
      <div className="text-center p-8">
        <Filter className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-medium mb-2">No saved filters</h3>
        <p className="text-muted-foreground mb-4">
          Create and save filters to quickly access them later
        </p>
      </div>
    );
  }

  return (
    <ScrollArea className="h-[600px] pr-4">
      <div className="space-y-4 p-1">
        {savedFilters.map((filter) => (
          <Card key={filter.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">{filter.name}</CardTitle>
              <CardDescription className="flex items-center text-xs">
                <Clock className="h-3 w-3 mr-1" />
                {formatDistanceToNow(new Date(filter.createdAt), { addSuffix: true })}
              </CardDescription>
            </CardHeader>
            <CardContent className="pb-2">
              <div className="flex flex-wrap gap-1">
                {filter.filters && filter.filters.filters && 
                  Object.entries(filter.filters.filters).map(([key, value]) => {
                    // Only show non-empty filters
                    if (
                      (Array.isArray(value) && value.length > 0) || 
                      (typeof value === 'string' && value) ||
                      (typeof value === 'object' && value && Object.keys(value).length > 0)
                    ) {
                      return (
                        <div key={key} className="text-xs bg-muted px-2 py-1 rounded-md">
                          {key}
                        </div>
                      );
                    }
                    return null;
                  })
                }
              </div>
            </CardContent>
            <CardFooter className="pt-2 flex justify-between">
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => handleApply(filter)}>
                  Apply
                </Button>
                <Button 
                  variant="default" 
                  size="sm" 
                  onClick={() => handleViewJobs(filter.url)}
                >
                  <ExternalLink className="h-3 w-3 mr-1" />
                  View Jobs
                </Button>
              </div>
              <Button 
                variant="destructive" 
                size="sm" 
                onClick={() => handleDelete(filter.id)}
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </ScrollArea>
  );
} 