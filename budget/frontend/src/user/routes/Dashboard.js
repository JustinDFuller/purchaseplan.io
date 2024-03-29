import * as Auth from "auth";
import * as User from "user";
import * as Notifications from "notifications";
import * as Budget from "budget";
import * as Category from "category";
import * as Transaction from "transaction";
import * as api from "../api";

export const Dashboard = Auth.context.With(function ({ auth }) {
  const { user, setUser } = User.data.Use();

  const budget = user.Budgets().last();

  function handleUserChange(u) {
    setUser(u);
    api.put(u);
  }

  function handleViewChange(view) {
    const u = user.setBudget(budget.setView(view));
    handleUserChange(u);
  }

  if (!auth.isLoggedIn()) {
    return null;
  }

  return (
    <>
      <div
        className="d-flex row m-auto pt-xl-4 pb-5"
        style={{ maxWidth: 1500 }}
      >
        {user.Budgets().isEmpty() ? (
          <User.components.SavingsOverview />
        ) : (
          <>
            <div className="col-12 col-xl-4">
              <Budget.components.Overview
                budget={budget}
                view={budget.View()}
                setView={handleViewChange}
              />
              <Transaction.components.Card
                budget={budget}
                onSubmit={handleUserChange}
                user={user}
              />
            </div>
            <div className="col-12 col-xl-8">
              <Category.components.Groups
                budget={budget}
                view={budget.View()}
                user={user}
                onChange={handleUserChange}
              />
              <Category.components.NewGroup
                budget={budget}
                user={user}
                onChange={handleUserChange}
              />
            </div>
          </>
        )}
      </div>
      <Notifications.components.Toasts />
    </>
  );
});

Dashboard.path = "/budget/app/user/dashboard";
