import { MainNav } from "@/components/main-nav";
import { DashboardNav } from "@/components/nav";
import { SiteFooter } from "@/components/site-footer";
import { UserAccountNav } from "@/components/user-account-nav";
import { dashboardConfig } from "@/config/dashboard";
import { getCurrentUser } from "@/lib/session";
import { getLocale, getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";

interface DashboardLayoutProps {
  children?: React.ReactNode;
}

export default async function DashboardLayout({
  children,
}: DashboardLayoutProps) {
  const user = await getCurrentUser(true);
  const t = await getTranslations("main");
  const locale = await getLocale();

  if (!user) {
    return notFound();
  }

  const items = dashboardConfig.sidebarNav.map((item) => ({
    ...item,
    href: locale + item.href,
    title: t(item.title.toLocaleLowerCase()),
  }));

  console.log({ items });

  return (
    <div className="flex min-h-screen flex-col space-y-6">
      <header className="sticky top-0 z-40 border-b bg-background">
        <div className="container flex h-16 items-center justify-between py-4">
          <MainNav items={items} />

          <div className="flex items-center gap-4">
            <div className="items-center text-sm">
              <span className="mr-2">{t("balance")}:</span>
              <span className="font-bold">{user.profile?.balance}</span>
            </div>

            <UserAccountNav
              user={{
                name: user.profile?.full_name,
                image: user.profile?.avatar_url,
                email: user.email,
                balance: user.profile?.balance,
              }}
            />
          </div>
        </div>
      </header>
      <div className="container grid flex-1 gap-12 md:grid-cols-[200px_1fr]">
        <aside className="hidden w-[200px] flex-col md:flex">
          <DashboardNav items={items} />
        </aside>
        <main className="flex w-full flex-1 flex-col overflow-hidden">
          {children}
        </main>
      </div>
      <SiteFooter className="border-t" />
    </div>
  );
}
