import { iterator } from "object";

export function New(data = []) {
  return {
    ...iterator(data, New),
    setBudget(budget) {
      return New(data.map((b) => (b.ID() === budget.ID() ? budget : b)));
    },
  };
}
