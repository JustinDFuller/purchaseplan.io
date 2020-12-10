import React, { useContext } from "react";

import * as User from "../../context/user";
import * as userapi from "../../api/user";

export function PurchaseList() {
  const { user, setUser } = useContext(User.Context);

  return (
    <div id="purchase-container">
      <strong>Purchases</strong>
      <ul id="purchases">
        {user
          .purchases()
          .withAvailability(user.availabilityCalculator())
          .map((p) => (
            <li className="card" key={p.name()}>
              <div>
                <strong>Name: </strong>
                <span className="name">{p.name()}</span>
              </div>
              <div>
                <strong>Price: </strong>
                <span className="price">{p.price()}</span>
              </div>
              <div>
                <strong>URL: </strong>
                <a className="url" href={p.url()}>
                  {p.url()}
                </a>
              </div>
              <div>
                <strong>Available On: </strong>
                <span className="availablity">{p.availability()}</span>
              </div>
              <div className="order-buttons">
                {user.purchases().isNotFirst(p) && (
                  <button
                    type="button"
                    onClick={() => {
                      const u = user.setPurchases(user.purchases().up(p));
                      setUser(u);
                      userapi.put(u);
                    }}
                  >
                    Buy Sooner
                  </button>
                )}
                {user.purchases().isNotLast(p) && (
                  <button
                    type="button"
                    onClick={() => {
                      const u = user.setPurchases(user.purchases().down(p));
                      setUser(u);
                      userapi.put(u);
                    }}
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
