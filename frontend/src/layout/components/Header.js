import React, { useContext } from "react";

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
      className="row m-auto"
      style={styles.combine(styles.dark, { maxWidth: 1500 })}
    >
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
              <a
                className="btn btn-link nav-link"
                style={styles.text}
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
                  style={styles.text}
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
  );
}
