import React, { useState } from "react";
import { ReactComponent as Plus } from "bootstrap-icons/icons/plus-circle-fill.svg";

import * as Layout from "layout";
import { Form } from "./Form";

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
      <Plus
        className="float-right cursor-pointer"
        onClick={() => setEditing(true)}
      />

      {editing && (
        <Form budget={budget} onSubmit={handleSubmit} onCancel={handleCancel} />
      )}
    </Layout.components.Card>
  );
}
