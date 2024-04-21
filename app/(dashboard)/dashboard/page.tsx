import { ImageList } from "@/components/ImageList";
import { DashboardHeader } from "@/components/header";
import { DashboardShell } from "@/components/shell";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import Dropzone from "@/components/ui/dropzone";
import { getCurrentUser } from "@/lib/session";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Create Images",
  description: "Create and manage images.",
};

export default async function CreateLink() {
  const user = await getCurrentUser(true);

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
        heading="Create Images"
        text={`You can create ${user.profile?.balance || 0} more images`}
      />
      <div className="grid gap-8" suppressHydrationWarning>
        <form>
          <Dropzone maxFiles={user.profile?.balance} />
        </form>
        {/* list of images */}
        <ImageList imagesFromServer={images} profile={user.profile} />
        {!user.profile?.is_paid_user && (
          <Alert>
            <AlertTitle>Heads up!</AlertTitle>
            <AlertDescription>
              Since you haven't bought any image generation credits, you can
              only generate {user.profile?.balance} image
              {user.profile?.balance! > 1 ? "s" : ""}. Once you buy credits,
              your images won't have any watermark
            </AlertDescription>
          </Alert>
        )}
      </div>
    </DashboardShell>
  );
}
