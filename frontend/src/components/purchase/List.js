import React, { useContext } from "react";

import * as User from "../../context/user";
import * as userapi from "../../api/user";

export function PurchaseList() {
  const { user, setUser } = useContext(User.Context);

  console.log(user);

  return (
    <div id="purchase-container">
      {user.purchases().map((purchase) => (
        <div className="card">
          <div style={{ width: "20%", display: "inline-block" }}>
            <img
              src={purchase.data.product.image}
              alt={purchase.data.product.description}
              style={{ width: "90%", height: "auto" }}
            />
          </div>
          <div style={{ width: "80%", display: "inline-block" }}>
            <a href={purchase.data.product.url}>
              <h3>{purchase.data.product.name}</h3>
            </a>
            <p className="form-group">
              <strong style={{ marginRight: 3 }}>
                ${purchase.data.product.price}
              </strong>
              {purchase.data.product.description}
            </p>
            <div style={{ marginTop: 10 }}>
              <strong style={{ marginRight: 3 }}>Available</strong>
              <span className="availablity">{purchase.data.date}</span>
            </div>
          </div>
          <div className="order-buttons">
            {user.purchases().isNotFirst(purchase) && (
              <button
                type="button"
                onClick={() => {
                  const u = user.setPurchases(user.purchases().up(purchase));
                  setUser(u);
                  userapi.put(u);
                }}
              >
                Buy Sooner
              </button>
            )}
            {user.purchases().isNotLast(purchase) && (
              <button
                type="button"
                onClick={() => {
                  const u = user.setPurchases(user.purchases().down(purchase));
                  setUser(u);
                  userapi.put(u);
                }}
              >
                Buy Later
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
