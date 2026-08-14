// ===== CONFIGURAÇÕES GERAIS =====
// Troque aqui a senha, a data de início do relacionamento, etc.

export const CORRECT_PASSWORD = '20/05';
export const START_DATE = new Date('2026-05-20T00:00:00-03:00');

export const STORAGE_KEYS = {
  specialText: 'eu_e_voce_texto_especial',
  moments: 'eu_e_voce_momentos',
  messages: 'eu_e_voce_msgs_count',
};

// Se quiser sincronizar a caixa de texto especial online (opcional),
// preencha os dados do seu projeto Firebase aqui. Se deixar null,
// a caixa de texto salva só no aparelho da pessoa (localStorage).
export const FIREBASE_CONFIG = {
  apiKey: 'AIzaSyAqKx7g-kNBN3F3ziyIUFVhiMLdA5N3wp0',
  authDomain: 'nicolly-site2.firebaseapp.com',
  databaseURL: 'https://nicolly-site2-default-rtdb.firebaseio.com',
  projectId: 'nicolly-site2',
  storageBucket: 'nicolly-site2.firebasestorage.app',
  messagingSenderId: '676371407160',
  appId: '1:676371407160:web:b9b3cb379b66c1a61fe1cd',
};
