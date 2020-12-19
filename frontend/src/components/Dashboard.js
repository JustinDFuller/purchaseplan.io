import { SavedForm } from "./forms/Saved";
import { FrequencyForm } from "./forms/Frequency";
import { ContributionsForm } from "./forms/Contributions";
import { PurchaseForm } from "./forms/Purchase";
import { ProductForm } from "./forms/Product";
import { UserInfo } from "./user/Info";
import { PurchaseList } from "./purchase/List";

export function Dashboard({}) {
  return (
    <>
      <UserInfo />
      <SavedForm />
      <FrequencyForm />
      <ContributionsForm />
      <ProductForm />
      <PurchaseList />
    </>
  );
}
