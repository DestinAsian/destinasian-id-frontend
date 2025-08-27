import React, { useState, useEffect } from 'react';
import { gql, useQuery } from '@apollo/client';
import * as MENUS from '../constants/menus';
import { BlogInfoFragment } from '../fragments/GeneralSettings';
import Main from '../components/Main/Main';
import Container from '../components/Container/Container';
import SEO from '../components/SEO/SEO';
import EntryHeader from '../components/EntryHeader/EntryHeader';
import ContentWrapperContestFrontPage from '../components/ContentWrapperContest/ContentWrapperContestFrontPage';
import Header from '../components/Header/Header';
import SecondaryHeader from '../components/Header/SecondaryHeader/SecondaryHeader';
import FeaturedImage from '../components/FeaturedImage/FeaturedImage';
import { GetMenus } from '../queries/GetMenus';
import { GetLatestStories } from '../queries/GetLatestStories';

export default function Component(props) {
  if (props.loading) {
    return <>Loading...</>;
  }

  const { title: siteTitle, description: siteDescription } = props?.data?.generalSettings;
  const { title, featuredImage, seo, uri } = props?.data?.page ?? {};

  const [searchQuery, setSearchQuery] = useState('');
  const [isScrolled, setIsScrolled] = useState(false);
  const [isNavShown, setIsNavShown] = useState(false);
  const [isGuidesNavShown, setIsGuidesNavShown] = useState(false);

  useEffect(() => {
    document.body.style.overflow = searchQuery ? 'hidden' : 'visible';
  }, [searchQuery]);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 0);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isNavShown ? 'hidden' : 'visible';
  }, [isNavShown]);

  // Get menus
  const { data: menusData, loading: menusLoading } = useQuery(GetMenus, {
    variables: {
      first: 20,
      headerLocation: MENUS.PRIMARY_LOCATION,
      secondHeaderLocation: MENUS.SECONDARY_LOCATION,
      thirdHeaderLocation: MENUS.THIRD_LOCATION,
      fourthHeaderLocation: MENUS.FOURTH_LOCATION,
      fifthHeaderLocation: MENUS.FIFTH_LOCATION,
      // featureHeaderLocation: MENUS.FEATURE_LOCATION,
    },
    fetchPolicy: 'network-only',
    nextFetchPolicy: 'cache-and-network',
  });

  const primaryMenu = menusData?.headerMenuItems?.nodes ?? [];
  const secondaryMenu = menusData?.secondHeaderMenuItems?.nodes ?? [];
  const thirdMenu = menusData?.thirdHeaderMenuItems?.nodes ?? [];
  const fourthMenu = menusData?.fourthHeaderMenuItems?.nodes ?? [];
  const fifthMenu = menusData?.fifthHeaderMenuItems?.nodes ?? [];
  const featureMenu = menusData?.featureHeaderMenuItems?.nodes ?? [];

  // Get latest stories
  const { data: latestStories, loading: latestLoading } = useQuery(GetLatestStories, {
    variables: { first: 5 },
    fetchPolicy: 'network-only',
    nextFetchPolicy: 'cache-and-network',
  });

  const posts = latestStories?.posts?.edges?.map(edge => edge.node) ?? [];
  const editorials = latestStories?.editorials?.edges?.map(edge => edge.node) ?? [];
  const updates = latestStories?.updates?.edges?.map(edge => edge.node) ?? [];

  const allPosts = [...posts, ...editorials, ...updates].sort(
    (a, b) => new Date(b.date) - new Date(a.date)
  );

  return (
    <main>
      <SEO
        title={seo?.title}
        description={seo?.metaDesc}
        imageUrl={featuredImage?.node?.sourceUrl}
        url={uri}
        focuskw={seo?.focuskw}
      />

      <Header
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

      <Main>
        <Container>
          <EntryHeader contestTitle={title} />
          <ContentWrapperContestFrontPage />
        </Container>
      </Main>
    </main>
  );
}

Component.query = gql`
  ${BlogInfoFragment}
  ${FeaturedImage.fragments.entry}
  query GetPageData($databaseId: ID = "147", $asPreview: Boolean = false) {
    page(id: $databaseId, idType: DATABASE_ID, asPreview: $asPreview) {
      title
      ...FeaturedImageFragment
      seo {
        title
        metaDesc
        focuskw
      }
      uri
    }
    generalSettings {
      ...BlogInfoFragment
    }
  }
`;

Component.variables = ({ databaseId }, ctx) => ({
  databaseId,
  asPreview: ctx?.asPreview,
});
