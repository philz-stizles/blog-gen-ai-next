export const getAsideProps = async (ctx) => {
  const {req, res, params} = ctx;
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
    };
  }

  const posts = await db
    .collection("posts")
    .findOne({
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
    postId: params.id
  };
};
