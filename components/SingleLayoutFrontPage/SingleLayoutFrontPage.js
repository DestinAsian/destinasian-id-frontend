import React from "react";
import dynamic from "next/dynamic";

// Import layout dinamis
const GuideLayoutPost = dynamic(() => import("../../components/GuideLayoutPost/GuideLayoutPost"));
const EditorialLayoutPost = dynamic(() => import("../../components/EditorialLayoutPost/EditorialLayoutPost"));

const SingleLayoutFrontPage = ({
  data,
  databaseId,
  title,
  content,
  categories,
  author,
  date,
  images,
  featuredImage,
  searchQuery,
  setSearchQuery,
  isGuidesNavShown,
  setIsGuidesNavShown,
  isScrolled,
  shuffledRelatedStories,
}) => {
  // Ambil kategori utama (pertama) jika ada
  const mainCategory = categories?.[0]?.node;
  const isGuidesCategory = mainCategory?.destinationGuides?.destinationGuides === "yes";

  // Gunakan conditional return di luar JSX expression
  if (isGuidesCategory) {
    return (
      <GuideLayoutPost
        data={data}
        databaseId={databaseId}
        title={title}
        content={content}
        categories={categories}
        images={images}
      />
    );
  }

  return (
    <EditorialLayoutPost
      searchQuery={searchQuery}
      setSearchQuery={setSearchQuery}
      isGuidesNavShown={isGuidesNavShown}
      setIsGuidesNavShown={setIsGuidesNavShown}
      isScrolled={isScrolled}
      featuredImage={featuredImage}
      title={title}
      categories={categories}
      author={author}
      date={date}
      content={content}
      images={images}
      shuffledRelatedStories={shuffledRelatedStories}
    />
  );
};

export default SingleLayoutFrontPage;
