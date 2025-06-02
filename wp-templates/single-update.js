import React, { useState, useEffect } from 'react'
import { gql, useQuery } from '@apollo/client'
import * as MENUS from '../constants/menus'
import { BlogInfoFragment } from '../fragments/GeneralSettings'
import { GetSpecificBannerAds } from '../queries/GetSpecificBannerAds'
import dynamic from 'next/dynamic'

const SingleHeader = dynamic(() => import('../components/SingleHeader/SingleHeader'))
const Footer = dynamic(() => import('../components/Footer/Footer'))
const Main = dynamic(() => import('../components/Main/Main'))
const Container = dynamic(() => import('../components/Container/Container'))
const SingleUpdateEntryHeader = dynamic(() => import('../components/SingleUpdateEntryHeader/SingleUpdateEntryHeader'))
import FeaturedImage from '../components/FeaturedImage/FeaturedImage'
const SEO = dynamic(() => import('../components/SEO/SEO'))
const ModuleAd = dynamic(() => import('../components/ModuleAd/ModuleAd'))
const ContentWrapperUpdate = dynamic(() => import('../components/ContentWrapperUpdate/ContentWrapperUpdate'))
const PasswordProtected = dynamic(() => import('../components/PasswordProtected/PasswordProtected'))
const SecondaryHeader = dynamic(() => import('../components/Header/SecondaryHeader/SecondaryHeader'));
import { GetMenus } from '../queries/GetMenus'
import { GetFooterMenus } from '../queries/GetFooterMenus'
import { GetLatestStories } from '../queries/GetLatestStories'
import { eb_garamond, rubik, rubik_mono_one } from '../styles/fonts/fonts'
import Cookies from 'js-cookie'
import { GetLatestRCA } from '../queries/GetLatestRCA'

export default function SingleUpdate(props) {
  // Loading state for previews
  if (props.loading) {
    return <>Loading...</>
  }

  const [enteredPassword, setEnteredPassword] = useState('')
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  // Check for stored password in cookies on mount
  useEffect(() => {
    const storedPassword = Cookies.get('updatePassword')
    if (
      storedPassword &&
      storedPassword === props?.data?.update?.passwordProtected?.password
    ) {
      setIsAuthenticated(true)
    }
  }, [props?.data?.update?.passwordProtected?.password])

  const bannerPerPage = 20

  const { title: siteTitle, description: siteDescription } =
    props?.data?.generalSettings
  const {
    title,
    content,
    featuredImage,
    author,
    date,
    contentType,
    seo,
    uri,
    passwordProtected,
  } = props?.data?.update
  const categories = props?.data?.update?.categories?.edges ?? []
  const relatedStories = categories[0]?.node?.editorials ?? []

  // Search function content
  const [searchQuery, setSearchQuery] = useState('')
  // Scrolled Function
  const [isScrolled, setIsScrolled] = useState(false)
  // NavShown Function
  const [isNavShown, setIsNavShown] = useState(false)
  const [isGuidesNavShown, setIsGuidesNavShown] = useState(false)
  const [isRCANavShown, setIsRCANavShown] = useState(false)

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

  // Stop scrolling pages when isRCANavShown
  useEffect(() => {
    if (isRCANavShown) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'visible'
    }
  }, [isRCANavShown])

  // Stop scrolling pages when isGuidesNavShown
  useEffect(() => {
    if (isGuidesNavShown) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'visible'
    }
  }, [isGuidesNavShown])

  const { data: rcaData } = useQuery(GetLatestRCA, {
    fetchPolicy: 'network-only',
    nextFetchPolicy: 'cache-and-network',
  })

  const [latestRCA, setLatestRCA] = useState(null)

  useEffect(() => {
    if (rcaData?.readersChoiceAwards?.edges) {
      // Find the first RCA where parent is null
      const filteredRCA = rcaData.readersChoiceAwards.edges.find(
        (edge) => !edge.node.parent,
      )?.node
      setLatestRCA(filteredRCA || null)
    }
  }, [rcaData]) // Runs whenever rcaData changes

  const {
    // title: rcaTitle,
    databaseId: rcaDatabaseId,
    uri: rcaUri,
  } = latestRCA ?? []

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

  // Handle password submission
  const handlePasswordSubmit = (e) => {
    e.preventDefault()
    if (enteredPassword === passwordProtected?.password) {
      setIsAuthenticated(true)
      Cookies.set('updatePassword', enteredPassword, { expires: 1 }) // Set cookie to expire in 1 day
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
      <SEO
        title={seo?.title}
        description={seo?.metaDesc}
        imageUrl={featuredImage?.node?.sourceUrl}
        url={uri}
        focuskw={seo?.focuskw}
      />
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
      <SecondaryHeader
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        rcaDatabaseId={rcaDatabaseId}
        rcaUri={rcaUri}
        isGuidesNavShown={isGuidesNavShown}
        setIsGuidesNavShown={setIsGuidesNavShown}
        isRCANavShown={isRCANavShown}
        setIsRCANavShown={setIsRCANavShown}
        isScrolled={isScrolled}
      />
      <Main>
        <>
          <Container>
            <SingleUpdateEntryHeader
              image={featuredImage?.node}
              title={title}
              categoryUri={categories[0]?.node?.uri}
              categoryName={categories[0]?.node?.name}
              contentTypeName={contentType?.node?.graphqlPluralName}
              author={author.node.name}
              date={date}
            />
            <ContentWrapperUpdate content={content} />
          </Container>
        </>
      </Main>
      <Footer footerMenu={footerMenu} />
    </main>
  )
}

SingleUpdate.query = gql`
  ${BlogInfoFragment}
  ${FeaturedImage.fragments.entry}
  query GetPost($databaseId: ID!, $asPreview: Boolean = false) {
    update(id: $databaseId, idType: DATABASE_ID, asPreview: $asPreview) {
      title
      content
      date
      passwordProtected {
        onOff
        password
      }
      contentType {
        node {
          graphqlPluralName
        }
      }
      seo {
        title
        metaDesc
        focuskw
      }
      uri
      ...FeaturedImageFragment
      author {
        node {
          name
        }
      }
      categories {
        edges {
          node {
            name
            uri
            parent {
              node {
                name
                uri
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
            updates {
              edges {
                node {
                  title
                  excerpt
                  uri
                  ...FeaturedImageFragment
                  categories {
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
          }
        }
      }
      ...FeaturedImageFragment
    }
    generalSettings {
      ...BlogInfoFragment
    }
  }
`

SingleUpdate.variables = ({ databaseId }, ctx) => {
  return {
    databaseId,
    asPreview: ctx?.asPreview,
  }
}
