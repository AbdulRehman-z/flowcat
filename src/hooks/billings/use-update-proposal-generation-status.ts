import { UpdateProposalGenerationStatusAction } from "@/actions/credits/update-proposal-generation-status-action";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const useUpdateProposalGenerationStatus = () => {

  const queryClient = useQueryClient()

  const { mutate: updateStatus, isPending: isUpdating } = useMutation({
    mutationFn: UpdateProposalGenerationStatusAction,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["credits"]
      });
      toast.success("Proposal generation status updated successfully");
    },
    onError: () => {
      toast.error("Failed to update proposal generation status");
    }
  })
  return { updateStatus, isUpdating };
};
