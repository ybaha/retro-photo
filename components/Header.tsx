import React from "react";
import DeployButton from "./DeployButton";
import AuthButton from "./AuthButton";
import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";

export default async function Header() {
  const canInitSupabaseClient = async () => {
    "use server";

    return true;
  };

  const isSupabaseConnected = await canInitSupabaseClient();

  return (
    <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16">
      <div className="w-full max-w-4xl flex justify-between items-center p-3 text-sm">
        <DeployButton />
        {isSupabaseConnected && <AuthButton />}
      </div>
    </nav>
  );
}
