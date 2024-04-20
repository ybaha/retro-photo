"use client";
import { notFound, redirect } from "next/navigation";

import "@/styles/mdx.css";
import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";

import { Button } from "@/components/ui/button";
import Dropzone from "@/components/ui/dropzone";
import LinkPageEditSidebar from "@/components/LinkPageEditSidebar";
import { useState } from "react";

interface PageProps {
  params: {
    slug: string[];
  };
}

export default async function LinkPage({ params }: PageProps) {
  const [files, setFiles] = useState<File[]>([]);
  const [color, setColor] = useState("#000000");

  const slug = params.slug.join("/");

  const cs = cookies();
  const supabase = createClient(cs);

  const { data: link } = await supabase
    .from("urls")
    .select("*")
    .eq("slug", slug)
    .single();

  if (!link) {
    notFound();
  }

  return (
    <article className="relative flex justify-between  h-screen py-4">
      <LinkPageEditSidebar
        color={color}
        setColor={setColor}
        files={files}
        setFiles={setFiles}
      />
      <div className="flex flex-col w-full items-center">
        <div className="flex flex-col space-y-4">
          <h1 className="inline-block font-heading text-4xl lg:text-5xl">
            {link.creator_id}
          </h1>
          {link.slug && (
            <p className="text-xl text-muted-foreground">{link.slug}</p>
          )}
        </div>
        <hr className="my-4" />
        <form>
          <Button
            type="submit"
            formAction={async () => {
              "use server";
              const cs = cookies();
              const supabase = createClient(cs);

              const { data: link } = await supabase
                .from("urls")
                .select("*")
                .eq("slug", slug)
                .single();

              if (!link?.url) {
                notFound();
              }
              console.log("\n\n\nlink.url\n\n\n", link.url, slug);

              await supabase
                .from("urls")
                .update({ click_count: (link.click_count || 0) + 1 })
                .eq("slug", slug);

              if (!link.url?.startsWith("http"))
                return redirect(`https://${link.url}`);

              redirect(link.url);
            }}
          >
            Go
          </Button>
        </form>
      </div>
    </article>
  );
}
