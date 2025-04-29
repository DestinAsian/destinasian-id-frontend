import { gql, useQuery } from '@apollo/client'
import * as MENUS from '../constants/menus'
import { BlogInfoFragment } from '../fragments/GeneralSettings'
import React, { useEffect, useState } from 'react'
import {
  SingleHeader,
  Footer,
  Main,
  Container,
  SingleEntryHeader,
  ContentWrapper,
  FeaturedImage,
  SEO,
  SingleSlider,
  CategorySecondaryHeader,
  EntryMoreReviews,
  MoreReviews,
  PartnerContent,
  PasswordProtected,
} from '../components'
import { GetMenus } from '../queries/GetMenus'
import { GetFooterMenus } from '../queries/GetFooterMenus'
import { GetLatestStories } from '../queries/GetLatestStories'
import { eb_garamond, rubik, rubik_mono_one } from '../styles/fonts/fonts'
import Cookies from 'js-cookie'
import { GetSecondaryHeader } from '../queries/GetSecondaryHeader'

export default function Component(props) {
  // Loading state for previews
  if (props.loading) {
    return <>Loading...</>
  }

  const [enteredPassword, setEnteredPassword] = useState('')
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  // Check for stored password in cookies on mount
  useEffect(() => {
    const storedPassword = Cookies.get('postPassword')
    if (
      storedPassword &&
      storedPassword === props?.data?.post?.passwordProtected?.password
    ) {
      setIsAuthenticated(true)
    }
  }, [props?.data?.post?.passwordProtected?.password])

  const { title: siteTitle, description: siteDescription } =
    props?.data?.generalSettings
  const {
    title,
    content,
    featuredImage,
    databaseId,
    acfPostSlider,
    acfCategoryIcon,
    acfLocationIcon,
    seo,
    uri,
    passwordProtected,
  } = props?.data?.post
  const categories = props?.data?.post.categories?.edges ?? []

  // Search function content
  const [searchQuery, setSearchQuery] = useState('')
  // Scrolled Function
  const [isScrolled, setIsScrolled] = useState(false)
  // NavShown Function
  const [isNavShown, setIsNavShown] = useState(false)

  // Stop scrolling pages when searchQuery
  useEffect(() => {
    if (searchQuery !== '') {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'visible'
    }
  }, [searchQuery])

  // Add sticky header on scroll
  useEffect(() => {
    function handleScroll() {
      setIsScrolled(window.scrollY > 0)
    }

    window.addEventListener('scroll', handleScroll)

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  // Stop scrolling pages when isNavShown
  useEffect(() => {
    if (isNavShown) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'visible'
    }
  }, [isNavShown])

  let catVariable = {
    first: 1,
    id: databaseId,
  }

  // Get Category
  const { data, loading } = useQuery(GetSecondaryHeader, {
    variables: catVariable,
    fetchPolicy: 'network-only',
    nextFetchPolicy: 'cache-and-network',
  })

  // Get menus
  const { data: menusData, loading: menusLoading } = useQuery(GetMenus, {
    variables: {
      first: 20,
      headerLocation: MENUS.PRIMARY_LOCATION,
      secondHeaderLocation: MENUS.SECONDARY_LOCATION,
      thirdHeaderLocation: MENUS.THIRD_LOCATION,
      fourthHeaderLocation: MENUS.FOURTH_LOCATION,
      fifthHeaderLocation: MENUS.FIFTH_LOCATION,
      featureHeaderLocation: MENUS.FEATURE_LOCATION,
    },
    fetchPolicy: 'network-only',
    nextFetchPolicy: 'cache-and-network',
  })

  // Header Menu
  const primaryMenu = menusData?.headerMenuItems?.nodes ?? []
  const secondaryMenu = menusData?.secondHeaderMenuItems?.nodes ?? []
  const thirdMenu = menusData?.thirdHeaderMenuItems?.nodes ?? []
  const fourthMenu = menusData?.fourthHeaderMenuItems?.nodes ?? []
  const fifthMenu = menusData?.fifthHeaderMenuItems?.nodes ?? []
  const featureMenu = menusData?.featureHeaderMenuItems?.nodes ?? []

  // Get Footer menus
  const { data: footerMenusData, loading: footerMenusLoading } = useQuery(
    GetFooterMenus,
    {
      variables: {
        first: 50,
        footerHeaderLocation: MENUS.FOOTER_LOCATION,
      },
      fetchPolicy: 'network-only',
      nextFetchPolicy: 'cache-and-network',
    },
  )

  // Footer Menu
  const footerMenu = footerMenusData?.footerHeaderMenuItems?.nodes ?? []

  // Get latest travel stories
  const { data: latestStories, loading: latestLoading } = useQuery(
    GetLatestStories,
    {
      variables: {
        first: 5,
      },
      fetchPolicy: 'network-only',
      nextFetchPolicy: 'cache-and-network',
    },
  )

  const posts = latestStories?.posts ?? []
  const editorials = latestStories?.editorials ?? []
  const updates = latestStories?.updates ?? []

  const mainPosts = []
  const mainEditorialPosts = []
  const mainUpdatesPosts = []

  // loop through all the main categories posts
  posts?.edges?.forEach((post) => {
    mainPosts.push(post.node)
  })

  // loop through all the main categories and their posts
  editorials?.edges?.forEach((post) => {
    mainEditorialPosts.push(post.node)
  })

  // loop through all the main categories and their posts
  updates?.edges?.forEach((post) => {
    mainUpdatesPosts.push(post.node)
  })

  // sort posts by date
  const sortPostsByDate = (a, b) => {
    const dateA = new Date(a.date)
    const dateB = new Date(b.date)
    return dateB - dateA // Sort in descending order
  }

  // define mainCatPostCards
  const mainCatPosts = [
    ...(mainPosts != null ? mainPosts : []),
    ...(mainEditorialPosts != null ? mainEditorialPosts : []),
    ...(mainUpdatesPosts != null ? mainUpdatesPosts : []),
  ]

  // sortByDate mainCat & childCat Posts
  const allPosts = mainCatPosts.sort(sortPostsByDate)

  const images = [
    [
      acfPostSlider?.slide1 != null
        ? acfPostSlider?.slide1?.mediaItemUrl
        : null,
      acfPostSlider?.slideCaption1 != null
        ? acfPostSlider?.slideCaption1
        : null,
    ],
    [
      acfPostSlider?.slide2 != null
        ? acfPostSlider?.slide2?.mediaItemUrl
        : null,
      acfPostSlider?.slideCaption2 != null
        ? acfPostSlider?.slideCaption2
        : null,
    ],
    [
      acfPostSlider?.slide3 != null
        ? acfPostSlider?.slide3?.mediaItemUrl
        : null,
      acfPostSlider?.slideCaption3 != null
        ? acfPostSlider?.slideCaption3
        : null,
    ],
    [
      acfPostSlider?.slide4 != null
        ? acfPostSlider?.slide4?.mediaItemUrl
        : null,
      acfPostSlider?.slideCaption4 != null
        ? acfPostSlider?.slideCaption4
        : null,
    ],
    [
      acfPostSlider?.slide5 != null
        ? acfPostSlider?.slide5?.mediaItemUrl
        : null,
      acfPostSlider?.slideCaption5 != null
        ? acfPostSlider?.slideCaption5
        : null,
    ],
  ]

  // Handle password submission
  const handlePasswordSubmit = (e) => {
    e.preventDefault()
    if (enteredPassword === passwordProtected?.password) {
      setIsAuthenticated(true)
      Cookies.set('postPassword', enteredPassword, { expires: 1 }) // Set cookie to expire in 1 day
    } else {
      alert('Incorrect password. Please try again.')
    }
  }

  if (passwordProtected?.onOff && !isAuthenticated) {
    return (
      <main
        className={`${eb_garamond.variable} ${rubik_mono_one.variable} ${rubik.variable}`}
      >
        <form onSubmit={handlePasswordSubmit}>
          <PasswordProtected
            enteredPassword={enteredPassword}
            setEnteredPassword={setEnteredPassword}
            title={seo?.title}
            description={seo?.metaDesc}
            imageUrl={featuredImage?.node?.sourceUrl}
            url={uri}
            focuskw={seo?.focuskw}
          />
        </form>
      </main>
    )
  }

  return (
    <main className={`${eb_garamond.variable} ${rubik_mono_one.variable}`}>
      {/* <SEO
        title={seo?.title}
        description={seo?.metaDesc}
        imageUrl={featuredImage?.node?.sourceUrl}
        url={uri}
        focuskw={seo?.focuskw}
      /> */}
      <SingleHeader
        title={siteTitle}
        description={siteDescription}
        primaryMenuItems={primaryMenu}
        secondaryMenuItems={secondaryMenu}
        thirdMenuItems={thirdMenu}
        fourthMenuItems={fourthMenu}
        fifthMenuItems={fifthMenu}
        featureMenuItems={featureMenu}
        latestStories={allPosts}
        menusLoading={menusLoading}
        latestLoading={latestLoading}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        isNavShown={isNavShown}
        setIsNavShown={setIsNavShown}
        isScrolled={isScrolled}
      />
      <CategorySecondaryHeader
        data={data}
        databaseId={databaseId}
        categoryUri={categories[0]?.node?.uri}
        parentCategory={categories[0]?.node?.parent?.node?.name}
      />
      <Main>
        <>
          <SingleSlider images={images} />
          <SingleEntryHeader
            title={title}
            categoryUri={categories[0]?.node?.uri}
            parentCategory={categories[0]?.node?.parent?.node?.name}
            categoryName={categories[0]?.node?.name}
            chooseYourCategory={acfCategoryIcon?.chooseYourCategory}
            chooseIcon={acfCategoryIcon?.chooseIcon?.mediaItemUrl}
            categoryLabel={acfCategoryIcon?.categoryLabel}
            locationValidation={acfLocationIcon?.fieldGroupName}
            locationLabel={acfLocationIcon?.locationLabel}
            locationUrl={acfLocationIcon?.locationUrl}
          />
          <Container>
            <ContentWrapper content={content} />
          </Container>
          {/* <EntryMoreReviews
            parentName={categories[0]?.node?.parent?.node?.name}
            categoryName={categories[0]?.node?.name}
            categoryUri={categories[0]?.node?.uri}
          /> */}
          {/* <MoreReviews databaseId={databaseId} /> */}
          {/* <PartnerContent
            parentName={categories[0]?.node?.parent?.node?.name}
          /> */}
        </>
      </Main>
      <Footer footerMenu={footerMenu} />
    </main>
  )
}

Component.query = gql`
  ${BlogInfoFragment}
  ${FeaturedImage.fragments.entry}
  query GetPost($databaseId: ID!, $asPreview: Boolean = false) {
    post(id: $databaseId, idType: DATABASE_ID, asPreview: $asPreview) {
      title
      databaseId
      content
      date
      passwordProtected {
        onOff
        password
      }
      author {
        node {
          name
        }
      }
      seo {
        title
        metaDesc
        focuskw
      }
      uri
      categories(where: { childless: true }) {
        edges {
          node {
            name
            uri
            parent {
              node {
                name
                uri
                countryCode {
                  countryCode
                }
                destinationGuides {
                  destinationGuides
                }
                children {
                  edges {
                    node {
                      name
                      uri
                    }
                  }
                }
              }
            }
            children {
              edges {
                node {
                  name
                  uri
                }
              }
            }
          }
        }
      }
      acfPostSlider {
        slide1 {
          mediaItemUrl
        }
        slide2 {
          mediaItemUrl
        }
        slide3 {
          mediaItemUrl
        }
        slide4 {
          mediaItemUrl
        }
        slide5 {
          mediaItemUrl
        }
        slideCaption1
        slideCaption3
        slideCaption2
        slideCaption4
        slideCaption5
      }
      acfCategoryIcon {
        categoryLabel
        chooseYourCategory
        chooseIcon {
          mediaItemUrl
        }
      }
      acfLocationIcon {
        fieldGroupName
        locationLabel
        locationUrl
      }
      ...FeaturedImageFragment
    }
    generalSettings {
      ...BlogInfoFragment
    }
  }
`

Component.variables = ({ databaseId }, ctx) => {
  return {
    databaseId,
    asPreview: ctx?.asPreview,
  }
}
