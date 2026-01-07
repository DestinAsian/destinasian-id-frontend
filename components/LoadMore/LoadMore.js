import React from 'react';
import styles from './LoadMore.module.scss';

export default function LoadMore({
  hasNextPage,
  endCursor,
  isLoading,
  fetchMore,
  className,
}) {
  if (!(hasNextPage && endCursor)) return null;

  return (
    <section className={`${styles.wrapper} ${className || ''}`}>
      <button
        className={styles.button}
        disabled={isLoading}
        aria-label="Load more posts"
        onClick={async () => {
          try {
            await fetchMore({ variables: { after: endCursor } });
          } catch (err) {
            console.error('LoadMore error:', err);
          }
        }}
      >
        {isLoading ? 'Loading...' : 'Load More'}
      </button>
    </section>
  );
}
