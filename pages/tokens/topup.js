import { withPageAuthRequired } from "@auth0/nextjs-auth0";
import AppLayout from "../../components/layout/AppLayout";
import Button from "../../components/ui/Button";
import { useState } from "react";
import { getAsideProps } from "../../utils/getAsideProps";

const TopUpPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(undefined);

  const topupHandler = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/tokens/topup", {
        method: "POST",
      });
      const json = await response.json();
      console.log(json);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.log(error);
    }
  };

  return (
    <div>
      <h1>This is the token topup</h1>
      <Button className="btn-primary" onClick={topupHandler}>
        Add tokens
      </Button>
    </div>
  );
};

TopUpPage.getLayout = function getLayout(page, pageProps) {
  return <AppLayout {...pageProps}>{page}</AppLayout>;
};

export const getServerSideProps = withPageAuthRequired(async (context) => {
  const props = await getAsideProps(context);
  return {
    props,
  };
});

export default TopUpPage;
