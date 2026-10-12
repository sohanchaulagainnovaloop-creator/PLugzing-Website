'use client';

// import './Activation.css';

const steps = [
  {
    number: '01',
    title: 'SELECT',
    description:
      'Find a plugin by platform, category or the workflow you are trying to fix.',
    color: '#76FEEA',
  },
  {
    number: '02',
    title: 'PURCHASE',
    description:
      'Choose a licence that matches your setup and complete a secure checkout.',
    color: '#8CD869',
  },
  {
    number: '03',
    title: 'DOWNLOAD',
    description:
      'The plugin and its documentation are available the moment payment clears.',
    color: '#935AB4',
  },
  {
    number: '04',
    title: 'ACTIVATE',
    description:
      'Enter your licence key once and the plugin is live in your application.',
    color: '#8EC85B',
  },
];

export default function Activation() {
  return (
    <section className="activation-section">
      {/* Decorative dashed vectors */}
      <div className="activation-vector activation-vector-left" />
      <div className="activation-vector activation-vector-left-small" />
      <div className="activation-vector activation-vector-center" />
      <div className="activation-vector activation-vector-right" />
      <div className="activation-vector activation-vector-right-small" />

      {/* Heading */}
      <div className="activation-header">
        <h2>FROM DISCOVERY TO ACTIVATION.</h2>

        <p>
          Four steps, and none of them involve waiting for an email.
        </p>
      </div>

      {/* Download button */}
<div className="activation-button-wrapper">
  <button
    type="button"
    className="activation-download-button"
    onClick={() => {
      console.log('Download Z-Tracker');
    }}
  >
    DOWNLOAD Z-TRACKER NOW
  </button>
</div>

{/* Timeline */}
<div className="activation-timeline">
  <div className="activation-line" />

  <div className="activation-dots">
    {steps.map((step) => (
      <span
        key={step.number}
        className="activation-dot"
        style={{ backgroundColor: step.color }}
      />
    ))}
  </div>
</div>

{/* Steps */}
<div className="activation-steps">
  {steps.map((step) => (
    <div
      key={step.number}
      className={`activation-step activation-step-${step.number}`}
    >
      <div className="activation-step-heading">
        <span className="activation-number">{step.number}</span>
        <span className="activation-title">{step.title}</span>
      </div>

      <p>{step.description}</p>
    </div>
  ))}
</div>
    </section>
  );
}