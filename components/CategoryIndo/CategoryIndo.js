import React from 'react';
import Link from 'next/link';
import styles from './CategoryIndo.module.scss';

const CategoryIndo = ({ data }) => {
  const categories = data || [];

  return (
    <div className={styles.categoryIndoWrapper}>
      <h2 className={styles.title}>Destinasi Indonesia</h2>
      <div className={styles.grid}>
        {categories.map((node) => {
          const {
            id,
            name,
            slug,
            categoryImages,
            contentNodes,
            description,
          } = node;

          const images = [
            {
              url: categoryImages?.categorySlide1?.mediaItemUrl,
              caption: categoryImages?.categoryImagesCaption1,
            //   description: categoryImages?.description,
            },
            {
              url: categoryImages?.categorySlide2?.mediaItemUrl,
              caption: categoryImages?.categorySlideCaption2,
            },
            {
              url: categoryImages?.categorySlide3?.mediaItemUrl,
              caption: categoryImages?.categorySlideCaption3,
            },
            {
              url: categoryImages?.categorySlide4?.mediaItemUrl,
              caption: categoryImages?.categorySlideCaption4,
            },
            {
              url: categoryImages?.categorySlide5?.mediaItemUrl,
              caption: categoryImages?.categorySlideCaption5,
            },
          ];

          return (
            <Link key={id} href={`/category/${slug}`} className={styles.card}>
              <h3 className={styles.name}>{name}</h3>
              <p className={styles.slug}>/{slug}</p>
              <p className={styles.description}>/{description}</p>
              <p className={styles.contentCount}>
                {contentNodes?.edges?.length || 0} artikel
              </p>
              <div className={styles.imageGallery}>
                {images.map((img, index) => (
                  img.url && (
                    <div key={index} className={styles.imageWrapper}>
                      <img src={img.url} alt={`${name} - Slide ${index + 1}`} className={styles.image} />
                      {img.caption && <p className={styles.caption}>{img.caption}</p>}
                    </div>
                  )
                ))}
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default CategoryIndo;
