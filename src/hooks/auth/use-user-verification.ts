import { CheckVerificationAction } from "@/actions/auth/check-verification-action";
import { useQuery } from "@tanstack/react-query"

export const useUserVerification = (email: string) => {
  const { data } = useQuery({
    queryKey: ['userVerification', email],
    queryFn: () => CheckVerificationAction(email),
    refetchOnWindowFocus: "always",
  })

  return { data }
}
