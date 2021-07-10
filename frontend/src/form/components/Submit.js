import * as styles from "../../styles";

export function Submit({ loading, text, dataTestid }) {
  if (loading) {
    return <div className="spinner-border mt-1" role="status" />;
  }

  return (
    <button
      data-testid={dataTestid}
      type="submit"
      className="btn btn-success w-100 w-md-auto"
      style={styles.combine(styles.success, styles.transparent)}
    >
      {text}
    </button>
  );
}
