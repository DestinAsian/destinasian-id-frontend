import React, { useEffect, useState, useMemo, useCallback } from 'react'
import { gql, useQuery } from '@apollo/client'
import dynamic from 'next/dynamic'
import * as MENUS from '../constants/menus'
import { BlogInfoFragment } from '../fragments/GeneralSettings'
import FeaturedImage from '../components/FeaturedImage/FeaturedImage'
import { GetMenus } from '../queries/GetMenus'
import { GetFooterMenus } from '../queries/GetFooterMenus'
import { GetLatestStories } from '../queries/GetLatestStories'
import { GetSecondaryHeader } from '../queries/GetSecondaryHeader'
import { eb_garamond, rubik_mono_one } from '../styles/fonts/fonts'

// Dynamic imports
const CategoryHeader = dynamic(() => import('../components/CategoryHeader/CategoryHeader'))
const CategoryStories = dynamic(() => import('../components/CategoryStories/CategoryStories'), { ssr: false })
const CategoryStoriesGuide = dynamic(() => import('../components/CategoryStoriesGuide/CategoryStoriesGuide'))
const CategoryStoriesLatest = dynamic(() => import('../components/CategoryStoriesLatest/CategoryStoriesLatest'))
const CategorySecondStoriesLatest = dynamic(() => import('../components/CategorySecondStoriesLatest/CategorySecondStoriesLatest'))
const CategoryEntryHeader = dynamic(() => import('../components/CategoryEntryHeader/CategoryEntryHeader'))
const CategorySecondaryHeader = dynamic(() => import('../components/CategoryHeader/CategorySecondaryHeader/CategorySecondaryHeader'))
const CategoryDesktopHeader = dynamic(() => import('../components/CategoryDesktopHeader/CategoryDesktopHeader'))
const CategoryDesktopSecondaryHeader = dynamic(() => import('../components/CategoryDesktopHeader/CategoryDesktopSecondaryHeader/CategoryDesktopSecondaryHeader'))
const SecondaryHeader = dynamic(() => import('../components/Header/SecondaryHeader/SecondaryHeader'))
const SecondaryDesktopHeader = dynamic(() => import('../components/Header/SecondaryDesktopHeader/SecondaryDesktopHeader'))
const GuideFitur = dynamic(() => import('../components/GuideFitur/GuideFitur'))
const GuideReelIg = dynamic(() => import('../components/GuideReelIg/GuideReelIg'))
const BannerPosterGuide = dynamic(() => import('../components/BannerPosterGuide/BannerPosterGuide'))
const Main = dynamic(() => import('../components/Main/Main'))
const Footer = dynamic(() => import('../components/Footer/Footer'))

