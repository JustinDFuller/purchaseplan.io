import * as uuid from "uuid";

import { iterator, getterSetters } from "object";

const defaults = {
  ID: "",
  Start: null,
  End: null,
  Categories: Categories(),
  Transactions: Transactions(),
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
        d.Categories = Categories(d.Categories.map((c) => Category(c)));
      }

      if (d.Transactions && d.Transactions.length) {
        d.Transactions = Transactions(
          d.Transactions.map((t) => Transaction(t))
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
    setCategory(id, fn) {
      return New({
        ...data,
        Categories: data.Categories.setCategory(id, fn),
      });
    },
  };
}

export function list(data = []) {
  return {
    ...iterator(data, list),
    setBudget(budget) {
      return list(data.map((b) => (b.ID() === budget.ID() ? budget : b)));
    },
  };
}

const categoryDefaults = {
  ID: "",
  Name: "",
  Group: "",
  PlannedInCents: 0,
};

function Category(data = categoryDefaults) {
  if (!data.ID) {
    data.ID = uuid.v4();
  }

  if (!data.PlannedInCents) {
    data.PlannedInCents = 0;
  }

  return {
    ...getterSetters(data, Category),
    planned() {
      return data.PlannedInCents / 100;
    },
    setPlanned(planned) {
      return Category({
        ...data,
        PlannedInCents: Number(planned) * 100,
      });
    },
  };
}

function Categories(data = []) {
  return {
    ...iterator(data, Categories),
    initialize() {
      return Categories([
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
      return Categories(data.map((c) => (c.ID() === id ? fn(c) : c)));
    },
  };
}

function Transaction() {
  return {};
}

function Transactions(data = []) {
  return iterator(data, Transactions);
}
