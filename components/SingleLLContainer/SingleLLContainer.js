import styles from './SingleLLContainer.module.scss';

export default function SingleLLContainer({ children }) {
  return (
    <div className={styles.component}>
      {children}
    </div>
  );
}
