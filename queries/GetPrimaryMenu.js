import { gql } from '@apollo/client'

export const GetPrimaryMenu = gql`
  query GetPrimaryMenu($first: Int, $headerLocation: MenuLocationEnum) {
    headerMenuItems: menuItems(
      where: { location: $headerLocation }
      first: $first
    ) {
      edges {
        node {
          connectedNode {
            node {
              ... on Category {
                id
                name
                uri
                categoryImages {
                  categoryImages {
                    sourceUrl
                  }
                }
                destinationGuides {
                  guidesTitle
                }
                children(first: 4, where: { order: ASC, orderby: NAME }) {
                  edges {
                    node {
                      id
                      name
                      uri
                      categoryImages {
                        categoryImages {
                          sourceUrl
                        }
                      }
                      parent {
                        node {
                          name
                        }
                      }
                      posts(
                        first: 10
                        where: {
                          orderby: { field: DATE, order: ASC }
                          status: PUBLISH
                        }
                      ) {
                        edges {
                          node {
                            id
                            title
                            uri
                          }
                        }
                      }
                    }
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
