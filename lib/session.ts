import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";

export async function getCurrentUser(includeProfile = false) {
  "use server";

  const cookieStore = cookies();
  try {
    const supabase = createClient(cookieStore);
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (includeProfile && user?.id) {
      const { data: profile } = await supabase
        .from("profiles")
        .select()
        .eq("id", user?.id)
        .single();

      return { ...user, profile };
    }

    return { ...user, profile: null };
  } catch (error) {
    console.error(error);
    throw new Error("An error occurred while fetching the user.");
  }
}
