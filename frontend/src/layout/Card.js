import * as styles from "../styles";

export function Card({ children, style, noBody }) {
  return (
    <div className="card text-white" style={styles.combine(styles.darkAlt, style)}>
      <div className={noBody ? '' : 'card-body'}>{children}</div>
    </div>
  );
}
