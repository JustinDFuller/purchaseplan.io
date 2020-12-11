import React, { useState } from "react";

import { Product } from '../../context/product';
import * as productapi from "../../api/product";

export function ProductForm() {
  const [url, setUrl] = useState("");
  const [product, setProduct] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    const result = await productapi.get(url)
    console.log(result)
    setProduct(Product(result))
  }

  function handleSubmitEdit(e) {
    e.preventDefault();
    console.log(product)
  }

  function ProductGet() {
    return (
      <div className="card">
        <form onSubmit={handleSubmit}>
          <label>Enter the URL to the product you want to buy</label>
          <br />
          <label>Name</label>
          <input type="url" value={url} onChange={(e) => setUrl(e.target.value)} />
          <button type="submit">Next</button>
        </form>
      </div>
    )
  }

  function ProductEdit() {
    return (
      <div className="card">
        <form onSubmit={handleSubmitEdit}>
          <h3>Does this look right?</h3>
          <img src={product.data.url} alt={product.data.description} />
          <div className="form-group">
            <label>Name</label>
            <input type="text" value={product.data.name} onChange={e => setProduct(product.setName(e.target.value))} />
          </div>
          <div className="form-group">
            <label>Description</label>
            <input type="text" value={product.data.description} onChange={e => setProduct(product.setDescription(e.target.value))} />
          </div>
          <div className="form-group">
            <label>URL</label>
            <input type="url" value={product.data.url} onChange={e => setProduct(product.setUrl(e.target.value))} />
          </div>
          <div className="form-group">
            <label>Price</label>
            <input type="number" value={product.data.price} onChange={e => setProduct(product.setPrice(e.target.value))} />
          </div>
          <button type="submit">Looks Good</button>
        </form>
      </div>
    )
  }

  return product ? <ProductEdit /> : <ProductGet />
}
