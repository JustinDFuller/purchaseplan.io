import React, { useContext } from "react";

import * as User from "../../context/user";

export function EmailForm({ next }) {
  const { user, setUser } = useContext(User.Context);

  return (
    <form id="email-form" class="card" onSubmit={next}>
      <label>What's Your Email Address?</label>
      <input
        type="email"
        name="email"
        value={user.email()}
        onChange={e => setUser(user.setEmail(e.target.value))}
      />
      <button type="submit">Next</button>
    </form>
  );
}
