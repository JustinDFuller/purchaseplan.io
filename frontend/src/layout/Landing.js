import * as Auth from "../auth";
import * as styles from "../styles";
import * as User from "../user";
import * as Purchase from "../purchase";
import * as Product from "../product";

function makeDate(days) {
  const today = new Date();
  today.setDate(today.getDate() + days);
  return today;
}

const samplePurchases = [
  {
    name: "an immersive home theater",
    products: [
      User.Purchase({
        date: makeDate(20),
        product: Product.data.New({
          name: "Optoma 4k Projector",
          description:
            "A really good mid-tier 4k projector at a reasonable price.",
          price: 2373,
          url: "https://amzn.to/3rRVnt2",
          image:
            "https://storage.googleapis.com/download/storage/v1/b/purchase-plan-images-prd/o/2c5e30f70deb8b5e9342d882ab01ad86?alt=media",
        }),
      }),
      User.Purchase({
        date: makeDate(20),
        product: Product.data.New({
          name: "Elite Screens 4k Projector Screen",
          description: "A simple manual projector screen that is 4k-ready.",
          price: 69,
          url: "https://amzn.to/3dgxnvL",
          image:
            "https://storage.googleapis.com/download/storage/v1/b/purchase-plan-images-prd/o/72474e3d1e0e6acb7580028531e8abb1?alt=media",
        }),
      }),
      User.Purchase({
        date: makeDate(30),
        product: Product.data.New({
          name: "Enclave Audio Surround Sound Bluetooth Speakers",
          description:
            "These bluetooth speakers have really good reviews. Plus, no wires!",
          price: 799,
          url: "https://amzn.to/37gEws6",
          image:
            "https://storage.googleapis.com/download/storage/v1/b/purchase-plan-images-prd/o/98e578528df6cc80d41eeb3dc5c6dc55?alt=media",
        }),
      }),
      User.Purchase({
        date: makeDate(30),
        product: Product.data.New({
          name: "Chromecast Ultra (4k)",
          description: "To watch things with!",
          price: 49,
          url: "https://store.google.com/us/product/chromecast_google_tv",
          image:
            "https://storage.googleapis.com/download/storage/v1/b/purchase-plan-images-prd/o/173d7f269d7e395e05f53b47729b3fc2?alt=media",
        }),
      }),
    ],
  },
  {
    name: "your dream kitchen.",
  },
  {
    name: "the perfect back yard.",
  },
  {
    name: "a fall wardrobe.",
  },
];

export function Landing() {
  return (
    <>
      <div className="row">
        <div className="col-12 col-md-6 text-white pt-md-4 pl-lg-5">
          <div className="m-auto" style={{ maxWidth: 424 }}>
            <h5>Purchase Plan</h5>
            <h1>
              Not a wish list — <br className="d-lg-none" /> a plan.
            </h1>
          </div>
        </div>
        <div className="col-12 col-md-6 mt-4 mt-md-0">
          <Auth.Login />
        </div>
      </div>
      <div
        className="row text-white my-md-4 py-4"
        style={styles.combine(styles.darkLight, {
          minHeight: 200,
          borderTop: "3px solid rgb(10, 10, 36)",
          borderBottom: "3px solid rgb(10, 10, 36)",
        })}
      >
        <div className="col-12 col-lg-8 col-xl-7 pt-3 order-2 order-lg-1">
          {samplePurchases[0].products.map((p) => (
            <Purchase.components.Card
              purchase={p}
              readonly
              key={p.product().name()}
            />
          ))}
        </div>
        <div className="col-12 col-lg-4 col-xl-5 d-flex d-column align-items-center justify-content-center order-1 order-lg-2">
          <h2>
            Plan for... <br /> {samplePurchases[0].name}
          </h2>
        </div>
      </div>
    </>
  );
}
