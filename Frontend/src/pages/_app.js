import "@/styles/globals.css";
import NavBar from "../../components/NavBar";
import { MoralisProvider } from "react-moralis";
import Head from "next/head";
import { NotificationProvider } from "web3uikit";
import Footer from "../../components/Footer";

export default function App({ Component, pageProps }) {
  return (
    <div>
      <Head>
        <title>DecentraVote</title>
      </Head>
      <MoralisProvider initializeOnMount={false}>
        <NotificationProvider>
          <NavBar />
          <Component {...pageProps} />
          <Footer />
        </NotificationProvider>
      </MoralisProvider>
    </div>
  );
}
