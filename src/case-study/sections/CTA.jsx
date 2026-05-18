// CTA — closing call-to-action. Dark, oversized title, single primary
// button. Mirrors the Inquire pill from the marketing footer but on
// its own scale so the case-study ends with a clear ask.

import React from 'react';
import Reveal from '../components/Reveal.jsx';

const CTA = ({ data }) => {
  const [open, setOpen] = React.useState(false);
  const [email, setEmail] = React.useState('');
  const [sent, setSent] = React.useState(false);
  const inputRef = React.useRef(null);

  React.useEffect(() => {
    if (open && inputRef.current) inputRef.current.focus();
  }, [open]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email.includes('@') || sent) return;
    setSent(true);
    setOpen(false);
  };

  return (
    <section className="cs-section cs-section--dark cs-section--cta">
      <div className="cs-container">
        <Reveal className="cs-cta-inner">
          <div className="cs-eyebrow cs-eyebrow--on-dark">{data.eyebrow}</div>
          <h2 className="cs-cta-title">
            <span>{data.title}</span>
            <span className="cs-cta-title-accent">{data.titleAccent}</span>
          </h2>
          <p className="cs-cta-body">{data.body}</p>

          <form
            className={`cs-inquire ${open ? 'is-open' : ''} ${sent ? 'is-sent' : ''}`}
            onSubmit={handleSubmit}
          >
            <div className="cs-inquire-input-wrap">
              <input
                ref={inputRef}
                className="cs-inquire-input"
                type="email"
                placeholder="your@email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                tabIndex={open ? 0 : -1}
                aria-hidden={!open}
                disabled={sent}
              />
            </div>
            <button
              type={open ? 'submit' : 'button'}
              className="cs-inquire-btn"
              onClick={(e) => {
                if (sent) { e.preventDefault(); return; }
                if (!open) { e.preventDefault(); setOpen(true); }
              }}
              disabled={sent}
            >
              <span>{sent ? 'Thank you' : open ? 'Send' : 'Inquire'}</span>
              {!sent && <span className="cs-inquire-arrow">→</span>}
            </button>
          </form>

          <div className="cs-cta-fineprint">
            By invitation · Limited cohorts · North America
          </div>
        </Reveal>
      </div>
    </section>
  );
};

export default CTA;
