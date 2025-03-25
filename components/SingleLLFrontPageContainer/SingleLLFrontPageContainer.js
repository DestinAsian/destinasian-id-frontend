import styles from './SingleLLFrontPageContainer.module.scss';

export default function SingleLLFrontPageContainer({ children }) {
  return (
    <div className={styles.component}>
      {children}
    </div>
  );
}
