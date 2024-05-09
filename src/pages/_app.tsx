import type { AppProps } from 'next/app';
import { ApolloProvider, ApolloClient, InMemoryCache, gql } from '@apollo/client';
import apolloClient from '../lib/apollo-client'; // Adjust the import path based on where your apollo-client.ts is located relative to _app.tsx
import '../../styles/globals.css'; // Import global styles
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { CategoryProvider } from '@/context/CategoryContext';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ApolloProvider client={apolloClient}>
      <CategoryProvider>
        <Header />
        <div className="bg-white">
          <Component {...pageProps} />
        </div>
        <Footer />
      </CategoryProvider>
    </ApolloProvider>
  );
}

export default MyApp;
