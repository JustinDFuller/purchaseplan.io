import { getterSetters } from "object/getterSetters";

const defaults = {
  deviceToken: "",
  deviceTokenType: "",
  expoToken: "",
};

export function New(data = defaults) {
  return getterSetters(data, New);
}
