import { iterator } from "object";

export function New(data = []) {
  return {
    ...iterator(data, New),
    sortByAsc() {
      return data.sort(
        (a, b) => new Date(b.Time().Completed) - new Date(a.Time().Completed)
      );
    },
    setTransaction(transaction) {
      return New(
        data.map((t) => (t.ID() === transaction.ID() ? transaction : t))
      );
    },
  };
}
