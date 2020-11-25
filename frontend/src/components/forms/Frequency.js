import React, { useContext } from "react";

import * as User from "../../context/user";

export function FrequencyForm({ next }) {
  const { user, setUser } = useContext(User.Context);

  return (
    <form id="frequency-form" class="card" onSubmit={next}>
      <label>How often do you save?</label>
      <select
        name="frequency"
        value={user.frequency()}
        onChange={e => setUser(user.setFrequency(e.target.value))}
      >
        <option selected disabled value="">
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
        value={user.lastPaycheck()}
        onChange={e => setUser(user.setLastPaycheck(e.target.value))}
      />
      <button type="submit">Next</button>
    </form>
  );
}
