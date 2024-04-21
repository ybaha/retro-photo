import createServiceRoleClient from "@/utils/supabase/service";
import axios from "axios";
import fs from "fs";
import { NextApiRequest, NextApiResponse } from "next";
// import Ffmpeg from "fluent-ffmpeg";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import sharp from "sharp";

export const maxDuration = 10;

export async function POST(req: any, res: NextApiResponse) {
  console.log("post");

  const body = await req.json();

  const supabase = createServiceRoleClient();

  if (body.status === "failed") {
    await supabase
      .from("images")
      .update({
        status: "error",
      })
      .eq("prediction_id", body.id);

    return NextResponse.json("Done", {
      status: 200,
    });
  }

  await supabase.from("logs").insert({
    message: JSON.stringify(body),
    type: "replicate",
  });

  const { data: imageWithProfile } = await supabase
    .from("images")
    .select("*, profiles(*)")
    .eq("prediction_id", body.id)
    .single();

  if (!imageWithProfile) {
    return NextResponse.json("No image found", {
      status: 404,
    });
  }

  const profile = imageWithProfile.profiles;

  const isPaidUser = profile?.is_paid_user;

  if (!profile) {
    return NextResponse.json("No profile found", {
      status: 404,
    });
  }

  if (isPaidUser) {
    await supabase
      .from("images")
      .update({
        status: "completed",
        processed_url: body.output[0],
        with_watermark: false,
      })
      .eq("prediction_id", body.id);

    return NextResponse.json("Done", {
      status: 200,
    });
  }

  await supabase
    .from("images")
    .update({
      status: "adding_watermark",
      with_watermark: true,
    })
    .eq("prediction_id", body.id);

  // add watermark
  const input = (
    await axios({
      url: body.output[0],
      responseType: "arraybuffer",
    })
  ).data as Buffer;

  const composite = fs.readFileSync("public/RetroPhotoco.png");

  const image = sharp(input);

  const metadata = await image.metadata();
  const mainImageWidth = metadata.width || 0;
  const mainImageHeight = metadata.height || 0;

  // calculate watermark size
  const watermarkHeight = Math.floor(mainImageHeight / 20);

  console.log({ watermarkHeight });

  const watermark = await sharp(composite)
    .resize({
      height: watermarkHeight,
    })
    .toBuffer();

  const output = await sharp(input)
    .composite([
      {
        input: watermark,
        top: 50,
        left: 50,
      },
    ])
    .png()
    .toBuffer();

  // output is Buffer
  // conver

  const { data } = await supabase.storage
    .from("images-processed")
    .upload(`${profile.id}/${body.id}`, output);

  if (!data?.path) {
    return NextResponse.json("Error uploading", {
      status: 500,
    });
  }

  const {
    data: { publicUrl },
  } = supabase.storage.from("images-processed").getPublicUrl(data.path);

  await supabase
    .from("images")
    .update({
      status: "completed",
      processed_url: publicUrl,
    })
    .eq("prediction_id", body.id);

  return NextResponse.json(body, {
    status: 200,
  });
}
