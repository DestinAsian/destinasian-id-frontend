

// export default CategoryIndo;
import React from 'react';
import Link from 'next/link';
import classNames from 'classnames/bind';
import styles from './CategoryIndo.module.scss';

const cx = classNames.bind(styles);

const CategoryIndo = ({ data }) => {
  const categories = data || [];

  return (
    <div className={cx('categoryIndoWrapper')}>
      <h2 className={cx('title')}>Destinasi Indonesia</h2>
      <div className={cx('grid')}>
        {categories.map((node) => {
          const {
            id,
            name,
            slug,
            categoryImages,
          } = node;

          const firstImage = categoryImages?.categorySlide1?.mediaItemUrl;

          return (
            <Link key={id} href={`/category/${slug}`} className={cx('card')}>
              <div className={cx('imageWrapper')}>
                {firstImage && (
                  <img
                    src={firstImage}
                    alt={name}
                    className={cx('image')}
                  />
                )}
                <h3 className={cx('nameOverlay')}>{name}</h3>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default CategoryIndo;




// import React from 'react';
// import Link from 'next/link';
// import classNames from 'classnames/bind';
// import styles from './CategoryIndo.module.scss';

// const cx = classNames.bind(styles);

// const CategoryIndo = ({ data }) => {
//   const categories = data || [];

//   return (
//     <div className={cx('categoryIndoWrapper')}>
//       <h2 className={cx('title')}>Destinasi Indonesia</h2>
//       <div className={cx('grid')}>
//         {categories.map((node) => {
//           const {
//             id,
//             name,
//             slug,
//             categoryImages,
//             contentNodes,
//             description,
//           } = node;

//           const images = [
//             {
//               url: categoryImages?.categorySlide1?.mediaItemUrl,
//               caption: categoryImages?.categoryImagesCaption1,
//             },
//             {
//               url: categoryImages?.categorySlide2?.mediaItemUrl,
//               caption: categoryImages?.categorySlideCaption2,
//             },
//             {
//               url: categoryImages?.categorySlide3?.mediaItemUrl,
//               caption: categoryImages?.categorySlideCaption3,
//             },
//             {
//               url: categoryImages?.categorySlide4?.mediaItemUrl,
//               caption: categoryImages?.categorySlideCaption4,
//             },
//             {
//               url: categoryImages?.categorySlide5?.mediaItemUrl,
//               caption: categoryImages?.categorySlideCaption5,
//             },
//           ];

//           return (
//             <Link key={id} href={`/category/${slug}`} className={cx('card')}>
//               <h3 className={cx('name')}>{name}</h3>
//               <p className={cx('slug')}>/{slug}</p>
//               <p className={cx('description')}>{description}</p>
//               <p className={cx('contentCount')}>
//                 {contentNodes?.edges?.length || 0} artikel
//               </p>
//               <div className={cx('imageGallery')}>
//                 {images.map((img, index) => (
//                   img.url && (
//                     <div key={index} className={cx('imageWrapper')}>
//                       <img
//                         src={img.url}
//                         alt={`${name} - Slide ${index + 1}`}
//                         className={cx('image')}
//                       />
//                       {img.caption && (
//                         <p className={cx('caption')}>{img.caption}</p>
//                       )}
//                     </div>
//                   )
//                 ))}
//               </div>
//             </Link>
//           );
//         })}
//       </div>
//     </div>
//   );
// };
