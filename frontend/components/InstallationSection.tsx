import Link from "next/link";

const compatibility = [
  "Premiere Pro 2026",
  "Windows 10 / 11 and macOS 13+",
  "Works on existing timelines, no project conversion",
  "Runs locally, nothing is uploaded",
];

export default function InstallationSection() {
  return (
    <section className="section installation-section" id="how-it-works">
      <div className="container">
        <div className="section-heading centered installation-heading">
          <p className="eyebrow">SEE EXACTLY WHAT YOU&apos;RE INSTALLING.</p>
          <p className="section-subtitle">
            Screenshots, walkthroughs, requirements and a live demonstration — all of it before you pick, not after.
          </p>
        </div>

        <div className="installation-grid">
          <div className="video-frame" role="img" aria-label="Plugin demonstration video placeholder">
            <button className="play-button" aria-label="Play plugin demonstration">
              <span>▶</span>
            </button>
          </div>

          <aside className="compatibility-card">
            <p className="mini-heading">COMPATIBILITY</p>

            <ul>
              {compatibility.map((item) => (
                <li key={item}>
                  <span aria-hidden="true">✓</span>
                  {item}
                </li>
              ))}
            </ul>

            <div className="spec-list">
              <div>
                <span>VERSION</span>
                <strong>1.0.4</strong>
              </div>
              <div>
                <span>LAST UPDATE</span>
                <strong>SEP 2026</strong>
              </div>
              <div>
                <span>DOWNLOAD SIZE</span>
                <strong>12 MB</strong>
              </div>
            </div>

            <Link href="#plugins" className="button button-lime full-button button-slanted">
              Browse Plugins
            </Link>
          </aside>
        </div>
      </div>
    </section>
  );
}
