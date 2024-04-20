"use server";

import { Tables } from "@/types/supabase-types";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";

export const updateTheme = async (
  theme: Tables<"themes"> & {
    files?: FormData;
  }
) => {
  "use server";
  const ck = cookies();
  const supabase = createClient(ck);

  const authUser = await supabase.auth.getUser();

  if (!authUser.data.user) {
    throw new Error("User not authenticated");
  }
  console.log("123");

  let newLogo = theme.logo;

  // upload logo to bucket
  if (theme.logo) {
    // check if logo exists in storage
    const { data: logoData, error: logoError } = await supabase.storage
      .from("logos")
      .list(`${authUser.data.user.id}/`);

    console.log(logoData);

    if (logoData?.find((l) => l.name === `${theme.id}`)) {
      console.log("logo exists");
      const { data, error } = await supabase.storage
        .from("logos")
        .update(`${authUser.data.user.id}/${theme.id}`, theme.files!);

      if (error) {
        console.error(error);
        return;
      } else {
        const url = supabase.storage.from("logos").getPublicUrl(data.path);
        newLogo = url.data.publicUrl;
        console.log(newLogo);
      }
    } else {
      console.log("doesnt existrs");
      const { data, error } = await supabase.storage
        .from("logos")
        .upload(`${authUser.data.user.id}/${theme.id}`, theme.files!);

      if (error) {
        console.error(error);
        return;
      } else {
        const url = supabase.storage.from("logos").getPublicUrl(data.path);
        newLogo = url.data.publicUrl;
        console.log(newLogo);
      }
    }
  }

  delete theme.files;

  const { data, error } = await supabase
    .from("themes")
    .update({ ...theme, logo: newLogo })
    .eq("id", theme.id);

  console.log(error?.message);
};
