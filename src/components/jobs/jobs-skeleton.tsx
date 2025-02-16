import { Skeleton } from "../ui/skeleton";

export default function JobsSkeleton() {
  return (
    <div className="flex flex-col gap-4">
      {
        Array.from({ length: 8 }, (_, i) => (
          <Skeleton key={i} className="h-8" />
        ))
      }
    </div>
  );
}
