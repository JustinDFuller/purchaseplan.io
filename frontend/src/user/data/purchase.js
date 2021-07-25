import * as uuid from "uuid";

import { getterSetters } from "object/getterSetters";
import * as ProductData from "product/data";

const purchaseDefaults = {
  id: null,
  date: null,
  deleted: false,
  purchased: false,
  purchasedAt: null,
  product: ProductData.New(),
  quantity: 1,
};

export function New(data = purchaseDefaults) {
  function quantity() {
    return Number(data.quantity) >= 1 ? data.quantity : 1;
  }

  if (!data.id) {
    data = {
      ...data,
      id: uuid.v4(),
    };
  }

  return {
    ...getterSetters(data, New),
    quantity,
    price() {
      return data.product.price() * quantity();
    },
    clear() {
      return New();
    },
    isNotEmpty() {
      return data !== purchaseDefaults;
    },
    is(purchase) {
      return purchase.id() === data.id;
    },
    from(purchase) {
      return New({
        ...purchaseDefaults,
        ...purchase,
        product: ProductData.New(purchase.product),
      });
    },
    shouldSkip() {
      return data.purchased || data.deleted;
    },
    displayDate() {
      if (data.date === null) {
        return null;
      }

      if (data.date <= new Date()) {
        return "today";
      }

      return data.date?.toLocaleDateString("en-US") ?? "";
    },
  };
}
