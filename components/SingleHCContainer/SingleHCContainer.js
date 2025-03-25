import styles from './SingleHCContainer.module.scss';

export default function SingleHCContainer({ children }) {
  return (
    <div className={styles.component}>
      {children}
    </div>
  );
}
