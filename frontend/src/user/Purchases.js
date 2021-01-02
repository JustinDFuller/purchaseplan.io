import { Card } from "../layout/Card";
import { withContext } from "./context/with";
import * as styles from "../styles";

export const Purchases = withContext(function ({ user, setUser }) {
  return (
    <div className="row">
      {user.purchases().map((purchase) => (
        <div className="col-12" key={purchase.data.product.data.name}>
          <Card noBody>
            <div className="row">
              <div className="col-12 col-lg-3">
                <img
                  className="card-img-top"
                  src={purchase.data.product.data.image}
                  alt={purchase.data.product.data.description}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src =
                      "https://cdn.dribbble.com/users/2046015/screenshots/6015680/08_404.gif"; // TODO: Find another image.
                  }}
                />
              </div>
              <div className="col-12 col-lg-9">
                <div className="card-body" style={{ position: "relative" }}>
                  <strong className="price-bubble" style={styles.bubble}>
                    ${purchase.data.product.data.price}
                  </strong>
                  <a
                    href={purchase.data.product.data.url}
                    className="text-white"
                  >
                    <h5 className="card-title mt-3 mt-lg-0">
                      {purchase.data.product.data.name}
                    </h5>
                  </a>
                  <p>
                    {purchase.data.product.data.description.slice(0, 150)}
                    {purchase.data.product.data.description.length > 150 &&
                      "..."}
                  </p>
                  <div style={{ marginTop: 10 }}>
                    <strong style={{ marginRight: 3 }}>Ready to buy</strong>
                    <span className="availablity">
                      {purchase.displayDate()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      ))}
    </div>
  );
});

/*
 <div className="btn-group-vertical float-right mt-3">
                        {user.purchases().isNotFirst(purchase) && (
                          <button
                            className="btn btn-outline-primary"
                            type="button"
                            onClick={() => {
                              const u = user.setPurchases(
                                user.purchases().up(purchase)
                              );
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
                              const u = user.setPurchases(
                                user.purchases().down(purchase)
                              );
                              setUser(u);
                              userapi.put(u);
                            }}
                          >
                            Buy Later
                          </button>
                        )}
                      </div>
                      */
