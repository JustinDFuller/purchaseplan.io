import React, { useContext } from "react";

import * as User from "../user";

export function FrequencyForm() {
  const { user, setUser } = useContext(User.Context);

  async function handleSubmit(e) {
    e.preventDefault();
    await User.api.put(user);
  }

  return (
    <form id="frequency-form" className="card" onSubmit={handleSubmit}>
      <label>How often do you save?</label>
      <select
        name="frequency"
        value={user.frequency()}
        onChange={(e) => setUser(user.setFrequency(e.target.value))}
      >
        <option disabled value="">
          Choose A Frequency
        </option>
        <option>Weekly</option>
        <option>Every 2 Weeks</option>
        <option>1st and 5th</option>
        <option>Monthly</option>
      </select>

      <label>When was your last paycheck?</label>
      <input
        type="date"
        name="lastPaycheck"
        value={
          user.lastPaycheck()
            ? `${user
                .lastPaycheck()
                .getFullYear()}-${user.lastPaycheck().getMonth()}-${(
                "0" + user.lastPaycheck().getDate()
              ).slice(-2)}`
            : ""
        }
        onChange={(e) => setUser(user.setLastPaycheck(e.target.value))}
      />
      <button type="submit">Next</button>
    </form>
  );
}
