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
      const t = new Date();
      const l = data.Start;

      if (
        l.getYear() === t.getYear() &&
        l.getMonth() === t.getMonth() &&
        l.getDate() === t.getDate()
      ) {
        return "Today";
      }

      return l.toLocaleDateString("en-US");
    },
    endDisplay() {
      const t = new Date();
      const l = data.End;

      if (
        l.getYear() === t.getYear() &&
        l.getMonth() === t.getMonth() &&
        l.getDate() === t.getDate()
      ) {
        return "Today";
      }

      return l.toLocaleDateString("en-US");
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
  };
}
