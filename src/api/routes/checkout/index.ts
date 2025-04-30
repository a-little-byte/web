import { PrivateContextVariables } from "@/api/types";
import { Hono } from "hono";
import { jsonObjectFrom } from "kysely/helpers/postgres";
import { Stripe } from "stripe";

export const checkoutRouter = new Hono<{
  Variables: PrivateContextVariables;
}>().post("/", async ({ var: { stripe, db, session: s }, json }) => {
  try {
    const cartItems = await db
      .selectFrom("cart_items")
      .leftJoin("services", "cart_items.service_id", "services.id")
      .selectAll()
      .where("user_id", "=", s.user.id)
      .execute();

    // if (!cartItems?.length) {
    //   return json({ error: "Cart is empty" }, 400);
    // }

    // const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = cartItems.map((item) => {
    //   let discount = 0;
    //
    //   // Uncomment if you want to enable discounts based on duration
    //   // if (item.quantity >= 12) {
    //   //   discount = 0.2;
    //   // } else if (item.quantity >= 3) {
    //   //   discount = 0.1;
    //   // }
    //
    //   const servicePrice = item.price || 0;
    //   const totalBeforeDiscount = servicePrice * item.quantity;
    //   const finalPrice = totalBeforeDiscount * (1 - discount);
    //
    //   const serviceName = item.name || "Service";
    //
    //   return {
    //     price_data: {
    //       currency: "usd",
    //       product_data: {
    //         name: serviceName,
    //         description: `${item.quantity} month${
    //           item.quantity > 1 ? "s" : ""
    //         } subscription${
    //           discount > 0 ? ` (${discount * 100}% discount applied)` : ""
    //         }`,
    //       },
    //       unit_amount: Math.round(finalPrice * 100),
    //       recurring: {
    //         interval: "month",
    //         interval_count: 1, // Use fixed interval of 1 month with quantity instead
    //       },
    //     },
    //     quantity: item.quantity,
    //   };
    // });
    //
    const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] =
      cartItems.map((item) => {
        return {
          price: item.stripe_id!,
          quantity: item.quantity,
        };
      });

    const customer = await stripe.customers.create({
      email: s.user.email,
    });

    const session = await stripe.checkout.sessions.create({
      customer: customer.id,
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: lineItems,
      metadata: {
        user_id: s.user.id,
      },
      success_url: `${process.env.NEXT_PUBLIC_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_URL}/cart`,
    });

    return json({ url: session.url });
  } catch (error) {
    console.error("Error creating checkout session:", error);
    return json({ error: "Error creating checkout session" }, 500);
  }
});
