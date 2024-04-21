import { ForgotPasswordForm } from "@/components/forgot-password-form";
import { Icons } from "@/components/icons";
import { ResetPasswordForm } from "@/components/reset-password-form";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { createClient } from "@/utils/supabase/server";
import { Metadata } from "next";
import { cookies } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Forgot Password",
  description: "Forgot your password? No worries, we got you covered.",
};

export default function ResetPassword() {
  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <Link
        href="/"
        className={cn(
          buttonVariants({ variant: "ghost" }),
          "absolute left-4 top-4 md:left-8 md:top-8"
        )}
      >
        <>
          <Icons.chevronLeft className="mr-2 h-4 w-4" />
          Back
        </>
      </Link>
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col space-y-2 text-center">
          <Icons.logo className="mx-auto h-6 w-6" />
          <h1 className="text-2xl font-semibold tracking-tight">
            Reset Password
          </h1>
          <p className="text-sm text-muted-foreground">
            Enter your new password
          </p>
        </div>
        <Suspense>
          <ResetPasswordForm />
        </Suspense>
        <p className="px-8 text-center text-sm text-muted-foreground flex flex-col gap-4 justify-between w-full">
          <Link
            href="/register"
            className="hover:text-brand underline underline-offset-4"
          >
            Sign Up
          </Link>
          <Link
            href="/forgot-password"
            className="hover:text-brand underline underline-offset-4"
          >
            Forgot password
          </Link>
        </p>
      </div>
    </div>
  );
}
