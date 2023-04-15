import { getSession } from "@auth0/nextjs-auth0";
import clientPromise from "../lib/mongodb";

export const getAsideProps = async (ctx) => {
  const { req, res, params } = ctx;
  const { user: currentUser } = await getSession(req, res);

  const client = await clientPromise;
  const db = client.db("blogGen");
  const user = await db.collection("users").findOne({
    auth0Id: currentUser.sub,
  });

  if (!user) {
    return {
      tokens: 0,
      posts: [],
      postId: params ? params.id : null,
    };
  }

  const posts = await db
    .collection("posts")
    .find({
      userId: user._id,
    })
    .sort({ createdAt: -1 })
    .toArray();

  return {
    tokens: user.availableTokens,
    posts: posts.map(({ createdAt, _id, userId, ...rest }) => {
      return {
        _id: _id.toString(),
        createdAt: createdAt.toString(),
        ...rest,
      };
    }),
    postId: params ? params.id : null,
  };
};
