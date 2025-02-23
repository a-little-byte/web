import { createServerClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-10-16",
});

export async function POST(request: Request) {
  try {
    const supabase = createServerClient();
    const { data } = await supabase.auth.getUser();
    if (!data.user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const { data: cartItems } = await supabase
      .from("cart_items")
      .select(
        `
        *,
        services (
          name,
          description,
          price,
          period
        )
      `
      )
      .eq("user_id", data.user.id)
      .throwOnError();

    if (!cartItems?.length) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
    }

    const lineItems =
      cartItems.map<Stripe.Checkout.SessionCreateParams.LineItem>((item) => {
        const service = item.services;
        let finalPrice = service.price;
        let discount = 0;

        if (item.duration >= 12) {
          discount = 0.2;
        } else if (item.duration >= 3) {
          discount = 0.1;
        }

        const totalBeforeDiscount = service.price * item.duration;
        finalPrice = totalBeforeDiscount * (1 - discount);

        return {
          price_data: {
            currency: "usd",
            product_data: {
              name: service.name,
              description: `${item.duration} month${
                item.duration > 1 ? "s" : ""
              } subscription${
                discount > 0 ? ` (${discount * 100}% discount applied)` : ""
              }`,
            },
            unit_amount: Math.round(finalPrice * 100),
            recurring: {
              interval: "month",
              interval_count: item.duration,
            },
          },
          quantity: item.quantity,
        };
      });

    const session = await stripe.checkout.sessions.create({
      customer_email: data.user.email,
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: lineItems,
      metadata: {
        user_id: data.user.id,
      },
      success_url: `${process.env.NEXT_PUBLIC_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_URL}/cart`,
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Error creating checkout session:", error);
    return NextResponse.json(
      { error: "Error creating checkout session" },
      { status: 500 }
    );
  }
}
