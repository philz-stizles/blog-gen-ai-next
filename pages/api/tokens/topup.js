import { getSession, withApiAuthRequired } from "@auth0/nextjs-auth0";
import clientPromise from "../../../lib/mongodb";

export default withApiAuthRequired(async function handler(req, res) {
  try {
    // Get currently logged in user from Auth0 session.
    const { user: currentUser } = await getSession(req, res);

    const client = await clientPromise;
    const db = client.db("blogGen");

    const topup = 10;
    const user = await db.collection("users").updateOne(
      {
        auth0Id: currentUser.sub,
      },
      {
        $inc: {
          availableTokens: topup,
        },
        $setOnInsert: {
          auth0Id: currentUser.sub,
          email: currentUser.email,
          picture: currentUser.picture,
          is_verified: currentUser.email_verified,
          createdAt: new Date(),
        },
      },
      {
        upsert: true,
      }
    );

    return res
      .status(200)
      .json({ status: true, data: user, message: `Token topup(${topup} tokens) was successful` });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: false,
      data: undefined,
      message:
        error && error.message
          ? error.message
          : "Token top up is currently unavailable. Try again in a few minutes",
    });
  }
});
