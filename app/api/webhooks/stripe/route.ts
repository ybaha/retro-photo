import { stripe } from "@/lib/stripe";
import createServiceRoleClient from "@/utils/supabase/service";
import { headers } from "next/headers";
import Stripe from "stripe";

export async function POST(req: Request) {
  const body = await req.text();
  const signature = headers().get("Stripe-Signature") as string;

  const supabase = createServiceRoleClient();

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET as string
    );
  } catch (error: any) {
    return new Response(`Webhook Error: ${error.message}`, { status: 400 });
  }

  const session = event.data.object as Stripe.Checkout.Session;

  console.log({ session });

  if (event.type === "checkout.session.completed") {
    console.log("Checkout session completed");

    await supabase.from("logs").insert({
      message: `Checkout completed for user id: ${session.metadata?.userId}`,
      type: "stripe",
    });

    const id = session.metadata?.userId;

    if (!id) {
      return new Response("User id not found", { status: 400 });
    }

    await supabase
      .from("profiles_stripe_info")
      .insert({
        stripe_price_id: session.metadata?.type,
        product: session.metadata?.type,
        profile_id: id,
        payment_intent_id: session.payment_intent as string,
      })
      .throwOnError();

    const { data: profile } = await supabase
      .from("profiles")
      .select("balance")
      .eq("id", id)
      .single();

    const balance = profile?.balance || 0;

    await supabase
      .from("profiles")
      .update({
        is_paid_user: true,
        balance: balance + parseInt(session.metadata?.type as string),
      })
      .eq("id", id)
      .throwOnError();

    // Retrieve the subscription details from Stripe.
    // const subscription = await stripe.subscriptions.retrieve(
    //   session.subscription as string
    // );

    // // Update the user stripe into in our database.
    // // Since this is the initial subscription, we need to update
    // // the subscription id and customer id.
    // await db.user.update({
    //   where: {
    //     id: session?.metadata?.userId,
    //   },
    //   data: {
    //     stripeSubscriptionId: subscription.id,
    //     stripeCustomerId: subscription.customer as string,
    //     stripePriceId: subscription.items.data[0].price.id,
    //     stripeCurrentPeriodEnd: new Date(
    //       subscription.current_period_end * 1000
    //     ),
    //   },
    // });
  }

  return new Response(null, { status: 200 });
}
