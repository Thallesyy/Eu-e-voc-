import { timelineEvents } from '../data/timeline';

export default function Timeline() {
  return (
    <section className="section">
      <div className="section-card">
        <div className="section-header">Nossa história 🗓️</div>
        <div className="timeline">
          {timelineEvents.map((ev, i) => (
            <div className="timeline-item" style={{ animationDelay: `${i * 0.1}s` }} key={i}>
              <div className="timeline-dot">💖</div>
              <div className="timeline-content">
                <div className="timeline-date">{ev.date}</div>
                <div className="timeline-title">{ev.title}</div>
                <div className="timeline-desc">{ev.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
