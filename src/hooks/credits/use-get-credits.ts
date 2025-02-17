import { GetAvailableCredits } from "@/actions/credits/get-credits-action";
import { useQuery } from "@tanstack/react-query";

export const useGetCredits = (initialData: any) => {
  const { data, isPending: isLoadingCredits, isRefetching: isRefetchingCredits } = useQuery({
    queryKey: ['credits'],
    queryFn: GetAvailableCredits,
    initialData,
    refetchInterval: 1000 * 30, // 30 seconds
  })

  return {
    data,
    isLoadingCredits,
    isRefetchingCredits,
  };
}
