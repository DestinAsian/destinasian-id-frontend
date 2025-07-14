import { gql, useQuery } from '@apollo/client'
import * as MENUS from '../constants/menus'
import { BlogInfoFragment } from '../fragments/GeneralSettings'
import React, { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'

import FeaturedImage from '../components/FeaturedImage/FeaturedImage'

// const CategoryDesktopSecondaryHeader = dynamic(() =>
//   import(
//     '../components/CategoryDesktopHeader/CategoryDesktopSecondaryHeader/CategoryDesktopSecondaryHeader'
//   ),
// )

// const CategorySecondaryHeader = dynamic(() =>
//   import(
//     '../components/CategoryHeader/CategorySecondaryHeader/CategorySecondaryHeader'
//   ),
// )

const Container = dynamic(() => import('../components/Container/Container'))

// const ContentWrapper = dynamic(() =>
//   import('../components/ContentWrapper/ContentWrapper'),
// )

const ContentWrapperEditorial = dynamic(() =>
  import('../components/ContentWrapperEditorial/ContentWrapperEditorial'),
)

// const EntryMoreReviews = dynamic(() =>
//   import('../components/EntryMoreReviews/EntryMoreReviews'),
// )

const EntryRelatedStories = dynamic(() =>
  import('../components/EntryRelatedStories/EntryRelatedStories'),
)

const Footer = dynamic(() => import('../components/Footer/Footer'))

const Main = dynamic(() => import('../components/Main/Main'))

// const MoreReviews = dynamic(() =>
//   import('../components/MoreReviews/MoreReviews'),
// )

// const PartnerContent = dynamic(() =>
//   import('../components/PartnerContent/PartnerContent'),
// )

const PasswordProtected = dynamic(() =>
  import('../components/PasswordProtected/PasswordProtected'),
)

const RelatedStories = dynamic(() =>
  import('../components/RelatedStories/RelatedStories'),
)

const SEO = dynamic(() => import('../components/SEO/SEO'))

const SecondaryHeader = dynamic(() =>
  import('../components/Header/SecondaryHeader/SecondaryHeader'),
)

const SingleDesktopHeader = dynamic(() =>
  import('../components/SingleHeader/SingleDesktopHeader/SingleDesktopHeader'),
)

const SingleEditorialEntryHeader = dynamic(() =>
  import('../components/SingleEditorialEntryHeader/SingleEditorialEntryHeader'),
)

const SingleEditorialFeaturedImage = dynamic(() =>
  import(
    '../components/SingleEditorialFeaturedImage/SingleEditorialFeaturedImage'
  ),
)

// const SingleEntryHeader = dynamic(() =>
//   import('../components/SingleEntryHeader/SingleEntryHeader'),
// )

const SingleHeader = dynamic(() =>
  import('../components/SingleHeader/SingleHeader'),
)

// const SingleSlider = dynamic(() =>
//   import('../components/SingleSlider/SingleSlider'),
// )

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
    acfPostSlider,
    content,
    databaseId,
    destinationGuides,
    featuredImage,
    guides,
    name,
    passwordProtected,
    seo,
    slug,
    title,
    uri,
  } = props?.data?.post
  const categories = props?.data?.post.categories?.edges ?? []

  // Search function content
  const [searchQuery, setSearchQuery] = useState('')
  // Scrolled Function
  const [isScrolled, setIsScrolled] = useState(false)
  // NavShown Function
  const [isNavShown, setIsNavShown] = useState(false)

  const [isGuidesNavShown, setIsGuidesNavShown] = useState(false)

  const [isDesktop, setIsDesktop] = useState(false)
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

  // desktop
  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 1024) // breakpoint desktop
    }

    handleResize() // cek saat mount
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

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
        first: 100,
        footerHeaderLocation: MENUS.FOOTER_LOCATION,
      },
      fetchPolicy: 'network-only',
      nextFetchPolicy: 'cache-and-network',
    },
  )

  // Logic for Guides Category
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
  const mainCatPosts = [...(mainPosts != null ? mainPosts : [])]

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
      <SEO
        title={seo?.title}
        description={seo?.metaDesc}
        imageUrl={featuredImage?.node?.sourceUrl}
        url={uri}
        focuskw={seo?.focuskw}
      />

      {/* Header */}
      {isDesktop ? (
        <>
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
          <SingleDesktopHeader
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            isGuidesNavShown={isGuidesNavShown}
            setIsGuidesNavShown={setIsGuidesNavShown}
            isScrolled={isScrolled}
          />
          {/* {!isNavShown &&
            (guides?.guidesPost === 'yes' ||
            categories?.[0]?.node?.parent?.node?.destinationGuides
              ?.destinationGuides === 'yes' ? (
              <CategoryDesktopSecondaryHeader
                data={data}
                databaseId={databaseId}
                categoryUri={categories[0]?.node?.uri}
                parentCategory={categories[0]?.node?.parent?.node?.name}
              />
            ) : (
              <SingleDesktopHeader
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                isGuidesNavShown={isGuidesNavShown}
                setIsGuidesNavShown={setIsGuidesNavShown}
                isScrolled={isScrolled}
              />
            ))} */}
        </>
      ) : (
        <>
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
            isGuidesNavShown={isGuidesNavShown}
            setIsGuidesNavShown={setIsGuidesNavShown}
            isScrolled={isScrolled}
          />
          {/* {guides?.guidesPost === 'yes' ||
          categories?.[0]?.node?.parent?.node?.destinationGuides
            ?.destinationGuides === 'yes' ? (
            <CategorySecondaryHeader
              data={data}
              databaseId={databaseId}
              categoryUri={categories[0]?.node?.uri}
              parentCategory={categories[0]?.node?.parent?.node?.name}
            />
          ) : (
            <SecondaryHeader
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              isGuidesNavShown={isGuidesNavShown}
              setIsGuidesNavShown={setIsGuidesNavShown}
              isScrolled={isScrolled}
            />
          )} */}
        </>
      )}
      <Main className="relative top-[-0.75rem] sm:top-[-1rem]">
        <SingleEditorialFeaturedImage image={featuredImage?.node} />
        <SingleEditorialEntryHeader
          image={featuredImage?.node}
          title={title}
          categoryUri={categories?.[0]?.node?.uri}
          parentCategory={categories?.[0]?.node?.parent?.node?.name}
          categoryName={categories?.[0]?.node?.name}
          author={props?.data?.post?.author?.node?.name}
          date={props?.data?.post?.date}
        />
        <ContentWrapperEditorial content={content} images={images} />
        <EntryRelatedStories />
        {props?.shuffledRelatedStories?.map((post) =>
          post.node.title !== title ? (
            <Container key={post.node.id}>
              <RelatedStories
                title={post.node.title}
                excerpt={post.node.excerpt}
                uri={post.node.uri}
                category={post.node.categories.edges[0]?.node?.name}
                categoryUri={post.node.categories.edges[0]?.node?.uri}
                featuredImage={post.node.featuredImage?.node}
              />
            </Container>
          ) : null,
        )}
      </Main>
      {/* Validasi: apakah ini post dengan tipe Guide */}
      {/* {guides?.guidesPost === 'yes' ||
      categories?.[0]?.node?.parent?.node?.destinationGuides
        ?.destinationGuides === 'yes' ? (
        <Main>
          <SingleSlider images={images} />
          <SingleEntryHeader
            title={title}
            categoryUri={categories?.[0]?.node?.slug}
            parentCategory={categories?.[0]?.node?.parent?.node?.name}
            categoryName={categories?.[0]?.node?.name}
          />
          <Container>
            <ContentWrapper content={content} />
          </Container>
          <EntryMoreReviews
            parentName={categories?.[0]?.node?.parent?.node?.name}
            categoryName={categories?.[0]?.node?.name}
            categoryUri={categories?.[0]?.node?.uri}
          />
          <MoreReviews databaseId={databaseId} />
          <PartnerContent
            parentName={categories?.[0]?.node?.parent?.node?.name}
          />
        </Main>
      ) : (
        <Main className="relative top-[-0.75rem] sm:top-[-1rem]">
          <SingleEditorialFeaturedImage image={featuredImage?.node} />
          <SingleEditorialEntryHeader
            image={featuredImage?.node}
            title={title}
            categoryUri={categories?.[0]?.node?.uri}
            parentCategory={categories?.[0]?.node?.parent?.node?.name}
            categoryName={categories?.[0]?.node?.name}
            author={props?.data?.post?.author?.node?.name}
            date={props?.data?.post?.date}
          />
          <ContentWrapperEditorial content={content} images={images} />
          <EntryRelatedStories />
          {props?.shuffledRelatedStories?.map((post) =>
            post.node.title !== title ? (
              <Container key={post.node.id}>
                <RelatedStories
                  title={post.node.title}
                  excerpt={post.node.excerpt}
                  uri={post.node.uri}
                  category={post.node.categories.edges[0]?.node?.name}
                  categoryUri={post.node.categories.edges[0]?.node?.uri}
                  featuredImage={post.node.featuredImage?.node}
                />
              </Container>
            ) : null,
          )}
        </Main>
      )} */}

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
      guides {
        guidesPost
      }
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
      slug
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
