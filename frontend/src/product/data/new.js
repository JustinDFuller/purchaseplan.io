import { getterSetters } from "object/getterSetters";

const productDefaults = {
  name: "",
  price: 0,
  url: "",
  description: "",
  image: "",
};

export function New(data = productDefaults) {
  return {
    ...getterSetters(data, New),
    setPrice(p) {
      return New({
        ...data,
        price: Math.ceil(p),
      });
    },
  };
}
