import React from 'react'
import { NavLink} from 'react-router-dom'
import { useState } from 'react';


export const HeaderNav = () => {
    const [isNavExpanded, setIsNavExpanded] = useState(false);

  const toggleNav = () => {
    setIsNavExpanded(!isNavExpanded);
  };

  const closeNav = () => {
    setIsNavExpanded(false);
  };
  return (
    <nav className="navbar navbar-dark bg-black" id="topPage">
      <div className="container-fluid d-flex justify-content-between align-items-center">
        <NavLink className="navbar-brand" to="/inicio">
          <img src="/image/logo.webp" alt="Logo" />
        </NavLink>
        {/* <div className="d-flex img-countries">
          <div className="esp"><img src="/image/español.png" alt="Español" /></div>
          <div className="ing"><img src="/image/ingles.png" alt="Inglés" /></div>
        </div> */}
        <button className="navbar-toggler custom-toggler" type="button" onClick={toggleNav} aria-label="Toggle navigation">
          <span className="navbar-toggler-icon bg-transparent"></span>
        </button>
        <div className={`offcanvas bg-white offcanvas-end opacity-75 offcanvas-transparent-bg ${isNavExpanded ? 'show' : ''}`} tabIndex="-1" id="offcanvasDarkNavbar" aria-labelledby="offcanvasDarkNavbarLabel">
          <div className="offcanvas-header bg-white">
            <h5 className="offcanvas-title bg-white  text-warning-emphasis" id="offcanvasDarkNavbarLabel">Menu</h5>
            <button type="button" className="btn-close btn-close-black" onClick={closeNav} aria-label="Close"></button>
          </div>
          <div className="offcanvas-body bg-white">
            <ul className="navbar-nav justify-content-end flex-grow-1 pe-3 bg-white">
              <li className="nav-item bg-white">
                <NavLink className="nav-link bg-white active text-warning-emphasis" aria-current="page" to="/" onClick={closeNav}>Inicio</NavLink>
              </li>
              <li className="nav-item bg-white">
                <NavLink className="nav-link bg-white text-warning-emphasis" to="/conocenos"  onClick={closeNav}>Quiénes somos</NavLink>
              </li>
              <li className="nav-item bg-white">
                <NavLink  className="nav-link bg-white text-warning-emphasis" to="/beneficios"  onClick={closeNav}>Beneficios</NavLink>
              </li>
              <li className="nav-item bg-white">
                <NavLink  className="nav-link bg-white text-warning-emphasis" to="/infoNutricional"  onClick={closeNav}>Información Nutricional</NavLink>
              </li>
              <li className="nav-item bg-white">
                <NavLink  className="nav-link bg-white text-warning-emphasis" to="#footer"  onClick={closeNav}>Contacto</NavLink>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </nav>

  )
}
