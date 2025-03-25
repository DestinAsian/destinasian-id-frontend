import { gql } from '@apollo/client'

export const GetRCASlider = gql`
  query GetRCASlider($id: ID!) {
    readersChoiceAward(id: $id, idType: DATABASE_ID) {
      rcaSlider {
        propertyName1
        propertyName2
        propertyName3
        propertyName4
        propertyName5
        propertyName6
        propertyName7
        propertyName8
        propertyName9
        propertyName10
        propertyImage1 {
          mediaItemUrl
        }
        propertyImage2 {
          mediaItemUrl
        }
        propertyImage3 {
          mediaItemUrl
        }
        propertyImage4 {
          mediaItemUrl
        }
        propertyImage5 {
          mediaItemUrl
        }
        propertyImage6 {
          mediaItemUrl
        }
        propertyImage7 {
          mediaItemUrl
        }
        propertyImage8 {
          mediaItemUrl
        }
        propertyImage9 {
          mediaItemUrl
        }
        propertyImage10 {
          mediaItemUrl
        }
        propertyUrl1
        propertyUrl2
        propertyUrl3
        propertyUrl4
        propertyUrl5
        propertyUrl6
        propertyUrl7
        propertyUrl8
        propertyUrl9
        propertyUrl10
        propertyId1
        propertyId2
        propertyId3
        propertyId4
        propertyId5
        propertyId6
        propertyId7
        propertyId8
        propertyId9
        propertyId10
      }
    }
  }
`
