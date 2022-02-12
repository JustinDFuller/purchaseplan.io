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
    missing() {
      let missing = [];
      if (!data.image) {
        missing.push("image");
      }
      if (!data.price) {
        missing.push("price");
      }
      if (!data.name) {
        missing.push("name");
      }
      if (!data.description) {
        missing.push("description");
      }

      return missing.reduce((sum, m, i, arr) => {
        if (i === 0) {
          return sum + " " + m;
        }

        if (i === arr.length - 1) {
          return sum + ", or " + m;
        }

        return sum + ", " + m;
      }, "");
    },
  };
}
