import React from "react";

import { ReactComponent as Pencil } from "bootstrap-icons/icons/pencil.svg";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Dropdown from "react-bootstrap/Dropdown";

import * as User from "../../user";
import * as styles from "../../styles";
import * as Layout from "../../layout";
import * as notifications from "../../notifications";

import { UndoPurchase } from "./UndoPurchase";
import { UndoRemove } from "./UndoRemove";

export const Edit = React.forwardRef(function ({ children, onClick }, ref) {
  return (
    <Pencil ref={ref} onClick={onClick} style={styles.pointer}>
      {children}
    </Pencil>
  );
});

export const Card = User.withContext(function ({
  purchase,
  user,
  setUser,
  readonly,
}) {
  function onRemove(purchase) {
    const purchases = user.purchases().remove(purchase);
    const u = user.setPurchases(purchases);
    setUser(u);
    User.api.put(u);

    notifications.show(<UndoRemove purchase={purchase} />);
  }

  function onPurchase(purchase) {
    const purchases = user.purchases().purchase(purchase);
    const u = user.setPurchases(purchases);
    setUser(u);
    User.api.put(u);

    notifications.show(<UndoPurchase purchase={purchase} />);
  }
  return (
    <Layout.Card noBody>
      <Row>
        <Col xs={12} sm={5} md={4}>
          <div
            className="card-img-top"
            style={{
              backgroundColor: "white",
              backgroundImage: `url('${purchase.data.product.data.image}')`,
              minHeight: "200px",
              height: "100%",
              width: "100%",
              backgroundPosition: "top",
              backgroundSize: "cover",
              backgroundRepeat: "no-repeat",
            }}
            alt={purchase.data.product.data.description}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src =
                "https://cdn.dribbble.com/users/2046015/screenshots/6015680/08_404.gif"; // TODO: Find another image.
            }}
          />
        </Col>
        <Col xs={12} sm={7} md={8}>
          <div className="card-body pl-md-5" style={{ position: "relative" }}>
            <strong className="price-bubble" style={styles.bubble}>
              ${purchase.data.product.data.price}
            </strong>

            <a href={purchase.data.product.data.url} className="text-white">
              <h5
                className="card-title mt-3 mt-sm-0 d-inline-block"
                style={{
                  height: "1.4rem",
                  textOverflow: "ellipsis",
                  overflow: "hidden",
                  whiteSpace: "nowrap",
                  maxWidth: "90%",
                }}
              >
                {purchase.data.product.data.name}
              </h5>
            </a>

            {!readonly && (
              <Dropdown className="float-right mt-3 mt-sm-0">
                <Dropdown.Toggle variant="primary" as={Edit}>
                  Edit
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item as="button" onClick={() => onRemove(purchase)}>
                    Remove this product
                  </Dropdown.Item>
                  <Dropdown.Item
                    as="button"
                    onClick={() => onPurchase(purchase)}
                  >
                    I purchased this product
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            )}

            <p style={{ maxWidth: "90%" }}>
              {purchase.data.product.data.description.slice(0, 150)}
              {purchase.data.product.data.description.length > 150 && "..."}
            </p>
            <div style={{ marginTop: 10 }}>
              <strong style={{ marginRight: 3 }}>Ready to buy</strong>
              <span className="availablity">{purchase.displayDate()}</span>
            </div>
          </div>
        </Col>
      </Row>
    </Layout.Card>
  );
});
