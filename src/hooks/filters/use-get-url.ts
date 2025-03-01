import { GetUrlAction } from "@/actions/filters/get-url-action";
import { useQuery } from "@tanstack/react-query";

export const useGetUrl = () => {
  const { data: url, isFetching } = useQuery({
    queryKey: ["jobsUrl"],
    queryFn: GetUrlAction,
    staleTime: Infinity,
  })

  return {
    url,
    isFetching
  };
}
