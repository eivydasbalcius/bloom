import { ApolloClient, InMemoryCache, HttpLink, NormalizedCacheObject } from '@apollo/client';

const httpLink = new HttpLink({
  uri: 'http://localhost:10048/graphql', // Replace this with your actual GraphQL endpoint
});

// Initialize Apollo Client with a cache and a link that points to your GraphQL server.
const apolloClient = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache(),
});

export default apolloClient;