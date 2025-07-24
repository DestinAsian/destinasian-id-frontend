import React, { useEffect, useState, useMemo, useCallback } from 'react'
import { gql, useQuery } from '@apollo/client'
import * as MENUS from '../constants/menus'
import { BlogInfoFragment } from '../fragments/GeneralSettings'
import dynamic from 'next/dynamic'

import FeaturedImage from '../components/FeaturedImage/FeaturedImage'

// Dynamic Imports
const CategoryHeader = dynamic(() =>
  import('../components/CategoryHeader/CategoryHeader'),
)
const CategoryStories = dynamic(
  () => import('../components/CategoryStories/CategoryStories'),
  { ssr: false },
)
const CategoryStoriesGuide = dynamic(() =>
  import('../components/CategoryStoriesGuide/CategoryStoriesGuide'),
)
const CategoryEntryHeader = dynamic(() =>
  import('../components/CategoryEntryHeader/CategoryEntryHeader'),
)
const Footer = dynamic(() => import('../components/Footer/Footer'))
const Main = dynamic(() => import('../components/Main/Main'))
const GuideFitur = dynamic(() => import('../components/GuideFitur/GuideFitur'))
const GuideReelIg = dynamic(() =>
  import('../components/GuideReelIg/GuideReelIg'),
)
const BannerPosterGuide = dynamic(() =>
  import('../components/BannerPosterGuide/BannerPosterGuide'),
)
const CategoryStoriesLatest = dynamic(() =>
  import('../components/CategoryStoriesLatest/CategoryStoriesLatest'),
)
const CategorySecondStoriesLatest = dynamic(() =>
  import(
    '../components/CategorySecondStoriesLatest/CategorySecondStoriesLatest'
  ),
)
const CategoryDesktopHeader = dynamic(() =>
  import('../components/CategoryDesktopHeader/CategoryDesktopHeader'),
)
const CategoryDesktopSecondaryHeader = dynamic(() =>
  import(
    '../components/CategoryDesktopHeader/CategoryDesktopSecondaryHeader/CategoryDesktopSecondaryHeader'
  ),
)
const SecondaryHeader = dynamic(() =>
  import('../components/Header/SecondaryHeader/SecondaryHeader'),
)
const CategorySecondaryHeader = dynamic(() =>
  import(
    '../components/CategoryHeader/CategorySecondaryHeader/CategorySecondaryHeader'
  ),
)
const SecondaryDesktopHeader = dynamic(() =>
  import('../components/Header/SecondaryDesktopHeader/SecondaryDesktopHeader'),
)

const PreviewMastHeadTop = dynamic(() =>
  import('../components/AdUnit/Preview/PreviewMastHeadTop/PreviewMastHeadTop'),
)
const PreviewMastHeadTopMobile = dynamic(() =>
  import(
    '../components/AdUnit/Preview/PreviewMastHeadTopMobile/PreviewMastHeadTopMobile'
  ),
)
const PreviewMastHeadBottom = dynamic(() =>
  import(
    '../components/AdUnit/Preview/PreviewMastHeadBottom/PreviewMastHeadBottom'
  ),
)
const PreviewMastHeadBottomMobile = dynamic(() =>
  import(
    '../components/AdUnit/Preview/PreviewMastHeadBottomMobile/PreviewMastHeadBottomMobile'
  ),
)
const PreviewMastHeadTopGuides = dynamic(() =>
  import(
    '../components/AdUnit/Preview/PreviewMastHeadTop/PreviewMastHeadTopGuides'
  ),
)
const PreviewMastHeadTopMobileGuides = dynamic(() =>
  import(
    '../components/AdUnit/Preview/PreviewMastHeadTopMobile/PreviewMastHeadTopMobileGuides'
  ),
)
const PreviewMastHeadBottomGuides = dynamic(() =>
  import(
    '../components/AdUnit/Preview/PreviewMastHeadBottom/PreviewMastHeadBottomGuides'
  ),
)
const PreviewMastHeadBottomMobileGuides = dynamic(() =>
  import(
    '../components/AdUnit/Preview/PreviewMastHeadBottomMobile/PreviewMastHeadBottomMobileGuides'
  ),
)

const MastHeadTop = dynamic(() =>
  import('../components/AdUnit/MastHeadTop/MastHeadTop'),
)

import { GetMenus } from '../queries/GetMenus'
import { GetFooterMenus } from '../queries/GetFooterMenus'
import { GetLatestStories } from '../queries/GetLatestStories'
import { GetSecondaryHeader } from '../queries/GetSecondaryHeader'
import { eb_garamond, rubik_mono_one } from '../styles/fonts/fonts'

