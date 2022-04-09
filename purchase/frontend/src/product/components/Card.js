import React, { useState } from "react";

import * as User from "user";
import * as Product from "product";
import * as layout from "layout";
import * as Tracking from 'tracking';

import { URL } from "./URL";
import { Form } from "./Form";

const NO_ERROR = 0;
const INVALID_SEARCH = 1;

export const Card = User.data.WithContext(function ({
  user,
  setUser,
  productDefaults = null,
  disabled,
}) {
  const [loading, setLoading] = useState(false);
  const [product, setProduct] = useState(productDefaults);
  const [error, setError] = useState(false);
  const [quantity, setQuantity] = useState(1);

  async function handleSubmit(url) {
    setLoading(true);

    try {
      Tracking.api.track({ Type: "action", Name: "Click import URL Button" });

      const result = await Product.api.get(url);

      if (result) {
        setProduct(Product.data.New(result));
        setError(NO_ERROR);
      }

      if (!result) {
        setProduct(productDefaults);
        setError(INVALID_SEARCH);
      }
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
    setUser(user.from(res));
    setError(NO_ERROR);
    setProduct(null);
    setQuantity(1);
    Tracking.api.track({ Type: "action", Name: "Click submit edit product form" });
  }

  function handleCancel(e) {
    e.preventDefault();
    setProduct(null);
    setQuantity(1);
    Tracking.api.track({ Type: "action", Name: "Click Cancel URL Form" })
  }

  function handleNoURL() {
    setProduct();
    setProduct(Product.data.New());
    Tracking.api.track({ Type: "action", Name: "Click no URL Button" });
  }

  if (!product) {
    return (
      <URL
        disabled={disabled}
        onNoURL={handleNoURL}
        onSubmit={handleSubmit}
        loading={loading}
        error={error === INVALID_SEARCH}
      />
    );
  }

  return (
    <layout.components.Card
      style={{ width: "100%" }}
      className={
        !disabled && product.url() && product.image() ? "pb-5 pb-xl-0" : ""
      }
    >
      <div className="row">
        {product.image() && product.url() && (
          <div
            className={
              product.url() && product.image()
                ? "col-12 col-md-4 mb-4"
                : "col-12 mb-4"
            }
          >
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
        <div
          className={
            product.image() && product.url() ? "col-12 col-md-8" : "col-12"
          }
        >
          <Form
            onSubmit={handleSubmitEdit}
            onCancel={handleCancel}
            loading={loading}
            error={error}
            product={product}
            setProduct={setProduct}
            quantity={quantity}
            setQuantity={setQuantity}
            disabled={disabled}
          />
        </div>
      </div>
    </layout.components.Card>
  );
});
