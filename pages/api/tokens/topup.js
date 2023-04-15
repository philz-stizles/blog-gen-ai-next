import { getSession, withApiAuthRequired } from "@auth0/nextjs-auth0";
import clientPromise from "../../../lib/mongodb";
import Stripe from "stripe";

const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

export default withApiAuthRequired(async function handler(req, res) {
  try {
    // Get currently logged in user from Auth0 session.
    const { user: currentUser } = await getSession(req, res);

    // Stripe
    const lineItems = [
      {
        price: process.env.STRIPE_PRODUCT_PRICE_ID,
        quantity: 1,
      },
    ];

    const protocol =
      process.env.NODE_ENV === "development" ? "http://" : "https://";
    const host = req.headers.host;

    const checkoutSession = await stripe.checkout.sessions.create({
      line_items: lineItems,
      mode: "payment",
      success_url: `${protocol}${host}/tokens/success`, // Must be an absolute URL
      // cancel_url: `${protocol}${host}/tokens/cancel`, // Must be an absolute URL
      payment_intent_data: {
        metadata: {
          sub: currentUser.sub,
        },
      },
      metadata: {
        sub: currentUser.sub,
      },
    });

    res.status(200).json({
      status: true,
      data: checkoutSession,
      message: `Token topup checkout session was successful`,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: false,
      data: undefined,
      message:
        error && error.message
          ? error.message
          : "Token top up is currently unavailable. Try again in a few minutes",
    });
  }
});
