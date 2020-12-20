import React, { useState, useContext } from "react";
import { ReactComponent as CheckCircle } from "bootstrap-icons/icons/check-circle.svg";

import { Purchase } from "../../context/purchases";
import { Product } from "../../context/product";
import * as productapi from "../../api/product";
import * as userapi from "../../api/user";
import * as User from "../../context/user";
import { Card } from "../Card";
import { styles } from "../../styles";

export function ProductForm({ previous, next }) {
  const [url, setUrl] = useState("");
  const [product, setProduct] = useState(null);
  const { user, setUser } = useContext(User.Context);

  async function handleSubmit(e) {
    e.preventDefault();
    const result = await productapi.get(url);
    setProduct(Product(result));
  }

  function handleSubmitEdit(e) {
    e.preventDefault();
    setUser(user.addPurchase(Purchase().setProduct(product)));
    previous();
  }

  function handleDone(e) {
    e.preventDefault();
    userapi.put(user);
    next();
    next();
  }

  function ProductGet() {
    return (
      <Card>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">
              Enter the URL to the product you want to buy
            </label>
            <div className="row">
              <div className="col-11">
                <input
                  type="url"
                  className="form-control"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                />
              </div>
              <div className="col-1">
                <CheckCircle
                  onClick={handleSubmit}
                  className="mt-2"
                  style={{ ...styles.success, ...styles.pointer }}
                  width={24}
                  height={24}
                />
              </div>
            </div>
          </div>
        </form>
      </Card>
    );
  }

  function ProductEdit() {
    return (
      <div className="card text-white" style={styles.darkAlt}>
        <form onSubmit={handleSubmitEdit}>
          <h3>Feel free to fix anything that doesn't look right.</h3>
          <div style={{ width: "20%", display: "inline-block" }}>
            <img
              src={product.data.image}
              alt={product.data.description}
              style={{ width: "90%", height: "auto" }}
            />
          </div>
          <div style={{ width: "80%", display: "inline-block" }}>
            <div className="form-group">
              <label>Name</label>
              <input
                type="text"
                value={product.data.name}
                onChange={(e) => setProduct(product.setName(e.target.value))}
              />
            </div>
            <div className="form-group">
              <label>Description</label>
              <input
                type="text"
                value={product.data.description}
                onChange={(e) =>
                  setProduct(product.setDescription(e.target.value))
                }
              />
            </div>
            <div className="form-group">
              <label>URL</label>
              <input
                type="url"
                value={product.data.url}
                onChange={(e) => setProduct(product.setUrl(e.target.value))}
              />
            </div>
            <div className="form-group">
              <label>Price</label>
              <input
                type="number"
                value={product.data.price}
                onChange={(e) => setProduct(product.setPrice(e.target.value))}
              />
            </div>
          </div>
          <button type="submit">Looks Good</button>
        </form>
      </div>
    );
  }

  return product ? <ProductEdit /> : <ProductGet />;
}
