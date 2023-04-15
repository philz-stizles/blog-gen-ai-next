import { UserProvider } from "@auth0/nextjs-auth0/client";
import "../styles/globals.css";

function MyApp({ Component, pageProps }) {
  // Use the layout defined at the page level, if available
  const getLayout = Component.getLayout || ((page) => page);

  return <UserProvider>{getLayout(<Component {...pageProps} />, pageProps)}</UserProvider>;
}

export default MyApp;
