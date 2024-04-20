import { ImageList } from "@/components/ImageList";
import { DashboardHeader } from "@/components/header";
import { DashboardShell } from "@/components/shell";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import Dropzone from "@/components/ui/dropzone";
import { getCurrentUser } from "@/lib/session";
import { createClient } from "@/utils/supabase/server";
import createServiceRoleClient from "@/utils/supabase/service";
import { Loader } from "lucide-react";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Replicate from "replicate";

export const metadata = {
  title: "Create Link",
  description: "Create and manage links.",
};

export default async function CreateLink() {
  const user = await getCurrentUser(true);

  if (!user || !user.id) {
    console.log({ user });
    redirect("/login");
  }

  const supabase = createClient(cookies());

  const { data: images, error } = await supabase
    .from("images")
    .select("*")
    .eq("user_id", user.id)
    .neq("status", "deleted")
    .neq("status", "error")
    .order("created_at", { ascending: false });

  return (
    <DashboardShell>
      <DashboardHeader heading="Create Link" text="Create and manage links." />
      <div className="grid gap-8">
        <form>
          <Dropzone />
        </form>
        {/* list of images */}
        <ImageList imagesFromServer={images} />
        <Alert>
          <AlertTitle>Heads up!</AlertTitle>
          <AlertDescription>
            You need to be subscribed to create a link.
            <a href="/dashboard/billing">Subscribe now</a>.
          </AlertDescription>
          <form className="mt-8 gap-4 flex items-center">
            <span>Balance: {user.profile?.balance}</span>
          </form>
        </Alert>
      </div>
    </DashboardShell>
  );
}
