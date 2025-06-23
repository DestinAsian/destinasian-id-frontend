import styles from './SingleLTContainer.module.scss';

export default function SingleLTContainer({ children }) {
  return (
    <div className={styles.component}>
      {children}
    </div>
  );
}