export default function Category({ loading, data: initialData }) {
  if (loading) return <>Loading...</>

  const {
    generalSettings,
    category: {
      name,
      description,
      children,
      parent,
      pinPosts,
      categoryImages,
      destinationGuides,
      databaseId,
      guideStorie,
      guideReelIg,
      guidesfitur,
    },
  } = initialData || {}

  const [searchQuery, setSearchQuery] = useState('')
  const [isScrolled, setIsScrolled] = useState(false)
  const [isNavShown, setIsNavShown] = useState(false)
  const [isGuidesNavShown, setIsGuidesNavShown] = useState(false)
  const [isDesktop, setIsDesktop] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    setIsMobile(window.innerWidth <= 768)
    const handleResize = () => setIsMobile(window.innerWidth <= 768)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const handleResize = useCallback(
    () => setIsDesktop(window.innerWidth >= 1024),
    [],
  )
  const handleScroll = useCallback(() => setIsScrolled(window.scrollY > 0), [])

  useEffect(() => {
    handleResize()
    window.addEventListener('resize', handleResize)
    window.addEventListener('scroll', handleScroll)
    return () => {
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('scroll', handleScroll)
    }
  }, [handleResize, handleScroll])

  useEffect(() => {
    document.body.style.overflow =
      searchQuery || isNavShown || isGuidesNavShown ? 'hidden' : 'visible'
  }, [searchQuery, isNavShown, isGuidesNavShown])

  // const renderMastheadTopAd = () => {
  //   if (isGuidesCategory) {
  //     return isMobile ? <PreviewMastHeadTopMobileGuides /> : <PreviewMastHeadTopGuides />
  //   } else {
  //     return isMobile ? <PreviewMastHeadTopMobile /> : <PreviewMastHeadTop />
  //   }
  // }

  // const renderMastheadBottomAd = () => {
  //   if (isGuidesCategory) {
  //     return isMobile ? <PreviewMastHeadBottomMobileGuides /> : <PreviewMastHeadBottomGuides />
  //   } else {
  //     return isMobile ? <PreviewMastHeadBottomMobile /> : <PreviewMastHeadBottom />
  //   }
  // }

  // Fetch queries
  const { data: menusData } = useQuery(GetMenus, {
    variables: {
      first: 20,
      headerLocation: MENUS.PRIMARY_LOCATION,
      secondHeaderLocation: MENUS.SECONDARY_LOCATION,
      thirdHeaderLocation: MENUS.THIRD_LOCATION,
      fourthHeaderLocation: MENUS.FOURTH_LOCATION,
      fifthHeaderLocation: MENUS.FIFTH_LOCATION,
      featureHeaderLocation: MENUS.FEATURE_LOCATION,
    },
    fetchPolicy: 'cache-first',
  })

  const { data: footerMenusData } = useQuery(GetFooterMenus, {
    variables: { first: 100, footerHeaderLocation: MENUS.FOOTER_LOCATION },
    fetchPolicy: 'cache-first',
  })

  const { data: latestStories } = useQuery(GetLatestStories, {
    variables: { first: 5 },
    fetchPolicy: 'cache-first',
  })

  const { data: dataSecondaryHeader, loading: loadingSecondaryHeader } =
    useQuery(GetSecondaryHeader, {
      variables: { id: databaseId },
      fetchPolicy: 'network-only',
      nextFetchPolicy: 'cache-and-network',
    })

  const isGuidesCategory =
    dataSecondaryHeader?.category?.destinationGuides?.destinationGuides ===
    'yes'

  const latestPosts = useMemo(() => {
    const posts = latestStories?.posts?.edges || []
    const updates = latestStories?.updates?.edges || []
    return [...posts, ...updates]
      .map((edge) => edge.node)
      .sort((a, b) => new Date(b.date) - new Date(a.date))
  }, [latestStories])

  const categorySlider = useMemo(
    () =>
      [1, 2, 3, 4, 5].map((i) => [
        categoryImages?.[`categorySlide${i}`]?.mediaItemUrl || null,
        categoryImages?.[`categorySlideCaption${i}`] || null,
      ]),
    [categoryImages],
  )

  const categoryComponentProps = {
    parent: parent?.node?.name,
    children: children?.edges,
    title: name,
    destinationGuides: destinationGuides?.destinationGuides,
    changeToSlider: categoryImages?.changeToSlider,
    guidesTitle: destinationGuides?.guidesTitle,
    categorySlider,
    image: categoryImages?.categoryImages?.mediaItemUrl,
    imageCaption: categoryImages?.categoryImagesCaption,
    description,
  }

  const sharedHeaderProps = {
    title: generalSettings?.title,
    description: generalSettings?.description,
    primaryMenuItems: menusData?.headerMenuItems?.nodes ?? [],
    secondaryMenuItems: menusData?.secondHeaderMenuItems?.nodes ?? [],
    thirdMenuItems: menusData?.thirdHeaderMenuItems?.nodes ?? [],
    fourthMenuItems: menusData?.fourthHeaderMenuItems?.nodes ?? [],
    fifthMenuItems: menusData?.fifthHeaderMenuItems?.nodes ?? [],
    featureMenuItems: menusData?.featureHeaderMenuItems?.nodes ?? [],
    latestStories: latestPosts,
    searchQuery,
    setSearchQuery,
    isNavShown,
    setIsNavShown,
    isScrolled,
    isGuidesCategory,
  }

  const renderAdComponent = (position) => {
    const isTop = position === 'top'
    if (isGuidesCategory) {
      if (isMobile)
        return isTop ? (
          <PreviewMastHeadTopMobileGuides />
        ) : (
          <PreviewMastHeadBottomMobileGuides />
        )
      return isTop ? (
        <PreviewMastHeadTopGuides />
      ) : (
        <PreviewMastHeadBottomGuides />
      )
    } else {
      if (isMobile)
        return isTop ? (
          <PreviewMastHeadTopMobile />
        ) : (
          <PreviewMastHeadBottomMobile />
        )
      return isTop ? <PreviewMastHeadTop /> : <PreviewMastHeadBottom />
    }
  }
  return (
    <main className={`${eb_garamond.variable} ${rubik_mono_one.variable}`}>
      {isDesktop ? (
        <>
          <CategoryDesktopHeader {...sharedHeaderProps} />
          {!isNavShown &&
            !loadingSecondaryHeader &&
            (isGuidesCategory ? (
              <CategoryDesktopSecondaryHeader
                data={dataSecondaryHeader}
                databaseId={databaseId}
                name={name}
                parent={parent?.node?.name}
              />
            ) : (
              <SecondaryDesktopHeader
                {...sharedHeaderProps}
                isGuidesNavShown={isGuidesNavShown}
                setIsGuidesNavShown={setIsGuidesNavShown}
              />
            ))}
        </>
      ) : (
        <>
          <CategoryHeader {...sharedHeaderProps} />
          {!loadingSecondaryHeader &&
            (isGuidesCategory ? (
              <CategorySecondaryHeader
                data={dataSecondaryHeader}
                databaseId={databaseId}
                name={name}
                parent={parent?.node?.name}
              />
            ) : (
              <SecondaryHeader
                {...sharedHeaderProps}
                isGuidesNavShown={isGuidesNavShown}
                setIsGuidesNavShown={setIsGuidesNavShown}
              />
            ))}
        </>
      )}

      <CategoryEntryHeader {...categoryComponentProps} />

      <Main>
        {isGuidesCategory && (
          <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
            <hr
              style={{
                border: 'none',
                borderTop: '1px solid black',
                margin: '2rem 0',
              }}
            />
          </div>
        )}
        {renderAdComponent('top')}
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          <hr
            style={{
              border: 'none',
              borderTop: '1px solid black',
              margin: '0',
            }}
          />
        </div>
        <CategoryStoriesLatest
          categoryUri={databaseId}
          pinPosts={pinPosts}
          name={name}
          children={children}
          parent={parent?.node?.name}
          guideStories={guideStorie}
        />
        {isGuidesCategory && (
          <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
            <hr
              style={{
                border: 'none',
                borderTop: '1px solid black',
                margin: '0',
              }}
            />
          </div>
        )}
        {isGuidesCategory && guidesfitur && (
          <GuideFitur guidesfitur={guidesfitur} />
        )}
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
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          <hr
            style={{
              border: 'none',
              borderTop: '1px solid black',
              margin: '2rem 0',
            }}
          />
        </div>

        {renderAdComponent('bottom')}
      </Main>

      <Footer
        footerMenu={footerMenusData?.footerHeaderMenuItems?.nodes ?? []}
      />
    </main>
  )
}

Category.query = gql`
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

Category.variables = ({ databaseId }) => {
  return {
    databaseId,
  }
}
