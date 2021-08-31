import React, { useState } from "react";

import { ReactComponent as MenuIcon } from "bootstrap-icons/icons/three-dots-vertical.svg";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Dropdown from "react-bootstrap/Dropdown";

import * as User from "user";
import * as styles from "styles";
import * as layout from "layout";
import * as notifications from "notifications";
import * as Product from "product";

import { UndoPurchase } from "./UndoPurchase";
import { UndoRemove } from "./UndoRemove";

export const Edit = React.forwardRef(function ({ children, onClick }, ref) {
  return (
    <MenuIcon
      ref={ref}
      onClick={(e) => {
        e.preventDefault();
        onClick(e);
      }}
      style={styles.combine(styles.pointer, styles.zIndex)}
    >
      {children}
    </MenuIcon>
  );
});

export const Card = User.data.WithContext(function ({
  purchase,
  user,
  setUser,
  readonly,
}) {
  const [editing, setEditing] = useState(false);
  const [editProduct, setEditProduct] = useState(purchase.product());
  const [editQuantity, setEditQuantity] = useState(purchase.quantity());

  function onRemove(e, purchase) {
    e.preventDefault();

    const purchases = user.purchases().remove(purchase);
    const u = user.setPurchases(purchases);
    setUser(u);
    User.api.put(u);

    notifications.show(<UndoRemove purchase={purchase} />);
  }

  function onPurchase(e, purchase) {
    e.preventDefault();

    const u = user.purchase(purchase);
    setUser(u);
    User.api.put(u);

    notifications.show(<UndoPurchase purchase={purchase} />);
  }

  function onEdit(e, purchase) {
    e.preventDefault();
    setEditing(true);
  }

  function handleEditSubmit(e) {
    e.preventDefault();
    setEditing(false);
    const u = user.setPurchase(
      purchase.setQuantity(editQuantity).setProduct(editProduct)
    );
    setUser(u);
    User.api.put(u);
  }

  function handleEditCancel(e) {
    e.preventDefault();
    setEditing(false);
  }

  if (editing) {
    return (
      <layout.components.Card>
        <Product.components.ProductForm
          onSubmit={handleEditSubmit}
          onCancel={handleEditCancel}
          product={editProduct}
          setProduct={(p) => setEditProduct(p)}
          quantity={editQuantity}
          setQuantity={(q) => setEditQuantity(q)}
        />
      </layout.components.Card>
    );
  }

  return (
    <layout.components.Card noBody noPadding>
      <a
        href={purchase.product().url() || `?purchase=${purchase.id()}`}
        className="text-white"
        target={purchase.product().url() ? "_blank" : ""}
        rel={purchase.product().url() ? "noopener noreferrer" : ""}
      >
        <Row>
          <Col xs={12} sm={5} md={4}>
            <div
              className="card-img-top"
              style={{
                background: "white",
                width: "100%",
                height: 250,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              {purchase.product().image() ? (
                <img
                  src={purchase.product().image()}
                  alt={purchase.product().name()}
                  style={{
                    backgroundColor: "white",
                    height: "auto",
                    width: "auto",
                    maxHeight: "100%",
                    maxWidth: "100%",
                  }}
                  onError={(e) => {
                    e.target.onError = null;
                    e.target.src = `${process.env.PUBLIC_URL}/404.png`;
                  }}
                />
              ) : (
                <Product.components.Grid />
              )}
            </div>
          </Col>
          <Col xs={12} sm={7} md={8}>
            <div
              className="card-body pl-md-5 d-flex flex-column"
              style={{ position: "relative", height: "100%" }}
            >
              <strong className="price-bubble" style={styles.bubble}>
                ${purchase.price()}
              </strong>

              <div>
                <h5
                  className="card-title mt-3 mt-sm-0 d-inline-block"
                  style={{
                    height: "1.4rem",
                    textOverflow: "ellipsis",
                    overflow: "hidden",
                    whiteSpace: "nowrap",
                    maxWidth: readonly ? "100%" : "90%",
                  }}
                >
                  {purchase.product().name()}
                </h5>

                {!readonly && (
                  <Dropdown className="float-right mt-3 mt-sm-0">
                    <Dropdown.Toggle variant="primary" as={Edit}>
                      Edit
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                      <Dropdown.Item
                        as="button"
                        onClick={(e) => onEdit(e, purchase)}
                      >
                        Edit
                      </Dropdown.Item>
                      <Dropdown.Item
                        as="button"
                        onClick={(e) => onRemove(e, purchase)}
                      >
                        I don't want to buy this
                      </Dropdown.Item>
                      <Dropdown.Item
                        as="button"
                        onClick={(e) => onPurchase(e, purchase)}
                      >
                        I purchased this
                      </Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                )}
              </div>

              {purchase.product().description() && (
                <p className="line-clamp-2 m-0">
                  {purchase.product().description()}
                </p>
              )}
              {purchase.quantity() > 1 && (
                <>
                  <div>
                    <strong style={{ marginRight: 3 }}>Quantity</strong>
                    <span>{purchase.quantity()}</span>
                  </div>
                  <div style={{ marginTop: 10 }}>
                    <strong style={{ marginRight: 3 }}>Individual Price</strong>
                    <span>${purchase.product().price()}</span>
                  </div>
                </>
              )}
              {purchase.date() && (
                <div style={{ marginTop: 10 }}>
                  <strong style={{ marginRight: 3 }}>Ready to buy</strong>
                  <span className="availablity">{purchase.displayDate()}</span>
                </div>
              )}
            </div>
          </Col>
        </Row>
      </a>
    </layout.components.Card>
  );
});
