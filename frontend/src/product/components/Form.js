import { useState } from "react";

import ReactTooltip from "react-tooltip";
import { ReactComponent as Pencil } from "bootstrap-icons/icons/pencil-square.svg";
import { ReactComponent as Plus } from "bootstrap-icons/icons/plus-square.svg";
import Alert from "react-bootstrap/Alert";

import * as styles from "styles";
import * as form from "form";

export function Form({
  onSubmit,
  product,
  setProduct,
  error,
  quantity,
  setQuantity,
  loading,
  onCancel,
}) {
  const [showNote, setShowNote] = useState(product.description);
  const [showQuantity, setShowQuantity] = useState(quantity > 1);
  // Cache product.missing so it doesn't update as the user edits the form.
  const [missingText] = useState(product.missing());

  return (
    <form onSubmit={onSubmit}>
      {product.url() && missingText && (
        <Alert variant="danger">
          <div className="mb-2">
            🤦 Looks like there's no <strong>{missingText}</strong> for this
            product.
          </div>
          Sorry about that. We'll try to improve Purchase Plan's ability to
          understand this website.
        </Alert>
      )}
      <h5 className="card-title">
        {product.url()
          ? "Does everything look correct?"
          : "What are you buying?"}
      </h5>
      <div className="row">
        <div className="form-group col-12">
          <label className="form-label">Name</label>
          <input
            type="text"
            className="form-control"
            value={product.name()}
            onChange={(e) => setProduct(product.setName(e.target.value))}
            required
          />
        </div>
      </div>
      <div className="row">
        <div className="form-group col-12">
          <label className="form-label">Price</label>
          <input
            type="number"
            className="form-control"
            placeholder="0"
            step="1"
            value={product.price() ? product.price().toString() : ""}
            onChange={(e) => setProduct(product.setPrice(e.target.value))}
            required
          />
        </div>
        {showNote && (
          <div className="form-group col-12">
            <label className="form-label">Note</label>
            <textarea
              type="text"
              className="form-control"
              value={product.description()}
              onChange={(e) =>
                setProduct(product.setDescription(e.target.value))
              }
            />
          </div>
        )}
        {showQuantity && (
          <div className="form-group col-12">
            <label className="form-label">Quantity</label>
            <input
              type="number"
              className="form-control"
              placeholder="0"
              step="1"
              min="1"
              max="9999"
              value={quantity.toString() || "1"}
              onChange={(e) => setQuantity(Number(e.target.value))}
              required
            />
          </div>
        )}
      </div>
      {(!showNote || !showQuantity) && (
        <div className="row mb-3">
          <div className="col-12">
            Add to purchase:
            <div
              style={{
                display: "inline-block",
                padding: "5px 15px",
                marginLeft: 20,
                background: styles.theme.addToPurchaseBackground,
                color: styles.theme.addToPurchaseColor,
                borderRadius: 5,
              }}
            >
              {!showNote && (
                <Pencil
                  height="19"
                  width="19"
                  className="mx-2"
                  style={{ cursor: "pointer" }}
                  onClick={() => setShowNote(true)}
                  data-tip="Add a note"
                />
              )}
              {!showQuantity && (
                <Plus
                  height="17"
                  width="19"
                  className="mx-2"
                  style={{ cursor: "pointer" }}
                  onClick={() => {
                    setShowQuantity(true);
                    setShowQuantity(true);
                  }}
                  data-tip="Increase quantity"
                />
              )}
              {/*<Image
              className="mx-2"
              style={{ cursor: "pointer" }}
              onClick={() => setShowImage(true)}
              data-tip="Add an image"
            /> */}
            </div>
          </div>
        </div>
      )}
      <div className="col-12 text-right mt-2">
        <div className="row">
          <div className="col-12 col-md-6 p-0 pr-md-3">
            <form.components.Submit
              onClick={onSubmit}
              loading={loading}
              text="Save"
            />
          </div>
          <div className="col-12 col-md-6 p-0 mt-3 mt-md-0 pl-md-3">
            <button
              type="button"
              className="btn btn-danger mr-2 w-100"
              style={styles.danger}
              onClick={onCancel}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
      <ReactTooltip
        className="opaque"
        place="top"
        type="dark"
        effect="solid"
        backgroundColor="#0a0a24"
      />
    </form>
  );
}
