import { gql } from '@apollo/client';
import Image from "next/image";

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
  const altText = image?.altText || '';

  // Tentukan ukuran, fallback ke mediaDetails atau default
  const imgWidth = width || image?.mediaDetails?.width || 600;
  const imgHeight = height || image?.mediaDetails?.height || 400;

  const useFill = !!fill;

  if (!src) return null;

  return (
    <figure className={className} style={useFill ? { position: 'relative' } : undefined}>
      <Image
        src={src}
        alt={altText}
        {...(useFill ? { fill: true } : { width: imgWidth, height: imgHeight })}
        priority={priority}
        {...props}
      />
    </figure>
  );
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
