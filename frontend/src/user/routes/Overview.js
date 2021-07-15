import * as styles from "styles";
import * as Auth from "auth";

import { SavingsOverview } from "../components";

export function Overview() {
  const { auth, setAuth } = Auth.context.Use();

  return (
    <div className="row m-auto">
      <div className="col col-12">
        <SavingsOverview />
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
        {auth.isLoggedIn() && (
          <button
            className="btn btn-link nav-link m-auto"
            style={styles.text}
            onClick={async () => setAuth(await auth.logout())}
          >
            Log Out
          </button>
        )}
      </div>
    </div>
  );
}

Overview.path = "/app/user/overview";
