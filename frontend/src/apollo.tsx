import { InMemoryCache } from "@apollo/client";
import { relayStylePagination } from "@apollo/client/utilities";

export function ApolloCache(): InMemoryCache {
  return new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          posts: relayStylePagination(),
        }
      }
    }
  });
}