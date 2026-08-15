import { useState, useRef, useCallback, useEffect } from 'react';

import BalloonBoxGame from './components/BalloonBoxGame';
import PadlockKeypad from './components/PadlockKeypad';
import WelcomeRain from './components/WelcomeRain';
import AmbientAnimations from './components/AmbientAnimations';
import MusicPlayer from './components/MusicPlayer';
import Reveal from './components/Reveal';
import TogetherCounter from './components/TogetherCounter';
import Hero from './components/Hero';
import PhotoBanner from './components/PhotoBanner';
import SpecialTextBox from './components/SpecialTextBox';
import SpecialMessage from './components/SpecialMessage';
import Timeline from './components/Timeline';
import Reasons from './components/Reasons';
import MomentCounter from './components/MomentCounter';
import MessageCounter from './components/MessageCounter';
import MomentsGrid from './components/MomentsGrid';
import PhotoViewer from './components/PhotoViewer';

export default function App() {
  const [phase, setPhase] = useState('game'); // game -> padlock -> welcome -> app
  const [albumKey, setAlbumKey] = useState(null);
  const [easterEggVisible, setEasterEggVisible] = useState(false);
  const musicRef = useRef(null);

  const handleAllBalloonsPopped = useCallback(() => setPhase('padlock'), []);
  const handlePadlockCorrect = useCallback(() => setPhase('welcome'), []);
  const handleWelcomeDone = useCallback(() => {
    setPhase('app');
    musicRef.current?.startBgMusic();
  }, []);

  useEffect(() => {
    // Só registra o Service Worker na versão de produção (npm run build).
    // Em desenvolvimento (npm run dev) ele atrapalha o live-reload do Vite,
    // servindo versões antigas dos arquivos por cima das novas.
    if (import.meta.env.PROD && 'serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch(() => {});
    }
  }, []);

  // Previne double-tap zoom no mobile
  useEffect(() => {
    let lastTouchEnd = 0;
    function onTouchEnd(e) {
      const now = Date.now();
      if (now - lastTouchEnd <= 300) e.preventDefault();
      lastTouchEnd = now;
    }
    document.addEventListener('touchend', onTouchEnd, { passive: false });
    return () => document.removeEventListener('touchend', onTouchEnd);
  }, []);

  const appVisible = phase === 'app';

  return (
    <>
      {phase === 'game' && <BalloonBoxGame onAllPopped={handleAllBalloonsPopped} />}
      {phase === 'padlock' && <PadlockKeypad onCorrect={handlePadlockCorrect} />}
      {phase === 'welcome' && <WelcomeRain onDone={handleWelcomeDone} />}

      {appVisible && <AmbientAnimations />}
      {appVisible && <MusicPlayer ref={musicRef} />}

      <div className={`app ${appVisible ? 'show' : ''}`}>
        {appVisible && (
          <>
            <Reveal variant="scale">
              <TogetherCounter />
            </Reveal>

            <div className="topbar">
              <div className="topbar-title">
                Tudo para minha beyhive
                <span className="heart-beat">❤️</span>
              </div>
            </div>

            <Reveal variant="blur">
              <Hero />
            </Reveal>

            <Reveal variant="left">
              <PhotoBanner
                header="Sobre nós"
                photo="/sobre-nos.jpg"
                alt="Nossa foto"
                name="Thales e Nicolly vulgo T.N"
                hint="Acho incrivel que tu nem tá a tanto tempo na minha vida e eu já queria que fosse para sempre"
              >
                <SpecialTextBox />
              </PhotoBanner>
            </Reveal>

            <Reveal variant="right">
              <SpecialMessage
                header="Mais um recado pra você 💌"
                intro="Tem mais uma coisa que eu queria te falar"
                message="Escreva aqui o segundo recado — troque este texto pelo que você quiser declarar pra ela."
                showLabel="Mostrar recado"
                hideLabel="Esconder recado"
              />
            </Reveal>

            {/* Banner (foto + texto) — duplique este <Reveal><PhotoBanner>...</PhotoBanner></Reveal> pra criar mais banners */}
            <Reveal variant="left">
              <PhotoBanner
                header="Família"
                photo="/banner1.jpg"
                alt="Descrição da foto"
                name="para a nossa família"
                hint='Quando eu tirei essa foto a primeira coisa que eu pensei foi "eu quero que ela seja a mao dos meus filhos" e por isso, eu faço uma area dedicada a isso'
              />
            </Reveal>

            <Reveal variant="up">
              <SpecialMessage />
            </Reveal>

            <Reveal variant="scale">
              <MomentCounter />
            </Reveal>

            <Reveal variant="up">
              <Timeline />
            </Reveal>

            <Reveal variant="right">
              <Reasons />
            </Reveal>

            <Reveal variant="left">
              <MessageCounter />
            </Reveal>

            <Reveal variant="up">
              <MomentsGrid onOpenAlbum={setAlbumKey} />
            </Reveal>
          </>
        )}
      </div>

      {appVisible && albumKey && (
        <PhotoViewer
          albumKey={albumKey}
          onClose={() => setAlbumKey(null)}
          onEasterEgg={setEasterEggVisible}
          easterEggVisible={easterEggVisible}
        />
      )}
    </>
  );
}