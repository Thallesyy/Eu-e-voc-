import { useState, useRef, useCallback } from 'react';

const BALLOON_LAYOUT = [
  { id: 0, x: 18, y: 10, color: '#ff6b9d' },
  { id: 1, x: 42, y: 4, color: '#ff8fab' },
  { id: 2, x: 66, y: 9, color: '#e63969' },
  { id: 3, x: 28, y: 24, color: '#ffb3c6' },
  { id: 4, x: 55, y: 26, color: '#ff6b9d' },
  { id: 5, x: 80, y: 22, color: '#c44569' },
];

export default function BalloonBoxGame({ onAllPopped }) {
  const [popped, setPopped] = useState({});
  const [poppedCount, setPoppedCount] = useState(0);
  const [arrows, setArrows] = useState([]);
  const [bowKick, setBowKick] = useState(false);
  const [boxPhase, setBoxPhase] = useState('hanging'); // hanging | falling | zoom
  const bowRef = useRef(null);
  const balloonRefs = useRef({});

  const total = BALLOON_LAYOUT.length;

  const popBalloon = useCallback((id) => {
    setPopped((prev) => ({ ...prev, [id]: true }));
    setPoppedCount((c) => {
      const next = c + 1;
      if (next === total) {
        setTimeout(() => setBoxPhase('falling'), 250);
        setTimeout(() => setBoxPhase('zoom'), 750);
        setTimeout(() => onAllPopped(), 1550);
      }
      return next;
    });
  }, [total, onAllPopped]);

  function handleTap(id) {
    if (popped[id] || boxPhase !== 'hanging') return;
    const bowEl = bowRef.current;
    const balloonEl = balloonRefs.current[id];

    if (!bowEl || !balloonEl) {
      popBalloon(id);
      return;
    }

    const bowRect = bowEl.getBoundingClientRect();
    const balloonRect = balloonEl.getBoundingClientRect();
    const start = { x: bowRect.left + bowRect.width / 2, y: bowRect.top + bowRect.height / 2 };
    const end = { x: balloonRect.left + balloonRect.width / 2, y: balloonRect.top + balloonRect.height / 2 };
    const angle = (Math.atan2(end.y - start.y, end.x - start.x) * 180) / Math.PI;

    const arrowId = Math.random().toString(36).slice(2);
    setArrows((prev) => [...prev, { id: arrowId, start, end, angle, flying: false }]);
    setBowKick(true);
    setTimeout(() => setBowKick(false), 200);

    requestAnimationFrame(() => {
      setArrows((prev) => prev.map((a) => (a.id === arrowId ? { ...a, flying: true } : a)));
    });

    setTimeout(() => {
      setArrows((prev) => prev.filter((a) => a.id !== arrowId));
      popBalloon(id);
    }, 220);
  }

  const droop = Math.min(poppedCount, total - 1) * 8;

  return (
    <div id="balloonGameOverlay">
      <div className="balloon-game-text">Estoura os balões pra abrir a caixa 🎈</div>

      <div className={`balloon-box-area ${boxPhase}`}>
        <svg className="balloon-strings" viewBox="0 0 100 100" preserveAspectRatio="none">
          {BALLOON_LAYOUT.filter((b) => !popped[b.id]).map((b) => (
            <line
              key={b.id}
              x1={b.x} y1={b.y}
              x2={50} y2={44 + droop * 0.3}
              stroke="rgba(255,255,255,0.35)"
              strokeWidth="0.4"
            />
          ))}
        </svg>

        {BALLOON_LAYOUT.map((b) => (
          <div
            key={b.id}
            className={`balloon ${popped[b.id] ? 'popped' : ''}`}
            ref={(el) => { balloonRefs.current[b.id] = el; }}
            style={{ left: `${b.x}%`, top: `${b.y}%`, background: b.color }}
            onClick={() => handleTap(b.id)}
          >
            <div className="balloon-knot" />
          </div>
        ))}

        <div className="crate-box" style={{ transform: `translate(-50%, ${droop}px)` }}>📦</div>
      </div>

      <div
        className="bow"
        ref={bowRef}
        style={{ transform: bowKick ? 'rotate(-12deg) scale(1.1)' : 'rotate(0deg) scale(1)' }}
      >
        🏹
      </div>

      {arrows.map((a) => (
        <div
          key={a.id}
          className="flying-arrow"
          style={{
            left: a.flying ? a.end.x : a.start.x,
            top: a.flying ? a.end.y : a.start.y,
            transform: `translate(-50%, -50%) rotate(${a.angle}deg)`,
            transition: a.flying ? 'left 0.2s ease-out, top 0.2s ease-out' : 'none',
          }}
        >
          ➤
        </div>
      ))}
    </div>
  );
}
