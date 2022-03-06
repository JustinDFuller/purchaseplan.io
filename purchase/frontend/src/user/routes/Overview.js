import { ReactComponent as LogOutIcon } from "bootstrap-icons/icons/box-arrow-in-right.svg";
import { ReactComponent as BookIcon } from "bootstrap-icons/icons/book.svg";

import * as styles from "styles";
import * as Auth from "auth";

import { SavingsOverview } from "../components";

export function Overview() {
  const { auth, setAuth } = Auth.context.Use();

  return (
    <div className="row m-auto">
      <div className="col-12 px-0">
        <SavingsOverview />
        <ul className="list-group list-group-flush">
          <li className="list-group-item">
            <a
              className="btn btn-link"
              style={styles.text}
              href="https://blog.purchaseplan.io"
              target="_blank"
              rel="noreferrer"
              data-testid="blog"
            >
              <BookIcon className="mr-2" />
              <span style={{ position: "relative", top: 1 }}>Blog</span>
            </a>
          </li>
          <li className="list-group-item">
            {auth.isLoggedIn() && (
              <button
                className="btn btn-link"
                style={styles.text}
                onClick={async () => setAuth(await auth.logout())}
              >
                <LogOutIcon className="mr-2" />
                <span style={{ position: "relative", top: 1 }}>Log Out</span>
              </button>
            )}
          </li>
        </ul>
      </div>
    </div>
  );
}

Overview.path = "/app/user/overview";
