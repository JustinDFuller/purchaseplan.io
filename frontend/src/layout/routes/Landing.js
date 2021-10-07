import React, { useEffect, useState, useRef } from "react";

import * as Auth from "auth";
import * as styles from "styles";
import * as Purchase from "purchase";

import * as components from "../components";

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
        if (s >= Purchase.samplePurchases.length - 1) {
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
          {Purchase.samplePurchases[sample].products.map((p) => (
            <div className="mb-3">
              <Purchase.components.Card
                purchase={p}
                readonly
                key={p.product().name()}
              />
            </div>
          ))}
        </div>
        <div className="col-12 col-lg-4 col-xl-5 d-flex d-column align-items-md-center justify-content-md-center order-1 order-lg-2">
          <h2 className="m-auto py-3 py-lg-0">
            Plan for <span className="d-none d-lg-inline-block">...</span>{" "}
            <br className="d-none d-lg-inline-block" />{" "}
            {Purchase.samplePurchases[sample].name}
          </h2>
        </div>
      </div>
      <components.Download />
    </>
  );
}

Landing.path = "/";
