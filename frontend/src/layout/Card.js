import * as styles from "../styles";

export function Card({ children, style }) {
  return (
    <div className="card text-white" style={styles.combine(styles.darkAlt, style)}>
      <div className="card-body">{children}</div>
    </div>
  );
}
