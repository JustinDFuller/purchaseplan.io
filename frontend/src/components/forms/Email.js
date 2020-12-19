import React, { useContext } from "react";

import * as User from "../../context/user";
import * as userapi from "../../api/user";

export function EmailForm({ next }) {
  const { user, setUser } = useContext(User.Context);

  async function onSuccess() {
    /*
     e.preventDefault();

    try {
      const u = await userapi.get(user);
      setUser(user.from(u));
      next(e);
      return;
    } catch (e) {
      console.error(e);
    }

    await userapi.put(user);
    next(e);
     */
  }

  return (
    <div className="card">
      <div className="card-body">
        <form>
          <label>What's Your Email Address?</label>
          <input
            type="email"
            name="email"
            value={user.email()}
            onChange={(e) => setUser(user.setEmail(e.target.value))}
          />
          <button type="submit">Next</button>
        </form>
      </div>
    </div>
  );
}
