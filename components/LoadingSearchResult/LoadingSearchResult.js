import styles from './LoadingSearchResult.module.scss';

export default function LoadingSearchResult() {
  return (
    <div className={styles['loading-result']}>
      <div className={styles['loading-result-title']} />
      <div className={styles['loading-result-meta']} />
      <div className={styles['loading-result-excerpt']} />
    </div>
  );
}