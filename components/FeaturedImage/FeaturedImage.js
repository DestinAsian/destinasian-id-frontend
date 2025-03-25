import { gql } from '@apollo/client';
import Image from "next/image"
export default function FeaturedImage({
  image,
  width,
  height,
  className,
  priority,
  fill,
  ...props
}) {
  const src = image?.sourceUrl;
  const { altText } = image || '';

  width = width ? width : image?.mediaDetails?.width;
  height = height ? height : image?.mediaDetails?.height;

  return src && width && height ? (
    <figure className={className}>
      <Image
        src={src}
        alt={altText}
        fill={fill}
        width={width}
        height={height}
        priority={priority}
        {...props}
        // style={{
        //   maxWidth: "100%",
        //   height: "auto"
        // }} 
        />
    </figure>
  ) : null;
}

FeaturedImage.fragments = {
  entry: gql`
    fragment FeaturedImageFragment on NodeWithFeaturedImage {
      featuredImage {
        node {
          id
          sourceUrl
          altText
          mediaDetails {
            width
            height
          }
        }
      }
    }
  `,
};
