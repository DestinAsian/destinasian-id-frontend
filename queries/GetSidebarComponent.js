import { gql } from "@apollo/client";

export const GetSidebarComponent = gql`
  query GetSidebarComponent($id: ID!) {
    page(id: $id, idType: DATABASE_ID) {
      id
      sidebarComponent {
        outnow {
          id
          sourceUrl
          altText
          mediaDetails {
            width
            height
          }
        }
        inHouseAds {
          id
          sourceUrl
          altText
          mediaDetails {
            width
            height
          }
        }
      }
    }
  }
`;
