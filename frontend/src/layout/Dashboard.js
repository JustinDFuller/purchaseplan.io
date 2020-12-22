import * as Product from "../product";
import * as User from "../user";

export function Dashboard() {
  return (
    <div className="row">
      <div className="col-12 col-lg-4">
        <User.SavingsOverview />
      </div>
      <div className="col-12 col-lg-8">
        <Product.Form />
        <User.Purchases />
      </div>
    </div>
  );
}
