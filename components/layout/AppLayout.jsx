import React from "react";
import Aside from "./Aside";

const AppLayout = ({ children, tokens, posts, postId, ...rest }) => {
  return (
    <div className="grid grid-cols-[300px_1fr] h-screen max-h-screen">
      <Aside tokens={tokens} posts={posts} postId={postId} />
      <div>{children}</div>
    </div>
  );
};

export default AppLayout;
