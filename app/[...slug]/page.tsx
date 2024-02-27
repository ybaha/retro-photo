import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import FormButton from "./form-button";

type Props = {
  params: {
    slug: string;
  };
  searchParams: {
    [key: string]: string;
  };
};

const querySupabase = async (slug: string) => {
  const cookieStore = cookies();
  const supabaseClient = createClient(cookieStore);
  try {
    const { data: urlData } = await supabaseClient
      .from("urls")
      .select()
      .eq("slug", slug)
      .throwOnError()
      .single();

    if (!urlData || typeof urlData.click_count !== "number")
      throw new Error("URL not found");

    await supabaseClient
      .from("urls")
      .update({ click_count: urlData.click_count + 1 })
      .eq("slug", slug)
      .throwOnError();

    return urlData;
  } catch (e) {
    return undefined;
  }
};

export default function LinkPage({ params }: Props) {
  const goToLink = async () => {
    "use server";

    const result = await querySupabase(params.slug);

    if (!result) return redirect(`/${params.slug}?error`);

    if (!result.url?.startsWith("http"))
      return redirect(`https://${result.url}`);

    return redirect(result.url);
  };

  return (
    <div className="container bg-red-200 max-w-[800px] flex items-center flex-col">
      <h1>This link is safe</h1>
      <h2>{params.slug}</h2>
      <form>
        <FormButton formAction={goToLink}>Get Link</FormButton>
      </form>
    </div>
  );
}
