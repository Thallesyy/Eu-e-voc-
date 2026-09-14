import { useEffect, useMemo, useState } from 'react';
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { places } from '../data/places';

const pinIcon = L.divIcon({
  className: 'place-pin',
  html: '<span class="place-pin-inner">💗</span>',
  iconSize: [36, 36],
  iconAnchor: [18, 34],
});

function FitToPlaces({ points }) {
  const map = useMap();

  useEffect(() => {
    if (points.length === 1) {
      map.setView(points[0], 13);
    } else if (points.length > 1) {
      map.fitBounds(points, { padding: [36, 36] });
    }
  }, [map, points]);

  return null;
}

export default function PlacesMap() {
  const [active, setActive] = useState(null);
  const points = useMemo(() => places.map((p) => [p.lat, p.lng]), []);
  const center = points[0] ?? [-29.8197, -51.1609]; // Sapucaia do Sul, RS

  if (!places.length) return null;

  return (
    <section className="section">
      <div className="section-card">
        <div className="section-header">Nosso mapa de memórias 🗺️</div>
        <div className="section-body">Cada lugar onde a gente já esteve junto, com uma lembrança guardada nele. Toca num coraçãozinho pra ver.</div>

        <div className="places-map-wrap">
          <MapContainer
            center={center}
            zoom={12}
            scrollWheelZoom={false}
            className="places-map"
          >
            <TileLayer
              url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            />
            <FitToPlaces points={points} />
            {places.map((p) => (
              <Marker
                key={p.id}
                position={[p.lat, p.lng]}
                icon={pinIcon}
                eventHandlers={{ click: () => setActive(p) }}
              />
            ))}
          </MapContainer>
        </div>

        <div className={`place-memory-card ${active ? 'open' : ''}`}>
          {active && (
            <>
              <button className="place-memory-close" onClick={() => setActive(null)} aria-label="Fechar">✕</button>
              {active.date && <div className="place-memory-date">{active.date}</div>}
              <div className="place-memory-title">{active.title}</div>
              {active.photos?.length > 0 && (
                <div className="place-memory-photos">
                  {active.photos.map((src) => (
                    <img
                      key={src}
                      src={src}
                      alt={active.title}
                      className="place-memory-photo"
                      onError={(e) => { e.currentTarget.style.display = 'none'; }}
                    />
                  ))}
                </div>
              )}
              <p className="place-memory-text">{active.memory}</p>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
