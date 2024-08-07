import { Icons } from "@/components/icons";
import { buttonVariants } from "@/components/ui/button";
import { UserAuthForm } from "@/components/user-auth-form";
import { cn } from "@/lib/utils";
import { Metadata } from "next";
import { useTranslations } from "next-intl";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Login",
  description: "Login to your account",
};

export default function LoginPage() {
  const t = useTranslations("auth");

  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <Link
        href="/"
        className={cn(
          buttonVariants({ variant: "ghost" }),
          "absolute left-4 top-4 md:left-8 md:top-8"
        )}
      >
        <>
          <Icons.chevronLeft className="mr-2 h-4 w-4" />
          {t("back")}
        </>
      </Link>
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col space-y-2 text-center">
          <Icons.logo className="mx-auto h-6 w-6" />
          <h1 className="text-2xl font-semibold tracking-tight">
            {t("login-title")}
          </h1>
          <p className="text-sm text-muted-foreground">
            {t("login-description")}
          </p>
        </div>

        <UserAuthForm
          signInWithEmail={t("sign-in-with-email")}
          orContinueWith={t("or-continue-with")}
          createAccount={t("create-account")}
          password={t("password")}
        />
        <p className="px-8 text-center text-sm text-muted-foreground flex flex-col gap-4 justify-between w-full">
          <Link
            href="/register"
            className="hover:text-brand underline underline-offset-4"
          >
            {t("register")}
          </Link>
          <Link
            href="/forgot-password"
            className="hover:text-brand underline underline-offset-4"
          >
            {t("forgot-password")}
          </Link>
        </p>
      </div>
    </div>
  );
}
