import { useState } from 'react';
import { albums } from '../data/albums';

const SIZE = 3;
const PIECES = SIZE * SIZE;
const photos = albums.us.photos;

function randomPhoto(except) {
  if (photos.length < 2) return photos[0].src;
  let src;
  do {
    src = photos[Math.floor(Math.random() * photos.length)].src;
  } while (src === except);
  return src;
}

function shuffledOrder() {
  const order = Array.from({ length: PIECES }, (_, i) => i);
  do {
    for (let i = order.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [order[i], order[j]] = [order[j], order[i]];
    }
  } while (order.every((piece, pos) => piece === pos));
  return order;
}

export default function PhotoPuzzle() {
  const [photo, setPhoto] = useState(() => randomPhoto());
  const [order, setOrder] = useState(shuffledOrder);
  const [selected, setSelected] = useState(null);
  const [moves, setMoves] = useState(0);

  const solved = order.every((piece, pos) => piece === pos);

  function pick(pos) {
    if (solved) return;
    if (selected === null) {
      setSelected(pos);
      return;
    }
    if (selected !== pos) {
      setOrder((prev) => {
        const next = [...prev];
        [next[selected], next[pos]] = [next[pos], next[selected]];
        return next;
      });
      setMoves((m) => m + 1);
    }
    setSelected(null);
  }

  function restart(drawNewPhoto) {
    if (drawNewPhoto) setPhoto((current) => randomPhoto(current));
    setOrder(shuffledOrder());
    setSelected(null);
    setMoves(0);
  }

  return (
    <section className="section">
      <div className="section-card">
        <div className="section-header">Quebra-cabeça nosso 🧩</div>
        <div className="section-body">
          {solved
            ? `Montou! 💖 Em ${moves} ${moves === 1 ? 'jogada' : 'jogadas'}.`
            : 'Toca em duas peças pra trocar elas de lugar e monta a nossa foto.'}
        </div>

        <div
          className={`puzzle-board ${solved ? 'solved' : ''}`}
          style={{ gridTemplateColumns: `repeat(${SIZE}, 1fr)` }}
        >
          {order.map((piece, pos) => (
            <div
              key={piece}
              className={`puzzle-piece ${selected === pos ? 'selected' : ''}`}
              // pointerup em vez de click: o bloqueio de double-tap do App engole toques rápidos no celular
              onPointerUp={() => pick(pos)}
            >
              <div
                className="puzzle-piece-img"
                style={{
                  backgroundImage: `url(${photo})`,
                  width: `${SIZE * 100}%`,
                  height: `${SIZE * 100}%`,
                  left: `${-(piece % SIZE) * 100}%`,
                  top: `${-Math.floor(piece / SIZE) * 100}%`,
                }}
              />
            </div>
          ))}
        </div>

        <div className="puzzle-footer">
          <div className="puzzle-info">
            <img className="puzzle-preview" src={photo} alt="Foto do quebra-cabeça" />
            <span>{moves} {moves === 1 ? 'jogada' : 'jogadas'}</span>
          </div>
          <div className="puzzle-actions">
            <button className="btn" onClick={() => restart(false)}>Embaralhar 🔀</button>
            <button className="btn" onClick={() => restart(true)}>Outra foto 🎲</button>
          </div>
        </div>
      </div>
    </section>
  );
}
