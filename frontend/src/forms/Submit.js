import { ReactComponent as CheckCircle } from "bootstrap-icons/icons/check-circle.svg";

import * as styles from "../styles";

export function Submit({ onClick, loading }) {
  if (loading) {
    return <div className="spinner-border mt-1" role="status" />;
  }

  return (
    <CheckCircle
      onClick={onClick}
      className="mt-2"
      style={styles.combine(styles.success, styles.pointer)}
      width={24}
      height={24}
    />
  );
}
