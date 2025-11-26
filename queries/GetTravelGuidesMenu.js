import { gql } from '@apollo/client'

export const GetTravelGuidesMenu = gql`
  query GetTravelGuidesMenu(
    $first: Int
    $footerHeaderLocation: MenuLocationEnum
  ) {
    footerHeaderMenuItems: menuItems(
      where: { location: $footerHeaderLocation }
      first: $first
    ) {
      nodes {
        id
        path
        label
        parentId
        connectedNode {
          node {
            ... on Category {
              id
              name
              uri
              categoryImages {
                changeToSlider
                categoryImages {
                  sourceUrl
                }
                categorySlide1 {
                  sourceUrl
                }
              }
              destinationGuides {
                guidesTitle
              }
              countryCode {
                countryCode
              }
              parent {
                node {
                  name
                }
              }
              posts(
                first: 10
                where: { orderby: { field: DATE, order: ASC }, status: PUBLISH }
              ) {
                edges {
                  node {
                    id
                    title
                    uri
                  }
                }
              }
              children(first: 4, where: { order: ASC, orderby: NAME }) {
                edges {
                  node {
                    id
                    name
                    uri

                    parent {
                      node {
                        id
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
`
