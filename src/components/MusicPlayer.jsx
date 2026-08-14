import { useRef, useState, useEffect, useCallback, forwardRef, useImperativeHandle } from 'react';
import { tracks } from '../data/tracks';

const MIN_HEIGHT = 125;

function formatTime(s) {
  if (!isFinite(s)) return '0:00';
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60).toString().padStart(2, '0');
  return `${m}:${sec}`;
}

const MusicPlayer = forwardRef(function MusicPlayer(_props, ref) {
  const audioRef = useRef(null);
  const sheetRef = useRef(null);
  const progressBarRef = useRef(null);

  const [trackIndex, setTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [curTime, setCurTime] = useState('0:00');
  const [durTime, setDurTime] = useState('0:00');
  const [sheetHeight, setSheetHeight] = useState(MIN_HEIGHT);
  const [dragging, setDragging] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [controlVisible, setControlVisible] = useState(false);
  const [volume, setVolume] = useState(15);
  const [bgStarted, setBgStarted] = useState(false);

  const dragStartY = useRef(0);
  const track = tracks[trackIndex];

  const maxHeight = () => (typeof window !== 'undefined' ? window.innerHeight * 0.7 : 500);

  const play = useCallback(async (startAt) => {
    const audio = audioRef.current;
    if (!audio) return;
    try {
      if (audio.currentTime < 1 && startAt) audio.currentTime = startAt;
      await audio.play();
      setIsPlaying(true);
    } catch (e) {
      // autoplay bloqueado ou outro erro — ignora silenciosamente
    }
  }, []);

  const loadTrack = useCallback((index) => {
    setTrackIndex(index);
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    if (audio) audio.volume = volume / 100;
  }, [volume]);

  // Expõe startBgMusic() pro componente pai (App) chamar via ref,
  // sem precisar de variável global no window.
  useImperativeHandle(ref, () => ({
    startBgMusic() {
      setBgStarted((already) => {
        if (already) return already;
        setControlVisible(true);
        play(track.startAt);
        return true;
      });
    },
  }), [play, track.startAt]);

  function togglePlay() {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) {
      play(track.startAt);
    } else {
      audio.pause();
      setIsPlaying(false);
    }
  }

  function toggleBgMusic() {
    if (!bgStarted) {
      setBgStarted(true);
      setControlVisible(true);
      play(track.startAt);
      return;
    }
    togglePlay();
  }

  function onEnded() {
    const next = (trackIndex + 1) % tracks.length;
    loadTrack(next);
  }

  useEffect(() => {
    // ao trocar de faixa, toca automaticamente se já estava tocando
    if (isPlaying) play(tracks[trackIndex].startAt);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trackIndex]);

  function updateProgress() {
    const audio = audioRef.current;
    if (audio && audio.duration) {
      setProgress((audio.currentTime / audio.duration) * 100);
      setCurTime(formatTime(audio.currentTime));
      setDurTime(formatTime(audio.duration));
    }
  }

  function seek(e) {
    const audio = audioRef.current;
    const rect = progressBarRef.current.getBoundingClientRect();
    if (audio && audio.duration) {
      audio.currentTime = ((e.clientX - rect.left) / rect.width) * audio.duration;
    }
  }

  function setHeightClamped(h) {
    setSheetHeight(Math.max(MIN_HEIGHT, Math.min(maxHeight(), h)));
  }

  function onHandleDown(e) {
    setDragging(true);
    dragStartY.current = e.touches ? e.touches[0].clientY : e.clientY;
  }

  function onHandleMove(e) {
    if (!dragging) return;
    const y = e.touches ? e.touches[0].clientY : e.clientY;
    const delta = dragStartY.current - y;
    setHeightClamped(sheetHeight + delta);
    dragStartY.current = y;
  }

  function onHandleUp() {
    if (!dragging) return;
    setDragging(false);
    const mid = (MIN_HEIGHT + maxHeight()) / 2;
    if (sheetHeight > mid) {
      setSheetHeight(maxHeight());
      setExpanded(true);
    } else {
      setSheetHeight(MIN_HEIGHT);
      setExpanded(false);
    }
  }

  useEffect(() => {
    window.addEventListener('mousemove', onHandleMove);
    window.addEventListener('mouseup', onHandleUp);
    return () => {
      window.removeEventListener('mousemove', onHandleMove);
      window.removeEventListener('mouseup', onHandleUp);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  });

  useEffect(() => {
    function onVisibility() {
      if (document.hidden && audioRef.current && !audioRef.current.paused) {
        audioRef.current.pause();
        setIsPlaying(false);
      }
    }
    document.addEventListener('visibilitychange', onVisibility);
    return () => document.removeEventListener('visibilitychange', onVisibility);
  }, []);

  function volumeLabel() {
    if (!bgStarted) return 'Música';
    if (volume == 0) return 'Mudo';
    if (!isPlaying) return 'Pausado';
    if (volume < 30) return 'Baixo';
    if (volume < 70) return 'Médio';
    return 'Alto';
  }

  return (
    <>
      <div className={`bg-music-control ${controlVisible ? 'show' : ''}`}>
        <button
          className={`bg-music-btn ${isPlaying ? 'playing' : ''}`}
          onClick={toggleBgMusic}
          title="Play/Pause música de fundo"
        >
          {bgStarted && isPlaying ? '⏸' : '🎵'}
        </button>
        <input
          type="range"
          className="volume-slider"
          min="0"
          max="100"
          value={volume}
          onChange={(e) => setVolume(Number(e.target.value))}
        />
        <span className="bg-music-label">{volumeLabel()}</span>
      </div>

      <div
        className={`sheet ${expanded ? 'expanded' : ''}`}
        style={{ height: `${sheetHeight}px`, transition: dragging ? 'none' : 'height 0.3s ease' }}
        ref={sheetRef}
      >
        <div
          className="sheet-handle"
          onMouseDown={onHandleDown}
          onTouchStart={onHandleDown}
          onTouchMove={onHandleMove}
          onTouchEnd={onHandleUp}
        >
          <div className="handle-bar" />
        </div>
        <div className="sheet-content">
          <div className="song-row">
            <img className="song-cover" src={track.cover} alt="Capa" />
            <div className="song-meta">
              <p className="song-title">{track.title}</p>
              <p className="song-artist">{track.artist}</p>
            </div>
            <button className="play-btn" onClick={togglePlay}>{isPlaying ? '⏸' : '▶'}</button>
          </div>
          <div className="progress" ref={progressBarRef} onClick={seek}>
            <div style={{ width: `${progress}%` }} />
          </div>
          <div className="time-row">
            <span>{curTime}</span>
            <span>{durTime}</span>
          </div>
          <div className="playlist">
            {tracks.map((t, i) => (
              <div
                key={t.file}
                className="track"
                onClick={() => { loadTrack(i); play(t.startAt); }}
              >
                <img src={t.cover} alt="capa" />
                <div className="tmeta">
                  <p className="tname">{t.title}</p>
                  <p className="tartist">{t.artist}</p>
                </div>
                <button className="badge">{i === trackIndex ? '...' : 'Play'}</button>
              </div>
            ))}
          </div>
        </div>
      </div>

      <audio
        ref={audioRef}
        src={track.file}
        preload="metadata"
        onTimeUpdate={updateProgress}
        onLoadedMetadata={updateProgress}
        onEnded={onEnded}
      />
    </>
  );
});

export default MusicPlayer;
