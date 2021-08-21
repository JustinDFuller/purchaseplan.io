import * as uuid from "uuid";

import * as Notifications from "notifications";
import { getterSetters } from "object/getterSetters";

import * as Purchases from "./purchases";

const defaults = {
  id: uuid.v4(),
  email: "",
  saved: 0,
  frequency: "Every 2 Weeks",
  contributions: 0,
  lastPaycheck: new Date(),
  purchases: Purchases.New(),
  pushNotificationTokens: [],
};

export function New(data = defaults) {
  return {
    ...getterSetters(data, New),
    isReady() {
      return data.email && data.email !== "";
    },
    from(user) {
      return New({
        ...defaults,
        ...user,
        lastPaycheck: user.lastPaycheck
          ? new Date(user.lastPaycheck)
          : data.lastPaycheck,
        purchases: data.purchases.from(user.purchases),
        pushNotificationTokens: user.pushNotificationTokens.map((t) =>
          Notifications.New(t)
        ),
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
    addPushNotificationTokens(newTokens) {
      const found = data.pushNotificationTokens.findIndex(
        (t) => t.deviceToken() === newTokens.deviceToken()
      );

      const pushNotificationTokens =
        found > -1
          ? data.pushNotificationTokens
          : [...data.pushNotificationTokens, newTokens];

      return New({
        ...data,
        pushNotificationTokens,
      });
    },
  };
}
