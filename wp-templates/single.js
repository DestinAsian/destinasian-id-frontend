import React, { useEffect, useState, useMemo } from 'react'
import { gql, useQuery } from '@apollo/client'
import * as MENUS from '../constants/menus'
import { BlogInfoFragment } from '../fragments/GeneralSettings'
import Cookies from 'js-cookie'
import { eb_garamond, rubik, rubik_mono_one } from '../styles/fonts/fonts'

import FeaturedImage from '../components/FeaturedImage/FeaturedImage'
import { GetMenus } from '../queries/GetMenus'
import { GetLatestStories } from '../queries/GetLatestStories'
import { GetSecondaryHeader } from '../queries/GetSecondaryHeader'

import dynamic from 'next/dynamic'
const Container = dynamic(() => import('../components/Container/Container'))
const ContentWrapperEditorial = dynamic(() =>
  import('../components/ContentWrapperEditorial/ContentWrapperEditorial'),
)
const EntryRelatedStories = dynamic(() =>
  import('../components/EntryRelatedStories/EntryRelatedStories'),
)
const Footer = dynamic(() => import('../components/Footer/Footer'))
const Main = dynamic(() => import('../components/Main/Main'))
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
const SingleHeader = dynamic(() =>
  import('../components/SingleHeader/SingleHeader'),
)

