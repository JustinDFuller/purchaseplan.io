import { useState } from "react";

import ReactTooltip from "react-tooltip";
import { ReactComponent as Pencil } from "bootstrap-icons/icons/pencil-square.svg";
// import { ReactComponent as Image } from "bootstrap-icons/icons/image.svg";
import { ReactComponent as Plus } from "bootstrap-icons/icons/plus-square.svg";

import * as styles from "styles";
import * as form from "form";

export function ProductForm({
  onSubmit,
  product,
  setProduct,
  error,
  quantity,
  setQuantity,
  loading,
  onCancel,
}) {
  const [showNote, setShowNote] = useState(false);
  const [showQuantity, setShowQuantity] = useState(false);
  // const [showImage, setShowImage] = useState(false);

  const name = (
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
  );

  const price = (
    <div className="form-group col-12">
      <label className="form-label">Price</label>
      <input
        type="number"
        className="form-control"
        placeholder="0"
        value={product.price() ? product.price().toString() : ""}
        onChange={(e) => setProduct(product.setPrice(e.target.value))}
        required
      />
    </div>
  );

  const note = (
    <div className="form-group col-12">
      <label className="form-label">Note</label>
      <textarea
        type="text"
        className="form-control"
        value={product.description()}
        onChange={(e) => setProduct(product.setDescription(e.target.value))}
      />
    </div>
  );

  const quantityInput = (
    <div className="form-group col-12">
      <label className="form-label">Quantity</label>
      <input
        type="number"
        className="form-control"
        placeholder="0"
        min="1"
        max="9999"
        value={quantity.toString() || "1"}
        onChange={(e) => setQuantity(Number(e.target.value))}
        required
      />
    </div>
  );

  const [inputs, setInputs] = useState([name, price]);

  return (
    <form onSubmit={onSubmit}>
      <h5 className="card-title">
        {product.url()
          ? "Does everything look correct?"
          : "What are you buying?"}
      </h5>
      <div className="row">{inputs}</div>
      {(!showNote || !showQuantity) && (
        <div className="row mb-3">
          <div className="col-12">
            Add to purchase:
            <div
              style={{
                display: "inline-block",
                padding: "10px 20px",
                marginLeft: 20,
                background: "rgb(38, 38, 78)",
                borderRadius: 5,
              }}
            >
              {!showNote && (
                <Pencil
                  className="mx-2"
                  style={{ cursor: "pointer" }}
                  onClick={() => {
                    setShowNote(true);
                    setInputs([...inputs, note]);
                  }}
                  data-tip="Add a note"
                />
              )}
              {!showQuantity && (
                <Plus
                  className="mx-2"
                  style={{ cursor: "pointer" }}
                  onClick={() => {
                    setShowQuantity(true);
                    setQuantity(2);
                    setInputs([...inputs, quantityInput]);
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
