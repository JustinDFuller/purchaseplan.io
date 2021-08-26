import React, { useState } from "react";

import * as User from "user";
import * as Product from "product";
import * as layout from "layout";

import { URL } from "./URL";
import { ProductForm } from "./ProductForm";

const NO_ERROR = 0;
const INVALID_SEARCH = 1;

export const Form = User.data.WithContext(function ({
  user,
  setUser,
  productDefaults = null,
}) {
  const [loading, setLoading] = useState(false);
  const [product, setProduct] = useState(productDefaults);
  const [error, setError] = useState(false);
  const [quantity, setQuantity] = useState(1);

  async function handleSubmit(url) {
    setLoading(true);
    try {
      const result = await Product.api.get(url);
      setProduct(Product.data.New(result));
      setError(NO_ERROR);
    } catch (e) {
      console.error(e);
      setProduct(productDefaults);
      setError(INVALID_SEARCH);
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmitEdit(e) {
    e.preventDefault();

    const u = user.addPurchase(
      User.data.Purchase.New().setQuantity(quantity).setProduct(product)
    );

    const res = await User.api.put(u);
    console.log(res);
    setUser(user.from(res));
    setError(NO_ERROR);
    setProduct(null);
    setQuantity(1);
  }

  function handleCancel(e) {
    e.preventDefault();
    setProduct(null);
    setQuantity(1);
  }

  function handleNoURL() {
    setProduct();
    setProduct(Product.data.New());
  }

  if (!product) {
    return (
      <URL
        onNoURL={handleNoURL}
        onSubmit={handleSubmit}
        loading={loading}
        error={error === INVALID_SEARCH}
      />
    );
  }

  return (
    <layout.components.Card>
      <div className="row">
        {product.url() && (
          <div className="col-12 col-md-4 mb-4">
            <img
              className="card-img-top"
              src={product.image()}
              alt={product.description()}
              onError={(e) => {
                e.target.onError = null;
                e.target.src = `${process.env.PUBLIC_URL}/404.png`;
              }}
            />
          </div>
        )}
        <div className={product.url() ? "col-12 col-md-8" : "col-12"}>
          <ProductForm
            onSubmit={handleSubmitEdit}
            onCancel={handleCancel}
            loading={loading}
            error={error}
            product={product}
            setProduct={setProduct}
            quantity={quantity}
            setQuantity={setQuantity}
          />
        </div>
      </div>
    </layout.components.Card>
  );
});
