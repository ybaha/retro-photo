"use client";

import Pricing from "./prices";
import { Icons } from "@/components/icons";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "@/components/ui/use-toast";
import { prices } from "@/config/pricing";
import { cn, formatDate } from "@/lib/utils";
import { Loader } from "lucide-react";
import * as React from "react";
import { UserSubscriptionPlan } from "types";

type BillingFormProps = React.HTMLAttributes<HTMLFormElement> & {
  subscriptionPlan?: UserSubscriptionPlan;
};

export function BillingForm({ className, ...props }: BillingFormProps) {
  const [isLoading, setIsLoading] = React.useState<boolean>(false);

  async function onSubmit(type = 3) {
    setIsLoading(!isLoading);

    // Get a Stripe session URL.
    const response = await fetch("/api/users/stripe?type=" + type);

    if (!response?.ok) {
      return toast({
        title: "Something went wrong.",
        description: "Please refresh the page and try again.",
        variant: "destructive",
      });
    }

    // Redirect to the Stripe session.
    // This could be a checkout page for initial upgrade.
    // Or portal to manage existing subscription.
    const session = await response.json();
    if (session) {
      window.location.href = session.url;
    }
  }

  return (
    <form className={cn(className)} {...props}>
      <Pricing withoutHeader prices={prices} />
    </form>
  );
}
