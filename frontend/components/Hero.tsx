import Link from "next/link";

const trustItems = ["Instant Download", "Secured checkout", "Verified plugins", "Regular updates"];

export default function Hero() {
  return (
    <section className="hero" id="top">
      <div className="hero-image" aria-hidden="true" />
      <div className="hero-overlay" />

      <div className="container hero-content">
        <div className="hero-copy">
          <div className="hero-title">
            <span>POWER UP</span>
            <strong>YOUR EDITING</strong>
          </div>

          <p className="hero-description">
           Production-ready plugins for creators, developers and businesses. Install faster, automate the repetitive work, and get more out of the platforms you already pay for.
          </p>

          <div className="hero-actions">
            <Link className="button button-dark button-large" href="#plugins">
              Explore Plugins
            </Link>
            <Link className="button button-lime button-large button-slanted" href="/register">
              Get Z-Tracker
            </Link>
          </div>

         <div className="trust-row">
  {trustItems.map((item) => (
    <span key={item} className="trust-pill">
      <span className="loading-ellipse" aria-hidden="true"></span>
      {item}
    </span>
  ))}
</div>
        </div>
      </div>
    </section>
  );
}
