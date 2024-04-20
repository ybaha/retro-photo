import { Database } from "@/types/supabase-types";
import { createClient } from "@supabase/supabase-js";

const createServiceRoleClient = () => {
  return createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
};

export default createServiceRoleClient;
