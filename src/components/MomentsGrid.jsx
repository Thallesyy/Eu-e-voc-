const TILES = [
  { key: 'dates', cover: '/album_dates_cover.jpg', label: 'Fotos suas' },
  { key: 'random', cover: '/album_random_cover.jpg', label: 'Fotos aleatórias' },
  { key: 'us', cover: '/album_us_cover.jpg', label: 'Nossas fotos' },
];

export default function MomentsGrid({ onOpenAlbum }) {
  return (
    <section className="section">
      <div className="section-card">
        <div className="section-header">Nossos momentos</div>
        <div className="grid">
          {TILES.map((tile) => (
            <div key={tile.key} className="tile" onClick={() => onOpenAlbum(tile.key)}>
              <img src={tile.cover} alt={tile.label} loading="lazy" />
              <div className="tile-label">{tile.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
