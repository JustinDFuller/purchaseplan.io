import * as Product from "../product";
import * as User from "../user";

import { HowItWorks } from "./HowItWorks";

export function Dashboard() {
  return (
    <div className="row">
      <div className="col-12 col-lg-4 order-2 order-lg-1">
        <User.SavingsOverview />
        <HowItWorks />
      </div>
      <div className="col-12 col-lg-8 order-1 order-lg-2">
        <Product.Form />
        <User.Purchases />
      </div>
    </div>
  );
}
