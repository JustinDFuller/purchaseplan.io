import React, { useState, useContext, useEffect } from "react";

import * as User from "../../context/user";
import * as userapi from "../../api/user";

export function SavedForm({ next }) {
  const { user, setUser } = useContext(User.Context);
  const [init, setInit] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    await userapi.put(user)
    next(e)
  }

  useEffect(function() {
    if (!init && user.saved() !== 0) {
      next()
    }
    setInit(true)
  }, [init, user, next])

  return (
    <form id="saved-form" class="card" onSubmit={handleSubmit}>
      <label>How much have you saved so far?</label>
      <input
        type="number"
        name="saved"
        value={user.saved()}
        onChange={e => setUser(user.setSaved(e.target.value))}
      />
      <button type="submit">Next</button>
    </form>
  );
}
