import React, { useContext } from "react";
import * as styles from "../styles";
import * as Auth from "../auth";

export function Header() {
  const { auth, setAuth } = useContext(Auth.Context);

  return (
    <>
      <div className="alert alert-dark text-center" style={{ borderRadius: 0 }}>
        Welcome to the Purchase Plan early access. The website may not work
        perfectly and may change at any time.
      </div>
      <nav
        className="navbar navbar-expand navbark-dark py-3 px-3 m-auto d-flex justify-content-between"
        style={styles.combine(styles.dark, { maxWidth: 1500 })}
      >
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
              href="https://medium.com/@purchaseplan.io"
              target="_blank"
              rel="noreferrer"
            >
              Blog
            </a>
          </li>
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
      </nav>
    </>
  );
}
