import { gql } from '@apollo/client';

export const GetTravelGuides = gql`
  query GetTravelGuides($search: String) {
    tags(first: 10, where: { search: $search, hideEmpty: true }) {
      edges {
        node {
          id
          name
          uri
          featuredImage {
            node {
              sourceUrl
            }
          }
        }
      }
    }
  }
`;
