import React, { useEffect, useState, useRef } from "react";

import * as Auth from "auth";
import * as styles from "styles";
import * as User from "user";
import * as Purchase from "purchase";
import * as Product from "product";

import * as components from "../components";

function makeDate(days) {
  const today = new Date();
  today.setDate(today.getDate() + days);
  return today;
}

const samplePurchases = [
  {
    name: "an immersive home theater",
    products: [
      User.data.Purchase.New({
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
      User.data.Purchase.New({
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
      User.data.Purchase.New({
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
    ],
  },
  {
    name: "your dream kitchen.",
    products: [
      User.data.Purchase.New({
        date: makeDate(30),
        product: Product.data.New({
          name: "KitchenAid Refridgerator",
          description: "KitchenAid 5-Door French Door Refridgerator",
          price: 4099,
          url: "https://www.lowes.com/pd/KitchenAid-25-8-cu-ft-5-Door-French-Door-Refrigerator-with-Ice-Maker-Stainless-Steel/50413062",
          image:
            "https://storage.googleapis.com/download/storage/v1/b/purchase-plan-images-prd/o/bb62d5e907ce64be5280169ae7991219?alt=media",
        }),
      }),
      User.data.Purchase.New({
        date: makeDate(45),
        product: Product.data.New({
          name: "KitchenAid Combination Wall Oven",
          description:
            "KitchenAid 30-inch Self-Cleaning Combination Microwave and Wall Oven",
          price: 3899,
          url: "https://www.lowes.com/pd/KitchenAid-Self-Cleaning-Convection-Microwave-Wall-Oven-Combo-Stainless-Steel-30-in-Actual-30-in/50353220",
          image:
            "https://storage.googleapis.com/download/storage/v1/b/purchase-plan-images-prd/o/0339bed0ce53e3bbab6a8f85636ac9ee?alt=media",
        }),
      }),
      User.data.Purchase.New({
        date: makeDate(60),
        product: Product.data.New({
          name: "KitchenAid Cooktop",
          description: "KitchenAid 48-in 6 burner Gas Cooktop",
          image:
            "https://storage.googleapis.com/download/storage/v1/b/purchase-plan-images-prd/o/cbeb94818545ca6314704c5c28be50eb?alt=media",
          price: 3999,
          url: "https://www.lowes.com/pd/KitchenAid-48-in-6-Burners-Stainless-Steel-Gas-Cooktop-Common-48-in-Actual-48-in/1001227780",
        }),
      }),
    ],
  },
  {
    name: "the perfect back yard.",
    products: [
      User.data.Purchase.New({
        date: makeDate(20),
        product: Product.data.New({
          name: "Zuma Outdoor Sectional",
          description: "Zuma three-piece sectional with ottoman",
          price: 3496,
          url: "https://www.crateandbarrel.com/zuma-outdoor-upholstered-3-piece-sectional-with-ottoman/s175683",
          image:
            "https://storage.googleapis.com/download/storage/v1/b/purchase-plan-images-prd/o/1d780a17877f7ec6e3dcbb3f45b93fae?alt=media",
        }),
      }),
      User.data.Purchase.New({
        date: makeDate(20),
        product: Product.data.New({
          name: "ÄPPLARÖ Outdoor Table",
          description:
            "ÄPPLARÖ Outdoor Table seats up to 8 chairs and has a hole in the middle for an umbrella.",
          price: 149,
          url: "https://www.ikea.com/us/en/p/aepplaroe-table-outdoor-brown-stained-70419787/",
          image:
            "https://storage.googleapis.com/download/storage/v1/b/purchase-plan-images-prd/o/9d8a7496cc6cfa83226ac32d3b2802b1?alt=media",
        }),
      }),
      User.data.Purchase.New({
        date: makeDate(30),
        product: Product.data.New({
          name: "White Rectangular Patio Umbrella",
          description: "10' rectangular umbrella from Crate & Barrel",
          price: 559,
          url: "https://www.crateandbarrel.com/rectangular-sunbrella-white-sand-patio-umbrella-with-eucalyptus-frame/s130474",
          image:
            "https://storage.googleapis.com/download/storage/v1/b/purchase-plan-images-prd/o/bf29cc3d4817fa2ee56ff58145db731f?alt=media",
        }),
      }),
    ],
  },
];

export function Landing() {
  const [sample, setSample] = useState(0);
  const ref = useRef();

  useEffect(function () {
    if (ref.current) {
      clearTimeout(ref.current);
    }

    // The ref is only needed to keep things from going crazy during hot reloads.
    ref.current = setInterval(function () {
      setSample(function (s) {
        if (s >= samplePurchases.length - 1) {
          return 0;
        }
        return s + 1;
      });
    }, 8000);

    return function () {
      clearTimeout(ref.Current);
    };
  }, []);

  return (
    <>
      <div className="row m-auto">
        <div className="col-12 col-md-6 text-white pt-md-4 pl-lg-5">
          <div className="m-auto" style={{ maxWidth: 424 }}>
            <h5>Purchase Plan</h5>
            <h1>
              Not a wish list — <br className="d-lg-none" /> a plan.
            </h1>
          </div>
        </div>
        <div className="col-12 col-md-6 mt-4 mt-md-0">
          <Auth.components.Login />
        </div>
      </div>
      <div
        className="row m-auto text-white my-md-4 py-4 px-1 px-md-3"
        style={styles.combine(styles.darkLight, {
          minHeight: 200,
          borderTop: "3px solid rgb(10, 10, 36)",
          borderBottom: "3px solid rgb(10, 10, 36)",
        })}
      >
        <div className="col-12 col-lg-8 col-xl-7 pt-3 order-2 order-lg-1">
          {samplePurchases[sample].products.map((p) => (
            <Purchase.components.Card
              purchase={p}
              readonly
              key={p.product().name()}
            />
          ))}
        </div>
        <div className="col-12 col-lg-4 col-xl-5 d-flex d-column align-items-md-center justify-content-md-center order-1 order-lg-2">
          <h2 className="m-auto py-3 py-lg-0">
            Plan for <span className="d-none d-lg-inline-block">...</span>{" "}
            <br className="d-none d-lg-inline-block" />{" "}
            {samplePurchases[sample].name}
          </h2>
        </div>
      </div>
      <components.Download />
    </>
  );
}

Landing.path = "/";
