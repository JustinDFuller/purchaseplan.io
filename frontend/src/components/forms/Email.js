import React, { useContext } from "react";

import * as User from "../../context/user";
import * as userapi from "../../api/user";

export function EmailForm({ next }) {
  const { user, setUser } = useContext(User.Context);

  async function handleSubmit(e) {
    e.preventDefault()
    const { id } = await userapi.post({ email: user.email() })
    setUser(user.setId(id))
    next(e)
  }

  return (
    <form id="email-form" class="card" onSubmit={handleSubmit}>
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
