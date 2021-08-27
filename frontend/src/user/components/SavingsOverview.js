import React, { useState } from "react";
import { ReactComponent as Pencil } from "bootstrap-icons/icons/pencil.svg";

import * as styles from "styles";
import * as layout from "layout";
import * as form from "form";

import * as data from "../data";
import * as api from "../api";

const formatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

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

export const SavingsOverview = data.WithContext(function ({ user, setUser }) {
  const [edit, setEdit] = useState(false);

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
    setEdit(false);
    const res = await api.put(user);
    setUser(user.from(res));
  }

  function Edit() {
    return (
      <div className="row">
        <div className="col-12">
          <h5 className="card-title d-inline">Edit Savings Overview</h5>
        </div>
        <form onSubmit={onSubmit} className="col-12">
          <div className="form-group">
            <label className="form-label">Saved So Far</label>
            <input
              type="number"
              placeholder="0"
              value={user.saved() ? user.saved().toString() : ""}
              onChange={(e) => setUser(user.setSaved(e.target.value))}
              className="form-control"
              min="0"
            />
          </div>
          <div className="form-group">
            <label className="form-label">Planned Savings</label>
            <input
              type="number"
              placeholder="0"
              value={
                user.contributions() ? user.contributions().toString() : ""
              }
              onChange={(e) => setUser(user.setContributions(e.target.value))}
              className="form-control"
              min="0"
            />
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
          <div className="form-group">
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
          <div className="text-right">
            <form.components.Submit text="Save" />
          </div>
        </form>
      </div>
    );
  }

  function View() {
    return (
      <>
        <div className="row">
          <div className="col-12">
            <h5 className="card-title d-inline">Savings Overview</h5>
            <Pencil
              className="float-right mt-2 cursor-pointer"
              role="button"
              onClick={() => setEdit(true)}
            />
          </div>
        </div>
        <div className="row mt-3">
          <div className="col-12 col-xl-6">
            <strong style={styles.textDark}>Saved So Far</strong>
            <p>{formatter.format(user.saved())}</p>
          </div>
          <div className="col-12 col-xl-6">
            <strong style={styles.textDark}>Planned Savings</strong>
            <p>
              {formatter.format(user.contributions())}/{user.frequency()}
            </p>
          </div>
          <div className="col-12 col-xl-6">
            <strong style={styles.textDark}>Last Paycheck</strong>
            <p>{user.lastPaycheckDisplay()}</p>
          </div>
          <div className="col-12 col-xl-6">
            <strong style={styles.textDark}>
              {user.remaining() >= 0 ? "Remaining Budget" : "Need To Save"}
            </strong>
            <p>{formatter.format(Math.abs(user.remaining()))}</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <layout.components.Card>{edit ? Edit() : View()}</layout.components.Card>
  );
});
