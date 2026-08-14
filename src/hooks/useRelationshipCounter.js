import { useState, useEffect } from 'react';
import { START_DATE } from '../data/config';

function formatElapsed() {
  const diffMs = new Date() - START_DATE;
  if (diffMs < 0) return { text: 'Ainda não começou 💕', time: '' };

  const totalSeconds = Math.floor(diffMs / 1000);
  const totalMinutes = Math.floor(totalSeconds / 60);
  const totalHours = Math.floor(totalMinutes / 60);
  const totalDays = Math.floor(totalHours / 24);

  const seconds = totalSeconds % 60;
  const minutes = totalMinutes % 60;
  const hours = totalHours % 24;

  let remaining = totalDays;
  let years = Math.floor(remaining / 365);
  remaining -= years * 365;
  let months = Math.floor(remaining / 30);
  remaining -= months * 30;
  const days = remaining;

  let text = '';
  if (years > 0) text += years + ' ano' + (years > 1 ? 's' : '') + ', ';
  if (months > 0 || years > 0) text += months + ' mê' + (months !== 1 ? 'ses' : 's') + ', ';
  text += days + ' dia' + (days !== 1 ? 's' : '');

  const time =
    String(hours).padStart(2, '0') + ':' +
    String(minutes).padStart(2, '0') + ':' +
    String(seconds).padStart(2, '0');

  return { text, time };
}

export function useRelationshipCounter() {
  const [elapsed, setElapsed] = useState(formatElapsed);

  useEffect(() => {
    const id = setInterval(() => setElapsed(formatElapsed()), 1000);
    return () => clearInterval(id);
  }, []);

  return elapsed;
}
