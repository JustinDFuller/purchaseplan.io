import React, { useContext } from "react";

import * as User from "../user";

export function ContributionsForm() {
  const { user, setUser } = useContext(User.Context);

  async function handleSubmit(e) {
    e.preventDefault();
    await User.api.put(user);
  }

  return (
    <form id="contributions-form" className="card" onSubmit={handleSubmit}>
      <label>How much do you save each time?</label>
      <input
        type="number"
        name="contributions"
        value={user.contributions()}
        onChange={(e) => setUser(user.setContributions(e.target.value))}
      />
      <button type="submit">Next</button>
    </form>
  );
}
