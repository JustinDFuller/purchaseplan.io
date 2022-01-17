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
    <div
      style={{
        color: styles.theme.textColor,
      }}
    >
      <div
        className="row m-auto px-0 px-md-3"
        style={{
          display: "flex",
          justifyContent: "space-around",
          alignItems: "center",
          minHeight: 250,
          background: styles.colors.secondary,
        }}
      >
        <div className="col-12 col-md-6">
          <div className="m-auto" style={{ maxWidth: 424 }}>
            <h5>Purchase Plan</h5>
            <h1>
              Not a wish list — <br className="d-lg-none" /> a plan.
            </h1>
          </div>
        </div>
        <div className="col-12 col-md-6 mt-4 px-0">
          <Auth.components.Login />
        </div>
      </div>
      <div
        className="row m-auto my-md-4 py-4 px-1 px-md-3"
        style={{
          minHeight: 200,
        }}
      >
        <div className="col-12 col-lg-8 col-xl-7 pt-3 order-2 order-lg-1">
          {Purchase.samplePurchases[sample].products.map((p) => (
            <div className="mb-3" key={p.product().name()}>
              <Purchase.components.Card
                purchase={p}
                readonly
                key={p.product().name()}
              />
            </div>
          ))}
        </div>
        <div className="text-white col-12 col-lg-4 col-xl-5 d-flex d-column align-items-md-center justify-content-md-center order-1 order-lg-2">
          <h2 className="m-auto py-3 py-lg-0">
            Plan for <span className="d-none d-lg-inline-block">...</span>{" "}
            <br className="d-none d-lg-inline-block" />{" "}
            {Purchase.samplePurchases[sample].name}
          </h2>
        </div>
      </div>
      <components.Download />
    </div>
  );
}

Landing.path = "/";
