import React from "react";

import * as Budget from "budget";
import * as layout from "layout";
import * as form from "form";

import * as data from "../data";
import * as api from "../api";

function formatDate(d) {
  let m = d.getMonth() + 1;
  if (m < 10) {
    m = `0${m}`;
  } else {
    m = String(m);
  }

  let dt = d.getDate();
  if (dt < 10) {
    dt = `0${dt}`;
  } else {
    dt = String(dt);
  }

  return `${d.getFullYear()}-${m}-${dt}`;
}

export const SavingsOverview = data.WithContext(function ({
  user,
  setUser,
  loading,
}) {
  function formatLastPaycheck() {
    return formatDate(user.lastPaycheck());
  }

  function getMaxDate() {
    return formatDate(new Date());
  }

  function getMinDate() {
    const d = new Date();

    switch (user.frequency()) {
      case "Every 2 Weeks":
        d.setDate(d.getDate() - 14);
        break;
      case "Once A Month":
        d.setMonth(d.getMonth() - 1);
        break;
      case "1st and 15th":
        if (d.getDate() >= 15) {
          d.setDate(15);
        } else {
          d.setDate(1);
        }
        break;
      case "Every Week":
      default:
        d.setDate(d.getDate() - 7);
        break;
    }

    return formatDate(d);
  }

  async function onSubmit(e) {
    e.preventDefault();

    console.log(user.lastPaycheck(), user.frequency());

    const end = new Date(user.lastPaycheck().getTime());
    if (user.frequency() === "Every Week") {
      end.setDate(end.getDate() + 7);
    } else if (user.frequency() === "Every 2 Weeks") {
      end.setDate(end.getDate() + 14);
    } else if (user.frequency() === "Once A Month") {
      end.setMonth(end.getMonth() + 1);
    } else if (user.frequency() === "1st and 15th") {
      if (end.getDate() >= 15) {
        end.setMonth(end.getMonth() + 1);
        end.setDate(1);
      } else {
        end.setDate(15);
      }
    }

    console.log(end);

    const budget = Budget.New()
      .setStart(user.lastPaycheck())
      .setEnd(end)
      .initialize();
    const budgets = user.budgets().add(budget);
    setUser(user.setBudgets(budgets));
    api.put(user);
  }

  return (
    <layout.components.Card>
      <div className="row">
        <div className="col-12">
          <h5 className="card-title d-inline">Edit Savings Overview</h5>
        </div>
        <form onSubmit={onSubmit} className="col-12">
          <div className="form-group">
            <select
              className="form-control mt-2"
              value={user.frequency()}
              onChange={(e) => setUser(user.setFrequency(e.target.value))}
              required
            >
              {[
                "Every Week",
                "Every 2 Weeks",
                "Once A Month",
                "1st and 15th",
              ].map(function (frequency) {
                return (
                  <option key={frequency} value={frequency}>
                    {frequency}
                  </option>
                );
              })}
            </select>
          </div>
          <div className="form-group mt-3">
            <label className="form-label">Last Paycheck</label>
            <input
              type="date"
              value={formatLastPaycheck()}
              onChange={(e) => setUser(user.setLastPaycheck(e.target.value))}
              className="form-control"
              max={getMaxDate()}
              min={getMinDate()}
              required
            />
          </div>
          <div className="text-right mt-4">
            <form.components.Submit text="Create my first budget" />
          </div>
        </form>
      </div>
    </layout.components.Card>
  );
});
