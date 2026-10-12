import Link from "next/link";

const tools = [
  {
    number: "01",
    title: "2TRACKER",
    description: "Transfer and stabilize motion data in seconds, without leaving your timeline.",
    price: "$30",
    version: "v1.0.4",
  },
  {
    number: "02",
    title: "2TRACKER",
    description: "Transfer and stabilize motion data in seconds, without leaving your timeline.",
    price: "$30",
    version: "v1.0.4",
  },
];

export default function ToolsSection() {
  return (
    <section className="section tools-section" id="tools">
      <div className="container">
        <div className="section-topline">
          <div>
            <p className="eyebrow left">TOOLS &amp; PLUGINS</p>
            <p className="section-subtitle left">
              Tested tools with clear documentation, regular updates and practical support.
            </p>
          </div>
          <Link className="button button-lime button-slanted small-button" href="#plugins">
            Browse Plugins
          </Link>
        </div>

        <div className="tools-grid">
          {tools.map((tool) => (
            <article className="tool-card" key={tool.number}>
              <div className="tool-art">
                <span>{tool.number}</span>
                <div className="speed-line one" />
                <div className="speed-line two" />
                <div className="speed-line three" />
              </div>

              <div className="tool-body">
                <h3>{tool.title}</h3>
                <p>{tool.description}</p>

                <dl>
                  <div>
                    <dt>Platform</dt>
                    <dd>Premiere Pro</dd>
                  </div>
                  <div>
                    <dt>Version</dt>
                    <dd>{tool.version}</dd>
                  </div>
                  <div>
                    <dt>Compatibility</dt>
                    <dd>Premiere Pro 2026</dd>
                  </div>
                </dl>

                <div className="tool-bottom">
                  <strong>{tool.price}</strong>
                  <Link href="#installation">GET NOW ↗</Link>
                </div>
              </div>
            </article>
          ))}

          <article className="signup-card">
            <div>
              <p className="signup-title">SIGN UP FOR<br />EARLY UPDATES</p>
              <p className="signup-copy">
                Stay informed when new plugins arrive, without filling your inbox.
              </p>
            </div>
            <Link href="/register" className="outline-lime-button">
              Sign up Now ↗
            </Link>
          </article>
        </div>
      </div>
    </section>
  );
}
