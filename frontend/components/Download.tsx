'use client';

// import './Download.css';

const reviews = [
  {
    text: 'Finally, plugins that actually solve the problems I run into every day.',
    name: 'ALEX MARTIN',
    role: 'FULL STACK DEVELOPER',
  },
  {
    text: 'The workflow is simple, the tools are useful, and everything feels built for developers.',
    name: 'JORDAN LEE',
    role: 'SOFTWARE ENGINEER',
  },
  {
    text: 'I found exactly what I needed without wasting hours searching through plugins.',
    name: 'SAM WILSON',
    role: 'PRODUCT DEVELOPER',
  },
]; 

export default function Download() {
  return (
    <section className="download-section">
      {/* =====================================================
          REVIEWS / DOWNLOAD STATS
          ===================================================== */}

      <div className="download-reviews">
        {/* Header */}
        <div className="download-reviews-header">
          <div className="download-reviews-heading">
            <h2>USED BY PEOPLE WHO BUILD FOR A LIVING.</h2>

            <p>
              Every review below is tied to a purchase, no invited
              testimonials.
            </p>
          </div>

          <div className="download-stat">
            <span className="download-stat-number">102+</span>

            <span className="download-stat-label">TOTAL DOWNLOADS</span>
          </div>
        </div>

        {/* Review cards */}
        <div className="download-reviews-grid">
          {reviews.map((review) => (
            <article className="download-review-card" key={review.name}>
              <p className="download-review-text">{review.text}</p>

              <div className="download-review-divider" />

              <div className="download-review-footer">
                <div className="download-review-user">
                  <div className="download-avatar" />

                  <div className="download-user-info">
                    <span>{review.name}</span>
                    <span>{review.role}</span>
                  </div>
                </div>

                <div className="download-verified">
                  <span className="download-check">✓</span>
                  <span>VERIFIED PURCHASE</span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>

      {/* =====================================================
          NEWSLETTER CTA
          ===================================================== */}

      <div className="download-newsletter">
        <div className="download-newsletter-content">
          <h2>
            GET YOUR HANDS ON THE UPCOMING TOOLS BEFORE ANYONE
          </h2>

          <p>Subscribe to our Newsletter</p>
        </div>

        <form
          className="download-newsletter-form"
          onSubmit={(event) => {
            event.preventDefault();
          }}
        >
          <input
            type="email"
            placeholder="Enter your email"
            aria-label="Email address"
            required
          />

          <button type="submit">SUBSCRIBE</button>
        </form>
      </div>
    </section>
  );
}