import * as Notifications from "notifications";
import * as Purchase from "purchase";
import * as Layout from "layout";

import * as data from "../data";

export function List() {
  const { user } = data.Use();

  return (
    <div className="row m-auto pt-4">
      <div className="col col-12">
        {user.purchases().hasAtLeastOne() ? (
          <Purchase.components.List />
        ) : (
          <Layout.components.HowItWorks />
        )}
      </div>
      <Notifications.components.Toasts />
    </div>
  );
}

List.path = "/app/user/list";
