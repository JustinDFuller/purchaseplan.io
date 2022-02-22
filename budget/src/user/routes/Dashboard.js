import * as Auth from "auth";
import * as User from "user";
import * as Notifications from "notifications";
import * as styles from "styles";
import * as Layout from "layout";

import { List } from "./List";

export const Dashboard = Auth.context.With(function ({ auth }) {
  const { user } = User.data.Use();

  const budget = user.budgets().last();

  return (
    <>
      <span className="d-block d-xl-none">
        <List auth={auth} />
      </span>
      <div
        className="d-none d-xl-flex row m-auto pt-4"
        style={{ maxWidth: 1500 }}
      >
        {user.budgets().isEmpty() ? (
          <User.components.SavingsOverview />
        ) : (
          <>
            <Layout.components.Card>
              <div>Budget started: {budget.startDisplay()}</div>
              <div>Budget ends: {budget.endDisplay()}</div>
              <div>Budget frequency: {user.frequency()}</div>
            </Layout.components.Card>
            {budget
              .Categories()
              .groups()
              .map((g) => (
                <Layout.components.Card key={g.name}>
                  <strong>{g.name}</strong>
                  <ul className="list-group list-group-flush mt-3">
                    <li className="list-group-item pl-0 text-white">
                      <div>
                        <strong>Category</strong>
                        <strong className="float-right" style={styles.textDark}>
                          Remaining
                        </strong>
                      </div>
                    </li>
                    {g.categories.map((c) => (
                      <li
                        key={c.ID()}
                        className="list-group-item pl-0 text-white"
                      >
                        <div>
                          {c.Name()}
                          <span className="float-right">{c.planned()}</span>
                        </div>
                      </li>
                    ))}
                  </ul>
                </Layout.components.Card>
              ))}
          </>
        )}
      </div>
      <Notifications.components.Toasts />
    </>
  );
});

Dashboard.path = "/budget/app/user/dashboard";
