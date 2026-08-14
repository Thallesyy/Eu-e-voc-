import { useState } from 'react';
import { reasons } from '../data/reasons';

export default function Reasons() {
  const [index, setIndex] = useState(0);
  const [fading, setFading] = useState(false);

  function nextReason() {
    setFading(true);
    setTimeout(() => {
      setIndex((i) => (i + 1) % reasons.length);
      setFading(false);
    }, 250);
  }

  const isLast = index === reasons.length - 1;

  return (
    <section className="section">
      <div className="section-card special">
        <div className="section-header">Por que eu gosto de você 💝</div>
        <div className="section-body">
          <div className="reason-display">
            <div className="reason-number">{index + 1}</div>
            <div
              className="reason-text"
              style={{ opacity: fading ? 0 : 1, transform: fading ? 'translateY(10px)' : 'translateY(0)' }}
            >
              {reasons[index]}
            </div>
          </div>
          <div className="reason-controls">
            <button className="btn reason-btn" onClick={nextReason}>
              {isLast ? 'Recomeçar 💕' : 'Próxima razão ✨'}
            </button>
            <div className="reason-progress">{index + 1} / {reasons.length}</div>
          </div>
        </div>
      </div>
    </section>
  );
}
