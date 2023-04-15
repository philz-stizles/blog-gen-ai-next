import { withPageAuthRequired } from "@auth0/nextjs-auth0";
import React, { useState } from "react";
import AppLayout from "../../components/layout/AppLayout";
import Button from "../../components/ui/Button";
import { useRouter } from "next/router";
import Input from "../../components/ui/Input";

const NewPostPage = () => {
  const [topic, setTopic] = useState("Top 10 tips for dog owners");
  const [keywords, setKeywords] = useState(
    "first-time dog owners, common dog health issues, best dog breeds"
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(undefined);
  const router = useRouter();

  const submitHandler = async (e) => {
    e.preventDefault();
    if (!topic.trim() || !keywords.trim()) {
      return;
    }
    try {
      setIsLoading(true);
      console.log(topic, keywords);
      const response = await fetch("/api/posts/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic, keywords }),
      });
      const json = await response.json();
      console.log(json);
      if (!json?.status) {
        throw new Error(json.message);
      }

      if (json?.status && json.data) {
        router.push(`/posts/${json.data}`);
      }
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.log(error);
      alert(error);
      // setIsLoading(error);
    }
  };

  return (
    <div>
      <form
        onSubmit={submitHandler}
        className="p-4 shadow-md shadow-slate-500 bg-slate-100 rounded-md border border-slate-400"
      >
        <Input
          label="Generate a blog post on the topic of"
          value={topic}
          onChange={(e) => {
            setTopic(e.target.value);
          }}
        />
        <Input
          label="Target the following keywords"
          value={keywords}
          onChange={(e) => {
            setKeywords(e.target.value);
          }}
        />

        <Button className="btn-primary" type="submit">
          {isLoading ? "Loading..." : "Generate"}
        </Button>
      </form>
    </div>
  );
};

NewPostPage.getLayout = function getLayout(page, pageProps) {
  return <AppLayout {...pageProps}>{page}</AppLayout>;
};

export const getServerSideProps = withPageAuthRequired(async (context) => {
  const props = await getAsideProps(context);
  return {
    props,
  };
});

export default NewPostPage;
