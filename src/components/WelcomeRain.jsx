import { useEffect, useState } from 'react';

const HEART_EMOJIS = ['💖', '💕', '💗', '💓', '💝', '🩷', '💘', '❤️'];

export default function WelcomeRain({ onDone }) {
  const [hearts, setHearts] = useState([]);
  const [textFadeOut, setTextFadeOut] = useState(false);
  const [overlayFadeOut, setOverlayFadeOut] = useState(false);

  useEffect(() => {
    const timers = [];

    for (let i = 0; i < 40; i++) {
      timers.push(setTimeout(() => {
        const id = Math.random().toString(36).slice(2);
        const heart = {
          id,
          emoji: HEART_EMOJIS[Math.floor(Math.random() * HEART_EMOJIS.length)],
          left: Math.random() * 100,
          size: 16 + Math.random() * 22,
          duration: 1.5 + Math.random() * 2,
        };
        setHearts((prev) => [...prev, heart]);
        timers.push(setTimeout(() => {
          setHearts((prev) => prev.filter((h) => h.id !== id));
        }, 3500));
      }, i * 80));
    }

    timers.push(setTimeout(() => setTextFadeOut(true), 2500));
    timers.push(setTimeout(() => setOverlayFadeOut(true), 3200));
    timers.push(setTimeout(() => onDone(), 3800));

    return () => timers.forEach(clearTimeout);
  }, [onDone]);

  return (
    <div id="welcomeOverlay" className={overlayFadeOut ? 'fade-out' : ''}>
      <div className="welcome-hearts-container" id="welcomeHeartsContainer">
        {hearts.map((h) => (
          <div
            key={h.id}
            className="welcome-heart-rain"
            style={{ left: `${h.left}vw`, fontSize: `${h.size}px`, animationDuration: `${h.duration}s` }}
          >
            {h.emoji}
          </div>
        ))}
      </div>
      <div className={`welcome-text ${textFadeOut ? 'fade-out' : ''}`} id="welcomeText">
        Bem-vinda, Nicolly 💕
      </div>
    </div>
  );
}
