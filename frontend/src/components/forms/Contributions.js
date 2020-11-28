import React, { useContext, useEffect, useState } from "react";

import * as User from "../../context/user";
import * as userapi from "../../api/user";

export function ContributionsForm({ next }) {
  const { user, setUser } = useContext(User.Context);
  const [init, setInit] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault()
    await userapi.put(user)
    next(e)
  }

  useEffect(function() {
    if (!init && user.contributions() !== 0) {
      next()
    }
    setInit(true)
  }, [init, user, next])

  return (
    <form id="contributions-form" class="card" onSubmit={handleSubmit}>
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
