import React from 'react'
import Link from 'next/link'
import classNames from 'classnames/bind'
import styles from './CategoryIndo.module.scss'

const cx = classNames.bind(styles)

const CategoryIndo = ({ data }) => {
  const categories = data || []

  return (
    <div className={cx('categoryIndoWrapper')}>
      <div className={cx('grid')}>
        {categories.length > 0 &&
          categories.map((node) => {
            const { id, name, slug, categoryImages } = node ?? {}

            // Ambil gambar pertama
            const firstImage =
              categoryImages?.categoryImages?.[0]?.mediaItemUrl ||
              categoryImages?.categorySlide1?.mediaItemUrl || // fallback
              null

            return (
              <Link key={id} href={`/${slug}`} className={cx('card')}>
                <div className={cx('imageWrapper')}>
                  {firstImage && (
                    <img
                      src={firstImage}
                      alt={name ?? 'Category Image'}
                      className={cx('image')}
                    />
                  )}
                  <h3 className={cx('nameOverlay')}>{name}</h3>
                </div>
              </Link>
            )
          })}
      </div>
    </div>
  )
}

export default CategoryIndo







// // export default CategoryIndo;
// import React from 'react';
// import Link from 'next/link';
// import classNames from 'classnames/bind';
// import styles from './CategoryIndo.module.scss';

// const cx = classNames.bind(styles);

// const CategoryIndo = ({ data }) => {
//   const categories = data || [];

//   return (
//     <div className={cx('categoryIndoWrapper')}>
//       <div className={cx('grid')}>
//         {categories?.length > 0 &&
//           categories.map((node) => {
//             const {
//               id,
//               name,
//               slug,
//               categoryImages,
//             } = node ?? {};

//             const firstImage = categoryImages?.categorySlide1?.mediaItemUrl;

//             return (
//               <Link key={id} 
//             //   href={`/category/${slug}`} 
//             href={`/${node?.parent?.node?.slug}/${slug}`}
//               className={cx('card')}>
//                 <div className={cx('imageWrapper')}>
//                   {firstImage && (
//                     <img
//                       src={firstImage}
//                       alt={name ?? 'Category Image'}
//                       className={cx('image')}
//                     />
//                   )}
//                   <h3 className={cx('nameOverlay')}>{name}</h3>
//                 </div>
//               </Link>
//             );
//           })}
//       </div>
//     </div>
//   );
// };

// export default CategoryIndo;
