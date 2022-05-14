import * as uuid from "uuid";

import { views } from "layout/views";
import * as Category from "category";
import * as Transaction from "transaction";
import { getterSetters } from "object";

const defaults = {
  ID: "",
  Start: null,
  End: null,
  View: views.planned,
  Categories: Category.List(),
  Transactions: Transaction.List(),
};

export function New(data = defaults) {
  if (data.ID === "") {
    data.ID = uuid.v4();
  }

  function remaining(category) {
    const p = category.PlannedInCents();

    const transactions = data.Transactions.filter(
      (t) => t.CategoryID() === category.ID()
    );

    const difference = transactions.reduce((sum, val) => {
      return sum - val.AmountInCents();
    }, p);

    return difference / 100;
  }

  function remainingToPlan() {
    const remainingCents = data.Categories.reduce((sum, category) => {
      if (category.Type() === "Income") {
        return sum + category.PlannedInCents();
      }

      return sum - category.PlannedInCents();
    }, 0);

    return remainingCents / 100;
  }

  function remainingToSpend() {
    const income = data.Categories.reduce((sum, category) => {
      if (category.Type() === "Income") {
        return sum + category.PlannedInCents();
      }

      return sum;
    }, 0);

    const spent = data.Transactions.reduce((sum, transaction) => {
      const category = data.Categories.getById(transaction.CategoryID());
      if (category && category.Type() !== "Income") {
        return sum + transaction.AmountInCents();
      }
      return sum;
    }, 0);

    return (income - spent) / 100;
  }

  return {
    ...getterSetters(data, New),
    from(budget) {
      const d = {
        ...defaults,
        ...data,
        ...budget,
      };

      d.Start = new Date(d.Start);
      d.End = new Date(d.End);

      if (budget.Categories && budget.Categories.length) {
        d.Categories = Category.List(
          budget.Categories.map((c) => Category.New(c))
        );
      } else {
        d.Categories = Category.List();
      }

      if (budget.Transactions && budget.Transactions.length) {
        d.Transactions = Transaction.List(
          budget.Transactions.map((t) => Transaction.New(t))
        );
      } else {
        d.Transactions = Transaction.List();
      }

      return New(d);
    },
    initialize() {
      return New({
        ...data,
        Categories: data.Categories.initialize(),
      });
    },
    startDisplay() {
      return new Intl.DateTimeFormat("en-US", {
        day: "numeric",
        month: "long",
      }).format(data.Start);
    },
    endDisplay() {
      return new Intl.DateTimeFormat("en-US", {
        day: "numeric",
        month: "long",
      }).format(data.End);
    },
    addCategory(c) {
      return New({
        ...data,
        Categories: data.Categories.add(c),
      });
    },
    setCategory(id, fn) {
      return New({
        ...data,
        Categories: data.Categories.setCategory(id, fn),
      });
    },
    formattedRemaining(category) {
      const f = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      });
      return f.format(remaining(category));
    },
    remaining,
    addTransaction(transaction) {
      return New({
        ...data,
        Transactions: data.Transactions.add(transaction),
      });
    },
    remainingToPlan,
    formattedRemainingToPlan() {
      const f = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      });
      return f.format(remainingToPlan());
    },
    remainingToSpend,
    formattedRemainingToSpend() {
      const f = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      });
      return f.format(remainingToSpend());
    },
    setTransaction(transaction) {
      return New({
        ...data,
        Transactions: data.Transactions.setTransaction(transaction),
      });
    },
    isEmpty() {
      return data.Categories.isEmpty();
    },
  };
}
