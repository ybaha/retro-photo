import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const getLink = async (slug: string) => {
  "use server";

  const cookieStore = cookies();
  const supabaseClient = createClient(cookieStore);

  const { data, error } = await supabaseClient
    .from("urls")
    .select()
    .eq("slug", slug)
    .single();

  if (error) {
    console.log(error);
  } else {
    return redirect(data.url || "/");
  }
};
