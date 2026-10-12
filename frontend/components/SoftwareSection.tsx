const software = [
  {
    short: "Pr",
    name: "Adobe Premiere Pro",
    count: "[01] Plugins",
    status: "Compatible",
    tone: "premiere",
  },
  {
    short: "Pr",
    name: "Adobe After Effects",
    count: "[03] Plugins",
    status: "Coming Soon",
    tone: "after",
  },
  {
    short: "Ai",
    name: "Adobe Illustrator",
    count: "[06] Plugins",
    status: "Coming Soon",
    tone: "illustrator",
  },
];

export default function SoftwareSection() {
  return (
    <section className="section software-section" id="software">
      <div className="container narrow">
        <div className="section-heading centered">
          <p className="eyebrow">BUILT FOR UR SOFTWARES</p>
          <p className="section-subtitle">
            Filter the catalogue down to the application already open on your machine.
          </p>
        </div>

        <div className="software-grid">
          {software.map((item) => (
            <article className="software-card" key={item.name}>
              <div className={`software-icon ${item.tone}`}>{item.short}</div>
             <div className="software-info">
  <h3>{item.name}</h3>

  <div className="software-info-bottom">
    <p>{item.count}</p>

    <span className={`status-tag ${item.tone}`}>
      <span className="status-loader" aria-hidden="true"></span>
      {item.status}
    </span>
  </div>
</div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
