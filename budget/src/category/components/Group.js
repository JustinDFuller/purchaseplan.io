import * as Layout from "layout";
import * as styles from "styles";

import { New } from "../new";
import { Row } from "./Row";

export function Group({ group, view, user, budget, onChange }) {
  return (
    <Layout.components.Card className="col-12">
      <ul className="list-group list-group-flush">
        <li className="list-group-item pl-0 text-white">
          <div className="row">
            <div className="col-12 d-flex justify-content-between">
              <h5 className="card-title d-inline">{group.name}</h5>{" "}
              {view === Layout.views.planned && (
                <strong style={styles.textDark}>Planned</strong>
              )}
              {view === Layout.views.remaining && (
                <strong style={styles.textDark}>Remaining</strong>
              )}
            </div>
          </div>
        </li>
        {group.categories.map((c) => (
          <Row
            key={c.ID()}
            view={view}
            user={user}
            budget={budget}
            category={c}
            onChange={onChange}
          />
        ))}
      </ul>
      <div>
        <button
          className="btn btn-link px-0"
          style={styles.colorSuccess}
          onClick={() => {
            const u = user.setBudget(
              budget.addCategory(
                New().setName("New Category").setGroup(group.name)
              )
            );
            onChange(u);
          }}
        >
          Add Category
        </button>
      </div>
    </Layout.components.Card>
  );
}
