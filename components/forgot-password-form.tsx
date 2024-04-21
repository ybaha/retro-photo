"use client";

import { Icons } from "@/components/icons";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";
import { forgotPassword, register as registerFn, signIn } from "@/lib/session";
import { useRouter } from "next/navigation";
import * as React from "react";

type ForgotPasswordFormProps = React.HTMLAttributes<HTMLDivElement>;

export function ForgotPasswordForm() {
  const router = useRouter();
  return (
    <div>
      <form
        action={async (data) => {
          const email = data.get("email")?.toString();

          if (!email) {
            toast({
              title: "Error",
              description: "Please enter your email address",
              variant: "destructive",
            });
            return;
          }

          await forgotPassword(email);

          toast({
            title: "Success",
            description: "Password reset link sent to your email",
          });

          router.push("/login");
        }}
      >
        <div>
          <Label htmlFor="email" className="sr-only">
            Email
          </Label>
          <Input
            id="email"
            type="email"
            name="email"
            placeholder="john@example.com"
            autoComplete="email"
            autoCorrect="off"
            autoCapitalize="none"
          />
        </div>
        <Button type="submit" className="w-full mt-4">
          Send Reset Link
        </Button>
      </form>
    </div>
  );
}
