import { ReactComponent as CheckCircle } from "bootstrap-icons/icons/check-circle.svg";

import * as styles from "../styles";

export function Submit({ loading }) {
  if (loading) {
    return <div className="spinner-border mt-1" role="status" />;
  }

  return (
    <button
      type="submit"
      style={{
        border: "none",
        background: "transparent",
        width: 24,
        height: 24,
        padding: 0,
        margin: 0,
      }}
    >
      <CheckCircle
        className="mt-2"
        style={styles.combine(styles.success, styles.pointer)}
        width={24}
        height={24}
      />
    </button>
  );
}
