import * as styles from "styles";

export function Remaining({ budget, category }) {
  return (
    <input
      size={Math.max(budget.formattedRemaining(category).length, 1)}
      style={{
        width: Math.max(budget.formattedRemaining(category).length, 1) * 9,
      }}
      disabled
      className={styles.classes(
        "d-inline-block form-control-plaintext text-white text-right",
        {
          "text-danger": budget.remaining(category) < 0,
          "text-success": budget.remaining(category) > 0,
        }
      )}
      type="text"
      value={budget.formattedRemaining(category)}
    />
  );
}
