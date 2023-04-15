import { withPageAuthRequired } from "@auth0/nextjs-auth0";
import AppLayout from "../../components/layout/AppLayout";
import { getAsideProps } from "../../utils/getAsideProps";

const TopupSuccessPage = () => {
  return (
    <div>
      <h1>Thank you for your purchase.</h1>
    </div>
  );
};

TopupSuccessPage.getLayout = function getLayout(page, pageProps) {
  return <AppLayout {...pageProps}>{page}</AppLayout>;
};

export const getServerSideProps = withPageAuthRequired({
  getServerSideProps: async (context) => {
    const props = await getAsideProps(context);

    console.log(props);
    return {
      props,
    };
  },
});

export default TopupSuccessPage;
