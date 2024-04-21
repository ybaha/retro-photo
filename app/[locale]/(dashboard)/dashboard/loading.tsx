import { DashboardHeader } from "@/components/header";
import { PostCreateButton } from "@/components/post-create-button";
import { PostItem } from "@/components/post-item";
import { DashboardShell } from "@/components/shell";
import { useTranslations } from "next-intl";

export default function DashboardLoading() {
  const t = useTranslations("dashboard");
  return (
    <DashboardShell>
      <DashboardHeader
        heading={t("dashboard-header")}
        text={t("dashboard-text", { count: 0 })}
      >
        {/* <PostCreateButton /> */}
      </DashboardHeader>
      <div className="divide-border-200 divide-y rounded-md border">
        <PostItem.Skeleton />
        <PostItem.Skeleton />
        <PostItem.Skeleton />
        <PostItem.Skeleton />
        <PostItem.Skeleton />
      </div>
    </DashboardShell>
  );
}
