import React, { useContext, useState } from "react";

import * as Purchases from "../../context/purchases";

export function PurchaseForm({ next }) {
  const [purchase, setPurchase] = useState(Purchases.Purchase());
  const { purchases, setPurchases } = useContext(Purchases.Context);

  return (
    <form
      id="purchase-form"
      class="card"
      onSubmit={e => {
        e.preventDefault();
        setPurchases(purchases.addPurchase(purchase));
        setPurchase(purchase.clear());
      }}
    >
      <label>Now for the fun part! What do you want to buy?</label>
      <br />
      <label>Name</label>
      <input
        type="text"
        name="name"
        value={purchase.name()}
        onChange={e => setPurchase(purchase.setName(e.target.value))}
      />
      <label>Price</label>
      <input
        type="number"
        name="price"
        value={purchase.price()}
        onChange={e => setPurchase(purchase.setPrice(e.target.value))}
      />
      <label>URL</label>
      <input
        type="url"
        name="url"
        value={purchase.url()}
        onChange={e => setPurchase(purchase.setUrl(e.target.value))}
      />
      <button type="submit">Next</button>
      {purchases.hasAtLeastOne() && (
        <button
          type="button"
          onClick={e => {
            if (purchase.isNotEmpty()) {
              setPurchases(purchases.addPurchase(purchase));
              setPurchase(purchase.clear());
            }
            next(e);
          }}
        >
          Done Adding Purchases
        </button>
      )}
    </form>
  );
}
