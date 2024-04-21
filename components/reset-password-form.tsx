"use client";

import { Icons } from "@/components/icons";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";
import { resetPassword } from "@/lib/session";
import { cn } from "@/lib/utils";
import { userAuthSchema } from "@/lib/validations/auth";
import { createClient } from "@/utils/supabase/server";
import { zodResolver } from "@hookform/resolvers/zod";
import { cookies } from "next/headers";
import { useRouter, useSearchParams } from "next/navigation";
import * as React from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

export function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const code = searchParams?.get("code");

  return (
    <div>
      <form
        action={async (data) => {
          const password = data.get("password")?.toString();

          if (!password) {
            toast({
              title: "Error",
              description: "Please enter your password",
              variant: "destructive",
            });
            return;
          }

          await resetPassword(password, code);

          router.push("/dashboard");
        }}
      >
        <div>
          <Label htmlFor="Password" className="sr-only">
            Password
          </Label>
          <Input
            id="password"
            type="password"
            name="password"
            placeholder="Password"
            autoComplete="password"
            autoCorrect="off"
            autoCapitalize="none"
          />
        </div>
        <Button type="submit" className="w-full mt-4">
          Reset Password
        </Button>
      </form>
    </div>
  );
}
