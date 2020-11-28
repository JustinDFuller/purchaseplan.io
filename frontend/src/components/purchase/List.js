import React, { useContext } from "react";

import * as Purchases from "../../context/purchases";
import * as User from "../../context/user";

export function PurchaseList() {
  const { purchases, setPurchases } = useContext(Purchases.Context);
  const { user } = useContext(User.Context);

  return (
    <div id="purchase-container">
      <strong>Purchases</strong>
      <ul id="purchases">
        {purchases.withAvailability(user.availabilityCalculator()).map(p => (
          <li class="card" key={p.name()}>
            <div>
              <strong>Name: </strong>
              <span class="name">{p.name()}</span>
            </div>
            <div>
              <strong>Price: </strong>
              <span class="price">{p.price()}</span>
            </div>
            <div>
              <strong>URL: </strong>
              <a class="url" href={p.url()}>
                {p.url()}
              </a>
            </div>
            <div>
              <strong>Available On: </strong>
              <span class="availablity">{p.availability()}</span>
            </div>
            <div class="order-buttons">
              {purchases.isNotFirst(p) && (
                <button
                  type="button"
                  onClick={() => setPurchases(purchases.up(p))}
                >
                  Buy Sooner
                </button>
              )}
              {purchases.isNotLast(p) && (
                <button
                  type="button"
                  onClick={() => setPurchases(purchases.down(p))}
                >
                  Buy Later
                </button>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
