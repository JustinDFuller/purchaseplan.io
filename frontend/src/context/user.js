import React from "react";

import { getterSetters } from "./getterSetters";
import * as availabilities from "./availabilities";
import * as Purchases from "./purchases";

const defaults = {
  email: "",
  saved: 100,
  frequency: "Every 2 Weeks",
  contributions: 100,
  lastPaycheck: null,
  purchases: Purchases.New(),
};

export function New(data = defaults) {
  return {
    ...getterSetters(data, New),
    from(user) {
      return New({
        ...defaults,
        ...user,
        lastPaycheck: user.lastPaycheck ? new Date(user.lastPaycheck) : null,
        purchases: data.purchases.from(user.purchases),
      });
    },
    setFrequency(frequency) {
      return New({
        ...data,
        frequency,
        purchases: data.purchases.setFrequency(frequency),
      });
    },
    setLastPaycheck(lastPaycheck) {
      return New({
        ...data,
        lastPaycheck: new Date(lastPaycheck),
      });
    },
    availabilityCalculator() {
      return availabilities.get(data);
    },
    addPurchase(purchase) {
      return New({
        ...data,
        purchases: data.purchases.addPurchase(purchase),
      });
    },
  };
}

export const Context = React.createContext({
  user: null,
  setUser: null,
});
