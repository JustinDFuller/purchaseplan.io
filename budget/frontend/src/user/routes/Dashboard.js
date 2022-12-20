import * as Auth from "auth";
import * as User from "user";
import * as Notifications from "notifications";
import * as Budget from "budget";
import * as Category from "category";
import * as Transaction from "transaction";
import * as api from "../api";

function Container({ children }) {
  return (
    <div className="d-flex row m-auto pt-xl-4 pb-5" style={{ maxWidth: 1500 }}>
      {children}
      <Notifications.components.Toasts />
    </div>
  );
}

export const Dashboard = Auth.context.With(function ({ auth }) {
  const { user, setUser } = User.data.Use();

  console.log(JSON.stringify(user, null, 2));

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

  if (user.Budgets().isEmpty()) {
    return (
      <Container>
        <User.components.SavingsOverview />
      </Container>
    );
  }

  return (
    <Container>
      <div className="col-12 col-xl-4 px-0 px-xl-3">
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
      <div className="col-12 col-xl-8 px-0 px-xl-3 pb-4 pb-xl-0">
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
    </Container>
  );
});

Dashboard.path = "/budget/app/user/dashboard";
