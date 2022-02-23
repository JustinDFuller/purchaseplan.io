import * as Auth from "auth";
import * as User from "user";
import * as Notifications from "notifications";
import * as styles from "styles";
import * as Layout from "layout";

export const Dashboard = Auth.context.With(function ({ auth }) {
  const { user } = User.data.Use();

  const budget = user.Budgets().last();

  return (
    <>
      <div className="d-flex row m-auto pt-4" style={{ maxWidth: 1500 }}>
        {user.Budgets().isEmpty() ? (
          <User.components.SavingsOverview />
        ) : (
          <>
            <Layout.components.Card className="col-12">
              <div>Budget started: {budget.startDisplay()}</div>
              <div>Budget ends: {budget.endDisplay()}</div>
              <div>Budget frequency: {user.frequency()}</div>
            </Layout.components.Card>
            {budget
              .Categories()
              .groups()
              .map((g) => (
                <Layout.components.Card key={g.name} className="col-12">
                  <ul className="list-group list-group-flush">
                    <li className="list-group-item pl-0 text-white">
                      <div>
                        <h5 className="card-title d-inline">{g.name}</h5>{" "}
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
