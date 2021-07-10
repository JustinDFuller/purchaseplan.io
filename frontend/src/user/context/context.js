import React from "react";
import * as uuid from "uuid";

import { getterSetters } from "object/getterSetters";

import * as availabilities from "./availabilities";
import * as Purchases from "./purchases";

const defaults = {
  id: uuid.v4(),
  email: "",
  saved: 100,
  frequency: "Every 2 Weeks",
  contributions: 100,
  lastPaycheck: new Date(),
  purchases: Purchases.New(),
};

export function New(input = defaults) {
  const data = {
    ...input,
    purchases: input.purchases.setAvailability(availabilities.get(input)),
  };

  return {
    ...getterSetters(data, New),
    from(user) {
      const d = {
        ...defaults,
        ...user,
        lastPaycheck: user.lastPaycheck
          ? new Date(user.lastPaycheck)
          : data.lastPaycheck,
      };

      return New({
        ...d,
        purchases: data.purchases.from(user.purchases, availabilities.get(d)),
      });
    },
    setLastPaycheck(lastPaycheck) {
      return New({
        ...data,
        lastPaycheck: new Date(lastPaycheck + "T00:00:00"),
      });
    },
    addPurchase(purchase) {
      return New({
        ...data,
        purchases: data.purchases.addPurchase(purchase),
      });
    },
    setPurchase(purchase) {
      return New({
        ...data,
        purchases: data.purchases.setPurchase(purchase),
      });
    },
    lastPaycheck() {
      return data.purchases.availability().date();
    },
    lastPaycheckDisplay() {
      const t = new Date();
      const l = data.purchases.availability().date();

      if (
        l.getYear() === t.getYear() &&
        l.getMonth() === t.getMonth() &&
        l.getDate() === t.getDate()
      ) {
        return "Today";
      }

      return l.toLocaleDateString("en-US");
    },
    purchase(purchase) {
      return New({
        ...data,
        saved: data.saved - purchase.price(),
        purchases: data.purchases.purchase(purchase),
      });
    },
    undoPurchase(purchase) {
      return New({
        ...data,
        saved: data.saved + purchase.price(),
        purchases: data.purchases.undoPurchase(purchase),
      });
    },
    remaining() {
      return data.saved - data.purchases.total();
    },
  };
}

export const Context = React.createContext({
  user: null,
  setUser: null,
});
