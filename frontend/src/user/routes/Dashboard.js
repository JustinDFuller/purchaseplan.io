import * as Auth from "auth";
import * as Product from "product";
import * as User from "user";
import * as Notifications from "notifications";
import * as Purchase from "purchase";

import * as Layout from "layout";

export const Dashboard = Auth.context.With(function ({ auth }) {
  return (
    <div className="row m-auto pt-4" style={{ maxWidth: 1500 }}>
      <div className="col-12 col-lg-4 order-2 order-lg-1 px-0 px-md-3">
        <User.components.SavingsOverview loading={auth.isLoggingIn()} />
        <Layout.components.HowItWorks />
      </div>
      <div className="col-12 col-lg-8 order-1 order-lg-2 px-0 px-md-3">
        <Product.components.Card loading={auth.isLoggingIn()} />
        <Purchase.components.List loading={auth.isLoggingIn()} />
        <Notifications.components.Toasts />
      </div>
    </div>
  );
});

Dashboard.path = "/app/user/dashboard";
