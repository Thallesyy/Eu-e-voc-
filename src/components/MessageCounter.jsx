import { useState, useRef } from 'react';
import { useLocalStorage, useAnimatedNumber } from '../hooks/useLocalStorage';
import { STORAGE_KEYS } from '../data/config';

// Cobre o formato Android ("24/03/2026, 21:04 - Nome: msg")
// e o formato iOS ("[24/03/2026, 21:04:10] Nome: msg")
const MSG_PATTERN = /^\[?\d{1,2}\/\d{1,2}\/\d{2,4},?\s\d{1,2}:\d{2}(:\d{2})?\s?(AM|PM)?\]?\s?-?\s?/i;

function countWhatsappMessages(text) {
  const lines = text.split(/\r?\n/);
  let count = 0;
  for (const line of lines) {
    if (MSG_PATTERN.test(line.trim())) count++;
  }
  return count;
}

export default function MessageCounter() {
  const [count, setCount] = useLocalStorage(STORAGE_KEYS.messages, 0);
  const [hint, setHint] = useState('');
  const inputRef = useRef(null);
  const displayCount = useAnimatedNumber(count, 600);

  function handleFile(e) {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.name.toLowerCase().endsWith('.txt')) {
      setHint('⚠️ Manda o arquivo .txt exportado do WhatsApp');
      return;
    }

    setHint('Lendo conversa...');
    const reader = new FileReader();
    reader.onload = (ev) => {
      const total = countWhatsappMessages(ev.target.result);
      setCount(total);
      setHint(total > 0 ? '✓ Conversa importada com sucesso' : '⚠️ Não encontrei mensagens nesse arquivo');
    };
    reader.onerror = () => setHint('⚠️ Erro ao ler o arquivo');
    reader.readAsText(file, 'utf-8');
  }

  return (
    <section className="section">
      <div className="section-card special">
        <div className="section-header">Mensagens trocadas 💬</div>
        <div className="section-body" style={{ textAlign: 'center' }}>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '12px', fontSize: '14px' }}>
            Bota o arquivo que eu te mandei aqui amorzinho💕
          </p>
          <div className="moment-counter-wrap">
            <div className="moment-count">{displayCount}</div>
            <div className="moment-label">mensagens trocadas</div>
          </div>
          <label className="moment-btn" style={{ cursor: 'pointer', display: 'inline-block' }}>
            📥 Importar conversa (.txt)
            <input
              ref={inputRef}
              type="file"
              accept=".txt"
              style={{ display: 'none' }}
              onChange={handleFile}
            />
          </label>
          <div className="moment-hint" style={{ opacity: hint ? 1 : 0 }}>{hint}</div>
        </div>
      </div>
    </section>
  );
}
