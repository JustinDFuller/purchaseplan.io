import * as Layout from "layout";

import { Name } from "./Name";
import { Planned } from "./Planned";
import { Remaining } from "./Remaining";

export function Row({ budget, category, user, view, onChange }) {
  return (
    <li className="list-group-item pl-0 text-white">
      <div className="row">
        <div className="col-12 d-flex justify-content-between">
          <Name
            category={category}
            user={user}
            budget={budget}
            onChange={onChange}
          />
          <span className="d-flex align-items-center justify-content-end">
            {view === Layout.views.planned && (
              <Planned
                budget={budget}
                category={category}
                user={user}
                onChange={onChange}
              />
            )}
            {view === Layout.views.remaining && (
              <Remaining budget={budget} category={category} />
            )}
          </span>
        </div>
      </div>
    </li>
  );
}
