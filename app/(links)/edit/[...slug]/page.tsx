"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import LinkPageEditSidebar from "@/components/LinkPageEditSidebar";
import { useEffect, useState } from "react";
import { supabase } from "@/utils/supabase/client";
import { useLink } from "@/lib/hooks";
import { Tables } from "@/types/supabase-types";
import { updateTheme } from "./actions";
import { isLight } from "@/lib/is-light";

interface PageProps {
  params: {
    slug: string[];
  };
}

export default function LinkPage({ params }: PageProps) {
  const [files, setFiles] = useState<File[]>([]);
  const [color, setColor] = useState("#000000");
  const [themeData, setThemeData] = useState<Tables<"themes">>(
    {} as Tables<"themes">
  );

  const router = useRouter();
  const slug = params.slug.join("/");

  const { data: link, isLoading, isError } = useLink({ slug, theme: true });

  useEffect(() => {
    if (link?.theme && !isError && !isLoading) {
      setThemeData(link.theme);
    }
  }, [link]);

  if (isLoading)
    return (
      <article className="relative flex justify-between  h-screen py-4">
        <LinkPageEditSidebar
          theme={{} as Tables<"themes">}
          setTheme={() => {}}
          files={files}
          setFiles={() => {}}
        />
        <div className="flex flex-col w-full items-center">Loading...</div>
      </article>
    );

  if (!link && !isLoading)
    return <Button onClick={() => router.push("/404")}>Not Found</Button>;

  return (
    <article
      className="relative flex justify-between h-screen py-4"
      style={{
        backgroundColor: themeData?.color || "#000",
      }}
    >
      <LinkPageEditSidebar
        theme={themeData}
        setTheme={setThemeData}
        files={files}
        setFiles={setFiles}
      />
      <div
        className="flex flex-col w-full items-center"
        style={{
          color: isLight(themeData?.color || "#000") ? "#000" : "#fff",
        }}
      >
        <div className="flex flex-col space-y-4">
          <img
            src={themeData?.logo || ""}
            alt={themeData?.company_name || "logo"}
          />
          <h1 className="inline-block font-heading text-4xl lg:text-5xl">
            {themeData?.company_name}
          </h1>
          <p className="text-xl text-muted-foreground">
            {themeData?.description}
          </p>
        </div>
        <hr className="my-4" />
        <form>
          <Button
            type="submit"
            onClick={() => {
              router.push(link?.url || "/");
            }}
          >
            Go
          </Button>
        </form>
      </div>
      <Button
        className="absolute right-0"
        onClick={() => {
          console.log("asd");
          const formData = new FormData();
          formData.append("file", files[0]);

          updateTheme({ ...themeData, files: formData }).catch(console.error);
        }}
      >
        Save
      </Button>
    </article>
  );
}
