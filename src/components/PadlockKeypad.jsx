import { useState, useEffect } from 'react';
import { CORRECT_PASSWORD } from '../data/config';

const TARGET = CORRECT_PASSWORD.replace(/\D/g, '');
const KEYS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '*', '0', '#'];

export default function PadlockKeypad({ onCorrect }) {
  const [digits, setDigits] = useState('');
  const [shake, setShake] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (digits.length < TARGET.length) return;
    if (digits === TARGET) {
      setSuccess(true);
      setTimeout(onCorrect, 500);
    } else {
      setShake(true);
      setTimeout(() => {
        setShake(false);
        setDigits('');
      }, 400);
    }
  }, [digits, onCorrect]);

  function press(key) {
    if (success) return;
    if (key === '*') {
      setDigits((d) => d.slice(0, -1));
      return;
    }
    if (key === '#') {
      setDigits('');
      return;
    }
    if (digits.length >= TARGET.length) return;
    setDigits((d) => d + key);
  }

  return (
    <div id="padlockOverlay">
      <div className={`padlock-body ${shake ? 'shake' : ''} ${success ? 'success' : ''}`}>
        <div className="padlock-shackle" />
        <div className="padlock-title">Agora sim, destranca 🔒</div>
        <div className="padlock-dots">
          {Array.from({ length: TARGET.length }).map((_, i) => (
            <span key={i} className={`padlock-dot ${i < digits.length ? 'filled' : ''}`} />
          ))}
        </div>
        <div className="padlock-keypad">
          {KEYS.map((k) => (
            <button key={k} className="padlock-key" onClick={() => press(k)}>{k}</button>
          ))}
        </div>
        <div className="padlock-hint">
          {success ? 'Desbloqueado 💗' : shake ? 'Senha errada, tenta de novo' : 'Digita a senha'}
        </div>
      </div>
    </div>
  );
}
