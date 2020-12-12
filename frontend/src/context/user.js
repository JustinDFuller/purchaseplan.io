import React from "react";

import * as availabilities from "./availabilities";
import * as Purchases from './purchases';

const defaults = {
  email: "",
  saved: 0,
  frequency: "",
  contributions: 0,
  lastPaycheck: null,
  purchases: Purchases.New(),
};

export function New(data = defaults) {
  return {
    from(user) {
      return New({
        ...defaults,
        ...user,
        lastPaycheck: user.lastPaycheck ? new Date(user.lastPaycheck) : null,
        purchases: data.purchases.from(user.purchases),
      });
    },
    toJSON() {
      return data;
    },
    frequency() {
      return data.frequency;
    },
    setFrequency(frequency) {
      return New({
        ...data,
        frequency,
      });
    },
    saved() {
      return data.saved;
    },
    setSaved(saved) {
      return New({
        ...data,
        saved: Number(saved),
      });
    },
    email() {
      return data.email;
    },
    setEmail(email) {
      return New({
        ...data,
        email,
      });
    },
    contributions() {
      return data.contributions;
    },
    setContributions(contributions) {
      return New({
        ...data,
        contributions: Number(contributions),
      });
    },
    lastPaycheck() {
      return data.lastPaycheck;
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
    purchases() {
      return data.purchases;
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
