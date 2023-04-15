import Cors from "micro-cors";
import Stripe from "stripe";
import verifyStripe from "@webdeveducation/next-verify-stripe";
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
    let event;
    try {
      event = await verifyStripe({
        req,
        stripe,
        webhookSecret,
      });
      console.log('EVENT: ', event);
    } catch (error) {
   //  console.log("ERROR: ", error);
    }

    switch (event.type) {
      case "payment_intent.succeeded":
        const client = await clientPromise;
        const db = client.db("blogGen");
        const paymentIntentData = event.data.object; // event.data.object contains the payment_intent_data
        const currentUserSub = paymentIntentData.metadata.sub;
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
  }
};

export default cors(handler);
