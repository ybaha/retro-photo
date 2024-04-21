import { BillingForm } from "@/components/billing-form";
import { DashboardHeader } from "@/components/header";
import { DashboardShell } from "@/components/shell";
import { getCurrentUser } from "@/lib/session";
import { stripe } from "@/lib/stripe";
import { getUserSubscriptionPlan } from "@/lib/subscription";
import { getTranslations } from "next-intl/server";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Billing",
  description: "Manage billing and your subscription plan.",
};

export default async function BillingPage() {
  const user = await getCurrentUser();
  const t = await getTranslations("billing");

  if (!user || !user.id) {
    redirect("/login");
  }

  return (
    <DashboardShell>
      <DashboardHeader
        heading={t("dashboard-header")}
        text={t("dashboard-text")}
      />
      <div className="grid gap-8">
        <BillingForm />
      </div>
    </DashboardShell>
  );
}
