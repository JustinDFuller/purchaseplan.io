import * as styles from "styles";

export function CategoryBubble({ budget, transaction }) {
  return (
    <div style={styles.bubble}>
      {budget.Categories().getById(transaction.CategoryID()).Name()}
    </div>
  );
}
