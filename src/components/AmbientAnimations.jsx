import { useEffect, useState, useRef } from 'react';

const HEART_EMOJIS = ['💖', '💕', '💗', '💓', '💝', '🩷', '💘'];

export default function AmbientAnimations() {
  const [fireflies, setFireflies] = useState([]);
  const [hearts, setHearts] = useState([]);
  const idCounter = useRef(0);

  useEffect(() => {
    const timers = [];

    function spawnFirefly() {
      const id = idCounter.current++;
      const fly = {
        id,
        left: Math.random() * 100,
        delay: Math.random() * 15,
        duration: 10 + Math.random() * 10,
      };
      setFireflies((prev) => [...prev, fly]);
      timers.push(setTimeout(() => setFireflies((prev) => prev.filter((f) => f.id !== id)), 20000));
    }

    function spawnHeart() {
      const id = idCounter.current++;
      const heart = {
        id,
        emoji: HEART_EMOJIS[Math.floor(Math.random() * HEART_EMOJIS.length)],
        left: Math.random() * 100,
        delay: Math.random() * 5,
        duration: 10 + Math.random() * 8,
        size: 15 + Math.random() * 15,
      };
      setHearts((prev) => [...prev, heart]);
      timers.push(setTimeout(() => setHearts((prev) => prev.filter((h) => h.id !== id)), 20000));
    }

    for (let i = 0; i < 25; i++) timers.push(setTimeout(spawnFirefly, i * 600));
    for (let i = 0; i < 15; i++) timers.push(setTimeout(spawnHeart, i * 800 + 300));

    const loop = setInterval(() => {
      for (let i = 0; i < 3; i++) setTimeout(spawnFirefly, i * 500);
      for (let i = 0; i < 2; i++) setTimeout(spawnHeart, i * 600 + 200);
    }, 8000);

    return () => {
      timers.forEach(clearTimeout);
      clearInterval(loop);
    };
  }, []);

  return (
    <div id="animationsContainer">
      {fireflies.map((f) => (
        <div
          key={f.id}
          className="firefly"
          style={{ left: `${f.left}%`, animationDelay: `${f.delay}s`, animationDuration: `${f.duration}s` }}
        />
      ))}
      {hearts.map((h) => (
        <div
          key={h.id}
          className="floating-heart"
          style={{
            left: `${h.left}%`,
            bottom: '-50px',
            animationDelay: `${h.delay}s`,
            animationDuration: `${h.duration}s`,
            fontSize: `${h.size}px`,
          }}
        >
          {h.emoji}
        </div>
      ))}
    </div>
  );
}
