import React, { useState } from "react";
import { ReactComponent as Trash } from "bootstrap-icons/icons/trash.svg";

import * as Layout from "layout";
import * as styles from "styles";

import { New } from "../new";
import { Row } from "./Row";

export function Group({ group, view, user, budget, onChange }) {
  const [hover, setHover] = useState(false);

  return (
    <Layout.components.Card
      className="col-12"
      onMouseOver={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <ul className="list-group list-group-flush">
        <li className="list-group-item pl-0 text-white">
          <div className="row">
            <div className="col-12 d-flex justify-content-between align-items-center">
              <h5 className="card-title d-inline mb-0">
                <input
                  onChange={(e) => {
                    const u = user.setBudget(
                      budget.setCategories(
                        budget.Categories().setGroup(group.name, e.target.value)
                      )
                    );
                    onChange(u);
                  }}
                  className="form-control-plaintext text-white p-0 m-0"
                  style={{ fontSize: "1.25rem" }}
                  type="text"
                  value={group.name}
                />
              </h5>
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
      {hover && (
        <div
          style={{
            position: "absolute",
            top: -1,
            left: "50%",
            transform: "translateX(-50%)",
            padding: "6px 30px",
            background: "#14142a",
            zIndex: 2,
            borderBottomLeftRadius: 4,
            borderBottomRightRadius: 4,
            cursor: "pointer",
            opacity: 0.95,
          }}
        >
          <Trash
            role="button"
            onClick={() => {
              const u = user.setBudget(
                budget.setCategories(
                  budget.Categories().deleteGroup(group.name)
                )
              );
              onChange(u);
            }}
          />
        </div>
      )}
    </Layout.components.Card>
  );
}
