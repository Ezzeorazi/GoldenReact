import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMap, faEnvelope } from '@fortawesome/free-solid-svg-icons';
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons';


export const Footer = () => {
  return (
    <footer className="container" id="footer">
      <section className="bg-black pt-3">
        <div className="container">
          <div className="row">
            <div className="col-md-8">
              <div className="login-box bg-black rounded">
                <h3 className="mb-4 pt-5 semibold">CONTACTANOS</h3>
                <form action="https://formsubmit.co/1d57691f4369fd9d543ddb9cb2604cd9" method="POST">
                  <div className="mb-3 form-group">
                    <input
                      type="text"
                      autoComplete="off"
                      name="name"
                      className="form-control border-0 border-bottom rounded-0 text-custom bg-black"
                      placeholder="Nombre"
                      style={{ color: '#A68B67' }}
                      required
                    />
                  </div>
                  <div className="mb-3 form-group">
                    <input
                      type="email"
                      name="email"
                      autoComplete="off"
                      className="form-control border-0 border-bottom rounded-0 text-custom bg-black"
                      placeholder="Email"
                      style={{ color: '#A68B67' }}
                      required
                    />
                  </div>
                  <div className="mb-3 form-group">
                    <textarea
                      className="form-control border-0 border-bottom rounded-0 text-custom bg-black"
                      autoComplete="off"
                      name="mensaje"
                      rows="3"
                      placeholder="Mensaje"
                      style={{ color: '#A68B67' }}
                    ></textarea>
                  </div>
                  <button
                    type="submit"
                    className="btn btn-block mt-2 mb-3 regular"
                    style={{
                      backgroundColor: '#A68B67',
                      color: 'black',
                      fontFamily: "'Open Sans Condensed', sans-serif",
                      fontWeight: '400',
                    }}
                  >
                    Enviar
                  </button>
                </form>
              </div>
            </div>
            <div className="col-md-4 mt-4 mt-md-0">
              <h3 className="mb-4 pt-5 semibold">DÓNDE ESTAMOS</h3>
              <ul className="list-unstyled">
                <li className="mb-3">
                <FontAwesomeIcon icon={faWhatsapp} className='text-custom-where me-1'/>
                  <a
                    className="text-decoration-none text-custom-where"
                    href="https://wa.me/5493471621535"
                  >
                    +54 9 3471 621535
                  </a>
                </li>
                <li className="mb-3">
                <FontAwesomeIcon icon={faMap} className='text-custom-where me-1'/>
                  <a
                    className="text-decoration-none text-custom-where"
                    href="mailto:somosgoldenhorses@gmail.com"
                  >
                    somosgoldenhorses@gmail.com
                  </a>
                </li>
                <li className="mb-3">
                  <p className="mb-1 text-custom-where">Agropecuaria Los Nonos S.R.L</p>
                  <FontAwesomeIcon icon={faEnvelope} className='text-custom-where me-1'/>
                  <a
                    className="text-decoration-none text-custom-where"
                    href="https://www.google.com/maps/search/Flotron%201923%20Armstrong%20Santa%20Fe%20Argentina"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Flotron 1923 Armstrong-Santa Fe-Argentina
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
      <div className="container">
        <div className="row align-items-center mt-4 container__footer-img">
          <div className="col-md-1 text-center reciclaje">
            <img src="/image/Reciclaje.png" alt="Foto 1" />
          </div>
          <div className="col-md-1 mt-3 text-center senasa">
            <img src="/image/Senasa_Logo.png" alt="Foto 2" />
          </div>
          {/* Estos divs están vacíos en tu código original, se podrían eliminar si no son necesarios */}
          <div className="col-md-2 text-center"></div>
          <div className="col-md-3 text-center"></div>
          <div className="col-md-5 mt-3 text-end">
            <div className="footer bg-black small text-center text-white-50">
              <div className="container px-4 px-lg-5">
              &copy; {new Date().getFullYear()} Golden Horses - Todos los derechos reservados - 
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};


