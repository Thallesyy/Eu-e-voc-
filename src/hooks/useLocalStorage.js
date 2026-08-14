import { useState, useEffect, useRef } from 'react';

// Hook simples de estado sincronizado com localStorage
export function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const saved = localStorage.getItem(key);
      return saved !== null ? JSON.parse(saved) : initialValue;
    } catch {
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // localStorage indisponível (modo privado, etc.) — ignora
    }
  }, [key, value]);

  return [value, setValue];
}

// Hook pra animar um número contando até o valor alvo (usado nos contadores)
export function useAnimatedNumber(target, durationMs = 600) {
  const [display, setDisplay] = useState(target);
  const prevRef = useRef(target);

  useEffect(() => {
    const start = prevRef.current;
    const diff = target - start;
    if (diff === 0) return;

    const steps = 30;
    let step = 0;
    const timer = setInterval(() => {
      step++;
      setDisplay(Math.round(start + (diff * step) / steps));
      if (step >= steps) {
        setDisplay(target);
        clearInterval(timer);
      }
    }, durationMs / steps);

    prevRef.current = target;
    return () => clearInterval(timer);
  }, [target, durationMs]);

  return display;
}
