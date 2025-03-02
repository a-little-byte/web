import { ContextVariables } from "@/api/types";
import { Hono } from "hono";
import Stripe from "stripe";

export const checkoutRouter = new Hono<{ Variables: ContextVariables }>().post(
  "/",
  async ({ var: { stripe, db }, json }) => {
    try {
      const { data } = await db
        .selectFrom("users")
        .selectAll()
        .executeTakeFirstOrThrow();
      if (!data) {
        return json({ error: "Not authenticated" }, 401);
      }

      const cartItems = await db
        .selectFrom("cart_items")
        .selectAll()
        .where("user_id", "=", data.user.id)
        .execute();

      if (!cartItems?.length) {
        return json({ error: "Cart is empty" }, 400);
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

      return json({ url: session.url });
    } catch (error) {
      console.error("Error creating checkout session:", error);
      return json({ error: "Error creating checkout session" }, 500);
    }
  }
);
