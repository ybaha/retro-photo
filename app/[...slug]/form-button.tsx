"use client";

import { Button } from "@/components/ui/button";
// @ts-ignore
import { useFormStatus } from "react-dom";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export default function FormButton(props: React.ComponentProps<typeof Button>) {
  const { children, className, ...rest } = props;
  const { pending } = useFormStatus();

  return (
    <Button
      {...rest}
      disabled={pending}
      className={cn(className)}
      loading={pending}
    >
      {children}
    </Button>
  );
}
