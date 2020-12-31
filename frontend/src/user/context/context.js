import React from "react";

import { getterSetters } from "../../object/getterSetters";
import * as availabilities from "./availabilities";
import * as Purchases from "./purchases";

const defaults = {
  email: "",
  saved: 100,
  frequency: "Every 2 Weeks",
  contributions: 100,
  lastPaycheck: new Date(),
  purchases: Purchases.New(),
};

export function New(data = defaults) {
  return {
    ...getterSetters(data, New),
    from(user) {
      const d = {
        ...defaults,
        ...user,
        lastPaycheck: user.lastPaycheck
          ? new Date(user.lastPaycheck)
          : new Date(),
      };

      return New({
        ...d,
        purchases: data.purchases.from(user.purchases, availabilities.get(d)),
      });
    },
    setFrequency(frequency) {
      return New({
        ...data,
        frequency,
        purchases: data.purchases.setAvailability(
          availabilities.get(frequency)
        ),
      });
    },
    setLastPaycheck(lastPaycheck) {
      return New({
        ...data,
        lastPaycheck: new Date(lastPaycheck),
      });
    },
    addPurchase(purchase) {
      return New({
        ...data,
        purchases: data.purchases.addPurchase(purchase),
      });
    },
    lastPaycheckDisplay() {
      const t = new Date();
      const l = data.lastPaycheck;

      if (
        l.getYear() === t.getYear() &&
        l.getMonth() === t.getMonth() &&
        l.getDate() === t.getDate()
      ) {
        return "Today";
      }

      return data.lastPaycheck.toLocaleDateString("en-US");
    },
  };
}

export const Context = React.createContext({
  user: null,
  setUser: null,
});
