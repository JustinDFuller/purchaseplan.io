const styles = {
  nav: {
    background: '#fff',
    padding: '5px 20px'
  },
  img: {
    height: '30px',
  }
}

export function Header() {
  return (
    <nav className="navbar navbark-light bg-light">
      <div className="container">
        <a className="navbard-brand" href="/">
          <img src="/logo.png" alt="logo" style={styles.img} />
        </a>
      </div>
    </nav>
  );
}
