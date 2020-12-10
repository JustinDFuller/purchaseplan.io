import React, { useState } from "react";

// import * as productapi from "../../api/product";

export function ProductForm() {
  const [url, setUrl] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    console.log(url);
  }

  return (
    <form onSubmit={handleSubmit}>
      <label>Enter the URL to the product you want to buy</label>
      <br />
      <label>Name</label>
      <input type="url" value={url} onChange={(e) => setUrl(e.target.value)} />
      <button type="submit">Next</button>
    </form>
  );
}
