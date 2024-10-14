import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min'; // Importamos los scripts de Bootstrap
import 'animate.css';

export const Inicio = () => {
  useEffect(() => {
    // Inicializar manualmente el carrusel de Bootstrap
    const carouselElement = document.querySelector('#carouselExampleSlidesOnly');
    if (carouselElement) {
      const bootstrap = require('bootstrap'); // Importar Bootstrap solo para JS
      new bootstrap.Carousel(carouselElement, {
        interval: 2500,
        ride: 'carousel',
      });
    }
  }, []);

  return (
    <div className='animate__animated animate__fadeIn'>
      <div id="carouselExampleSlidesOnly" className="carousel slide" data-bs-ride="carousel">
        <div className="carousel-inner">
          <div className="carousel-item active">
            <img src="/image/golden-horses-gana-exito-alimento.webp" className="d-none d-md-block w-100" alt="Desktop" />
            <img src="/image/golden-horses-gana-exito-alimento-mobile.webp" className="d-block d-md-none w-100" alt="Mobile" />
          </div>
          <div className="carousel-item">
            <img src="/image/golden-horses-nutricion-animal-equinos-pc.webp" className="d-none d-md-block w-100" alt="Desktop" />
            <img src="image/golden-horses-nutricion-animal-equinos.webp" className="d-block d-md-none w-100" alt="Mobile" />
          </div>
          <div className="carousel-item">
            <img src="image/golden-horses-trazabilidad-alimentos.webp" className="d-none d-md-block w-100" alt="Desktop" />
            <img src="image/golden-horses-trazabilidad-alimentos-mobile.webp" className="d-block d-md-none w-100" alt="Mobile" />
          </div>
        </div>
      </div>

      <div className="main">
        <div className="container pt-5 mt-4 mb-5">
          <div className="row bg-black">
            <div className="col-md-4 bg-black text-center">
              <Link to="/conocenos" className="text-decoration-none text-custom">
                <div className="image-container">
                  <img src="/image/boton quienes somos-14.png" alt="Botón 1" className="img-fluid" width="400" />
                </div>
              </Link>
            </div>
            <div className="col-md-4 bg-black text-center">
              <Link to="/beneficios" className="text-decoration-none text-custom">
                <div className="image-container">
                  <img src="/image/botones iconos-15.png" alt="Botón 2" className="img-fluid" width="400" />
                </div>
              </Link>
            </div>
            <div className="col-md-4 bg-black text-center">
              <Link to="/infoNutricional" className="text-decoration-none text-custom">
                <div className="image-container">
                  <img src="/image/botones iconos-16.png" alt="Botón 3" className="img-fluid" width="400" />
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
