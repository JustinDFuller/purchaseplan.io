import * as uuid from "uuid";
import { getterSetters } from "object";

const defaults = Object.freeze({
  ID: "",
  CategoryID: "",
  AmountInCents: 0,
  Time: {
    Created: "",
    Completed: "",
  },
  Merchant: {
    Name: "",
  },
});

export function New(data = defaults) {
  if (!data.ID) {
    data = {
      ...data,
      ID: uuid.v4(),
    };
  }
  return {
    ...getterSetters(data, New),
    amount() {
      return data.AmountInCents / 100;
    },
    setAmount(amount) {
      return New({
        ...data,
        AmountInCents: amount * 100,
      });
    },
    merchantName() {
      return data.Merchant.Name;
    },
    setMerchantName(name) {
      return New({
        ...data,
        Merchant: {
          ...data.Merchant,
          Name: name,
        },
      });
    },
    inputTime() {
      if (data.Time.Completed === "") {
        return "";
      }

      const d = new Date(data.Time.Completed);

      let m = d.getMonth() + 1;
      if (m < 10) {
        m = `0${m}`;
      } else {
        m = String(m);
      }

      let dt = d.getDate();
      if (dt < 10) {
        dt = `0${dt}`;
      } else {
        dt = String(dt);
      }

      return `${d.getFullYear()}-${m}-${dt}`;
    },
    setInputTime(time) {
      return New({
        ...data,
        Time: {
          ...data.Time,
          Completed: new Date(time + "T00:00:00"),
        },
      });
    },
  };
}
