import * as styles from "styles";

function upperFirst(s) {
  return s[0].toUpperCase() + s.slice(1);
}

export function List({ budget }) {
  return (
    <ul className="list-group list-group-flush mt-3">
      {budget
        .Transactions()
        .sortByAsc()
        .map((t) => (
          <li
            key={t.ID()}
            className="list-group-item px-0 d-flex align-items-center"
          >
            <div>
              <div style={styles.bubble}>
                {budget.Categories().getById(t.CategoryID()).Name()}
              </div>
            </div>
            <span className="pl-3">
              <strong>{upperFirst(t.merchantName())}</strong> for $
              {t.displayAmount()} on {t.displayTime()}.
            </span>
          </li>
        ))}
    </ul>
  );
}
