import { iterator } from "object";

import { New as Category } from "./new";

export function New(data = []) {
  return {
    ...iterator(data, New),
    initialize() {
      return New([
        Category({
          Name: "Emergency Fund",
          Group: "Savings",
        }),
        Category({
          Name: "Rent",
          Group: "Bills",
        }),
        Category({
          Name: "Eletricity",
          Group: "Bills",
        }),
        Category({
          Name: "Water",
          Group: "Bills",
        }),
        Category({
          Name: "Phone",
          Group: "Bills",
        }),
        Category({
          Name: "Internet",
          Group: "Bills",
        }),
        Category({
          Name: "Groceries",
          Group: "Expenses",
        }),
        Category({
          Name: "Car Gas",
          Group: "Expenses",
        }),
        Category({
          Name: "Clothes",
          Group: "Expenses",
        }),
        Category({
          Name: "Restaurants",
          Group: "Fun",
        }),
        Category({
          Name: "Restaurants",
          Group: "Fun",
        }),
      ]);
    },
    groups() {
      const groups = new Map();

      for (const c of data) {
        if (!groups.has(c.Group())) {
          groups.set(c.Group(), []);
        }

        groups.get(c.Group()).push(c);
      }

      const arr = [];
      for (const [k, v] of groups.entries()) {
        arr.push({
          name: k,
          categories: v,
        });
      }

      return arr;
    },
    setCategory(id, fn) {
      return New(data.map((c) => (c.ID() === id ? fn(c) : c)));
    },
    setGroup(oldGroup, newGroup) {
      return New(
        data.map((c) => (c.Group() === oldGroup ? c.setGroup(newGroup) : c))
      );
    },
  };
}
