import * as styles from "../../styles";

export function Submit({ loading, text, dataTestid, style, className }) {
  if (loading) {
    return <div className="spinner-border mt-1" role="status" />;
  }

  return (
    <button
      data-testid={dataTestid}
      type="submit"
      className={styles.classes("btn btn-success w-100 w-md-auto", className)}
      style={styles.combine(styles.success, style, {
        whiteSpace: "nowrap",
      })}
    >
      {text}
    </button>
  );
}
