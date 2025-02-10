import type { NextPage } from "next";
import Head from "next/head";
import Gallery from "../pages/Gallery";
import Header from "../components/Header/Header";

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>Samy Frontend Test</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Header />
      <Gallery />
    </>
  );
};

export default Home;
