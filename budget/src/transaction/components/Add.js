import React, { useState } from "react";

import { New } from "../new";
import { Form } from "./Form";

export function Add({ user, budget, onSubmit, onCancel }) {
  const [transaction, setTransaction] = useState(New());
  const [group, setGroup] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    const u = user.setBudget(budget.addTransaction(transaction));
    onSubmit(u);
  }

  return (
    <Form
      user={user}
      budget={budget}
      onSubmit={handleSubmit}
      onCancel={onCancel}
      transaction={transaction}
      setTransaction={setTransaction}
      group={group}
      setGroup={setGroup}
    />
  );
}
