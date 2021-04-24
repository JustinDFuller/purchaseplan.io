import React, { useContext } from "react";
import { Image } from "react-native";

import * as styles from "../styles";
import * as Auth from "../auth";

export function Header() {
  const { auth, setAuth } = useContext(Auth.Context);

  return (
    <nav
      style={styles.combine(styles.dark)}
    >
      <a className="navbard-brand" href="/">
        <Image 
          source={require("../../assets/logo.png")}
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
