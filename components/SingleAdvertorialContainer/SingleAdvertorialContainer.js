import styles from './SingleAdvertorialContainer.module.scss';

export default function SingleAdvertorialContainer({ children }) {
  return (
    <div className={styles.component}>
      {children}
    </div>
  );
}
