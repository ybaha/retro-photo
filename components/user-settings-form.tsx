"use client";

import { updateUser } from "@/app/(dashboard)/dashboard/create-link/actions";
import { Icons } from "@/components/icons";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";
import { userNameSchema } from "@/lib/validations/user";
import { Tables } from "@/types/supabase";
import { supabase } from "@/utils/supabase/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { revalidatePath } from "next/cache";
import { useRouter } from "next/navigation";
import * as React from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

type User = Tables<"profiles"> & {
  email: string;
};

interface UserSettingsForm extends React.HTMLAttributes<HTMLFormElement> {
  user: Pick<User, "id" | "full_name" | "email">;
}

type FormData = z.infer<typeof userNameSchema>;

export function UserSettingsForm({
  user,
  className,
  ...props
}: UserSettingsForm) {
  const router = useRouter();

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(userNameSchema),
    defaultValues: {
      full_name: user?.full_name || "",
    },
  });

  const [isSaving, setIsSaving] = React.useState<boolean>(false);

  const onSubmit = async (data: FormData) => {
    setIsSaving(true);

    await updateUser({
      id: user.id,
      full_name: data.full_name,
    });

    setIsSaving(false);

    router.refresh();

    toast({
      title: "Profile updated",
      description: "Your profile has been updated.",
    });
  };

  return (
    <form
      className={cn(className, "flex flex-col gap-8")}
      onSubmit={handleSubmit(onSubmit)}
      {...props}
    >
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
          <CardDescription>
            Update your name and other personal information.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-1">
            <Label className="mb-1" htmlFor="name">
              Name
            </Label>
            <Input
              id="full_name"
              size={32}
              {...register("full_name", { required: "Name is required" })}
            />
            {errors?.full_name && (
              <p className="px-1 text-xs text-red-600">
                {errors.full_name.message}
              </p>
            )}
          </div>
          <div className="grid gap-1 mt-6">
            <Label className="mb-1" htmlFor="name">
              Email
            </Label>
            <Input id="full_name" size={32} value={user.email} disabled />
          </div>
        </CardContent>
        <CardFooter>
          <button
            type="submit"
            className={cn(buttonVariants(), className)}
            disabled={isSaving}
          >
            {isSaving && (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            )}
            <span>Save</span>
          </button>
        </CardFooter>
      </Card>

      {/* delete user */}
      <Card>
        <CardHeader>
          <CardTitle>Delete Account</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Deleting your account is irreversible. All your data will be
            permanently deleted.
          </p>
        </CardContent>
        <CardFooter>
          <Button
            type="button"
            variant="destructive"
            onClick={() => {
              if (
                confirm(
                  "Are you sure you want to delete your account? This action is irreversible."
                )
              ) {
                // delete user
              }
            }}
          >
            Delete Account
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
}
