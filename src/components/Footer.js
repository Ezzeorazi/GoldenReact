import React from 'react';


export const Footer = () => {
  return (
    <footer className="container" id="footer">
      <section className="bg-black pt-3">
        <div className="container">
          <div className="row">
            <div className="col-md-8">
              <div className="login-box bg-black rounded">
                <h3 className="mb-4 pt-5 semibold">CONTACTANOS</h3>
                <form action="" method="">
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
                  <i className="fab fa-whatsapp text-custom-where"></i>
                  <a
                    className="text-decoration-none text-custom-where"
                    href="https://wa.me/11111111111"
                  >
                    +54 9 1111 111111
                  </a>
                </li>
                <li className="mb-3">
                  <i className="fas fa-envelope text-custom-where"></i>
                  <a
                    className="text-decoration-none text-custom-where"
                    href="mailto:contacto@TuEmpresa.com.ar"
                  >
                    contacto@TuEmpresa.com.ar
                  </a>
                </li>
                <li className="mb-3">
                  <p className="mb-1 text-custom-where">Su empresa S.R.L</p>
                  <i className="fa-regular fa-map text-custom-where"></i>
                  <a
                    className="text-decoration-none text-custom-where"
                    href="http://maps.google.com/?q=Su direccion Rosario-Santa Fe-Argentina"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Su direccion Rosario-Santa Fe-Argentina
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
                &copy; Pixel Maker - Todos los derechos reservados
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};


