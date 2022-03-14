import { Row } from "./Row";

export function List({ user, budget, onSubmit }) {
  return (
    <ul className="row list-group list-group-flush mt-3">
      {budget
        .Transactions()
        .sortByAsc()
        .map((transaction) => (
          <Row
            onSubmit={onSubmit}
            user={user}
            transaction={transaction}
            budget={budget}
            key={transaction.ID()}
          />
        ))}
    </ul>
  );
}
