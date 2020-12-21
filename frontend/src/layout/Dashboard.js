import * as Product from '../product';
import { UserInfo } from "../user/SavingsOverview";
import { PurchaseList } from "../user/Purchases";

export function Dashboard() {
  return (
    <div className="row">
      <div className="col-12 col-lg-4 mb-4">
        <UserInfo />
      </div>
      <div className="col-12 col-lg-8">
        <PurchaseList />
        <Product.Form />
      </div>
    </div>
  );
}
