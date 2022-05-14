import { iterator } from "object";

import { New as Category } from "./new";

export function New(data = []) {
  return {
    ...iterator(data, New),
    initialize() {
      return New([
        Category({
          Name: "Paycheck",
          Group: "Income",
          Type: "Income",
        }),
        Category({
          Name: "Emergency Fund",
          Group: "Savings",
          Type: "Expense",
        }),
        Category({
          Name: "Rent",
          Group: "Bills",
          Type: "Expense",
        }),
        Category({
          Name: "Eletricity",
          Group: "Bills",
          Type: "Expense",
        }),
        Category({
          Name: "Water",
          Group: "Bills",
          Type: "Expense",
        }),
        Category({
          Name: "Phone",
          Group: "Bills",
          Type: "Expense",
        }),
        Category({
          Name: "Internet",
          Group: "Bills",
          Type: "Expense",
        }),
        Category({
          Name: "Groceries",
          Group: "Expenses",
          Type: "Expense",
        }),
        Category({
          Name: "Car Gas",
          Group: "Expenses",
          Type: "Expense",
        }),
        Category({
          Name: "Clothes",
          Group: "Expenses",
          Type: "Expense",
        }),
        Category({
          Name: "Restaurants",
          Group: "Fun",
          Type: "Expense",
        }),
        Category({
          Name: "Restaurants",
          Group: "Fun",
          Type: "Expense",
        }),
        Category({
          Name: "Credit Card",
          Group: "Debt",
          Type: "Expense",
        }),
        Category({
          Name: "Auto Loan",
          Group: "Debt",
          Type: "Expense",
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
    deleteGroup(group) {
      return New(data.filter((c) => c.Group() !== group));
    },
    isEmpty() {
      return data.every((c) => c.isEmpty());
    },
  };
}
