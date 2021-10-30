import * as Auth from "auth";
import * as Notifications from "notifications";
import * as Purchase from "purchase";
import * as Layout from "layout";

import * as data from "../data";

export const List = Auth.context.With(function ({ auth }) {
  const { user } = data.Use();

  return (
    <div className="row m-auto mx-0">
      <div className="col-12 px-0">
        {auth.isLoggedIn() && !user.purchases().hasAtLeastOne() ? (
          <Layout.components.HowItWorks />
        ) : (
          <Purchase.components.List loading={auth.isLoggingIn()} />
        )}
      </div>
      <Notifications.components.Toasts />
    </div>
  );
});

List.path = "/app/user/list";
