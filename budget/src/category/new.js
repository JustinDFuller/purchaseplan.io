import * as uuid from "uuid";

import { getterSetters } from "object";

const defaults = {
  ID: "",
  Name: "",
  Group: "",
  Type: "Expense",
  PlannedInCents: 0,
};

export function New(data = defaults) {
  if (!data.ID) {
    data = {
      ...data,
      ID: uuid.v4(),
    };
  }

  if (!data.PlannedInCents) {
    data = {
      ...data,
      PlannedInCents: 0,
    };
  }

  return {
    ...getterSetters(data, New),
    planned() {
      return data.PlannedInCents / 100;
    },
    setPlanned(planned) {
      return New({
        ...data,
        PlannedInCents: Number(planned) * 100,
      });
    },
  };
}
