import { Tables } from "@/types/supabase-types";
import { supabase } from "@/utils/supabase/client";
import { useQuery } from "@tanstack/react-query";

type UseLinkParams = {
  slug: string;
  theme?: boolean;
};

export const useLink = (params: UseLinkParams) => {
  const { slug, theme } = params;

  return useQuery({
    queryKey: ["links"],
    queryFn: async () => {
      const res = await supabase
        .from("urls")
        .select(`${theme ? "*,themes(*)" : "*"}`)
        .eq("slug", slug)
        .single()
        .throwOnError();

      const data = res.data as unknown as Tables<"urls"> & {
        themes: Tables<"themes">[];
      };

      return {
        ...data,
        theme: data.themes?.[0],
      } as Tables<"urls"> & { theme: Tables<"themes"> };
    },
  });
};
