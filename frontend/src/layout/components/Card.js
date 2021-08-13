import * as styles from "../../styles";

export function Card({ children, style, noBody, light }) {
  return (
    <div
      className="card mb-4"
      style={styles.combine(
        light ? styles.darkLight : styles.darkAlt,
        styles.roundBorder,
        style
      )}
    >
      <div className={noBody ? "" : "card-body"}>{children}</div>
    </div>
  );
}
