import * as Auth from "auth";
import * as Notifications from "notifications";
import * as Layout from "layout";

// import * as data from "../data";

export const List = Auth.context.With(function ({ auth }) {
  // const { user } = data.Use();

  const shouldShowHowItWorks = auth.isLoggedIn();

  return (
    <div className="row m-auto mx-0 pb-5">
      <div className="col-12 px-0">
        {shouldShowHowItWorks ? (
          <Layout.components.HowItWorks />
        ) : (
          <h1>TODO show categories</h1>
        )}
      </div>
      <Notifications.components.Toasts />
    </div>
  );
});

List.path = "/budget/app/user/list";
