"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { createClient } from "@/utils/supabase/client";
import { cookies } from "next/headers";
import { useState } from "react";

type Props = {
  params: {
    slug: string[];
  };
  searchParams: {
    [key: string]: string;
  };
};

export default function LinkPage({ params }: Props) {
  const [urlValue, setUrlValue] = useState("");
  const [slugValue, setSlugValue] = useState("");
  const supabaseClient = createClient();
  const { toast } = useToast();

  const createLink = async () => {
    const { data, error } = await supabaseClient.from("urls").insert({
      slug: slugValue,
      url: urlValue,
    });

    if (error) {
      console.log(error);
      const message =
        error.message.includes("duplicate key value violates") &&
        "Slug already exists";
      toast({
        title: "Error",
        description: message,
      });
    } else {
      console.log(data);
      toast({
        title: "Success",
        description: "Link created",
        variant: "default",
      });
    }
  };

  return (
    <div>
      <h1>Link Page</h1>
      <h2>{params.slug}</h2>
      <div className="flex gap-4">
        <Input
          placeholder="URL (ex: https://google.com)"
          value={urlValue}
          onChange={(e) => {
            setUrlValue(e.target.value);
          }}
        ></Input>
        <Input
          placeholder="Slug (ex: google)"
          value={slugValue}
          onChange={(e) => {
            setSlugValue(e.target.value);
          }}
        ></Input>

        <Button onClick={createLink}>Create Link</Button>
      </div>
    </div>
  );
}
