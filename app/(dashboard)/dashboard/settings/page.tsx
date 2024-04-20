import { DashboardHeader } from "@/components/header";
import { DashboardShell } from "@/components/shell";
import { UserSettingsForm } from "@/components/user-settings-form";
import { getCurrentUser } from "@/lib/session";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Settings",
  description: "Manage account and website settings.",
};

export default async function SettingsPage() {
  const user = await getCurrentUser(true);

  if (!user.id) {
    redirect("/login");
  }

  return (
    <DashboardShell>
      <DashboardHeader
        heading="Settings"
        text="Manage account and website settings."
      />
      <div className="">
        <UserSettingsForm
          user={{
            id: user.id,
            full_name: user.profile?.full_name || "",
            email: user.email || "",
          }}
        />
      </div>
    </DashboardShell>
  );
}
