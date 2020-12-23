import * as userapi from "./api";
import { Card } from "../layout/Card";
import { withContext } from './context/with';
import * as styles from '../styles';

export const Purchases = withContext(function ({ user, setUser }) {
  return (
    <div className="row">
      {user.purchases().map((purchase) => (
        <div className="col-12" key={purchase.data.product.data.name}>
          <Card noBody >
            <div className="row">
              <div className="col-4">
                <img
                  className="card-img-top"
                  src={purchase.data.product.data.image}
                  alt={purchase.data.product.data.description}
                />
              </div>
              <div className="col-8">
                <div className="card-body">
                  <div className="row">
                    <div className="col-9">
                      <a href={purchase.data.product.data.url} className="text-white">
                        <h5 className="card-title">{purchase.data.product.data.name}</h5>
                      </a>
                    <p>
                      {purchase.data.product.data.description}
                    </p>
                    <div style={{ marginTop: 10 }}>
                      <strong style={{ marginRight: 3 }}>Ready to buy on:</strong>
                      <span className="availablity">{purchase.data.date}</span>
                    </div>
                    </div>
                    <div className="col-3">
                      <strong style={styles.bubble} className="float-right">
                        ${purchase.data.product.data.price}
                      </strong>
                    </div>
                  </div>
                </div>
                <div className="card-body">
                  <div className="btn-group">
                    {user.purchases().isNotFirst(purchase) && (
                      <button
                        className="btn btn-outline-primary"
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
                        className="btn btn-outline-primary"
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
              </div>
            </div>
          </Card>
        </div>
      ))}
    </div>
  );
})
