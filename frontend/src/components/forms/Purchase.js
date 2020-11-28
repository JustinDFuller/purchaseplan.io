import React, { useContext, useState } from "react";

import * as Purchases from "../../context/purchases";
import * as User from "../../context/user";
import * as userapi from "../../api/user";

export function PurchaseForm({ next }) {
  const [purchase, setPurchase] = useState(Purchases.Purchase());
  const { user, setUser } = useContext(User.Context);

  async function handleSubmit(e) {
    e.preventDefault();
    const u = user.setPurchases(user.purchases().addPurchase(purchase))
    setUser(u);
    setPurchase(purchase.clear());
    await userapi.put(u)
  }

  async function handleDone(e) {
    if (purchase.isNotEmpty()) {
      await handleSubmit(e)
    }
    next(e);
  }

  return (
    <form
      id="purchase-form"
      class="card"
      onSubmit={handleSubmit} >
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
      {user.purchases().hasAtLeastOne() && (
        <button
          type="button"
          onClick={handleDone}
        >
          Done Adding Purchases
        </button>
      )}
    </form>
  );
}
