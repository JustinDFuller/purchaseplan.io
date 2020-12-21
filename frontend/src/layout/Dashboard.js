import { ProductForm } from "../forms/Product";
import { UserInfo } from "../user/SavingsOverview";
import { PurchaseList } from "../user/Purchases";

export function Dashboard() {
  return (
    <div className="row">
      <div className="col-12 col-md-4 mb-4">
        <UserInfo />
      </div>
      <div className="col-12 col-md-8">
        <PurchaseList />
        <ProductForm />
      </div>
    </div>
  );
}
