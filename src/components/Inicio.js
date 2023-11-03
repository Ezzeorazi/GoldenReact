import React from 'react';
import { Link } from 'react-router-dom';


export const Inicio = () => {
  return (
    <div className='animate__animated animate__backInRight'>
      <div id="carouselExampleSlidesOnly" className="carousel slide " data-bs-ride="carousel">
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
  )
}