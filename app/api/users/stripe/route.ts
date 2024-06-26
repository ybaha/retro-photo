import { prices } from "@/config/pricing";
import { proPlan } from "@/config/subscriptions";
import { getCurrentUser } from "@/lib/session";
import { stripe } from "@/lib/stripe";
import { getUserSubscriptionPlan } from "@/lib/subscription";
import { absoluteUrl } from "@/lib/utils";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { z } from "zod";

const billingUrl = absoluteUrl("/dashboard/billing");

export async function GET(req: Request) {
  const user = await getCurrentUser();

  if (!user?.id) {
    return new Response("Unauthorized", { status: 401 });
  }

  const requestUrl = new URL(req.url);

  const type = requestUrl.searchParams.get("type");

  const types = prices.map((price) => price.type.toString());

  console.log({ type, types });

  const tokens3 = type === types[0] && process.env.STRIPE_PRICE_ID_3!;
  const tokens10 = type === types[1] && process.env.STRIPE_PRICE_ID_15!;
  const tokens100 = type === types[2] && process.env.STRIPE_PRICE_ID_50!;

  const price = tokens3 || tokens10 || tokens100;
  console.log({ price });
  if (!price) {
    return new Response("Incorrect payment type", { status: 400 });
  }

  // one time payment for pro image generation tokens
  const stripeSession = await stripe.checkout.sessions.create({
    success_url: absoluteUrl("/dashboard/billing"),
    cancel_url: billingUrl,
    payment_method_types: ["card"],
    mode: "payment",
    line_items: [
      {
        price,
        quantity: 1,
      },
    ],
    metadata: {
      userId: user.id,
      type: `${type} tokens`,
    },
  });

  return new Response(JSON.stringify({ url: stripeSession.url }));
}
