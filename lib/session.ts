"use server";

import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

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

export const signOut = async () => {
  "use server";
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  await supabase.auth.signOut();

  redirect("/");
};

export const signIn = async (data: { email: string; password: string }) => {
  "use server";
  const supabase = createClient(cookies());

  const { error } = await supabase.auth.signInWithPassword({
    email: data.email,
    password: data.password,
  });

  if (error) {
    return error.message;
  }

  redirect("/dashboard");
};

export const register = async (data: { email: string; password: string }) => {
  "use server";
  const supabase = createClient(cookies());

  const { error } = await supabase.auth.signUp({
    email: data.email,
    password: data.password,
  });

  if (error) {
    return error.message;
  }

  redirect("/dashboard");
};

export const forgotPassword = async (email: string) => {
  "use server";

  const supabase = createClient(cookies());

  if (email) {
    await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/reset-password`,
    });
  }
};

export const resetPassword = async (password: string, code?: string | null) => {
  "use server";

  const supabase = createClient(cookies());

  if (!code) {
    throw new Error("No code provided");
  }

  await supabase.auth.exchangeCodeForSession(code);

  if (password) {
    await supabase.auth.updateUser({ password });
  }
};
