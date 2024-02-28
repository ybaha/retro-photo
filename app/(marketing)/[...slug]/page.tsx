import { notFound, redirect } from "next/navigation";

import { Mdx } from "@/components/mdx-components";

import "@/styles/mdx.css";
import { Metadata } from "next";
import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";

import { env } from "@/env.mjs";
import { siteConfig } from "@/config/site";
import { absoluteUrl } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface PageProps {
  params: {
    slug: string[];
  };
}

export default async function PagePage({ params }: PageProps) {
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
    <article className="container max-w-3xl py-6 lg:py-12">
      <div className="space-y-4">
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
    </article>
  );
}
