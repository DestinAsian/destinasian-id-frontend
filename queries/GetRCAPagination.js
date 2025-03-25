import { gql } from '@apollo/client'

export const GetRCAPagination = gql`
  query GetRCAPagination($first: Int, $after: String, $id: Int) {
    readersChoiceAwardBy(readersChoiceAwardId: $id) {
      id
      title
      uri
      menuOrder
      ancestors(
        first: 1
        where: {
          status: PUBLISH
          contentTypes: READERS_CHOICE_AWARD
          search: "Readers"
        }
      ) {
        edges {
          node {
            ... on ReadersChoiceAward {
              id
              title
              uri
              children(
                first: $first
                after: $after
                where: { orderby: { field: MENU_ORDER, order: ASC } }
              ) {
                edges {
                  node {
                    ... on ReadersChoiceAward {
                      id
                      title
                      uri
                      children(
                        first: 10
                        after: $after
                        where: { orderby: { field: MENU_ORDER, order: ASC } }
                      ) {
                        edges {
                          node {
                            ... on ReadersChoiceAward {
                              id
                              title
                              uri
                            }
                          }
                        }
                        pageInfo {
                          hasNextPage
                          endCursor
                        }
                      }
                    }
                  }
                }
                pageInfo {
                  hasNextPage
                  endCursor
                }
              }
            }
          }
        }
      }
      children(
        first: $first
        after: $after
        where: { orderby: { field: MENU_ORDER, order: ASC } }
      ) {
        edges {
          node {
            ... on ReadersChoiceAward {
              id
              title
              uri
              children(
                first: 10
                after: $after
                where: { orderby: { field: MENU_ORDER, order: ASC } }
              ) {
                edges {
                  node {
                    ... on ReadersChoiceAward {
                      id
                      title
                      uri
                    }
                  }
                }
                pageInfo {
                  hasNextPage
                  endCursor
                }
              }
            }
          }
        }
        pageInfo {
          hasNextPage
          endCursor
        }
      }
    }
  }
`
