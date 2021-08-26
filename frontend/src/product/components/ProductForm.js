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
  return (
    <form onSubmit={onSubmit}>
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
        <div className="form-group col-12">
          <label className="form-label">Description</label>
          <textarea
            type="text"
            className="form-control"
            value={product.description()}
            onChange={(e) => setProduct(product.setDescription(e.target.value))}
            required
          />
        </div>
      </div>
      <div className="col-12">
        <div className="row">
          <div className="form-group col-12 col-md-6 pl-0 pr-0 pr-md-3">
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
          <div className="form-group col-12 col-md-6 pr-0 pl-0 pl-md-3">
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
        </div>
        <div className="row align-items-center">
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
                  style={styles.combine(styles.danger, styles.transparent)}
                  onClick={onCancel}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
