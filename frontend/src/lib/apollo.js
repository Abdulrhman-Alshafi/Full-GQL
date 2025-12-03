import { ApolloClient, InMemoryCache, createHttpLink } from "@apollo/client";

const httpLink = createHttpLink({
  uri: "http://localhost:4000/graphql",
  credentials: "include", // ✅ Important: include cookies in requests
});

export const client = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache(),
});
