import { ApolloClient, InMemoryCache, HttpLink, NormalizedCacheObject } from '@apollo/client';

const httpLink = new HttpLink({
  uri: "https://blueviolet-antelope-713639.hostingersite.com/graphql",
});

const apolloClient = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache(),
});

export default apolloClient;