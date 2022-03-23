import React, { useEffect, useState, useRef } from "react";

import * as Auth from "auth";
import * as styles from "styles";
import * as Purchase from "purchase";
import * as Product from "product";
import * as User from "user";

import * as components from "../components";

const oneWeekAgo = new Date();
oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

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
        <div className="col-12 col-md-6 pt-3 pt-xl-0">
          <div className="m-auto mr-xl-0" style={{ maxWidth: 480 }}>
            <div className="row">
              <h1 className="col-9">
                Wave goodbye to <br className="d-none d-block-xs" /> impulse
                purchases
              </h1>
              <h1 className="pl-0 ml-0 col-3 d-flex justify-content-start align-items-center">
                👋
              </h1>
            </div>
          </div>
        </div>
        <div className="col-12 col-md-6 mt-4 px-0">
          <Auth.components.Login className="ml-xl-0" />
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
      <div
        style={{
          background: styles.colors.secondary,
          minHeight: 250,
        }}
      >
        <div
          className="row d-flex justify-content-space-around align-items-center px-3 px-xl-5 py-5 m-auto"
          style={{ maxWidth: 1500 }}
        >
          <div className="col-12 col-xl-4">
            <h5 className="text-center text-xl-left">
              If you're shopping online or in person, Purchase Plan can help.
            </h5>
          </div>
          <div className="col-12 col-xl-8 pt-4 pt-xl-0">
            <Product.components.Card loading={false} disabled={true} />
          </div>
          <div className="col-12 col-xl-4 pt-3 pt-xl-5">
            <h5 className="text-center text-xl-left">
              Purchase Plan finds information about your purchase.
            </h5>
          </div>

          <div className="col-12 col-xl-8 pt-4 pt-xl-0">
            <Product.components.Card
              disabled
              productDefaults={Purchase.samplePurchases[2].products[0].product()}
            />
          </div>
          <div className="col-12 col-xl-4 pt-3 pt-xl-5">
            <h5 className="text-center text-xl-left">
              Then, Purchase Plan shows when you'll have enough saved.
            </h5>
          </div>

          <div className="col-12 col-xl-8 pt-4 pt-xl-0">
            <Purchase.components.Card
              purchase={Purchase.samplePurchases[2].products[0]}
              readonly
            />
          </div>

          <div className="col-12 col-xl-4 pt-5">
            <h5 className="text-center text-xl-left">
              You can edit your savings plan any time.
            </h5>
          </div>

          <div className="col-12 col-xl-8 pt-4">
            <User.components.SavingsOverview
              disabled
              forceEdit
              user={User.data.New({
                saved: 500,
                frequency: "Every 2 Weeks",
                contributions: 100,
                lastPaycheck: oneWeekAgo,
              })}
            />
          </div>

          <div className="col-12 col-xl-4 pt-5 pt-xl-2 pr-xl-0 mr-xl-0">
            <h5 className="text-center text-xl-left">
              Are you ready to start planning?
              <span className="ml-3 d-none d-xl-inline-block">👉</span>
            </h5>
          </div>

          <div className="col-12 col-xl-8 pt-xl-4 pl-xl-0 ml-xl-0">
            <Auth.components.Login />
          </div>
        </div>
      </div>
      <div className="d-flex justify-content-center align-items-center flex-wrap py-5">
        <components.Download />
        <a
          href="https://www.producthunt.com/posts/purchase-plan?utm_source=badge-review&utm_medium=badge&utm_souce=badge-purchase-plan#discussion-body"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img
            src="https://api.producthunt.com/widgets/embed-image/v1/review.svg?post_id=330492&theme=dark"
            alt="Purchase Plan - Not a wish list but a plan | Product Hunt"
            style={{ width: 250, height: 54 }}
            width="250"
            height="54"
          />
        </a>
      </div>
    </div>
  );
}

Landing.path = "/";
