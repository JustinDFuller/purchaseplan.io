import React, { useState } from "react";
import cn from "classnames";

import * as User from "../user";
import * as Product from "../product";
import * as styles from "../styles";
import { Card } from "../layout/Card";
import { Submit } from "../forms/Submit";
import { URL } from "./URL";

const NO_ERROR = 0;
const INVALID_SEARCH = 1;
const DUPLICATE_NAME = 2;

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

    if (user.isDuplicateName(product)) {
      setError(DUPLICATE_NAME);
      return;
    }

    setError(NO_ERROR);
    const u = user.addPurchase(
      User.Purchase().setQuantity(quantity).setProduct(product)
    );
    setUser(u);
    User.api.put(u);
    setProduct(null);
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
          <form onSubmit={handleSubmitEdit}>
            <h5 className="card-title">Does everything look correct?</h5>
            <div className="row">
              <div className="form-group col-12">
                <label className="form-label">Name</label>
                <input
                  autoFocus
                  type="text"
                  className={cn("form-control", {
                    "is-invalid": error === DUPLICATE_NAME,
                  })}
                  value={product.data.name}
                  onChange={(e) => setProduct(product.setName(e.target.value))}
                  required
                />
                {error === DUPLICATE_NAME && (
                  <div className="invalid-feedback">
                    Please choose a unique name.
                  </div>
                )}
              </div>
              <div className="form-group col-12">
                <label className="form-label">Description</label>
                <textarea
                  type="text"
                  className="form-control"
                  value={product.data.description}
                  onChange={(e) =>
                    setProduct(product.setDescription(e.target.value))
                  }
                  required
                />
              </div>
            </div>
            <div className="form-group col-12">
              <div className="row">
                <div className="col-12 col-md-6 pl-0">
                  <label className="form-label">Price</label>
                  <input
                    type="number"
                    className="form-control"
                    placeholder="0"
                    value={
                      product.data.price ? product.data.price.toString() : ""
                    }
                    onChange={(e) =>
                      setProduct(product.setPrice(e.target.value))
                    }
                    required
                  />
                </div>
                <div className="col-12 col-md-6 pr-0">
                  <label className="form-label">Quantity</label>
                  <input
                    type="number"
                    className="form-control"
                    placeholder="0"
                    min="1"
                    max="9999"
                    value={quantity.toString() || "1"}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                    required
                  />
                </div>
              </div>
              <div className="row align-items-center">
                <div className="col-12 text-right mt-4">
                  <div className="row">
                    <div className="col-12 col-md-6 p-0 mb-2 pr-md-3">
                      <button
                        type="button"
                        className="btn btn-danger mr-2 w-100"
                        style={styles.combine(
                          styles.danger,
                          styles.transparent
                        )}
                        onClick={() => setProduct(productDefaults)}
                      >
                        Cancel
                      </button>
                    </div>
                    <div className="col-12 col-md-6 p-0 pl-md-3">
                      <Submit
                        onClick={handleSubmitEdit}
                        loading={loading}
                        text="Save"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </Card>
  );
});
