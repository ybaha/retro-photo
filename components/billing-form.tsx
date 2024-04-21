import Pricing from "./prices";
import { toast } from "@/components/ui/use-toast";
import { prices } from "@/config/pricing";
import { cn } from "@/lib/utils";
import * as React from "react";

export function BillingForm({
  className,
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  return (
    <form className={cn(className)} {...props}>
      <Pricing withoutHeader prices={prices} />
    </form>
  );
}
