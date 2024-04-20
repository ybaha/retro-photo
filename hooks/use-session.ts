"use client";

import { supabase } from "@/utils/supabase/client";
import { useQuery } from "@tanstack/react-query";

export const useSession = () => {
  return useQuery({
    queryKey: ["session"],
    queryFn: async () => {
      const { data } = await supabase.auth.getSession();
      return data;
    },
  });
};
