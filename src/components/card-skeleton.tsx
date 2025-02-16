import { cn } from "@/lib/utils";
import { Skeleton } from "./ui/skeleton";

type CardSkeletonProps = {
  cardHeight?: string;
  cardWidth?: string;
};

export default function CardSkeleton({ cardHeight, cardWidth }: CardSkeletonProps) {
  // const heightClass = cardHeight ? cardHeight : "h-full";
  // const widthClass = cardWidth ? cardWidth : "w-full";

  return (
    <Skeleton className={cn("w-full h-full")} />
  );
};
