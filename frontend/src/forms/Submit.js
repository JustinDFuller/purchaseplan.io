import { ReactComponent as CheckCircle } from "bootstrap-icons/icons/check-circle.svg";

import * as styles from "../styles";

export function Submit({ onClick }) {
  return (
    <CheckCircle
      onClick={onClick}
      className="mt-2"
      style={styles.combine(styles.success, styles.pointer)}
      width={24}
      height={24}
    />
  )
}