export default function Component({ loading, data: initialData }) {
  if (loading) return <>Loading...</>

  const {
    generalSettings: { title: siteTitle, description: siteDescription },
    category: {
      name,
      description,
      children,
      parent,
      pinPosts,
      categoryImages,
      destinationGuides,
      databaseId,
      guidesfitur,
      guideReelIg,
      guideStorie,
    },
  } = initialData

  const [searchQuery, setSearchQuery] = useState('')
  const [isScrolled, setIsScrolled] = useState(false)
  const [isNavShown, setIsNavShown] = useState(false)
  const [isGuidesNavShown, setIsGuidesNavShown] = useState(false)
  const [isDesktop, setIsDesktop] = useState(false)

  // Scroll and resize listeners
  const handleScroll = useCallback(() => {
    setIsScrolled(window.scrollY > 0)
  }, [])

  const handleResize = useCallback(() => {
    setIsDesktop(window.innerWidth >= 1024)
  }, [])

  useEffect(() => {
    handleResize()
    window.addEventListener('resize', handleResize)
    window.addEventListener('scroll', handleScroll)
    return () => {
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('scroll', handleScroll)
    }
  }, [handleResize, handleScroll])

  // Handle body overflow
  useEffect(() => {
    document.body.style.overflow =
      searchQuery || isNavShown || isGuidesNavShown ? 'hidden' : 'visible'
  }, [searchQuery, isNavShown, isGuidesNavShown])

  const { data: secondaryData } = useQuery(GetSecondaryHeader, {
    variables: { id: databaseId },
    fetchPolicy: 'network-only',
  })

  const isGuidesCategory =
    secondaryData?.category?.destinationGuides?.destinationGuides === 'yes'

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
  })

  const { data: footerMenusData } = useQuery(GetFooterMenus, {
    variables: { first: 100, footerHeaderLocation: MENUS.FOOTER_LOCATION },
  })

  const { data: latestStories, loading: latestLoading } = useQuery(GetLatestStories, {
    variables: { first: 5 },
  })

  const latestAllPosts = useMemo(() => {
    const posts = [
      ...(latestStories?.posts?.edges || []),
      ...(latestStories?.updates?.edges || []),
    ].map(edge => edge.node)

    return posts.sort((a, b) => new Date(b.date) - new Date(a.date))
  }, [latestStories])

  const categorySlider = useMemo(() => {
    return [1, 2, 3, 4, 5].map(i => [
      categoryImages?.[`categorySlide${i}`]?.mediaItemUrl ?? null,
      categoryImages?.[`categorySlideCaption${i}`] ?? null,
    ])
  }, [categoryImages])

  return (
    <main className={`${eb_garamond.variable} ${rubik_mono_one.variable}`}>
      {isDesktop ? (
        <>
          <CategoryDesktopHeader
            title={siteTitle}
            description={siteDescription}
            primaryMenuItems={menusData?.headerMenuItems?.nodes ?? []}
            secondaryMenuItems={menusData?.secondHeaderMenuItems?.nodes ?? []}
            thirdMenuItems={menusData?.thirdHeaderMenuItems?.nodes ?? []}
            fourthMenuItems={menusData?.fourthHeaderMenuItems?.nodes ?? []}
            fifthMenuItems={menusData?.fifthHeaderMenuItems?.nodes ?? []}
            featureMenuItems={menusData?.featureHeaderMenuItems?.nodes ?? []}
            latestStories={latestAllPosts}
            menusLoading={menusLoading}
            latestLoading={latestLoading}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            isNavShown={isNavShown}
            setIsNavShown={setIsNavShown}
            isScrolled={isScrolled}
            isGuidesCategory={isGuidesCategory}
          />
          {!isNavShown && (
            isGuidesCategory ? (
              <CategoryDesktopSecondaryHeader
                data={secondaryData}
                databaseId={databaseId}
                name={name}
                parent={parent?.node?.name}
              />
            ) : (
              <SecondaryDesktopHeader
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                isGuidesNavShown={isGuidesNavShown}
                setIsGuidesNavShown={setIsGuidesNavShown}
                isScrolled={isScrolled}
              />
            )
          )}
        </>
      ) : (
        <>
          <CategoryHeader
            title={siteTitle}
            description={siteDescription}
            primaryMenuItems={menusData?.headerMenuItems?.nodes ?? []}
            secondaryMenuItems={menusData?.secondHeaderMenuItems?.nodes ?? []}
            thirdMenuItems={menusData?.thirdHeaderMenuItems?.nodes ?? []}
            fourthMenuItems={menusData?.fourthHeaderMenuItems?.nodes ?? []}
            fifthMenuItems={menusData?.fifthHeaderMenuItems?.nodes ?? []}
            featureMenuItems={menusData?.featureHeaderMenuItems?.nodes ?? []}
            latestStories={latestAllPosts}
            menusLoading={menusLoading}
            latestLoading={latestLoading}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            isNavShown={isNavShown}
            setIsNavShown={setIsNavShown}
            isScrolled={isScrolled}
          />
          {isGuidesCategory ? (
            <CategorySecondaryHeader
              data={secondaryData}
              databaseId={databaseId}
              name={name}
              parent={parent?.node?.name}
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
        </>
      )}

      <CategoryEntryHeader
        parent={parent?.node?.name}
        children={children?.edges}
        title={name}
        destinationGuides={destinationGuides?.destinationGuides}
        changeToSlider={categoryImages?.changeToSlider}
        guidesTitle={destinationGuides?.guidesTitle}
        categorySlider={categorySlider}
        image={categoryImages?.categoryImages?.mediaItemUrl}
        imageCaption={categoryImages?.categoryImagesCaption}
        description={description}
      />

      <Main>
        <CategoryStoriesLatest
          categoryUri={databaseId}
          pinPosts={pinPosts}
          name={name}
          children={children}
          parent={parent?.node?.name}
          guideStories={guideStorie}
        />
        {isGuidesCategory && guidesfitur && <GuideFitur guidesfitur={guidesfitur} />}
        <CategorySecondStoriesLatest
          categoryUri={databaseId}
          pinPosts={pinPosts}
          name={name}
          children={children}
          parent={parent?.node?.name}
          guideStories={guideStorie}
          bannerDa={guideStorie}
        />
        {guideReelIg && <GuideReelIg guideReelIg={guideReelIg} />}
        <CategoryStories
          categoryUri={databaseId}
          pinPosts={pinPosts}
          name={name}
          children={children}
          parent={parent?.node?.name}
        />
        <BannerPosterGuide guideStorie={guideStorie} />
      </Main>

      <Footer footerMenu={footerMenusData?.footerHeaderMenuItems?.nodes ?? []} />
    </main>
  )
}


Component.query = gql`
  ${BlogInfoFragment}
  ${FeaturedImage.fragments.entry}
  query GetCategoryPage($databaseId: ID!) {
    category(id: $databaseId, idType: DATABASE_ID) {
      name
      description
      databaseId
      uri
      seo {
        title
        metaDesc
        focuskw
      }
      categoryImages {
        changeToSlider
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
        categoryImages {
          mediaItemUrl
        }
        categorySlideCaption1
        categorySlideCaption2
        categorySlideCaption3
        categorySlideCaption4
        categorySlideCaption5
        categoryImagesCaption
      }
      destinationGuides {
        destinationGuides
        guidesTitle
      }
      guidesfitur {
        linkUrlGuideFitur1
        linkUrlGuideFitur2
        linkUrlGuideFitur3
        linkUrlGuideFitur4
        titleGuideFitur1
        titleGuideFitur2
        titleGuideFitur3
        titleGuideFitur4
        featureImageGuideFitur1 {
          mediaItemUrl
        }
        featureImageGuideFitur2 {
          mediaItemUrl
        }
        featureImageGuideFitur3 {
          mediaItemUrl
        }
        featureImageGuideFitur4 {
          mediaItemUrl
        }
      }
      guideReelIg {
        titleReelIg
        contentReelIg
        reelGuideIg1
        reelGuideIg2
        videoReelIg1
        bannerReelIg2 {
          mediaItemUrl
        }
        linkUrlBannerReelIg2
      }
      guideStorie {
        bannerFokusHubDa {
          mediaItemUrl
        }
        bannerGuideStories {
          mediaItemUrl
        }
        fieldGroupName
        linkBannerFokusHubDa
        linkBannerGuideStories
        linkBannerLandscape
        bannerLandscape {
          mediaItemUrl
        }
      }
      pinPosts {
        pinPost {
          ... on Post {
            id
            title
            content
            date
            uri
            excerpt
            ...FeaturedImageFragment
            author {
              node {
                name
              }
            }
            categories(first: 1000, where: { childless: true }) {
              edges {
                node {
                  name
                  uri
                  parent {
                    node {
                      name
                    }
                  }
                }
              }
            }
          }
        }
      }
      parent {
        node {
          name
          uri
          children(first: 1000, where: { childless: true }) {
            edges {
              node {
                name
                uri
              }
            }
          }
          countryCode {
            countryCode
          }
          destinationGuides {
            destinationGuides
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
    generalSettings {
      ...BlogInfoFragment
    }
  }
`

Component.variables = ({ databaseId }) => {
  return {
    databaseId,
  }
}
