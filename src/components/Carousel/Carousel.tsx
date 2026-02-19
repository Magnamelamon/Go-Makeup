import { useState } from 'react';
import './Carousel.css';

interface Slide {
  imagen: string;
  titulo: string;
  subtitulo: string;
  botonTexto: string;
  link: string;
}

interface CarouselProps {
  slides: Slide[];
  autoSlide?: boolean;
  intervalo?: number;
}

const Carousel = ({ slides, autoSlide = true, intervalo = 5000 }: CarouselProps) => {
  const [actual, setActual] = useState(0);

  const siguiente = () => {
    setActual((actual + 1) % slides.length);
  };

  const anterior = () => {
    setActual((actual - 1 + slides.length) % slides.length);
  };

  return (
    <div className="carousel">
      <div 
        className="carousel-track"
        style={{ transform: `translateX(-${actual * 100}%)` }}
      >
        {slides.map((slide, index) => (
          <div key={index} className="carousel-slide">
            <div className="carousel-content">
              <span className="carousel-subtitulo">{slide.subtitulo}</span>
              <h2 className="carousel-titulo">{slide.titulo}</h2>
              <a href={slide.link} className="btn-primary carousel-boton">
                {slide.botonTexto}
              </a>
            </div>
            <div className="carousel-imagen">
              <img src={slide.imagen} alt={slide.titulo} />
            </div>
          </div>
        ))}
      </div>

      <button className="carousel-btn carousel-btn-left" onClick={anterior}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polyline points="15 18 9 12 15 6"></polyline>
        </svg>
      </button>
      <button className="carousel-btn carousel-btn-right" onClick={siguiente}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polyline points="9 18 15 12 9 6"></polyline>
        </svg>
      </button>

      <div className="carousel-dots">
        {slides.map((_, index) => (
          <button
            key={index}
            className={`carousel-dot ${index === actual ? 'active' : ''}`}
            onClick={() => setActual(index)}
          />
        ))}
      </div>
    </div>
  );
};

export default Carousel;
