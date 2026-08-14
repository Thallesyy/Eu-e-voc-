import { useRelationshipCounter } from '../hooks/useRelationshipCounter';

export default function TogetherCounter() {
  const { text, time } = useRelationshipCounter();

  return (
    <section className="section">
      <div className="section-card special">
        <div className="section-header">Tempo juntos 💖</div>
        <div className="section-body">
          <div className="about-together">
            <div className="about-together-label">Juntos há</div>
            <div className="about-together-value">
              {text}
              {time && <><br /><span style={{ color: 'var(--accent-light)' }}>{time}</span></>}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
