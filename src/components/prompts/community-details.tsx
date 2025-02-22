"use client"

import { useGetCategoryPrompts } from "@/hooks/prompts/use-get-category-prompts";
import { AnimatePresence, motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import CommunityPromptCard from "./community-prompt-card";

type CommunityDetailsProps = {
  categoryName: string;
};

export default function CommunityDetails({ categoryName }: CommunityDetailsProps) {
  const { categoryPrompts, isFetching } = useGetCategoryPrompts(categoryName);


  if (isFetching) {
    return <CategoryPromptsLoadingSkeleton />
  }


  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={categoryName}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.2 }}
        className="p-6 max-w-6xl "
      >
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {categoryPrompts?.map((item, index) => (
            <CommunityPromptCard item={item} index={index} key={index} />
          ))}
        </div>
      </motion.div>
    </AnimatePresence >
  );
}


const CategoryPromptsLoadingSkeleton = () => {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <div className="flex flex-col items-center space-y-4">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground">Loading prompt details...</p>
      </div>
    </div>
  )
}
