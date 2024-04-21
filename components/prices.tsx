import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";
import { useState } from "react";

type PricingCardProps = {
  title: string;
  price: string;
  features: string[];
  isPopular?: boolean;
  type?: number;
};

type Pricing = {
  withoutHeader?: boolean;
  prices: PricingCardProps[];
};

export default function Pricing({ withoutHeader, prices }: Pricing) {
  return (
    <div className={cn("bg-background dark:bg-gray-950")}>
      <div className="container px-4 md:px-6">
        {!withoutHeader && (
          <div className="mx-auto max-w-4xl text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Pricing
            </h2>
            <p className="mt-4 text-lg text-gray-500 dark:text-gray-400">
              Choose the plan that's right for you. Start with our free plan and
              upgrade as you grow.
            </p>
          </div>
        )}

        <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3 md:gap-8">
          {prices.map((price) => (
            <PricingCard key={price.title} {...price} />
          ))}
        </div>
      </div>
    </div>
  );
}

function PricingCard({
  title,
  price,
  features,
  isPopular,
  type,
}: PricingCardProps) {
  const [isLoading, setIsLoading] = useState(false);

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
          Most popular
        </span>
      )}
      <h3 className="mt-2 text-xl font-bold">{title}</h3>
      <p className="mt-4 text-4xl font-bold">{price}</p>
      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">per month</p>
      <div className="mt-5 space-y-4">
        {features.map((feature) => (
          <div key={feature} className="flex items-center">
            <CheckIcon className="h-5 w-5 text-primary" />
            <span className="ml-3 text-gray-500 dark:text-gray-400">
              {feature}
            </span>
          </div>
        ))}
      </div>
      <Button
        className="mt-8 w-full"
        onClick={(e) => {
          e.preventDefault();
          onSubmit(type);
        }}
      >
        Get started
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
