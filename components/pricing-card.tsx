"use client";

import { Button } from "./ui/button";
import { toast } from "./ui/use-toast";
import { cn } from "@/lib/utils";
import { useState } from "react";

type PricingCardProps = {
  title: string;
  price: string;
  features: string[];
  isPopular?: boolean;
  type?: number;
  noWatermark?: string;
  noRecurringFees?: string;
  buyNow?: string;
  loading?: string;
  mostPopular?: string;
};

export function PricingCard({
  title,
  price,
  loading,
  mostPopular,
  isPopular,
  type,
  buyNow,
  noRecurringFees,
  noWatermark,
}: PricingCardProps) {
  const [isLoading, setIsLoading] = useState(false);

  async function onSubmit(type: number) {
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
    <div
      className={cn(
        "rounded-lg border-2 border-gray-600 bg-background p-6 shadow-sm relative",
        {
          "border-4 border-primary bg-background dark:bg-gray-950 dark:border-primary":
            isPopular,
        }
      )}
    >
      {isPopular && (
        <span className="absolute -top-3 m-auto left-0 w-32 text-center right-0 text-xs text-white uppercase bg-primary px-2 py-1 rounded-full font-bold h-6">
          {mostPopular}
        </span>
      )}
      <h3 className="mt-2 text-xl font-bold">{title}</h3>
      <p className="mt-4 text-4xl font-bold">{price}</p>

      <div className="mt-5 space-y-4">
        <div className="flex items-center">
          <CheckIcon className="h-5 w-5 text-primary" />
          <span className="ml-3 text-gray-500 dark:text-gray-400">
            {noWatermark}
          </span>
        </div>
      </div>
      <div className="flex items-center">
        <CheckIcon className="h-5 w-5 text-primary" />
        <span className="ml-3 text-gray-500 dark:text-gray-400">
          {noRecurringFees}
        </span>
      </div>
      <Button
        className="mt-8 w-full"
        onClick={(e) => {
          e.preventDefault();
          if (type) onSubmit(type);
        }}
      >
        {isLoading ? loading : buyNow}
      </Button>
    </div>
  );
}

function CheckIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}
