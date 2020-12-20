import { getterSetters } from "./getterSetters";

const purchaseDefaults = {
  date: null, // calculated at display time
  product: null,
};

export function Purchase(data = purchaseDefaults) {
  return {
    ...getterSetters(data, Purchase),
    clear() {
      return Purchase();
    },
    isNotEmpty() {
      return data !== purchaseDefaults;
    },
    is(purchase) {
      return purchase.data.product.name === data.product.name; // switch to ID later
    },
  };
}

const defaults = {
  frequency: null,
  purchases: [],
};

export function New(data = defaults) {
  return {
    ...getterSetters(data, New),
    map(...args) {
      return data.purchases.map(...args);
    },
    addPurchase(purchase) {
      return New({
        purchases: [...data.purchases, purchase],
      });
    },
    hasAtLeastOne() {
      return data.purchases.length >= 1;
    },
    up(purchase) {
      const i = data.purchases.findIndex((p) => p.is(purchase));
      const a = data.purchases[i];
      const b = data.purchases[i - 1];
      const purchases = data.purchases.slice();
      purchases[i - 1] = a;
      purchases[i] = b;
      return New({
        purchases,
      });
    },
    down(purchase) {
      const i = data.purchases.findIndex((p) => p.is(purchase));
      const a = data.purchases[i];
      const b = data.purchases[i + 1];
      const purchases = data.purchases.slice();
      purchases[i + 1] = a;
      purchases[i] = b;
      return New({
        purchases,
      });
    },
    isNotFirst(p) {
      return !p.is(data.purchases[0]);
    },
    isNotLast(p) {
      return !p.is(data.purchases[data.purchases.length - 1]);
    },
    withAvailability(frequency) {
      return data.purchases?.map((p, i, purchases) =>
        p.setDate(frequency.calculate(p, purchases))
      );
    },
    toJSON() {
      return data.purchases;
    },
    from(purchases) {
      return New({
        purchases: purchases?.map(Purchase) || [],
      });
    },
  };
}
