import * as Product from "../product";
import * as User from "../user";
import * as Notifications from "../notifications";
import * as Purchase from "../purchase";

import { HowItWorks } from "./HowItWorks";

export function Dashboard() {
  return (
    <div className="row m-auto" style={{ maxWidth: 1500 }}>
      <div className="col-12 col-lg-4 order-2 order-lg-1">
        <User.SavingsOverview />
        <HowItWorks />
      </div>
      <div className="col-12 col-lg-8 order-1 order-lg-2">
        <Product.Form />
        <Purchase.components.List />
        <Notifications.components.Toasts />
      </div>
    </div>
  );
}
