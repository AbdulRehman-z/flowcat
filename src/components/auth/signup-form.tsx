"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { signupSchema } from "../../schemas/auth-schema";

import { Input } from "../ui/input";
import CardWrapper from "./card-wrapper";

import { signupAction } from "@/actions/auth/signup-action";
import { useEffect, useState, useTransition } from "react";
import FormError from "../form-error";
import FormSuccess from "../form-success";
import { Button } from "../ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { useUserVerification as Use } from "@/hooks/auth/use-user-verification";
import { useRouter } from "next/navigation";

export default function SignupForm() {
  const [isPending, startTransition] = useTransition();
  const router = useRouter()
  const [formStatus, setFormStatus] = useState<{
    error?: string;
    success?: string;
  }>({});

  const form = useForm<z.infer<typeof signupSchema>>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        console.log("Tab is visible");
        const isVerified = localStorage.getItem("verified") === "true";
        if (isVerified) {
          router.push("/auth/login");
        }
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [router]);

  async function onSubmit(data: z.infer<typeof signupSchema>) {
    setFormStatus({}); // Clear previous status

    startTransition(() => {
      signupAction(data)
        .then((response) => {
          setFormStatus(
            response.error
              ? { error: response.error }
              : { success: response.success }
          );
        })
        .catch((error) => {
          setFormStatus({
            error: error instanceof Error ? error.message : "An error occurred",
          });
        });
    });
  }

  return (
    <CardWrapper
      titleHeader="Sign up to Flowcat Inc"
      titleFooter="Login"
      backButtonHref="/auth/login"
      backButtonLabel="Already have an account?"
      headerLabel="Welcome! Please sign up to continue"
      showSocial
    >
      <Form {...form}>
        <form
          className="w-full space-y-4"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <FormField
            control={form.control}
            name="name"
            disabled={isPending}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input {...field} type="text" placeholder="John Doe" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            disabled={isPending}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="email"
                    placeholder="johndoe@gmail.com"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            disabled={isPending}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input {...field} type="password" placeholder="********" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormError message={formStatus.error} />
          <FormSuccess message={formStatus.success} />
          <div className="pt-4">
            <Button className="w-full " type="submit" disabled={isPending}>
              {isPending ? (
                <Loader2 className="animate-spin" />
              ) : (
                "Create account"
              )}
            </Button>
          </div>
        </form>
      </Form>
    </CardWrapper>
  );
}
