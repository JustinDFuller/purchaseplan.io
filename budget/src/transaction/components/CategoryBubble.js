import * as styles from "styles";

export function CategoryBubble({ budget, transaction }) {
  const category = budget.Categories().getById(transaction.CategoryID());

  if (!category) {
    return null;
  }

  return <div style={styles.bubble}>{category.Name()}</div>;
}
