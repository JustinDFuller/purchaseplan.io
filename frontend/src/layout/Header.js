import * as styles from "../styles";

export function Header() {
  return (
    <nav className="navbar navbark-dark mb-3 pt-3" styles={styles.dark}>
      <div className="container-fluid">
        <a className="navbard-brand" href="/">
          <img src="/logo.png" alt="logo" style={styles.logo} />
        </a>
        <div className="d-flex">
          <ul className="navbar-nav">
            <li className="nav-item">
              <button className="btn btn-link nav-link" style={styles.text}>
                Log Out
              </button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
