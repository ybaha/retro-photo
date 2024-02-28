import { redirect } from "next/navigation"

import { getCurrentUser } from "@/lib/session"
import { stripe } from "@/lib/stripe"
import { getUserSubscriptionPlan } from "@/lib/subscription"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { BillingForm } from "@/components/billing-form"
import { DashboardHeader } from "@/components/header"
import { Icons } from "@/components/icons"
import { DashboardShell } from "@/components/shell"

export const metadata = {
  title: "Create Link",
  description: "Create and manage links.",
}

export default async function CreateLink() {
  const user = await getCurrentUser()

  if (!user || !user.id) {
    redirect("/login")
  }

  return (
    <DashboardShell>
      <DashboardHeader heading="Create Link" text="Create and manage links." />
      <div className="grid gap-8">Selam</div>
    </DashboardShell>
  )
}
