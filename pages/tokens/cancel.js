import { withPageAuthRequired } from "@auth0/nextjs-auth0";
import AppLayout from "../../components/layout/AppLayout";
import { getAsideProps } from "../../utils/getAsideProps";

const TopupCancelPage = () => {
  return (
    <div>
      <h1>Thank you for your purchase.</h1>
    </div>
  );
};

TopupCancelPage.getLayout = function getLayout(page, pageProps) {
  return <AppLayout {...pageProps}>{page}</AppLayout>;
};

export const getServerSideProps = withPageAuthRequired(async (context) => {
  const props = await getAsideProps(context);
  return {
    props,
  };
});

export default TopupCancelPage;
