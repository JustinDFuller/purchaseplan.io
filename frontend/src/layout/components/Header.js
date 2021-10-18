import React, { useContext } from "react";
import { ReactComponent as Moon } from "bootstrap-icons/icons/moon-stars-fill.svg";
import { ReactComponent as Sun } from "bootstrap-icons/icons/sun-fill.svg";

import * as styles from "styles";
import * as Auth from "auth";

import { isNativeApp } from "../native";

export function Header() {
  const { auth, setAuth } = useContext(Auth.context.Context);

  if (isNativeApp()) {
    return null;
  }

  return (
    <div
      className="container-fluid mb-4"
      style={{
        background: styles.colors.secondary,
        color: styles.colors.light,
      }}
    >
      <div className="row m-auto" style={{ maxWidth: 1500 }}>
        <div className="col col-12">
          <nav className="navbar navbar-expand navbark-dark py-3 m-auto d-flex justify-content-between p-0">
            <a className="navbard-brand" href="/">
              <img
                src={`${process.env.PUBLIC_URL}/logo.png`}
                alt="logo"
                style={styles.logo}
              />
            </a>
            <ul className="navbar-nav float-end">
              <li className="nav-item">
                <Moon
                  style={{
                    height: 16,
                    width: 16,
                    cursor: "pointer",
                  }}
                  className="btn btn-link nav-link"
                />
              </li>
              <li className="nav-item">
                <Sun className="btn btn-link nav-link" />
              </li>
              <li className="nav-item">
                <a
                  className="btn btn-link nav-link"
                  style={styles.combine(styles.text, {
                    color: styles.colors.light,
                  })}
                  href="https://blog.purchaseplan.io"
                  target="_blank"
                  rel="noreferrer"
                  data-testid="blog"
                >
                  Blog
                </a>
              </li>
              <li className="nav-item">
                {auth.isLoggedIn() && (
                  <button
                    className="btn btn-link nav-link"
                    style={styles.combine(styles.text, {
                      color: styles.colors.light,
                    })}
                    onClick={async () => setAuth(await auth.logout())}
                  >
                    Log Out
                  </button>
                )}
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </div>
  );
}
