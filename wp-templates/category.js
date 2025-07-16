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
const CategoryStoriesLatest = dynamic(() =>
  import('../components/CategoryStoriesLatest/CategoryStoriesLatest'),
)
const CategorySecondStoriesLatest = dynamic(() =>
  import(
    '../components/CategorySecondStoriesLatest/CategorySecondStoriesLatest'
  ),
)
const CategoryEntryHeader = dynamic(() =>
  import('../components/CategoryEntryHeader/CategoryEntryHeader'),
)
const CategorySecondaryHeader = dynamic(() =>
  import(
    '../components/CategoryHeader/CategorySecondaryHeader/CategorySecondaryHeader'
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
const SecondaryDesktopHeader = dynamic(() =>
  import('../components/Header/SecondaryDesktopHeader/SecondaryDesktopHeader'),
)
const GuideFitur = dynamic(() => import('../components/GuideFitur/GuideFitur'))
const GuideReelIg = dynamic(() =>
  import('../components/GuideReelIg/GuideReelIg'),
)
const BannerPosterGuide = dynamic(() =>
  import('../components/BannerPosterGuide/BannerPosterGuide'),
)
const Main = dynamic(() => import('../components/Main/Main'))
const Footer = dynamic(() => import('../components/Footer/Footer'))

export default function Component(props) {
  // Loading state for previews
  if (props.loading) {
    return <>Loading...</>
  }
  const { title: siteTitle, description: siteDescription } =
    props?.data?.generalSettings

  const {
    name,
    description,
    children,
    parent,
    pinPosts,
    categoryImages,
    destinationGuides,
    databaseId,
    seo,
    uri,
    travelGuide,
  } = props?.data?.category ?? {}

  const [searchQuery, setSearchQuery] = useState('')
  const [isScrolled, setIsScrolled] = useState(false)
  const [isNavShown, setIsNavShown] = useState(false)
  const [isGuidesNavShown, setIsGuidesNavShown] = useState(false)
  const [isDesktop, setIsDesktop] = useState(false)

  // Cek ukuran layar (desktop)
  useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth >= 1024)
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Sticky scroll
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 0)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Control overflow (scroll lock)
  useEffect(() => {
    const isLocked = searchQuery || isNavShown || isGuidesNavShown
    document.body.style.overflow = isLocked ? 'hidden' : 'visible'
  }, [searchQuery, isNavShown, isGuidesNavShown])

  // Get data kategori (secondary header)
  const { data, loading } = useQuery(GetSecondaryHeader, {
    variables: { id: databaseId },
    fetchPolicy: 'network-only',
    nextFetchPolicy: 'cache-and-network',
  })

  // Deteksi apakah kategori adalah travel guides
  const isGuidesCategory =
    data?.category?.destinationGuides?.destinationGuides === 'yes'

  // Get menu header
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

  // Get footer menu
  const { data: footerMenusData } = useQuery(GetFooterMenus, {
    variables: { first: 100, footerHeaderLocation: MENUS.FOOTER_LOCATION },
    fetchPolicy: 'network-only',
    nextFetchPolicy: 'cache-and-network',
  })

  const footerMenu = footerMenusData?.footerHeaderMenuItems?.nodes ?? []

  // Get latest travel stories
  const { data: latestStories, loading: latestLoading } = useQuery(
    GetLatestStories,
    {
      variables: { first: 5 },
      fetchPolicy: 'network-only',
      nextFetchPolicy: 'cache-and-network',
    },
  )

  // Gabungkan dan urutkan post terbaru
  const latestAllPosts = useMemo(() => {
    const posts = [
      ...(latestStories?.posts?.edges || []),
      ...(latestStories?.updates?.edges || []),
    ].map((edge) => edge.node)

    return posts.sort((a, b) => new Date(b.date) - new Date(a.date))
  }, [latestStories])

  // Category Slider
  const categorySlider = useMemo(() => {
    return [1, 2, 3, 4, 5].map((i) => [
      categoryImages?.[`categorySlide${i}`]?.mediaItemUrl ?? null,
      categoryImages?.[`categorySlideCaption${i}`] ?? null,
    ])
  }, [categoryImages])

  const category = data?.category

  const guideStories = category?.guideStorie

  if (loading) {
    return (
      <>
        <div className="mx-auto my-0 flex max-w-[100vw] justify-center md:max-w-[700px]	">
          {/* <Button className="gap-x-4	">{'Loading...'}</Button> */}
        </div>
      </>
    )
  }
  return (
    <main className={`${eb_garamond.variable} ${rubik_mono_one.variable}`}>
      <>
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
            />
            {!isNavShown &&
              (isGuidesCategory ? (
                <CategoryDesktopSecondaryHeader
                  data={data}
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
              ))}

            {/* EntryHeader category name */}
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
                data={data}
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

            {/* EntryHeader category name */}
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
          </>
        )}
      </>
      <Main>
        <>
          <CategoryStoriesLatest
            categoryUri={databaseId}
            pinPosts={pinPosts}
            name={name}
            children={children}
            parent={parent?.node?.name}
            guideStories={data.category.guideStorie}
          />
          {isGuidesCategory && props?.data?.category?.guidesfitur && (
            <GuideFitur guidesfitur={props?.data?.category?.guidesfitur} />
          )}
          <CategorySecondStoriesLatest
            categoryUri={databaseId}
            pinPosts={pinPosts}
            name={name}
            children={children}
            parent={parent?.node?.name}
            guideStories={data.category.guideStorie}
            bannerDa={props.data.category.guideStorie}
            // guide_book_now={travelGuide?.guide_book_now.acf}
          />
          {/* {props?.data?.category?.guideStorie && (
            <GuideStories guideStories={props.data.category.guideStorie} />
          )} */}
          {props?.data?.category?.guideReelIg && (
            <GuideReelIg guideReelIg={props.data.category.guideReelIg} />
          )}
          {/* {props?.data?.category?.guideStorie && (
            <BannerFokusDA bannerDa={props.data.category.guideStorie} />
          )} */}
          {/* <CategoryStoriesGuide
            categoryUri={databaseId}
            pinPosts={pinPosts}
            name={name}
            children={children}
            parent={parent?.node?.name}
            guideStories={data.category.guideStorie}
          /> */}

          <CategoryStories
            categoryUri={databaseId}
            pinPosts={pinPosts}
            name={name}
            children={children}
            parent={parent?.node?.name}
          />
          {/* <BannerPosterGuide
            guideReelIg={props.data.category.guideReelIg}
            bannerDa={props.data.category.guideStorie}
          /> */}
          <BannerPosterGuide guideStorie={props.data.category.guideStorie} />
        </>
      </Main>
      <Footer footerMenu={footerMenu} />
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
