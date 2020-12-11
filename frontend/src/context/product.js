const productDefaults = {
  name: "",
  price: 0,
  url: "",
  description: "",
  image: "",
};

export function Product(data = productDefaults) {
  return {
    data,
    setName(name) {
      return Product({
        ...data,
        name,
      });
    },
    setPrice(price) {
      return Product({
        ...data,
        price: Number(price),
      });
    },
    setUrl(url) {
      return Product({
        ...data,
        url,
      });
    },
    setDescription(description) {
      return Product({
        ...data,
        description,
      });
    },
    setImage(image) {
      return Product({
        ...data,
        image,
      });
    },
    toJSON() {
      return data;
    },
  };
}
