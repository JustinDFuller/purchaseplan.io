import * as uuid from "uuid";

import * as Budget from "budget";
import * as Notifications from "notifications";
import { getterSetters } from "object/getterSetters";

const defaults = {
  id: uuid.v4(),
  email: "",
  frequency: "Every 2 Weeks",
  lastPaycheck: new Date(),
  pushNotificationTokens: [],
  Budgets: Budget.List(),
};

export function New(data = defaults) {
  return {
    ...getterSetters(data, New),
    isReady() {
      return data.email && data.email !== "";
    },
    from(user) {
      const d = {
        ...defaults,
        ...data,
        ...user,
      };

      if (d.Budgets && d.Budgets.length) {
        d.Budgets = d.Budgets.map((b) => Budget.New().from(b));
      }

      return New({
        ...d,
        lastPaycheck: d.lastPaycheck
          ? new Date(d.lastPaycheck)
          : d.lastPaycheck,
        pushNotificationTokens: d.pushNotificationTokens.map((t) =>
          Notifications.New(t)
        ),
        Budgets: Budget.List().from(d.Budgets),
      });
    },
    setLastPaycheck(lastPaycheck) {
      return New({
        ...data,
        lastPaycheck: new Date(lastPaycheck + "T00:00:00"),
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
    setBudget(b) {
      return New({
        ...data,
        Budgets: data.Budgets.setBudget(b),
      });
    },
    setCategory(id, fn) {
      return New({
        ...data,
        Budgets: data.Budgets.setCategory(id, fn),
      });
    },
  };
}
