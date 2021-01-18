import * as Auth from "../auth";
import * as styles from "../styles";
import * as User from "../user";
import * as Purchase from "../purchase";
import * as Product from "../product";

const samplePurchases = [
  User.Purchase({
    date: new Date(),
    product: Product.data.New({
      name: "Wood & Cane Cabinet",
      image:
        "https://storage.googleapis.com/download/storage/v1/b/purchase-saving-planner-images-local/o/8c346e2df62c0eedce1a24e26dfe6511?alt=media",
      price: 229,
      description: "For the living room",
    }),
  }),
];

export function Landing() {
  return (
    <>
      <div className="row">
        <div className="col-12 col-md-6 text-white pt-4 pl-5">
          <div className="m-auto" style={{ width: 424 }}>
            <h5>Purchase Plan</h5>
            <h1>Not a wish list — a plan.</h1>
          </div>
        </div>
        <div className="col-12 col-md-6">
          <Auth.Login />
        </div>
      </div>
      <div
        className="row"
        style={styles.combine(styles.darkLight, {
          background: "#f3f1c4",
          minHeight: 200,
          marginTop: "4rem",
          marginBottom: "4rem",
        })}
      >
        <div className="col-12 col-md-6 pt-3 pl-5">
          {samplePurchases.map((p) => (
            <Purchase.components.Card purchase={p} />
          ))}
        </div>
        <div className="col-12 col-md-6 d-flex d-column align-items-center justify-content-center">
          <h2>
            Plan your purchases. <br /> Know where your money is going.
          </h2>
        </div>
      </div>
    </>
  );
}
