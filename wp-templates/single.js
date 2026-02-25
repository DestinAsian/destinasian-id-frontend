'use client'

import React, { useEffect, useState, useMemo } from 'react'
import { gql } from '@apollo/client'
import * as MENUS from '../constants/menus'
import { BlogInfoFragment } from '../fragments/GeneralSettings'
import { open_sans } from '../styles/fonts/fonts'
import { getNextStaticProps } from '@faustwp/core'
import { GetMenus } from '../queries/GetMenus'
import { GetLatestStories } from '../queries/GetLatestStories'

import { useSWRGraphQL } from '../lib/useSWRGraphQL'
import { GetSecondaryHeaders } from '../queries/GetSecondaryHeaders'
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
import SingleSlider from '../components/SingleSlider/SingleSlider'
import SingleHeader from '../components/SingleHeader/SingleHeader'
import RelatedPosts from '../components/RelatedPosts/RelatedPosts'
import { usePasswordProtection } from '../lib/usePasswordProtection'

import dynamic from 'next/dynamic'

const MastHeadBottom = dynamic(
  () => import('../components/AdUnit/MastHeadBottom/MastHeadBottom'),
  { ssr: false },
)
const MastHeadBottomMobile = dynamic(
  () =>
    import('../components/AdUnit/MastHeadBottomMobile/MastHeadBottomMobile'),
  { ssr: false },
)

export default function SinglePost(props) {
  if (props.loading) return <>Loading...</>

  const [searchQuery, setSearchQuery] = useState('')
  const [isScrolled, setIsScrolled] = useState(false)
  const [isNavShown, setIsNavShown] = useState(false)
  const [isGuidesNavShown, setIsGuidesNavShown] = useState(false)
  const [isDesktop, setIsDesktop] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  const post = props?.data?.post ?? {}
  const isPreview = props?.asPreview
  const categories = post?.categories?.edges ?? []

  /* ===============================
     SCROLL + DEVICE
  =============================== */
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth
      setIsDesktop(width >= 1024)
      setIsMobile(width < 1024)
    }
    const handleScroll = () => setIsScrolled(window.scrollY > 0)

    handleResize()
    handleScroll()
    window.addEventListener('resize', handleResize)
    window.addEventListener('scroll', handleScroll)
    return () => {
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  useEffect(() => {
    const shouldLock = searchQuery !== '' || isNavShown || isGuidesNavShown
    document.body.style.overflow = shouldLock ? 'hidden' : ''
  }, [searchQuery, isNavShown, isGuidesNavShown])

  const {
    enteredPassword,
    setEnteredPassword,
    isAuthenticated,
    isChecking,
    handlePasswordSubmit,
    errorMessage,
  } = usePasswordProtection({
    contentType: 'post',
    databaseId: post?.databaseId,
    enabled: post?.passwordProtected?.onOff,
  })

  const { data: menusData, isLoading: menusLoading } = useSWRGraphQL(
    'menus',
    GetMenus,
    {
      first: 10,
      headerLocation: MENUS.PRIMARY_LOCATION,
      secondHeaderLocation: MENUS.SECONDARY_LOCATION,
      thirdHeaderLocation: MENUS.THIRD_LOCATION,
      fourthHeaderLocation: MENUS.FOURTH_LOCATION,
      fifthHeaderLocation: MENUS.FIFTH_LOCATION,
    },
  )

  /* ===============================
     🔁 SWR — LATEST STORIES
  =============================== */
  const { data: latestStories } = useSWRGraphQL(
    'latest-stories',
    GetLatestStories,
    { first: 5 },
  )

  const allPosts = useMemo(() => {
    const posts = [
      ...(latestStories?.posts?.edges || []),
      ...(latestStories?.updates?.edges || []),
    ]
    return posts
      .map((e) => e.node)
      .sort((a, b) => new Date(b.date) - new Date(a.date))
  }, [latestStories])

  const images = useMemo(() => {
    const slider = post?.acfPostSlider
    return Array.from({ length: 5 }, (_, i) => {
      const index = i + 1
      return [
        slider?.[`slide${index}`]?.mediaItemUrl || null,
        slider?.[`slideCaption${index}`] || null,
      ]
    })
  }, [post])

  const { data: secondaryHeaderData, isLoading: secondaryHeaderLoading } =
    useSWRGraphQL('secondary-headers', GetSecondaryHeaders, {
      include: ['20', '29', '3'],
    })

  const secondaryCategories = useMemo(() => {
    return secondaryHeaderData?.categories?.edges ?? []
  }, [secondaryHeaderData])

  /* ===============================
     PASSWORD SUBMIT
  =============================== */
  if (post?.passwordProtected?.onOff && !isAuthenticated) {
    return (
      <main className={`${open_sans.variable} overflow-x-hidden`}>
        {isPreview && (
          <div className="bg-yellow-400 p-3 text-center font-semibold text-black">
            Preview Mode, Konten ini belum dipublikasikan
          </div>
        )}
        {isChecking ? (
          <>Loading...</>
        ) : (
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
            {errorMessage && (
              <p className="mt-2 text-center text-sm font-medium text-red-600">
                {errorMessage}
              </p>
            )}
          </form>
        )}
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
          categories={secondaryCategories}
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

      <Main className="relative top-[-0.75rem] sm:top-[-1rem]">
        {images.some((img) => img[0]) ? (
          <SingleSlider images={images} />
        ) : (
          <SingleFeaturedImage image={post?.featuredImage?.node} />
        )}

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
          tagIds={post?.tags?.edges?.map((e) => e.node.databaseId) || []}
          excludeIds={[post.databaseId]}
        />
      </Main>

      <Footer />
    </main>
  )
}

SinglePost.query = gql`
  ${BlogInfoFragment}
  query GetPost($databaseId: ID!, $asPreview: Boolean = false) {
    post(id: $databaseId, idType: DATABASE_ID, asPreview: $asPreview) {
      id
      title
      databaseId
      content
      date
      guides {
        guidesPost
      }
      passwordProtected {
        onOff
      }
      author {
        node {
          id
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
            id
            name
            uri
            parent {
              node {
                id
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
            id
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
      featuredImage {
        node {
          sourceUrl
          altText
        }
      }
    }
    generalSettings {
      ...BlogInfoFragment
    }
  }
`

SinglePost.variables = ({ databaseId }, ctx) => {
  return {
    databaseId,
    asPreview: ctx?.preview || false,
  }
}

export async function getStaticProps(ctx) {
  return getNextStaticProps(ctx, {
    Page: SinglePost,
    props: {
      asPreview: ctx.preview || false,
    },
  })
}
