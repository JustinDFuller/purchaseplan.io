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
  User.Purchase({
    date: makeDate(2),
    product: Product.data.New({
      name: "Lily Storage Cabinet",
      description: "For the living room",
      price: 179,
      url: "https://www.urbanoutfitters.com/shop/lily-storage-cabinet",
      image:
        "https://storage.googleapis.com/download/storage/v1/b/purchase-plan-images-local/o/95ba7d219d70e5d06975e878cbf2106f?alt=media",
      originalImage:
        "https://s7d5.scene7.com/is/image/UrbanOutfitters/58325390_111_b?$xlarge$&fit=constrain&qlt=80&wid=683",
    }),
  }),
  User.Purchase({
    date: makeDate(14),
    product: Product.data.New({
      name: 'KOLBJÖRN Cabinet, indoor/outdoor - green 31 1/2x31 7/8 "',
      description: "For the kids' tinker station on the deck",
      price: 79,
      url:
        "https://www.ikea.com/us/en/p/kolbjoern-cabinet-indoor-outdoor-green-00450347/",
      image:
        "https://storage.googleapis.com/download/storage/v1/b/purchase-plan-images-local/o/81d08b11c66d4a8c9edcc0cefaf2b7ec?alt=media",
      originalImage:
        "https://www.ikea.com/us/en/images/products/kolbjoern-cabinet-indoor-outdoor-green__0762731_PE752182_S5.JPG",
    }),
  }),
  User.Purchase({
    date: makeDate(31),
    product: Product.data.New({
      name:
        "SOLLERÖN Modular corner sofa 4-seat, outdoor - with footstool brown/Frösön/Duvholmen beige",
      description: "Back deck! Summer!",
      price: 1205,
      url:
        "https://www.ikea.com/us/en/p/solleroen-modular-corner-sofa-4-seat-outdoor-with-footstool-brown-froesoen-duvholmen-beige-s89252570/",
      image:
        "https://storage.googleapis.com/download/storage/v1/b/purchase-plan-images-local/o/b27dbf46d823a99aa14f939322886737?alt=media",
      originalImage:
        "https://www.ikea.com/us/en/images/products/solleroen-modular-corner-sofa-4-seat-outdoor-with-footstool-brown-froesoen-duvholmen-beige__0728668_PE736394_S5.JPG",
    }),
  }),
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
          {samplePurchases.map((p) => (
            <Purchase.components.Card
              purchase={p}
              readonly
              key={p.product().name()}
            />
          ))}
        </div>
        <div className="col-12 col-lg-4 col-xl-5 d-flex d-column align-items-center justify-content-center order-1 order-lg-2">
          <h2>
            Plan your purchases. <br /> Know where your money is going.
          </h2>
        </div>
      </div>
    </>
  );
}
