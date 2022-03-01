import React, { useState } from "react";
import { ReactComponent as Plus } from "bootstrap-icons/icons/plus-circle-fill.svg";

import * as styles from "styles";
import * as Layout from "layout";
import { Form } from "./Form";

function upperFirst(s) {
  return s[0].toUpperCase() + s.slice(1);
}

export function Card({ budget, onSubmit }) {
  const [editing, setEditing] = useState(false);

  function handleCancel() {
    setEditing(false);
  }

  function handleSubmit(...args) {
    setEditing(false);
    onSubmit(...args);
  }

  return (
    <Layout.components.Card>
      <h5 className="card-title d-inline">Transactions</h5>
      {!editing && (
        <Plus
          className="float-right cursor-pointer"
          onClick={() => setEditing(true)}
        />
      )}

      {editing && (
        <Form budget={budget} onSubmit={handleSubmit} onCancel={handleCancel} />
      )}

      {!editing && (
        <ul className="list-group list-group-flush mt-3">
          {budget
            .Transactions()
            .sortByAsc()
            .map((t) => (
              <li
                key={t.ID()}
                className="list-group-item px-0 d-flex align-items-center"
              >
                <div>
                  <div style={styles.bubble}>
                    {budget.Categories().getById(t.CategoryID()).Name()}
                  </div>
                </div>
                <span className="pl-3">
                  <strong>{upperFirst(t.merchantName())}</strong> for $
                  {t.displayAmount()} on {t.displayTime()}.
                </span>
              </li>
            ))}
        </ul>
      )}
    </Layout.components.Card>
  );
}
