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
      <Card>
        <CardHeader>
          <CardTitle>Image Generation Balance</CardTitle>
          <CardDescription></CardDescription>
        </CardHeader>
        <CardContent>
          <p>
            You can generate images with your balance. Once you run out, you
            will need to top up your balance.
          </p>
        </CardContent>
        <CardFooter className="flex flex-col items-start space-y-2 md:flex-row md:justify-between md:space-x-0">
          <button
            type="submit"
            className={cn(buttonVariants())}
            disabled={isLoading}
          >
            {isLoading && (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            )}
            Get More Images
          </button>
        </CardFooter>
      </Card>

      <Pricing
        withoutHeader
        prices={[
          {
            title: "3 Image Generation Tokens",
            price: "50TL",
            features: ["Unlimited users", "Unlimited bandwidth"],
            type: 3,
          },
          {
            title: "10 Image Generation Tokens",
            price: "150TL",
            features: ["Unlimited users", "Unlimited bandwidth"],
            isPopular: true,
            type: 10,
          },
          {
            title: "100 Image Generation Tokens",
            price: "500TL",
            features: ["Unlimited users", "Unlimited bandwidth"],
            type: 100,
          },
        ]}
      />
    </form>
  );
}
