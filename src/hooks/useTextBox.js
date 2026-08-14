import { useState, useEffect, useRef, useCallback } from 'react';
import { FIREBASE_CONFIG } from '../data/config';

// Caixa de texto: salva localmente sempre, e sincroniza com Firebase se ele
// carregar. Se o Firebase falhar (bloqueador, sem internet, etc.), o resto do
// site nunca é afetado — o import é feito de forma assíncrona/opcional.
//
// storageKey: chave usada no localStorage deste navegador.
// firebasePath: caminho usado no Firebase Realtime Database (opcional, mas
// precisa ser único por caixa pra elas não se sobrescreverem).
export function useTextBox(storageKey, firebasePath) {
  const [text, setText] = useState(() => {
    try {
      return localStorage.getItem(storageKey) || '';
    } catch {
      return '';
    }
  });
  const [status, setStatus] = useState('idle'); // idle | saving | saved | local-only
  const fbSaveRef = useRef(null);
  const saveTimeoutRef = useRef(null);
  const loadedFromRemoteRef = useRef(false);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      if (!FIREBASE_CONFIG) return;
      try {
        const { initializeApp } = await import('https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js');
        const { getDatabase, ref, set, onValue } = await import('https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js');
        if (cancelled) return;

        const app = initializeApp(FIREBASE_CONFIG);
        const db = getDatabase(app);
        const textRef = ref(db, firebasePath);

        onValue(textRef, (snapshot) => {
          const valor = snapshot.val();
          if (valor !== null && !loadedFromRemoteRef.current) {
            loadedFromRemoteRef.current = true;
            setText((current) => (current === '' ? valor : current));
          }
        });

        fbSaveRef.current = (value) => set(textRef, value);
      } catch (err) {
        console.warn(`[Firebase] não carregou (${firebasePath}), a caixa vai salvar só neste aparelho:`, err);
      }
    })();

    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [firebasePath]);

  const updateText = useCallback((value) => {
    setText(value);
    setStatus('saving');
    clearTimeout(saveTimeoutRef.current);
    saveTimeoutRef.current = setTimeout(() => {
      try { localStorage.setItem(storageKey, value); } catch {}

      if (fbSaveRef.current) {
        fbSaveRef.current(value)
          .then(() => { setStatus('saved'); setTimeout(() => setStatus('idle'), 1500); })
          .catch(() => setStatus('local-only'));
      } else {
        setStatus('saved');
        setTimeout(() => setStatus('idle'), 1500);
      }
    }, 800);
  }, [storageKey]);

  return { text, updateText, status };
}
