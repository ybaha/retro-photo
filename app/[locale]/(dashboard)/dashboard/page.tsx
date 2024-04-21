import { ImageList } from "@/components/ImageList";
import { DashboardHeader } from "@/components/header";
import { DashboardShell } from "@/components/shell";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import Dropzone from "@/components/ui/dropzone";
import { getCurrentUser } from "@/lib/session";
import { createClient } from "@/utils/supabase/server";
import { getTranslations } from "next-intl/server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Create Images",
  description: "Create and manage images.",
};

export default async function CreateLink() {
  const user = await getCurrentUser(true);
  const t = await getTranslations("dashboard");

  if (!user || !user.id) {
    console.log({ user });
    redirect("/login");
  }

  const supabase = createClient(cookies());

  const { data: images } = await supabase
    .from("images")
    .select("*")
    .eq("profile_id", user.id)
    .neq("status", "deleted")
    .neq("status", "error")
    .order("created_at", { ascending: false });

  return (
    <DashboardShell>
      <DashboardHeader
        heading={t("dashboard-header")}
        text={t("dashboard-text", {
          count: user.profile?.balance,
        })}
      />
      <div className="grid gap-8" suppressHydrationWarning>
        <form>
          <Dropzone maxFiles={user.profile?.balance} />
        </form>
        {/* list of images */}
        <ImageList imagesFromServer={images} profile={user.profile} />
        {!user.profile?.is_paid_user && (
          <Alert>
            <AlertTitle>{t("alert-title")}</AlertTitle>
            <AlertDescription>
              {t("alert-description", {
                count: user.profile?.balance,
              })}
            </AlertDescription>
          </Alert>
        )}
      </div>
    </DashboardShell>
  );
}
// pluralization -> "message": "You have {count, plural, =0 {no followers yet} =1 {one follower} other {# followers}}."
