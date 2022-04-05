import * as Auth from "auth";
import * as Product from "product";
import * as User from "user";
import * as Notifications from "notifications";
import * as Purchase from "purchase";
import * as Tracking from "tracking";

import * as Layout from "layout";

import { List } from "./List";

export const Dashboard = Auth.context.With(function ({ auth }) {
  Tracking.hooks.useOnce({ type: "page_view", name: "user_dashboard" });

  return (
    <>
      <span className="d-block d-xl-none">
        <List auth={auth} />
      </span>
      <div
        className="d-none d-xl-flex row m-auto pt-4"
        style={{ maxWidth: 1500 }}
      >
        <div className="col-12 col-xl-4 order-2 order-xl-1 px-0 px-xl-3">
          <User.components.SavingsOverview loading={auth.isLoggingIn()} />
          <Layout.components.HowItWorks />
        </div>
        <div className="col-12 col-xl-8 order-1 order-xl-2 px-0 px-xl-3">
          <Product.components.Card loading={auth.isLoggingIn()} />
          <Purchase.components.List loading={auth.isLoggingIn()} />
          <Notifications.components.Toasts />
        </div>
      </div>
    </>
  );
});

Dashboard.path = "/app/user/dashboard";
