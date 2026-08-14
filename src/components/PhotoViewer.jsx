import { useState, useRef, useCallback, useEffect } from 'react';
import { albums } from '../data/albums';
import EasterEgg from './EasterEgg';

export default function PhotoViewer({ albumKey, onClose, onEasterEgg, easterEggVisible }) {
  const album = albumKey ? albums[albumKey] : null;
  const [index, setIndex] = useState(0);
  const [anim, setAnim] = useState(''); // '', 'anim-out-left', 'anim-in-right', ...
  const touchStartX = useRef(0);

  useEffect(() => {
    setIndex(0);
    setAnim('');
  }, [albumKey]);

  useEffect(() => {
    if (albumKey && index === 3) {
      onEasterEgg(albumKey === 'random');
    } else {
      onEasterEgg(false);
    }
  }, [albumKey, index, onEasterEgg]);

  useEffect(() => {
    document.body.style.overflow = albumKey ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [albumKey]);

  const goTo = useCallback((direction) => {
    if (!album) return;
    const total = album.photos.length;
    setAnim(direction === 'left' ? 'anim-out-left' : 'anim-out-right');
    setTimeout(() => {
      setIndex((i) => (direction === 'left' ? (i + 1) % total : (i - 1 + total) % total));
      setAnim(direction === 'left' ? 'anim-in-right' : 'anim-in-left');
    }, 180);
  }, [album]);

  if (!album) return null;

  const total = album.photos.length;
  const current = album.photos[index];
  const behind1 = album.photos[(index - 1 + total) % total];
  const behind2 = album.photos[(index + 1) % total];

  return (
    <div className="viewer show">
      <div className="viewer-top">
        <div>{index + 1}/{total}</div>
        <button className="viewer-close" onClick={onClose} aria-label="Fechar galeria">Fechar ✕</button>
      </div>
      <div
        className="stack"
        onTouchStart={(e) => { touchStartX.current = e.touches[0].clientX; }}
        onTouchEnd={(e) => {
          const delta = e.changedTouches[0].clientX - touchStartX.current;
          if (delta < -50) goTo('left');
          else if (delta > 50) goTo('right');
        }}
      >
        <img className="behind one" src={behind1.src} alt="" onClick={(e) => { e.stopPropagation(); goTo('right'); }} />
        <img className="behind two" src={behind2.src} alt="" onClick={(e) => { e.stopPropagation(); goTo('left'); }} />
        <img className={`card-img front ${anim}`} src={current.src} alt="Foto" onClick={() => goTo('left')} />
      </div>
      <div className="viewer-caption">{current.caption}</div>
      <div className="viewer-hint">Toque na foto ou arraste pros lados para passar</div>
      <EasterEgg visible={easterEggVisible} />
    </div>
  );
}
