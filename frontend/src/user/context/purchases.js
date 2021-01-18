import { getterSetters } from "../../object/getterSetters";
import * as ProductData from "../../product/data";

const purchaseDefaults = {
  date: null,
  deleted: false,
  purchased: false,
  purchasedAt: null,
  product: ProductData.New(),
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
      return purchase.product().name() === data.product.name(); // unique name is enforced
    },
    from(purchase) {
      return Purchase({
        ...purchaseDefaults,
        ...purchase,
        product: ProductData.New(purchase.product),
      });
    },
    shouldSkip() {
      return data.purchased || data.deleted;
    },
    displayDate() {
      if (data.date <= new Date()) {
        return "today";
      }

      return data.date?.toLocaleDateString("en-US") ?? "";
    },
    id() {
      return data.product?.name(); // name is unique
    },
  };
}

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
        purchases: purchases?.map((p) => Purchase().from(p)) || [],
        availability,
      });
    },
    findProduct(product) {
      return data.purchases.find(
        (purchase) => purchase.product().name() === product.name()
      );
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
  };
}
