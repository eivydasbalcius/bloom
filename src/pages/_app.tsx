import type { AppProps } from 'next/app';
import { ApolloProvider, ApolloClient, InMemoryCache, gql } from '@apollo/client';
import apolloClient from '../lib/apollo-client'; // Adjust the import path based on where your apollo-client.ts is located relative to _app.tsx
import '../../styles/globals.css'; // Import global styles
import '../../styles/main.css';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { ProductDataProvider } from '@/context/ProductDataContext';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ApolloProvider client={apolloClient}>
      <ProductDataProvider>
        <Header />
        <div className="bg-white">
          <Component {...pageProps} />
        </div>
        <Footer />
      </ProductDataProvider>
    </ApolloProvider>
  );
}

export default MyApp;
