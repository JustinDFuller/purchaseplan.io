import * as styles from "styles";

export function DateRange({ budget }) {
  return (
    <div className="d-flex align-items-center mt-4 justify-content-center">
      <h4 className={styles.classes({ "mb-0": budget.isEmpty() })}>
        {budget.startDisplay()}
      </h4>
      <h4 className={styles.classes({ "mb-0": budget.isEmpty() }, "mx-1")}>
        —
      </h4>
      <h4 className={styles.classes({ "mb-0": budget.isEmpty() }, "mx-1")}>
        {budget.endDisplay()}
      </h4>
    </div>
  );
}
