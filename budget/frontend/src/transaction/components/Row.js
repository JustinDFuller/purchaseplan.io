import React, { useState } from "react";

import * as styles from "styles";

import { CategoryBubble } from "./CategoryBubble";
import { Summary } from "./Summary";
import { Form } from "./Form";

export function Row({ user, budget, transaction, onSubmit }) {
  const [editing, setEditing] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(transaction);
  const [editingGroup, setEditingGroup] = useState(
    budget.Categories().getById(transaction.CategoryID()).Group()
  );

  function handleCancel() {
    setEditing(false);
  }

  function handleSubmit(e) {
    e.preventDefault();
    setEditing(false);
    const u = user.setBudget(budget.setTransaction(editingTransaction));
    onSubmit(u);
  }

  return (
    <li
      className={styles.classes(
        "px-3 list-group-item px-0 d-flex align-items-center cursor-pointer",
        { "hover-dark": !editing }
      )}
      onClick={() => !editing && setEditing(true)}
    >
      {editing ? (
        <Form
          transaction={editingTransaction}
          setTransaction={setEditingTransaction}
          budget={budget}
          user={user}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          group={editingGroup}
          setGroup={setEditingGroup}
        />
      ) : (
        <>
          <div>
            <CategoryBubble budget={budget} transaction={transaction} />
          </div>
          <span className="pl-3">
            <Summary transaction={transaction} />
          </span>
        </>
      )}
    </li>
  );
}
