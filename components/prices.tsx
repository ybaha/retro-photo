"use server";

import { PricingCard } from "./pricing-card";
import { cn } from "@/lib/utils";
import { getTranslations } from "next-intl/server";

type PricingCardProps = {
  title?: string;
  price: string;
  features?: string[];
  isPopular?: boolean;
  type?: number;
};

type Pricing = {
  withoutHeader?: boolean;
  prices: PricingCardProps[];
};

export default async function Pricing({ withoutHeader, prices }: Pricing) {
  const t = await getTranslations("billing");

  return (
    <div className={cn("bg-background dark:bg-gray-950")}>
      <div className="">
        {!withoutHeader && (
          <div className="mx-auto max-w-4xl text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              {t("pricing-header")}
            </h2>
            <p className="mt-4 text-lg text-gray-500 dark:text-gray-400">
              {t("pricing-text")}
            </p>
          </div>
        )}

        <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3 md:gap-8">
          {prices.map((price) => (
            <PricingCard
              key={price.title}
              {...price}
              title={t("pricing-card-title", { type: price.type })}
              noWatermark={t("pricing-card-nowatermark")}
              noRecurringFees={t("pricing-card-norecurringfees")}
              buyNow={t("pricing-card-buy-now")}
              loading={t("pricing-card-loading")}
              mostPopular={t("pricing-card-most-popular")}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
