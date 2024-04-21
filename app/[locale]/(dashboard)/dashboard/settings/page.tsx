import { DashboardHeader } from "@/components/header";
import { DashboardShell } from "@/components/shell";
import { UserSettingsForm } from "@/components/user-settings-form";
import { getCurrentUser } from "@/lib/session";
import { getTranslations } from "next-intl/server";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Settings",
  description: "Manage account and website settings.",
};

export default async function SettingsPage() {
  const user = await getCurrentUser(true);
  const t = await getTranslations("settings");

  if (!user.id) {
    redirect("/login");
  }

  return (
    <DashboardShell>
      <DashboardHeader
        heading={t("dashboard-header")}
        text={t("dashboard-text")}
      />
      <div className="">
        <UserSettingsForm
          user={{
            id: user.id,
            full_name: user.profile?.full_name || "",
            email: user.email || "",
          }}
          // eww
          personalInformationTitle={t("personal-information-title")}
          personalInformationDescription={t("personal-information-description")}
          nameLabel={t("name-label")}
          emailLabel={t("email-label")}
          deleteAccountTitle={t("delete-account-title")}
          deleteAccountDescription={t("delete-account-description")}
          saving={t("saving")}
          saveChanges={t("save-changes")}
          deleteAccount={t("delete-account")}
        />
      </div>
    </DashboardShell>
  );
}
