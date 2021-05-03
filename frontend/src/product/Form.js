import React, { useState } from "react";

import * as User from "../user";
import * as Product from "../product";
import { Card } from "../layout/Card";
import { URL } from "./URL";
import { ProductForm } from "./ProductForm";

const NO_ERROR = 0;
const INVALID_SEARCH = 1;

export const Form = User.withContext(function ({
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

  function handleSubmitEdit(e) {
    e.preventDefault();

    const u = user.addPurchase(
      User.Purchase().setQuantity(quantity).setProduct(product)
    );
    User.api.put(u);

    setUser(u);
    setError(NO_ERROR);
    setProduct(null);
    setQuantity(1);
  }

  function handleCancel(e) {
    e.preventDefault();
    setProduct(null);
    setQuantity(1);
  }

  if (!product) {
    return (
      <URL
        onSubmit={handleSubmit}
        loading={loading}
        error={error === INVALID_SEARCH}
      />
    );
  }

  return (
    <Card>
      <div className="row">
        <div className="col-12 col-md-4 mb-4">
          <img
            className="card-img-top"
            src={product.data.image}
            alt={product.data.description}
          />
        </div>
        <div className="col-12 col-md-8">
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
    </Card>
  );
});
