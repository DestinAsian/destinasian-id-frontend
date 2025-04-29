import { gql } from '@apollo/client'

export const GetIndoCategory = gql`
  query GetIndoCategory {
    category(id: "73", idType: DATABASE_ID) {
      id
      name
      slug
      children(first: 10) {
        edges {
          node {
            id
            name
            slug
            categoryImages {
              fieldGroupName
              changeToSlider
              categoryImagesCaption
              categorySlideCaption1
              categorySlideCaption2
              categorySlideCaption3
              categorySlideCaption4
              categorySlideCaption5
              categorySlide1 {
                mediaItemUrl
              }
              categorySlide2 {
                mediaItemUrl
              }
              categorySlide3 {
                mediaItemUrl
              }
              categorySlide4 {
                mediaItemUrl
              }
              categorySlide5 {
                mediaItemUrl
              }
            }
            contentNodes {
              edges {
                node {
                  id
                }
              }
            }
            description
          }
        }
      }
    }
  }
`
