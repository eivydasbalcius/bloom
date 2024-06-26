import type { AppProps } from 'next/app';
import { ApolloProvider, ApolloClient, InMemoryCache, gql } from '@apollo/client';
import apolloClient from '../lib/apollo-client'; // Adjust the import path based on where your apollo-client.ts is located relative to _app.tsx
import '../../styles/globals.css'; // Import global styles
import '../../styles/main.css';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { ProductDataProvider } from '@/context/ProductDataContext';
import { SessionProvider } from 'next-auth/react';
import { ReactElement, ReactNode } from 'react';
import { NextPage } from 'next';
import { SpeedInsights } from '@vercel/speed-insights/next';
import Head from 'next/head';

type NextPageWithLayout = NextPage & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

function MyApp({ Component, pageProps }: AppPropsWithLayout) {
  const getLayout = Component.getLayout ?? ((page) => (
    <>
    <Head>
      <title>Bloom</title>
      <meta name="viewport" content="initial-scale=1.0, width=device-width" />
    </Head>
      <Header />
      <div className="bg-white">
        {page}
        <SpeedInsights />
      </div>
      <Footer />
    </>
  ));

  return (
    <ApolloProvider client={apolloClient}>
      <ProductDataProvider>
        <SessionProvider session={pageProps.session}>
          {getLayout(<Component {...pageProps} />)}
        </SessionProvider>
      </ProductDataProvider>
    </ApolloProvider>
  );
}

export default MyApp;
