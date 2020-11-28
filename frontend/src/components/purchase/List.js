import React, { useContext } from "react";

import * as User from "../../context/user";

export function PurchaseList() {
  const { user, setUser } = useContext(User.Context);

  return (
    <div id="purchase-container">
      <strong>Purchases</strong>
      <ul id="purchases">
        {user.purchases().withAvailability(user.availabilityCalculator()).map(p => (
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
              {user.purchases().isNotFirst(p) && (
                <button
                  type="button"
                  onClick={() => setUser(user.setPurchases(user.purchases().up(p)))}
                >
                  Buy Sooner
                </button>
              )}
              {user.purchases().isNotLast(p) && (
                <button
                  type="button"
                  onClick={() => setUser(user.setPurchases(user.purchases().down(p)))}
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
