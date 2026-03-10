import './QuienesSomos.css';

const QuienesSomos = () => {
  return (
    <div className="quienes-somos">
      <div className="quienes-somos-hero">
        <div className="container">
          <h1>Quiénes Somos</h1>
          <p>Tu destino número uno para descubrir belleza y estilo.</p>
        </div>
      </div>
      <div className="quienes-somos-content container">
        <section className="historia">
          <h2>Nuestra Historia</h2>
          <p>
            Go Makeup nació de la pasión por la belleza y la autoexpresión. 
            Creemos que el maquillaje no sirve para ocultar, sino para resaltar
            la belleza única que cada uno lleva dentro. Desde nuestros inicios, nos hemos
            dedicado a buscar y ofrecer los mejores productos del mercado, siempre a la vanguardia de las tendencias.
          </p>
        </section>
        
        <section className="mision-vision">
          <div className="card">
            <h3>Nuestra Misión</h3>
            <p>
              Proveer productos de maquillaje accesibles, de alta calidad y que 
              inspiren confianza. Queremos que cada persona que visite Go Makeup 
              encuentre exactamente lo que necesita para sentirse increíble todos los días.
            </p>
          </div>
          <div className="card">
            <h3>Nuestra Visión</h3>
            <p>
              Convertirnos en el puente principal entre los amantes del maquillaje
              y los mejores creadores de tendencias a nivel mundial, fomentando una comunidad
              inclusiva, creativa y vibrante.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
};

export default QuienesSomos;
