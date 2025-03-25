import styles from './SingleContestContainer.module.scss';

export default function SingleContestContainer({ children }) {
  return (
    <div className={styles.component}>
      {children}
    </div>
  );
}
