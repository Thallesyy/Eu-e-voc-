// Banner reutilizável de foto + texto. Pra criar mais um, basta usar
// <PhotoBanner /> de novo em App.jsx com props diferentes.
export default function PhotoBanner({ header, photo, alt, name, hint, children }) {
  return (
    <section className="section">
      <div className="section-card about-card">
        <div className="section-header">{header}</div>
        <div className="section-body about-body">
          <img className="about-photo" src={photo} alt={alt} loading="lazy" />
          <div className="names">{name}</div>
          <div className="hint">{hint}</div>
          {children}
        </div>
      </div>
    </section>
  );
}
