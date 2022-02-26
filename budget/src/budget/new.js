import * as uuid from "uuid";

import * as Category from "category";
import * as Transaction from "transaction";
import { getterSetters } from "object";

const defaults = {
  ID: "",
  Start: null,
  End: null,
  Categories: Category.List(),
  Transactions: Transaction.List(),
};

export function New(data = defaults) {
  if (data.ID === "") {
    data.ID = uuid.v4();
  }

  return {
    ...getterSetters(data, New),
    from(budget) {
      const d = {
        ...data,
        ...budget,
      };

      d.Start = new Date(d.Start);
      d.End = new Date(d.End);

      if (d.Categories && d.Categories.length) {
        d.Categories = Category.List(d.Categories.map((c) => Category.New(c)));
      }

      if (d.Transactions && d.Transactions.length) {
        d.Transactions = Transaction.List(
          d.Transactions.map((t) => Transaction.New(t))
        );
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
    remaining(category) {
      return 0;
    },
  };
}
