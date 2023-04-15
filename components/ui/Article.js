import React from "react";

const Article = ({ title, content }) => {
  return (
    <>
      <h3 className="text-sm font-bold mt-6 p-2 bg-stone-200 rounded-sm">
        {title}
      </h3>
      <div
        className="max-w-screen-sm p-10"
        dangerouslySetInnerHTML={{ __html: content || "" }}
      />
    </>
  );
};

export default Article;
