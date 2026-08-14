import { useState, useEffect } from 'react';

export default function EasterEgg({ visible }) {
  const [show, setShow] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    if (visible) {
      const t = setTimeout(() => setShow(true), 300);
      return () => clearTimeout(t);
    }
    setShow(false);
  }, [visible]);

  useEffect(() => {
    if (modalOpen) {
      const t = setTimeout(() => setModalVisible(true), 10);
      return () => clearTimeout(t);
    }
    setModalVisible(false);
  }, [modalOpen]);

  if (!visible && !modalOpen) return null;

  return (
    <>
      {visible && (
        <div
          id="easterEggBtn"
          className={show ? 'visible' : ''}
          title="Clica aqui..."
          onClick={() => setModalOpen(true)}
        >
          🤍
        </div>
      )}
      {modalOpen && (
        <div id="easterEggModal" className={modalVisible ? 'show' : ''}>
          <div className="easter-egg-content">
            <div className="easter-egg-hearts">💖</div>
            <p className="easter-egg-msg">
              Achou ne <br /><br />
              Saiba que eu penso em você o tempo todo, tipo todo mesmo<br />
              Tudo nesse site é so pra demonstrar um pouco do meu amor o nosso quantinho<br /><br />
              Eu Te amo, My beyhive 💕
            </p>
            <button className="easter-egg-close" onClick={() => setModalOpen(false)}>Fechar ✕</button>
          </div>
        </div>
      )}
    </>
  );
}
