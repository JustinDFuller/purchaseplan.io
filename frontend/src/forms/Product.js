import React, { useState, useContext } from "react";

import * as User from "../user";
import * as Product from "../product";
import { Card } from "../layout/Card";
import * as styles from "../styles";
import { Submit } from './Submit';

export function ProductForm({ previous, next }) {
  const [url, setUrl] = useState("");
  const [product, setProduct] = useState(null);
  const { user, setUser } = useContext(User.Context);

  async function handleSubmit(e) {
    e.preventDefault();
    const result = await Product.api.get(url);
    setProduct(Product.context.New(result));
  }

  function handleSubmitEdit(e) {
    e.preventDefault();
    setUser(user.addUser.Purchase(User.Purchase().setProduct(product)));
    previous();
  }

  /* function handleDone(e) {
    e.preventDefault();
    User.api.put(user);
    next();
    next();
  } */

  function ProductGet() {
    return (
      <Card>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">
              Enter the URL to the product you want to buy
            </label>
            <div className="row">
              <div className="col col-10 col-md-11">
                <input
                  type="url"
                  className="form-control"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                />
              </div>
              <div className="col col-2 col-md-1">
                <Submit onClick={handleSubmit} />
              </div>
            </div>
          </div>
        </form>
      </Card>
    );
  }

  function ProductEdit() {
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
              <h5 className="card-title">Feel free to fix anything that doesn't look right.</h5>
              <div className="row">
                <div className="form-group col-12 col-md-6">
                  <label className="form-label">Name</label>
                  <input
                    type="text"
                    className="form-control"
                    value={product.data.name}
                    onChange={(e) => setProduct(product.setName(e.target.value))}
                  />
                </div>
                <div className="form-group col-12 col-md-6">
                  <label className="form-label">Description</label>
                  <input
                    type="text"
                    className="form-control"
                    value={product.data.description}
                    onChange={(e) =>
                      setProduct(product.setDescription(e.target.value))
                    }
                  />
                </div>
                <div className="form-group col-12">
                  <label className="form-label">URL</label>
                  <input
                    type="url"
                    className="form-control"
                    value={product.data.url}
                    onChange={(e) => setProduct(product.setUrl(e.target.value))}
                  />
                </div>
              </div>
              <div className="form-group col-12">
                <div className="row">
                  <label className="form-label">Price</label>
                </div>
                <div className="row align-items-center">
                  <div className="col-5 p-0">
                    <input
                      type="number"
                      className="form-control"
                      value={product.data.price}
                      onChange={(e) => setProduct(product.setPrice(e.target.value))}
                    />
                  </div>
                  <div className="col-7 text-right">
                    <Submit onClick={handleSubmitEdit} />
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </Card>
    );
  }

  return product ? <ProductEdit /> : <ProductGet />;
}
