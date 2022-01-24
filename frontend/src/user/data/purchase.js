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
    setQuantity(q) {
      return New({
        ...data,
        quantity: Math.ceil(q),
      });
    },
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

      const d = new Date(data.date);
      if (d <= new Date()) {
        return "today";
      }

      return d.toLocaleDateString("en-US") ?? "";
    },
    url() {
      return data.product.url() || `?purchase=${data.id}`;
    },
  };
}
