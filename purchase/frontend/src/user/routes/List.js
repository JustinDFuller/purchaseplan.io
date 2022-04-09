import * as Auth from "auth";
import * as Notifications from "notifications";
import * as Purchase from "purchase";
import * as Layout from "layout";
import * as Tracking from "tracking";

import * as data from "../data";

export const List = Auth.context.With(function ({ auth }) {
  const { user } = data.Use();
  Tracking.hooks.useOnce({ Type: "view", name: "user_list" });

  const shouldShowHowItWorks =
    auth.isLoggedIn() && !user.purchases().hasAtLeastOne();

  return (
    <div className="row m-auto mx-0 pb-5">
      <div className="col-12 px-0">
        {shouldShowHowItWorks ? (
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
