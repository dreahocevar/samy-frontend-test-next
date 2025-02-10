import { ApolloClient, InMemoryCache, createHttpLink } from "@apollo/client";

const client = new ApolloClient({
  link: createHttpLink({
    uri: "https://sandbox-api-test.samyroad.com/graphql",
  }),
  cache: new InMemoryCache(),
});

export default client;
