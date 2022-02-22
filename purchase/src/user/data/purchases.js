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
    withoutSkippable() {
      return data.purchases.filter((p) => !p.shouldSkip());
    },
    addPurchase(purchase) {
      return New({
        ...data,
        purchases: [...data.purchases, purchase],
      });
    },
    hasAtLeastOne() {
      return data.purchases.filter((p) => !p.shouldSkip()).length >= 1;
    },
    reorder(id, start, end) {
      const purchases = data.purchases.slice();
      const realStart = purchases.findIndex((p) => p.id() === id);

      // How many spaces did the purchase move?
      let diff = end - start;
      // Begin from where the purchase originally was.
      let realEnd = realStart;

      while (diff !== 0) {
        // moving down the list (position 5 to position 1), diff is -4.
        if (diff < 0) {
          realEnd--;
          if (!purchases[realEnd].shouldSkip()) {
            diff++;
          }
        }

        // moving up the list (position 1 to position 3), diff is 2.
        if (diff > 0) {
          realEnd++;
          if (!purchases[realEnd].shouldSkip()) {
            diff--;
          }
        }

        // In case we get to the beginning or end of the array and that element is skippable.
        if (realEnd === 0 || realEnd === purchases.length - 1) {
          break;
        }
      }

      const [removed] = purchases.splice(realStart, 1);
      purchases.splice(realEnd, 0, removed);

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
