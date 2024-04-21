import { freePlan, proPlan } from "@/config/subscriptions";
import { supabase } from "@/utils/supabase/client";
import { UserSubscriptionPlan } from "types";

export async function getUserSubscriptionPlan(userId: string) {
  // ): Promise<UserSubscriptionPlan> {
  // const { data } = await supabase
  //   .from("profiles_stripe_info")
  //   .select()
  //   .eq("id", userId)
  //   .single();
  // if (!data || !data.stripe_price_id) {
  //   return {
  //     stripeCurrentPeriodEnd: 0,
  //     isPro: false,
  //     stripeCustomerId: "",
  //     stripeSubscriptionId: "",
  //     ...freePlan,
  //   };
  // }
  // const {
  //   stripe_subscription_id,
  //   stripe_current_period_end,
  //   stripe_customer_id,
  //   stripe_price_id,
  // } = data;
  // // Check if user is on a pro plan.
  // const isPro =
  //   !!stripe_price_id &&
  //   new Date(stripe_current_period_end || 0)?.getTime() + 86_400_000 >
  //     Date.now();
  // const plan = isPro ? proPlan : freePlan;
  // return {
  //   ...plan,
  //   stripeCurrentPeriodEnd: new Date(stripe_current_period_end || 0)?.getTime(),
  //   stripeCustomerId: stripe_customer_id,
  //   stripeSubscriptionId: stripe_subscription_id,
  //   stripePriceId: stripe_price_id,
  //   isPro,
  // };
}
