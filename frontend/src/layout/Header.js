import React, { useContext } from "react";
import * as styles from "../styles";
import * as Auth from "../auth";

export function Header() {
  const { auth, setAuth } = useContext(Auth.Context);

  return (
    <nav
      className="navbar navbark-dark py-3 px-4 m-auto"
      style={styles.combine(styles.dark, { maxWidth: 1500 })}
    >
      <a className="navbard-brand" href="/">
        <img
          src={`${process.env.PUBLIC_URL}/logo.png`}
          alt="logo"
          style={styles.logo}
        />
      </a>
      <div className="d-flex">
        <ul className="navbar-nav">
          <li className="nav-item">
            {auth.state() === Auth.state.LOGGED_IN && (
              <button
                className="btn btn-link nav-link"
                style={styles.text}
                onClick={async () => setAuth(await auth.logout())}
              >
                Log Out
              </button>
            )}
          </li>
        </ul>
      </div>
    </nav>
  );
}
