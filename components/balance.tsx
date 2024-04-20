import { getCurrentUser } from "@/lib/session";

export const Balance = async () => {
  const user = await getCurrentUser(true);

  return <span>{user.profile?.balance}</span>;
};
