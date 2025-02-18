"use client"

import { newVerification } from "@/actions/auth/verification-action";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { BeatLoader } from "react-spinners";
import FormError from "../form-error";
import FormSuccess from "../form-success";
import CardWrapper from "./card-wrapper";

export default function VerificationForm() {
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  console.log({ error, success })

  const searchParams = useSearchParams()
  const token = searchParams.get("token")

  const onSubmit = useCallback(async () => {
    console.log("onSubmit")

    if (!token) {
      setError("Token missing!")
      return
    }

    await newVerification(token).then((data) => {
      if (data.error) {
        setError(data.error)
      } else {
        localStorage.setItem("verified", 'true')
        setSuccess(data.success!)
      }
    }).catch(() => {
      setError("Something went wrong!")
    })
  }, [token]);


  useEffect(() => {
    onSubmit()
    console.log("useEffect")
  }, [onSubmit])


  return (
    <CardWrapper headerLabel="Confirming your verification" >
      <div className="flex justify-center flex-col items-center">
        {!success && !error &&
          <BeatLoader />
        }
        <FormSuccess message={success} />
        {!success && <FormError message={error} />
        }
      </div>
    </CardWrapper>
  )
}
