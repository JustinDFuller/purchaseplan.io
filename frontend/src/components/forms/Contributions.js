import React, { useContext } from "react";

import * as User from "../../context/user";

export function ContributionsForm({ next }) {
  const { user, setUser } = useContext(User.Context);

  return (
    <form id="contributions-form" class="card" onSubmit={next}>
      <label>How much do you save each time?</label>
      <input
        type="number"
        name="contributions"
        value={user.contributions()}
        onChange={e => setUser(user.setContributions(e.target.value))}
      />
      <button type="submit">Next</button>
    </form>
  );
}
