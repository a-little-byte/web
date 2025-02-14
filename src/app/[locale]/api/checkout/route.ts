import { supabase } from "@/lib/supabase";
import { NextResponse } from "next/server";
import Stripe from "stripe";
import { getCurrentUser } from "../auth/actions";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-10-16",
});

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    // Get cart items
    const { data: cartItems, error: cartError } = await supabase
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
      .eq("user_id", user.id);

    if (cartError) throw cartError;
    if (!cartItems?.length) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
    }

    // Create line items for Stripe
    const lineItems = cartItems.map((item) => {
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
          unit_amount: Math.round(finalPrice * 100), // Convert to cents
          recurring: {
            interval: "month",
            interval_count: item.duration,
          },
        },
        quantity: item.quantity,
      };
    });

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      customer_email: user.email,
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: lineItems,
      metadata: {
        user_id: user.id,
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
