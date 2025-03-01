import { ApplyFiltersAction } from "@/actions/filters/apply-filters-action";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export function useApplyFilter() {
  const queryClient = useQueryClient();

  const { mutate: saveFilter, isPending: isSaving } = useMutation({
    mutationKey: ["jobsUrl"],
    mutationFn: ApplyFiltersAction,
    onSuccess: () => {
      toast.success("Filter saved successfully");
      queryClient.invalidateQueries({
        queryKey: ["jobsUrl"],
      });
    },
    onError: () => {
      toast.error("Failed to save filter");
    },

  })

  return {
    saveFilter,
    isSaving,
  };
}
