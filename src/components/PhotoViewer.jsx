import { useState, useRef, useCallback, useEffect } from 'react';
import { albums } from '../data/albums';
import EasterEgg from './EasterEgg';

// ===== Tamanho e espaçamento das fotos =====
const PHOTO_WIDTH_RATIO = 0.58; // % da largura do palco — menor = mais fotos visíveis ao mesmo tempo
const MAX_PHOTO_WIDTH = 260;
const GAP = 14;
const SCALE_AT_1 = 0.84;        // tamanho da foto vizinha imediata (usado só pra calcular o espaçamento)
const WINDOW_RADIUS = 3;        // quantas fotos pra cada lado ficam "montadas" (o resto nem existe na tela)

// ===== Aparência das fotos conforme a distância do centro =====
const SCALE_FALLOFF = 0.16;
const OPACITY_FALLOFF = 0.32;
const MIN_SCALE = 0.58;
const MIN_OPACITY = 0.28;

// ===== Física do arraste (mola com inércia) =====
const STIFFNESS = 190;
const DAMPING = 22;
const FLING_PROJECTION = 0.16;  // quanto a velocidade solta "empurra" o alvo pra frente
const RUBBER_BAND = 0.35;       // resistência ao passar do início/fim do álbum
const TAP_MOVE_LIMIT = 6;       // px — abaixo disso conta como toque, não arraste
const SETTLE_EPS = 0.0015;
const MIN_VELOCITY_DT_MS = 8;   // ignora amostras absurdamente próximas no tempo (evita divisão por ~0)
const MAX_FLING_VELOCITY = 30;  // teto de segurança pra velocidade da mola (fotos por segundo)

