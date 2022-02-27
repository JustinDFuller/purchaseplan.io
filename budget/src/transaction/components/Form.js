import React, { useState } from "react";

import * as form from "form";
import { New } from "../new";

export function Form({ budget, onSubmit, onCancel }) {
  const [group, setGroup] = useState("");
  const [transaction, setTransaction] = useState(New());

  function handleSubmit(e) {
    e.preventDefault();
    onSubmit(transaction);
  }

  return (
    <form className="mt-3" onSubmit={handleSubmit}>
      <label>Choose a budget category.</label>
      <select
        required
        value={group}
        onChange={(e) => {
          setTransaction(transaction.setCategoryID(""));
          setGroup(e.target.value);
        }}
        className="form-control"
      >
        <option disabled value="">
          Choose a Group
        </option>
        {budget
          .Categories()
          .groups()
          .map((g) => (
            <option key={g.name} value={g.name}>
              {g.name}
            </option>
          ))}
      </select>
      <select
        required
        disabled={!group}
        className="form-control mt-3"
        value={transaction.CategoryID()}
        onChange={(e) =>
          setTransaction(transaction.setCategoryID(e.target.value))
        }
      >
        <option value="" disabled>
          Choose a Category
        </option>
        {group &&
          budget
            .Categories()
            .groups()
            .find((g) => g.name === group)
            .categories.map((c) => (
              <option key={c.ID()} value={c.ID()}>
                {c.Name()}
              </option>
            ))}
      </select>
      <div className="mt-3">
        <label>How much did it cost?</label>
        <div className="input-group d-flex align-items-center">
          <div className="input-group-prepend">
            <span className="input-group-text">$</span>
          </div>
          <input
            required
            min="0"
            step=".01"
            className="form-control"
            type="number"
            value={transaction.amount() ? transaction.amount() : ""}
            onChange={(e) =>
              setTransaction(transaction.setAmount(e.target.value))
            }
            placeholder="0"
          />
        </div>
      </div>
      <div className="mt-3">
        <label>Where did you purchase it?</label>
        <input
          type="text"
          className="form-control"
          placeholder="Merchant"
          required
          value={transaction.merchantName()}
          onChange={(e) =>
            setTransaction(transaction.setMerchantName(e.target.value))
          }
        />
      </div>
      <div className="mt-3">
        <label>When did you purchase it?</label>
        <input
          type="date"
          required
          className="form-control"
          value={transaction.inputTime()}
          onChange={(e) =>
            setTransaction(transaction.setInputTime(e.target.value))
          }
        />
      </div>
      <form.components.Submit text="Save Transaction" className="mt-3" />
      <button
        type="button"
        className="btn btn-danger w-100 mt-3"
        onClick={onCancel}
      >
        Cancel
      </button>
    </form>
  );
}