const MastHeadBottom = dynamic(() =>
  import('../components/AdUnit/MastHeadBottom/MastHeadBottom'),
)
const MastHeadBottomMobile = dynamic(() =>
  import('../components/AdUnit/MastHeadBottomMobile/MastHeadBottomMobile'),
)
export default function Component(props) {
  if (props.loading) return <>Loading...</>

  const [enteredPassword, setEnteredPassword] = useState('')
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [isScrolled, setIsScrolled] = useState(false)
  const [isNavShown, setIsNavShown] = useState(false)
  const [isGuidesNavShown, setIsGuidesNavShown] = useState(false)
  const [isDesktop, setIsDesktop] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const post = props?.data?.post ?? {}
  const categories = post?.categories?.edges ?? []

  // Handle scroll dan responsif screen (desktop vs mobile)
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 0)

    const handleResize = () => {
      const width = window.innerWidth
      setIsMobile(width <= 768)
      setIsDesktop(width > 768)
    }

    handleScroll()
    handleResize()
    window.addEventListener('scroll', handleScroll)
    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  // Lock scroll saat search/menu aktif
  useEffect(() => {
    document.body.style.overflow =
      searchQuery !== '' || isNavShown ? 'hidden' : 'visible'
  }, [searchQuery, isNavShown])

  // Password protection
  useEffect(() => {
    const storedPassword = Cookies.get('postPassword')
    if (
      storedPassword &&
      storedPassword === post?.passwordProtected?.password
    ) {
      setIsAuthenticated(true)
    }
  }, [post?.passwordProtected?.password])

  const catVariable = useMemo(
    () => ({ first: 1, id: post.databaseId }),
    [post.databaseId],
  )

  const { data } = useQuery(GetSecondaryHeader, {
    variables: catVariable,
    fetchPolicy: 'network-only',
    nextFetchPolicy: 'cache-and-network',
  })

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

  const { data: latestStories } = useQuery(GetLatestStories, {
    variables: { first: 5 },
    fetchPolicy: 'network-only',
    nextFetchPolicy: 'cache-and-network',
  })

  const allPosts = useMemo(() => {
    const sortByDate = (a, b) => new Date(b.date) - new Date(a.date)
    const posts = latestStories?.posts?.edges?.map((e) => e.node) || []
    return posts.sort(sortByDate)
  }, [latestStories])

  const images = useMemo(() => {
    const { acfPostSlider } = post
    return [1, 2, 3, 4, 5].map((i) => [
      acfPostSlider?.[`slide${i}`]?.mediaItemUrl || null,
      acfPostSlider?.[`slideCaption${i}`] || null,
    ])
  }, [post])

  const handlePasswordSubmit = (e) => {
    e.preventDefault()
    if (enteredPassword === post?.passwordProtected?.password) {
      setIsAuthenticated(true)
      Cookies.set('postPassword', enteredPassword, { expires: 1 })
    } else {
      alert('Incorrect password.')
    }
  }

  if (post?.passwordProtected?.onOff && !isAuthenticated) {
    return (
      <main
        className={`${eb_garamond.variable} ${rubik_mono_one.variable} ${rubik.variable}`}
      >
        <form onSubmit={handlePasswordSubmit}>
          <PasswordProtected
            enteredPassword={enteredPassword}
            setEnteredPassword={setEnteredPassword}
            title={post?.seo?.title}
            description={post?.seo?.metaDesc}
            imageUrl={post?.featuredImage?.node?.sourceUrl}
            url={post?.uri}
            focuskw={post?.seo?.focuskw}
          />
        </form>
      </main>
    )
  }

  return (
    <main className={`${eb_garamond.variable} ${rubik_mono_one.variable}`}>
      <SEO
        title={post?.seo?.title}
        description={post?.seo?.metaDesc}
        imageUrl={post?.featuredImage?.node?.sourceUrl}
        url={post?.uri}
        focuskw={post?.seo?.focuskw}
      />

      {/* Header */}
      {isDesktop ? (
        <>
          <SingleHeader
            title={props?.data?.generalSettings?.title}
            description={props?.data?.generalSettings?.description}
            primaryMenuItems={menusData?.headerMenuItems?.nodes || []}
            secondaryMenuItems={menusData?.secondHeaderMenuItems?.nodes || []}
            thirdMenuItems={menusData?.thirdHeaderMenuItems?.nodes || []}
            fourthMenuItems={menusData?.fourthHeaderMenuItems?.nodes || []}
            fifthMenuItems={menusData?.fifthHeaderMenuItems?.nodes || []}
            featureMenuItems={menusData?.featureHeaderMenuItems?.nodes || []}
            latestStories={allPosts}
            menusLoading={menusLoading}
            latestLoading={!latestStories}
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
        </>
      ) : (
        <>
          <SingleHeader
            title={props?.data?.generalSettings?.title}
            description={props?.data?.generalSettings?.description}
            primaryMenuItems={menusData?.headerMenuItems?.nodes || []}
            secondaryMenuItems={menusData?.secondHeaderMenuItems?.nodes || []}
            thirdMenuItems={menusData?.thirdHeaderMenuItems?.nodes || []}
            fourthMenuItems={menusData?.fourthHeaderMenuItems?.nodes || []}
            fifthMenuItems={menusData?.fifthHeaderMenuItems?.nodes || []}
            featureMenuItems={menusData?.featureHeaderMenuItems?.nodes || []}
            latestStories={allPosts}
            menusLoading={menusLoading}
            latestLoading={!latestStories}
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
        </>
      )}

      <Main className="relative top-[-0.75rem] sm:top-[-1rem]">
        <SingleEditorialFeaturedImage image={post?.featuredImage?.node} />
        <SingleEditorialEntryHeader
          image={post?.featuredImage?.node}
          title={post?.title}
          categoryUri={categories?.[0]?.node?.uri}
          parentCategory={categories?.[0]?.node?.parent?.node?.name}
          categoryName={categories?.[0]?.node?.name}
          author={post?.author?.node?.name}
          date={post?.date}
        />
        <ContentWrapperEditorial content={post?.content} images={images} />
        <div>{isMobile ? <MastHeadBottomMobile /> : <MastHeadBottom />}</div>

        <EntryRelatedStories />
        {props?.shuffledRelatedStories?.map((related) =>
          related.node.title !== post.title ? (
            <Container key={related.node.id}>
              <RelatedStories
                title={related.node.title}
                excerpt={related.node.excerpt}
                uri={related.node.uri}
                category={related.node.categories.edges[0]?.node?.name}
                categoryUri={related.node.categories.edges[0]?.node?.uri}
                featuredImage={related.node.featuredImage?.node}
              />
            </Container>
          ) : null,
        )}
      </Main>

      <Footer />
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
                destinationGuides {
                  destinationGuides
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
        slideCaption2
        slideCaption3
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

Component.variables = ({ databaseId }, ctx) => ({
  databaseId,
  asPreview: ctx?.asPreview,
})
