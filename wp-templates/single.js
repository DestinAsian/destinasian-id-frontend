import React, { useEffect, useState, useMemo } from 'react'
import { gql, useQuery } from '@apollo/client'
import * as MENUS from '../constants/menus'
import { BlogInfoFragment } from '../fragments/GeneralSettings'
import Cookies from 'js-cookie'
import { open_sans } from '../styles/fonts/fonts'
import { getNextStaticProps } from '@faustwp/core'
import FeaturedImage from '../components/FeaturedImage/FeaturedImage'
import { GetMenus } from '../queries/GetMenus'
import { GetLatestStories } from '../queries/GetLatestStories'
import { GetSecondaryHeader } from '../queries/GetSecondaryHeader'
import ContentWrapperEditorial from '../components/ContentWrapperEditorial/ContentWrapperEditorial'
import EntryRelatedStories from '../components/EntryRelatedStories/EntryRelatedStories'
import Footer from '../components/Footer/Footer'
import Main from '../components/Main/Main'
import PasswordProtected from '../components/PasswordProtected/PasswordProtected'
import SEO from '../components/SEO/SEO'
import SecondaryHeader from '../components/Header/SecondaryHeader/SecondaryHeader'
import SingleDesktopHeader from '../components/SingleHeader/SingleDesktopHeader/SingleDesktopHeader'
import SingleEntryHeader from '../components/Single/SingleEntryHeader'
import SingleFeaturedImage from '../components/Single/SingleFeaturedImage'
import SingleHeader from '../components/SingleHeader/SingleHeader'
import RelatedPosts from '../components/RelatedPosts/RelatedPosts'

import dynamic from 'next/dynamic'
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
  const [errorMsg, setErrorMsg] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [isScrolled, setIsScrolled] = useState(false)
  const [isNavShown, setIsNavShown] = useState(false)
  const [isGuidesNavShown, setIsGuidesNavShown] = useState(false)
  const [isDesktop, setIsDesktop] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  const post = props?.data?.post ?? {}
  const isPreview = props?.asPreview
  const categories = post?.categories?.edges ?? []

  // Stable scroll + responsive handling
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 0)

    // Use matchMedia for stability
    const desktopQuery = window.matchMedia('(min-width: 769px)')
    const mobileQuery = window.matchMedia('(max-width: 768px)')

    const updateDeviceState = () => {
      setIsDesktop(desktopQuery.matches)
      setIsMobile(mobileQuery.matches)
    }

    handleScroll()
    updateDeviceState()

    window.addEventListener('scroll', handleScroll)
    desktopQuery.addEventListener('change', updateDeviceState)
    mobileQuery.addEventListener('change', updateDeviceState)

    return () => {
      window.removeEventListener('scroll', handleScroll)
      desktopQuery.removeEventListener('change', updateDeviceState)
      mobileQuery.removeEventListener('change', updateDeviceState)
    }
  }, [])

  // Lock scroll when nav/search active
  useEffect(() => {
    if (searchQuery !== '' || isNavShown) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = '' // let browser use default
    }
  }, [searchQuery, isNavShown])

  // Password protection check
  useEffect(() => {
    const storedPassword = Cookies.get('postPassword')
    if (
      storedPassword &&
      storedPassword === post?.passwordProtected?.password
    ) {
      setIsAuthenticated(true)
    }
  }, [post?.passwordProtected?.password])

  const catVariable = useMemo(() => {
    if (!post?.databaseId) return null
    return { first: 1, id: post.databaseId }
  }, [post?.databaseId])

  const { data } = useQuery(GetSecondaryHeader, {
    variables: catVariable,
    skip: !catVariable,
    fetchPolicy: 'network-only',
    nextFetchPolicy: 'cache-and-network',
  })

  const { data: menusData, loading: menusLoading } = useQuery(GetMenus, {
    variables: {
      first: 10,
      headerLocation: MENUS.PRIMARY_LOCATION,
      secondHeaderLocation: MENUS.SECONDARY_LOCATION,
      thirdHeaderLocation: MENUS.THIRD_LOCATION,
      fourthHeaderLocation: MENUS.FOURTH_LOCATION,
      fifthHeaderLocation: MENUS.FIFTH_LOCATION,
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

  // Handler submit password
  const handlePasswordSubmit = (e) => {
    e.preventDefault()
    if (enteredPassword === post?.passwordProtected?.password) {
      setIsAuthenticated(true)
      Cookies.set('postPassword', enteredPassword, { expires: 1 })
      setErrorMsg('') // reset error
    } else {
      setErrorMsg('Incorrect password.')
    }
  }

  // Password screen
  if (post?.passwordProtected?.onOff && !isAuthenticated) {
    return (
      <main className={`${open_sans.variable} overflow-x-hidden`}>
        {isPreview && (
          <div className="bg-yellow-400 p-3 text-center font-semibold text-black">
            Preview Mode, Konten ini belum dipublikasikan
          </div>
        )}
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
          {errorMsg && (
            <p className="mt-2 text-center text-sm font-medium text-red-600">
              {errorMsg}
            </p>
          )}
        </form>
      </main>
    )
  }

  return (
    <main className="overflow-x-hidden">
      {isPreview && (
        <div className="bg-yellow-400 p-3 text-center font-semibold text-black">
          Preview Mode – Konten ini belum dipublikasikan
        </div>
      )}

      <SEO
        title={post?.seo?.title}
        description={post?.seo?.metaDesc}
        imageUrl={post?.featuredImage?.node?.sourceUrl}
        url={post?.uri}
        focuskw={post?.seo?.focuskw}
      />
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
      {isDesktop ? (
        <SingleDesktopHeader
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          isGuidesNavShown={isGuidesNavShown}
          setIsGuidesNavShown={setIsGuidesNavShown}
          isScrolled={isScrolled}
        />
      ) : (
        <SecondaryHeader
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          isGuidesNavShown={isGuidesNavShown}
          setIsGuidesNavShown={setIsGuidesNavShown}
          isScrolled={isScrolled}
        />
      )}

      {/* Main content */}
      <Main className="relative top-[-0.75rem] sm:top-[-1rem]">
        <SingleFeaturedImage image={post?.featuredImage?.node} />
        <SingleEntryHeader
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
        <RelatedPosts
          tagIds={post?.tags?.edges?.map((edge) => edge.node.databaseId) || []}
          excludeIds={[post.databaseId]}
        />
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
      tags {
        edges {
          node {
            databaseId
            name
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

Component.variables = ({ databaseId }, ctx) => {
  return {
    databaseId,
    asPreview: ctx?.preview || false,
  }
}
export async function getStaticProps(ctx) {
  return getNextStaticProps(ctx, {
    Page: Component,
    props: {
      asPreview: ctx.preview || false,
    },
  })
}
