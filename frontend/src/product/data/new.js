import { getterSetters } from "object/getterSetters";

const productDefaults = {
  name: "",
  price: 0,
  url: "",
  affiliateURL: "",
  description: "",
  image: "",
};

export function New(data = productDefaults) {
  return {
    ...getterSetters(data, New),
    setPrice(p) {
      return New({
        ...data,
        price: Math.round(p),
      });
    },
    url() {
      return data.affiliateURL || data.url;
    },
  };
}
