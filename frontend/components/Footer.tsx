import Link from "next/link";
import Image from "next/image";
// import "./Footer.css";

export default function Footer() {
  return (
    <footer className="plugzing-footer">
      {/* Brand */}
      <div className="footer-brand-section">
        <Link href="/" className="footer-brand" aria-label="Plugzin home">
          <Image
            src="/images/logo.png"
            alt="Plugzin logo"
            width={44}
            height={56}
            className="footer-logo"
          />

          <Image
            src="/images/plugin.svg"
            alt="Plugzin"
            width={82}
            height={24}
            className="footer-brand-name"
          />
        </Link>

        <p className="footer-description">
          Professional plugins that automate repetitive work and extend the
          tools you already run.
        </p>
      </div>

      {/* Navigation */}
      <nav className="footer-navigation">
        <Link href="/plugins">PLUGINS</Link>
        <Link href="/support">SUPPORT</Link>
        <Link href="/policy">POLICY</Link>
        <Link href="/terms">TERMS &amp; CONDITIONS</Link>
      </nav>

      {/* Dashed divider */}
      <div className="footer-divider" />

      {/* Bottom information */}
      <div className="footer-bottom">
        <div className="footer-copyright">
          <span className="footer-copyright-symbol">©</span>
          <span>Copyright plugzin 2026</span>
        </div>

        <div className="footer-developed">
          <span className="footer-developed-symbol">✦</span>
          <span>Developed By Novaloop.tech</span>
        </div>
      </div>
    </footer>
  );
}