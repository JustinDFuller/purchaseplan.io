import * as Product from "product";
import * as User from "user";
import * as Notifications from "notifications";
import * as Purchase from "purchase";

import * as Layout from "layout";

export function Dashboard() {
  return (
    <div className="row m-auto" style={{ maxWidth: 1500 }}>
      <div className="col-12 col-lg-4 order-2 order-lg-1">
        <User.components.SavingsOverview />
        <Layout.components.HowItWorks />
      </div>
      <div className="col-12 col-lg-8 order-1 order-lg-2">
        <Product.components.Card />
        <Purchase.components.List />
        <Notifications.components.Toasts />
      </div>
    </div>
  );
}

Dashboard.path = "/app/user/dashboard";
