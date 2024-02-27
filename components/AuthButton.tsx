import { createClient } from "@/utils/supabase/server";
import Link from "next/link";
import { cookies } from "next/headers";
import { Button } from "@/components/ui/button";
import { redirect } from "next/navigation";

export default async function AuthButton() {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return user ? (
    <div className="flex items-center gap-4">
      Hey, {user.email}!
      <form>
        <Button
          type="submit"
          formAction={async () => {
            "use server";
            return redirect("/dashboard");
          }}
          variant="outline"
          className="h-8"
        >
          Dashboard
        </Button>
        {/* button to sign out */}
        <Button
          type="submit"
          formAction={async () => {
            "use server";
            const cookieStore = cookies();
            const supabase = createClient(cookieStore);

            await supabase.auth.signOut();

            redirect("/");
          }}
          variant="outline"
          className="h-8"
        >
          Sign Out
        </Button>
      </form>
    </div>
  ) : (
    <Link
      href="/login"
      className="py-2 px-3 flex rounded-md no-underline bg-btn-background hover:bg-btn-background-hover"
    >
      Login
    </Link>
  );
}
