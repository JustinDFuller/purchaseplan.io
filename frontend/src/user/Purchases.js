import * as userapi from "./api";
import { Card } from "../layout/Card";
import { withContext } from './context/with';

export const Purchases = withContext(function ({ user, setUser }) {
  return (
    <div id="purchase-container">
      {user.purchases().map((purchase) => (
        <Card>
          <div style={{ width: "20%", display: "inline-block" }}>
            <img
              src={purchase.data.product.data.image}
              alt={purchase.data.product.data.description}
              style={{ width: "90%", height: "auto" }}
            />
          </div>
          <div style={{ width: "80%", display: "inline-block" }}>
            <a href={purchase.data.product.data.url} className="text-white">
              <h5 className="card-title">{purchase.data.product.data.name}</h5>
            </a>
            <p className="form-group">
              <strong style={{ marginRight: 3 }}>
                ${purchase.data.product.data.price}
              </strong>
              {purchase.data.product.data.description}
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
        </Card>
      ))}
    </div>
  );
})
