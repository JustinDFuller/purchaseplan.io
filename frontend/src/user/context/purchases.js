import { getterSetters } from "../../object/getterSetters";
import * as Product from "../../product";

const purchaseDefaults = {
  date: null, // calculated at display time
  product: Product.data.New(),
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
    from(purchase) {
      return Purchase({
        ...purchase,
        product: Product.data.New(purchase.product),
      });
    },
    displayDate() {
      if (data.date <= new Date()) {
        return "today";
      }

      return data.date?.toLocaleDateString("en-US") ?? "";
    },
    id() {
      return data.product?.url();
    },
  };
}

const defaults = {
  availability: null,
  purchases: [],
};

export function New(data = defaults) {
  function withAvailability(purchases, availability = data.availability) {
    if (!purchases || !availability) {
      return purchases;
    }

    return purchases.map((p, i, purchases) =>
      p.setDate(availability.new().calculate(p, purchases))
    );
  }

  return {
    ...getterSetters(data, New),
    map(...args) {
      return data.purchases.map(...args);
    },
    addPurchase(purchase) {
      return New({
        purchases: withAvailability([...data.purchases, purchase]),
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
        purchases: withAvailability(purchases),
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
        purchases: withAvailability(
          purchases?.map((p) => Purchase().from(p)) || [],
          availability
        ),
        availability,
      });
    },
  };
}