export default function PhotoViewer({ albumKey, onClose, onEasterEgg, easterEggVisible }) {
  const album = albumKey ? albums[albumKey] : null;
  const total = album ? album.photos.length : 0;

  const [scrollPos, setScrollPos] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [stageWidth, setStageWidth] = useState(320);

  const containerRef = useRef(null);
  const draggingRef = useRef(false);
  const posRef = useRef(0);        // posição "real" — fonte da verdade, fora do ciclo do React
  const startXRef = useRef(0);
  const startPosRef = useRef(0);
  const maxMoveRef = useRef(0);
  const samplesRef = useRef([]);   // {x, t} recentes, pra calcular velocidade ao soltar
  const rafRef = useRef(null);
  const targetRef = useRef(0);
  const velRef = useRef(0);        // velocidade da mola, em "fotos por segundo"

  const clampBounds = useCallback((v) => Math.max(0, Math.min(total - 1, v)), [total]);

  const photoWidth = Math.min(stageWidth * PHOTO_WIDTH_RATIO, MAX_PHOTO_WIDTH);
  const pitch = (photoWidth * (1 + SCALE_AT_1)) / 2 + GAP;

  useEffect(() => {
    cancelAnimationFrame(rafRef.current);
    posRef.current = 0;
    setScrollPos(0);
    setDragging(false);
  }, [albumKey]);

  const displayIndex = Math.round(clampBounds(scrollPos));

  useEffect(() => {
    if (albumKey && displayIndex === 3) onEasterEgg(albumKey === 'random');
    else onEasterEgg(false);
  }, [albumKey, displayIndex, onEasterEgg]);

  useEffect(() => {
    document.body.style.overflow = albumKey ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [albumKey]);

  useEffect(() => {
    function measure() {
      if (containerRef.current) setStageWidth(containerRef.current.offsetWidth || 320);
    }
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, [albumKey]);

  useEffect(() => () => cancelAnimationFrame(rafRef.current), []);

  // Anima posRef.current em direção a targetRef.current usando uma mola com massa 1,
  // carregando a velocidade que a pessoa imprimiu ao arrastar (inércia de verdade).
  // IMPORTANTE: nunca chamamos requestAnimationFrame de dentro de um "updater" de
  // setState — isso roda em duplicidade no StrictMode e faz a animação explodir.
  // Aqui a física toda vive em refs; o setState só recebe o valor já pronto.
  function runSpring() {
    let last = performance.now();

    function tick(now) {
      const dt = Math.min((now - last) / 1000, 1 / 30);
      last = now;

      const target = targetRef.current;
      const force = -STIFFNESS * (posRef.current - target);
      const dampingForce = -DAMPING * velRef.current;
      const acc = force + dampingForce;

      velRef.current += acc * dt;
      velRef.current = Math.max(-MAX_FLING_VELOCITY * 3, Math.min(MAX_FLING_VELOCITY * 3, velRef.current));
      posRef.current = posRef.current + velRef.current * dt;

      const settled = Math.abs(posRef.current - target) < SETTLE_EPS && Math.abs(velRef.current) < SETTLE_EPS * 40;

      if (settled) {
        posRef.current = target;
        setScrollPos(target);
        rafRef.current = null;
        return;
      }

      setScrollPos(posRef.current);
      rafRef.current = requestAnimationFrame(tick);
    }

    cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(tick);
  }

  function settleTo(target, initialVelocity = 0) {
    targetRef.current = clampBounds(target);
    velRef.current = initialVelocity;
    runSpring();
  }

  function onPointerDown(e) {
    if (total <= 1) return;
    cancelAnimationFrame(rafRef.current);
    e.currentTarget.setPointerCapture(e.pointerId);
    draggingRef.current = true;
    setDragging(true);
    startXRef.current = e.clientX;
    startPosRef.current = posRef.current;
    maxMoveRef.current = 0;
    samplesRef.current = [{ x: e.clientX, t: performance.now() }];
  }

  function onPointerMove(e) {
    if (!draggingRef.current) return;
    const deltaPx = e.clientX - startXRef.current;
    maxMoveRef.current = Math.max(maxMoveRef.current, Math.abs(deltaPx));

    let next = startPosRef.current - deltaPx / pitch;
    if (next < 0) next = next * RUBBER_BAND;
    if (next > total - 1) next = (total - 1) + (next - (total - 1)) * RUBBER_BAND;

    posRef.current = next;
    setScrollPos(next);

    const now = performance.now();
    samplesRef.current.push({ x: e.clientX, t: now });
    samplesRef.current = samplesRef.current.filter((s) => now - s.t < 100);
  }

  function onPointerUp(e) {
    if (!draggingRef.current) return;
    draggingRef.current = false;
    setDragging(false);

    if (maxMoveRef.current < TAP_MOVE_LIMIT) {
      const rect = containerRef.current.getBoundingClientRect();
      const clickedRight = e.clientX - rect.left > rect.width / 2;
      settleTo(Math.round(posRef.current) + (clickedRight ? 1 : -1));
      return;
    }

    const samples = samplesRef.current;
    let pxPerMs = 0;
    if (samples.length >= 2) {
      const first = samples[0];
      const last = samples[samples.length - 1];
      const dt = last.t - first.t;
      if (dt >= MIN_VELOCITY_DT_MS) pxPerMs = (last.x - first.x) / dt;
    }
    let velIndexPerSec = -(pxPerMs * 1000) / pitch;
    velIndexPerSec = Math.max(-MAX_FLING_VELOCITY, Math.min(MAX_FLING_VELOCITY, velIndexPerSec));

    const rawTarget = posRef.current + velIndexPerSec * FLING_PROJECTION;
    const target = Math.round(clampBounds(rawTarget));
    settleTo(target, velIndexPerSec);
  }

  if (!album) return null;

  const renderMin = Math.max(0, Math.min(total - 1, Math.floor(scrollPos - WINDOW_RADIUS)));
  const renderMax = Math.max(0, Math.min(total - 1, Math.ceil(scrollPos + WINDOW_RADIUS)));
  const slots = [];
  for (let i = renderMin; i <= renderMax; i++) {
    const dist = i - scrollPos;
    const absDist = Math.abs(dist);
    const scale = Math.max(MIN_SCALE, 1 - absDist * SCALE_FALLOFF);
    const opacity = Math.max(MIN_OPACITY, 1 - absDist * OPACITY_FALLOFF);
    slots.push({
      key: i,
      photo: album.photos[i],
      x: dist * pitch,
      scale,
      opacity,
      z: 1000 - Math.round(absDist * 10),
    });
  }

  const current = album.photos[displayIndex];

  return (
    <div className="viewer show">
      <div className="viewer-top">
        <div>{displayIndex + 1}/{total}</div>
        <button className="viewer-close" onClick={onClose} aria-label="Fechar galeria">Fechar ✕</button>
      </div>

      <div
        className="drag-stage"
        ref={containerRef}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
      >
        {slots.map((s) => (
          <img
            key={s.key}
            className="drag-photo"
            src={s.photo.src}
            alt="Foto"
            draggable={false}
            style={{
              width: `${photoWidth}px`,
              transform: `translate(-50%, -50%) translateX(${s.x}px) scale(${s.scale})`,
              opacity: s.opacity,
              zIndex: s.z,
            }}
          />
        ))}
      </div>

      <div className="viewer-caption">{current.caption}</div>
      <div className="viewer-hint">Arrasta pra deslizar entre as fotos — solta rápido pra "atirar" por várias de uma vez</div>
      <EasterEgg visible={easterEggVisible} />
    </div>
  );
}