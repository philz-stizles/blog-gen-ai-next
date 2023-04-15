import { getSession, withPageAuthRequired } from "@auth0/nextjs-auth0";
import React from "react";
import AppLayout from "../../components/layout/AppLayout";
import clientPromise from "../../lib/mongodb";
import { ObjectId } from "mongodb";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHashtag } from "@fortawesome/free-solid-svg-icons";

const PostPage = ({ post }) => {
  return (
    <div className="overflow-auto max-h-full">
      <div className="max-w-screen-sm mx-auto">
        <h3 className="text-sm font-bold mt-6 p-2 bg-slate-200">
          SEO title and meta description
        </h3>
        <div className="p-4 my-2 border border-stone-200 rounded-md">
          <div className="">{post.title}</div>
          <div className="">{post.metaDescription}</div>
        </div>
        <div></div>
        <h3 className="text-sm font-bold mt-6 p-2 bg-stone-200 rounded-sm">
          Keywords
        </h3>
        <div className="flex flex-wrap">
          {props.keywords.split(",").map((word, i) => (
            <span className="p-2 rounded-full bg-slate-800 text-white" key={i}>
              <FontAwesomeIcon icon={faHashtag} /> {word}
            </span>
          ))}
        </div>
        <h3 className="text-sm font-bold mt-6 p-2 bg-stone-200 rounded-sm">
          Blog post
        </h3>
        {post && post.postContent && (
          <div
            className="max-w-screen-sm p-10"
            dangerouslySetInnerHTML={{ __html: "" }}
          >
            {post.postContent}
          </div>
        )}
      </div>
    </div>
  );
};

PostPage.getLayout = function getLayout(page, pageProps) {
  return <AppLayout {...pageProps}>{page}</AppLayout>;
};

export const getServerSideProps = withPageAuthRequired(
  async (context) => {
    // { req, res, params, query}
    const props = await getAsideProps(context);
    const { user: currentUser } = await getSession(req, res);
    const postId = context.params.id;

    const client = await clientPromise;
    const db = client.db("blogGen");
    const user = await db.collection("users").findOne({
      auth0Id: currentUser.sub,
    });
    const post = await db.collection("posts").findOne({
      userId: user._id,
      _id: new ObjectId(postId),
    });

    if (!post) {
      return {
        redirect: {
          destination: "/posts/new",
          permanent: false,
        },
      };
    }

    return {
      props: {
        post,
        ...props,
      },
    };
  }
);

export default PostPage;
