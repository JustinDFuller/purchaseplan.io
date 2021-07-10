import { getterSetters } from "object/getterSetters";

import * as Purchase from "./purchase";

const defaults = {
  availability: null,
  purchases: [],
};

export function New(input = defaults) {
  function withAvailability(purchases, availability = input.availability) {
    if (!purchases || !availability) {
      return purchases;
    }

    return purchases.map((p, i, purchases) =>
      p.setDate(availability.calculate(p, purchases))
    );
  }

  const data = {
    ...input,
    purchases: withAvailability(input.purchases),
  };

  return {
    ...getterSetters(data, New),
    map(...args) {
      return data.purchases.map(...args);
    },
    addPurchase(purchase) {
      return New({
        ...data,
        purchases: [...data.purchases, purchase],
      });
    },
    hasAtLeastOne() {
      return data.purchases.length >= 1;
    },
    reorder(start, end) {
      const purchases = data.purchases.slice();
      const [removed] = purchases.splice(start, 1);
      purchases.splice(end, 0, removed);

      return New({
        ...data,
        purchases: purchases,
      });
    },
    isNotFirst(p) {
      return !p.is(data.purchases[0]);
    },
    isNotLast(p) {
      return !p.is(data.purchases[data.purchases.length - 1]);
    },
    toJSON() {
      return data.purchases;
    },
    from(purchases, availability) {
      return New({
        purchases: purchases?.map((p) => Purchase.New().from(p)) || [],
        availability,
      });
    },
    undoRemove(purchase) {
      const i = data.purchases.findIndex((p) => p.is(purchase));
      const purchases = data.purchases.slice();
      purchases[i] = purchases[i].setDeleted(false);

      return New({
        ...data,
        purchases,
      });
    },
    remove(purchase) {
      const i = data.purchases.findIndex((p) => p.is(purchase));
      const purchases = data.purchases.slice();
      purchases[i] = purchases[i].setDeleted(true);

      return New({
        ...data,
        purchases,
      });
    },
    undoPurchase(purchase) {
      const i = data.purchases.findIndex((p) => p.is(purchase));
      const purchases = data.purchases.slice();
      purchases[i] = purchases[i].setPurchased(false).setPurchasedAt(null);

      return New({
        ...data,
        purchases,
      });
    },
    purchase(purchase) {
      const i = data.purchases.findIndex((p) => p.is(purchase));
      const purchases = data.purchases.slice();
      purchases[i] = purchases[i].setPurchased(true).setPurchasedAt(new Date());

      return New({
        ...data,
        purchases,
      });
    },
    setPurchase(purchase) {
      const i = data.purchases.findIndex((p) => p.is(purchase));
      const purchases = data.purchases.slice();
      purchases[i] = purchase;

      return New({
        ...data,
        purchases,
      });
    },
    total() {
      return data.purchases.reduce((sum, purchase) => {
        if (purchase.shouldSkip()) {
          return sum;
        }
        return sum + purchase.price();
      }, 0);
    },
  };
}
