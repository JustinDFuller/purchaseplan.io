import React, { useContext } from "react";
import { ReactComponent as Megaphone } from "bootstrap-icons/icons/megaphone-fill.svg";
import { ReactComponent as Door } from "bootstrap-icons/icons/door-open-fill.svg";

import * as styles from "styles";
import * as Auth from "auth";

import * as routes from "../routes";

import { isNativeApp } from "../native";

export function Header() {
  const { auth, setAuth } = useContext(Auth.context.Context);

  if (isNativeApp()) {
    return null;
  }

  return (
    <div
      className={styles.classes("container-fluid px-0", {
        "d-none d-xl-block": auth.isLoggedIn(),
        "d-block": !auth.isLoggedIn(),
      })}
      style={{
        background: styles.colors.secondary,
        color: styles.colors.light,
      }}
    >
      <div className="row m-auto" style={{ maxWidth: 1500 }}>
        <div className="col col-12">
          <nav className="navbar navbar-expand navbark-dark py-3 m-auto d-flex justify-content-between p-0">
            <a
              className="navbard-brand d-flex align-items-center justify-content-space-between"
              href="/"
            >
              <img
                src={`${process.env.PUBLIC_URL}/logo.png`}
                alt="Purchase Plan"
                style={styles.logo}
              />
              <h5 className="d-none d-xl-inline-block text-white mb-0 ml-2 mt-2">
                Purchase Plan
              </h5>
            </a>
            <ul className="navbar-nav float-end">
              {auth.isLoggedIn() &&
                window.location.pathname === routes.Landing.path && (
                  <li className="nav-item">
                    <a
                      className="btn btn-link nav-link text-white"
                      href="/app/user/dashboard"
                    >
                      Dashboard
                    </a>
                  </li>
                )}

              <li className="nav-item">
                {auth.isLoggedOut() && (
                  <a
                    className="btn btn-link nav-link"
                    style={styles.combine(styles.text, {
                      color: styles.colors.light,
                    })}
                    href="/app/auth/login"
                  >
                    Log In
                  </a>
                )}
              </li>
              {auth.isLoggedIn() && (
                <>
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
                      <Megaphone
                        role="button"
                        aria-label="announcements"
                        style={{ marginBottom: 3 }}
                      />
                    </a>
                  </li>
                  <li className="nav-item">
                    <button
                      className="btn btn-link nav-link"
                      style={styles.combine(styles.text, {
                        color: styles.colors.light,
                      })}
                      onClick={async () => setAuth(await auth.logout())}
                    >
                      <Door
                        role="button"
                        aria-label="log out"
                        style={{ marginBottom: 3 }}
                      />
                    </button>
                  </li>
                </>
              )}
            </ul>
          </nav>
        </div>
      </div>
    </div>
  );
}
