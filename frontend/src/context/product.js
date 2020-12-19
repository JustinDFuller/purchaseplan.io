import { getterSetters } from "./getterSetters";

const productDefaults = {
  name: "",
  price: 0,
  url: "",
  description: "",
  image: "",
};

export function Product(data = productDefaults) {
  return getterSetters(data, Product);
}
