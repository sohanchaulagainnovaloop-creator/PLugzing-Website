import Link from "next/link";

const navItems = [
  { label: "Plugins", href: "#plugins" },
  { label: "Tools", href: "#tools", comingSoon: true },
  { label: "How It Works", href: "#how-it-works" },
];

export default function Navbar() {
  return (
    <header className="navbar-wrap">
      <nav className="navbar">

        <Link className="brand" href="/" aria-label="Plugzin home">
          <img
            src="/images/logo.png"
            alt=""
            className="brand-logo"
          />

          <img
            src="/images/plugin.svg"
            alt="Plugzin"
            className="brand-name"
          />
        </Link>

        <div className="nav-links">
          {navItems.map((item) => (
            <Link key={item.label} href={item.href}>
              {item.label}

              {item.comingSoon && (
                <span className="coming-soon">
                  ( Comming Soon )
                </span>
              )}
            </Link>
          ))}
        </div>

        <div className="nav-actions">
          <Link className="button button-dark" href="/login">
            Sign In
          </Link>

          <Link
            className="button button-lime button-slanted"
            href="/register"
          >
            Get Z-Tracker
          </Link>
        </div>

        <details className="mobile-menu">
          <summary aria-label="Open navigation">Menu</summary>

          <div className="mobile-menu-panel">
            {navItems.map((item) => (
              <Link key={item.label} href={item.href}>
                {item.label}

                {item.comingSoon && (
                  <span className="coming-soon">
                    ( Comming Soon )
                  </span>
                )}
              </Link>
            ))}

            <Link href="/login">Sign In</Link>

            <Link className="mobile-lime" href="/register">
              Get Z-Tracker
            </Link>
          </div>
        </details>

      </nav>
    </header>
  );
}