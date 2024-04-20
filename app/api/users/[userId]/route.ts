import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";
import { z } from "zod";

import { db } from "@/lib/db";
import { userNameSchema } from "@/lib/validations/user";

const routeContextSchema = z.object({
  params: z.object({
    userId: z.string(),
  }),
});

export async function PATCH(
  req: Request,
  context: z.infer<typeof routeContextSchema>
) {
  try {
    const cookieStore = cookies();

    // Validate the route context.
    const { params } = routeContextSchema.parse(context);
    const supabase = createClient(cookieStore);

    // Ensure user is authentication and has access to this user.
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user || params.userId !== user.id) {
      return new Response(null, { status: 403 });
    }

    // Get the request body and validate it.
    const body = await req.json();
    const payload = userNameSchema.parse(body);

    await supabase
      .from("profiles")
      .update({ full_name: payload.full_name })
      .eq("id", user.id);

    return new Response(null, { status: 200 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(JSON.stringify(error.issues), { status: 422 });
    }

    return new Response(null, { status: 500 });
  }
}
