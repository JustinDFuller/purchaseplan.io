import * as styles from "styles";

export function Card({
  noPadding,
  children,
  style,
  noBody,
  light,
  bodyClassName,
  className = "",
}) {
  return (
    <div
      className={styles.classes("card", noPadding ? "" : "mb-4", className)}
      style={styles.combine(styles.card, style)}
    >
      <div className={styles.classes(noBody ? "" : "card-body", bodyClassName)}>
        {children}
      </div>
    </div>
  );
}
