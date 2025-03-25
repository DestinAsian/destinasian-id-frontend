import { gql } from '@apollo/client'

export const GetRCAMenu = gql`
  query GetRCAMenu($first: Int, $after: String, $id: ID = "") {
    readersChoiceAward(id: $id, idType: DATABASE_ID) {
      title
      uri
      children(
        first: $first
        after: $after
        where: {
          contentTypes: READERS_CHOICE_AWARD
          status: PUBLISH
          orderby: { field: MENU_ORDER, order: ASC }
        }
      ) {
        pageInfo {
          endCursor
          hasNextPage
        }
        edges {
          node {
            ... on ReadersChoiceAward {
              id
              title
              uri
              rcaPageAttributes {
                parentCustomLabel
              }
              categories {
                edges {
                  node {
                    id
                    name
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`
