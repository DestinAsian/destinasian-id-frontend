import React, { useEffect, useState, useMemo, useCallback } from 'react'
import { gql, useQuery } from '@apollo/client'
import * as MENUS from '../constants/menus'
import { BlogInfoFragment } from '../fragments/GeneralSettings'
import { eb_garamond, rubik_mono_one } from '../styles/fonts/fonts'

// Static imports: komponen utama
import FeaturedImage from '../components/FeaturedImage/FeaturedImage'
import Main from '../components/Main/Main'
import Footer from '../components/Footer/Footer'
import dynamic from 'next/dynamic'

const components = {
  CategoryDesktopSecondaryHeader: dynamic(() =>
    import(
      '../components/CategoryDesktopHeader/CategoryDesktopSecondaryHeader/CategoryDesktopSecondaryHeader'
    ),
  ),
  SecondaryDesktopHeader: dynamic(() =>
    import(
      '../components/Header/SecondaryDesktopHeader/SecondaryDesktopHeader'
    ),
  ),
  CategoryHeader: dynamic(() =>
    import('../components/CategoryHeader/CategoryHeader'),
  ),
  CategorySecondaryHeader: dynamic(() =>
    import(
      '../components/CategoryHeader/CategorySecondaryHeader/CategorySecondaryHeader'
    ),
  ),
  SecondaryHeader: dynamic(() =>
    import('../components/Header/SecondaryHeader/SecondaryHeader'),
  ),
  CategoryDesktopHeader: dynamic(() =>
    import('../components/CategoryDesktopHeader/CategoryDesktopHeader'),
  ),
  CategoryEntryHeader: dynamic(() =>
    import('../components/CategoryEntryHeader/CategoryEntryHeader'),
  ),
  CategoryStoriesLatest: dynamic(() =>
    import('../components/CategoryStoriesLatest/CategoryStoriesLatest'),
  ),
  GuideFitur: dynamic(() => import('../components/GuideFitur/GuideFitur')),
  CategorySecondStoriesLatest: dynamic(() =>
    import(
      '../components/CategorySecondStoriesLatest/CategorySecondStoriesLatest'
    ),
  ),
  GuideReelIg: dynamic(() => import('../components/GuideReelIg/GuideReelIg')),
  CategoryStories: dynamic(() =>
    import('../components/CategoryStories/CategoryStories'),
  ),
  BannerPosterGuide: dynamic(() =>
    import('../components/BannerPosterGuide/BannerPosterGuide'),
  ),
  MastHeadTop: dynamic(() =>
    import('../components/AdUnit/MastHeadTop/MastHeadTop'),
  ),
  MastHeadTopMobile: dynamic(() =>
    import('../components/AdUnit/MastHeadTopMobile/MastHeadTopMobile'),
  ),
  MastHeadBottom: dynamic(() =>
    import('../components/AdUnit/MastHeadBottom/MastHeadBottom'),
  ),
  MastHeadBottomMobile: dynamic(() =>
    import('../components/AdUnit/MastHeadBottomMobile/MastHeadBottomMobile'),
  ),
  MastHeadTopGuides: dynamic(() =>
    import('../components/AdUnit/MastHeadTop/MastHeadTopGuides'),
  ),
  MastHeadTopMobileGuides: dynamic(() =>
    import('../components/AdUnit/MastHeadTopMobile/MastHeadTopMobileGuides'),
  ),
  MastHeadBottomGuides: dynamic(() =>
    import('../components/AdUnit/MastHeadBottom/MastHeadBottomGuides'),
  ),
  MastHeadBottomMobileGuides: dynamic(() =>
    import(
      '../components/AdUnit/MastHeadBottomMobile/MastHeadBottomMobileGuides'
    ),
  ),
}
// Queries
import { GetMenus } from '../queries/GetMenus'
import { GetFooterMenus } from '../queries/GetFooterMenus'
import { GetLatestStories } from '../queries/GetLatestStories'
import { GetSecondaryHeader } from '../queries/GetSecondaryHeader'

