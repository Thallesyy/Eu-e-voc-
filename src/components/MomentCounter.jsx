import { useState, useRef } from 'react';
import { useLocalStorage, useAnimatedNumber } from '../hooks/useLocalStorage';
import { STORAGE_KEYS } from '../data/config';

const PHRASES = [
  'mais um momento lindo 💕',
  'eu nunca vou esquecer 🥹',
  'que sorte a minha 💖',
  'cada vez mais 💗',
  'pra sempre na memória 🌸',
  'feliz demais 🩷',
];
const CELEBRATION_HEARTS = ['💖', '💕', '💗', '🩷'];

export default function MomentCounter() {
  const [count, setCount] = useLocalStorage(STORAGE_KEYS.moments, 0);
  const [hint, setHint] = useState('');
  const [hintVisible, setHintVisible] = useState(false);
  const [bump, setBump] = useState(false);
  const [flying, setFlying] = useState([]);
  const btnRef = useRef(null);
  const displayCount = useAnimatedNumber(count, 200);

  function addMoment() {
    setCount((c) => c + 1);
    setBump(true);
    setTimeout(() => setBump(false), 200);

    setHint(PHRASES[Math.floor(Math.random() * PHRASES.length)]);
    setHintVisible(true);
    setTimeout(() => setHintVisible(false), 2000);

    if (btnRef.current) {
      const rect = btnRef.current.getBoundingClientRect();
      const id = Math.random().toString(36).slice(2);
      const heart = {
        id,
        emoji: CELEBRATION_HEARTS[Math.floor(Math.random() * CELEBRATION_HEARTS.length)],
        left: rect.left + rect.width / 2,
        top: rect.top,
      };
      setFlying((prev) => [...prev, heart]);
      setTimeout(() => setFlying((prev) => prev.filter((h) => h.id !== id)), 1200);
    }
  }

  return (
    <section className="section">
      <div className="section-card special">
        <div className="section-header">Nossos momentos especiais 🌟</div>
        <div className="section-body" style={{ textAlign: 'center' }}>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '12px', fontSize: '14px' }}>
            Cada vez que vivemos algo especial, clica aqui pra contar 💕
          </p>
          <div className="moment-counter-wrap">
            <div
              className="moment-count"
              style={{ transform: bump ? 'scale(1.4)' : 'scale(1)', color: bump ? '#ff6b9d' : '' }}
            >
              {displayCount}
            </div>
            <div className="moment-label">momentos juntos</div>
          </div>
          <button className="moment-btn" ref={btnRef} onClick={addMoment}>
            + Adicionar momento 💖
          </button>
          <div className="moment-hint" style={{ opacity: hintVisible ? 1 : 0 }}>{hint}</div>
        </div>
      </div>

      {flying.map((h) => (
        <div
          key={h.id}
          className="celebration-heart"
          style={{ left: h.left, top: h.top }}
        >
          {h.emoji}
        </div>
      ))}
    </section>
  );
}
