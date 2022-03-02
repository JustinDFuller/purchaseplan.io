import { Row } from "./Row";

export function List({ budget }) {
  return (
    <ul className="list-group list-group-flush mt-3">
      {budget
        .Transactions()
        .sortByAsc()
        .map((transaction) => (
          <Row
            transaction={transaction}
            budget={budget}
            key={transaction.ID()}
          />
        ))}
    </ul>
  );
}