export default function Category({ loading, data: initialData }) {
  const [searchQuery, setSearchQuery] = useState('')
  const [isScrolled, setIsScrolled] = useState(false)
  const [isNavShown, setIsNavShown] = useState(false)
  const [isGuidesNavShown, setIsGuidesNavShown] = useState(false)
  const [isDesktop, setIsDesktop] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const resizeHandler = () => {
      const width = window.innerWidth
      setIsDesktop(width >= 1024)
      setIsMobile(width <= 768)
    }
    resizeHandler()
    window.addEventListener('resize', resizeHandler)
    window.addEventListener('scroll', () => setIsScrolled(window.scrollY > 0))
    return () => {
      window.removeEventListener('resize', resizeHandler)
      window.removeEventListener('scroll', () =>
        setIsScrolled(window.scrollY > 0),
      )
    }
  }, [])

  useEffect(() => {
    document.body.style.overflow =
      searchQuery || isNavShown || isGuidesNavShown ? 'hidden' : 'visible'
  }, [searchQuery, isNavShown, isGuidesNavShown])

  const { generalSettings, category } = initialData || {}
  const {
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
  } = category || {}

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
    const posts = [
      ...(latestStories?.posts?.edges || []),
      ...(latestStories?.updates?.edges || []),
    ]
    return posts
      .map((e) => e.node)
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

  const sharedHeaderProps = useMemo(
    () => ({
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
    }),
    [
      menusData,
      latestPosts,
      searchQuery,
      isNavShown,
      isScrolled,
      isGuidesCategory,
    ],
  )

  const renderAdComponent = useCallback(
    (pos) => {
      const prefix = isGuidesCategory ? 'Guides' : ''
      const position = pos === 'top' ? 'Top' : 'Bottom'
      const Component =
        components[`MastHead${position}${isMobile ? 'Mobile' : ''}${prefix}`]
      return Component ? <Component /> : null
    },
    [isMobile, isGuidesCategory],
  )

  if (loading) return <>Loading...</>

  return (
    <main className={`${eb_garamond.variable} ${rubik_mono_one.variable}`}>
      {isDesktop ? (
        <>
          <components.CategoryDesktopHeader {...sharedHeaderProps} />
          {!isNavShown &&
            !loadingSecondaryHeader &&
            (isGuidesCategory ? (
              <components.CategoryDesktopSecondaryHeader
                data={dataSecondaryHeader}
                databaseId={databaseId}
                name={name}
                parent={parent?.node?.name}
              />
            ) : (
              <components.SecondaryDesktopHeader
                {...sharedHeaderProps}
                isGuidesNavShown={isGuidesNavShown}
                setIsGuidesNavShown={setIsGuidesNavShown}
              />
            ))}
        </>
      ) : (
        <>
          <components.CategoryHeader {...sharedHeaderProps} />
          {!loadingSecondaryHeader &&
            (isGuidesCategory ? (
              <components.CategorySecondaryHeader
                data={dataSecondaryHeader}
                databaseId={databaseId}
                name={name}
                parent={parent?.node?.name}
              />
            ) : (
              <components.SecondaryHeader
                {...sharedHeaderProps}
                isGuidesNavShown={isGuidesNavShown}
                setIsGuidesNavShown={setIsGuidesNavShown}
              />
            ))}
        </>
      )}

      <components.CategoryEntryHeader
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
        {isGuidesCategory && (
          <hr
            style={{
              border: 'none',
              borderTop: '1px solid black',
              margin: '2rem auto',
              maxWidth: '1400px',
            }}
          />
        )}
        {renderAdComponent('top')}
        <hr
          style={{
            border: 'none',
            borderTop: '1px solid black',
            padding: '0 0 2rem',
            maxWidth: '1400px',
            margin: '0 auto',
          }}
        />

        <components.CategoryStoriesLatest
          categoryUri={databaseId}
          pinPosts={pinPosts}
          name={name}
          children={children}
          parent={parent?.node?.name}
          guideStories={guideStorie}
        />
        {isGuidesCategory && guidesfitur && (
          <components.GuideFitur guidesfitur={guidesfitur} />
        )}
        <components.CategorySecondStoriesLatest
          categoryUri={databaseId}
          pinPosts={pinPosts}
          name={name}
          children={children}
          parent={parent?.node?.name}
          bannerDa={guideStorie}
          guideStories={guideStorie}
        />
        {guideReelIg && <components.GuideReelIg guideReelIg={guideReelIg} />}
        <components.CategoryStories
          categoryUri={databaseId}
          pinPosts={pinPosts}
          name={name}
          children={children}
          parent={parent?.node?.name}
        />
        <components.BannerPosterGuide guideStorie={guideStorie} />

        <hr
          style={{
            border: 'none',
            borderTop: '1px solid black',
            margin: '2rem auto',
            maxWidth: '1400px',
          }}
        />
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
