import Cors from "micro-cors";
import { buffer } from "micro";
import Stripe from "stripe";
import clientPromise from "../../../lib/mongodb";

const cors = Cors({
  allowMethods: ["POST", "HEAD"],
});

export const config = {
  api: {
    bodyParser: false,
  },
};

const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

const handler = async (req, res) => {
  if (req.method === "POST") {
    const buf = await buffer(req);
    const sig = req.headers["stripe-signature"];
    let event;
    try {
      event = stripe.webhooks.constructEvent(buf, sig, webhookSecret);
      console.log("EVENT: ", event.data.object);
    } catch (error) {
      res.status(400).send(`Webhook Error: ${err.message}`);
      return;
    }

    switch (event.type) {
      case "payment_intent.succeeded":
        const client = await clientPromise;
        const db = client.db("blogGen");
        const metadata = event.data.object.metadata; // event.data.object contains the payment_intent_data
        const currentUserSub =  metadata.sub;
        const topup = 10;
        await db.collection("users").updateOne(
          {
            auth0Id: currentUserSub,
          },
          {
            $inc: {
              availableTokens: topup,
            },
            $setOnInsert: {
              auth0Id: currentUserSub,
              //   email: currentUser.email,
              //   picture: currentUser.picture,
              //   is_verified: currentUser.email_verified,
              createdAt: new Date(),
            },
          },
          {
            upsert: true,
          }
        );

        break;
      default:
        console.log("UNHANDLED EVENT: ", event.type);
    }

    res.status(200).json({ status: true, message: "Payment successful" });
  } else {
    res.setHeader("Allow", "POST");
    res.status(405).end("Method Not Allowed");
  }
};

export default cors(handler);
