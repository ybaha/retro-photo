import { createClient } from "@/utils/supabase/server";
import createServiceRoleClient from "@/utils/supabase/service";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const supabase = createClient(cookies());

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json(
      {
        error: "User not found",
      },
      {
        status: 404,
      }
    );
  }

  const { data: images, error } = await supabase
    .from("images")
    .select("*")
    .eq("user_id", user.id)
    .neq("status", "deleted")
    .neq("status", "error")
    .order("created_at", { ascending: false });

  return NextResponse.json(images);
}
