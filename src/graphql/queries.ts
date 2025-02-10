import { gql } from "@apollo/client";

export const GET_IMAGES = gql`
  query GetImages($first: Int!, $after: String) {
    images(first: $first, after: $after) {
      edges {
        node {
          id
          title
          liked
          likesCount
          picture
          price
          author
        }
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
`;
