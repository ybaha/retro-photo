"use server";

import { getCurrentUser } from "@/lib/session";
import { Tables } from "@/types/supabase-types";
import { createClient } from "@/utils/supabase/server";
import createServiceRoleClient from "@/utils/supabase/service";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import Replicate from "replicate";
import { v4 as uuid } from "uuid";

const processImage = async (params: {
  file: File;
  user: Tables<"profiles">;
}) => {
  const { file, user } = params;
  const fileName = uuid();

  const supabase = createServiceRoleClient();

  const replicate = new Replicate({
    auth: process.env.REPLICATE_API_KEY,
  });

  if (file.size > 10485760) {
    throw new Error("File size is too big");
  }

  if (!user) {
    throw new Error("User not found");
  }

  // upload image
  const { data, error: imageUploadError } = await supabase.storage
    .from("images-unprocessed")
    .upload(`${user.id}/${fileName}`, file);

  console.log(data?.path);

  if (!data?.path || imageUploadError) {
    console.log(imageUploadError);
    throw new Error("Failed to upload image");
  }

  const {
    data: { publicUrl },
  } = supabase.storage.from("images-unprocessed").getPublicUrl(data.path);

  if (!user?.id) {
    return;
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  console.log("as123dasd");

  if (!profile || profile?.balance < 1) {
    throw new Error("Insufficient balance");
  }

  const { error } = await supabase
    .from("profiles")
    .update({
      balance: profile.balance - 1,
    })
    .eq("id", user.id);

  if (error) {
    throw new Error("Insufficient balance2");
  }

  const callbackURL = process.env.NEXT_PUBLIC_REPLICATE_WEBHOOK_URL;

  // describe image first

  const outputRaw = (await replicate.run(
    "salesforce/blip:2e1dddc8621f72155f24cf2e0adbde548458d3cab9f00c0139eea840d0ac4746",
    { input: { image: publicUrl } }
  )) as unknown as string;

  // Caption: a man wearing glasses and a black shirt
  const imageDesciption = outputRaw.slice(outputRaw.indexOf("Caption: ") + 9);

  console.log(`\n\n${imageDesciption}\n\n`);

  const prediction = await replicate.predictions.create({
    version: "a07f252abbbd832009640b27f063ea52d87d7a23a185ca165bec23b5adc8deaf",
    input: {
      image: publicUrl,
      style: "Video game",
      prompt: `${imageDesciption}, retro game style`,
      instant_id_strength: 0.5,
      denoising_strength: 0.65,
    },
    webhook: callbackURL,
    webhook_events_filter: ["completed"],
  });

  await supabase
    .from("images")
    .insert({
      status: "pending_from_replicate",
      profile_id: user.id,
      unprocessed_url: publicUrl,
      prediction_id: prediction.id,
      description: imageDesciption,
    })
    .throwOnError();

  return;
};

export const sendReplicateServerRequest = async (formData: FormData[]) => {
  "use server";

  const files = formData.map((fd) => fd.get("file") as File);

  const user = await getCurrentUser(true);

  if (!user || !user.profile) {
    throw new Error("User not found");
  }

  await Promise.all(
    files.map((file) =>
      processImage({
        file,
        user: user.profile as Tables<"profiles">,
      })
    )
  );

  revalidatePath("/dashboard");

  return;
};

export const deleteImage = async (id: string) => {
  "use server";
  const supabase = createServiceRoleClient();

  const { data: image } = await supabase
    .from("images")
    .select("*")
    .eq("id", id)
    .single();

  if (!image) {
    throw new Error("Image not found");
  }

  await supabase.from("images").update({ status: "deleted" }).eq("id", id);

  revalidatePath("/dashboard");
};

export const markImagesAsExpired = async (id: string) => {
  "use server";
  const supabase = createServiceRoleClient();

  await supabase.from("images").update({ status: "error" }).eq("id", id);

  revalidatePath("/dashboard");
};

export const updateUser = (data: { id: string; full_name: string }) => {
  "use server";
  const supabase = createClient(cookies());

  return supabase.from("profiles").update(data).eq("id", data.id);
};

export const deleteUser = (id: string) => {
  "use server";
  const supabase = createClient(cookies());

  return supabase.from("profiles").delete().eq("id", id);
};
