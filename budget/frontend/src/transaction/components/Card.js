import React, { useState } from "react";
import { ReactComponent as Plus } from "bootstrap-icons/icons/plus-circle-fill.svg";

import * as Layout from "layout";
import { Add } from "./Add";
import { List } from "./List";

export function Card({ user, budget, onSubmit }) {
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
        <Add
          user={user}
          budget={budget}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
        />
      )}

      {!editing && <List user={user} budget={budget} onSubmit={onSubmit} />}
    </Layout.components.Card>
  );
}
