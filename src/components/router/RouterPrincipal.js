
import React from 'react'
import {Routes, Route, BrowserRouter, Navigate, NavLink, Link } from 'react-router-dom'
import { Inicio } from '../Inicio'
import { Conocenos } from '../Conocenos'
import { Beneficios } from '../Beneficios'
import { InfoNutricional } from '../InfoNutricional'

export const RouterPrincipal = () => {
  return (
 <BrowserRouter>
 <nav className="navbar navbar-dark bg-black" id="topPage">
      <div className="container-fluid d-flex justify-content-between align-items-center">
        <Link className="navbar-brand" to="/">
          <img src="/image/logo.webp" alt="Logo" />
        </Link>
        {/* <div className="d-flex img-countries">
          <div className="esp"><img src="/image/español.png" alt="Español" /></div>
          <div className="ing"><img src="/image/ingles.png" alt="Inglés" /></div>
        </div> */}
        <button className="navbar-toggler custom-toggler" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasDarkNavbar" aria-controls="offcanvasDarkNavbar" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="offcanvas bg-white offcanvas-end opacity-75 offcanvas-transparent-bg" tabIndex="-1" id="offcanvasDarkNavbar" aria-labelledby="offcanvasDarkNavbarLabel">
          <div className="offcanvas-header bg-white">
            <h5 className="offcanvas-title bg-white  text-warning-emphasis" id="offcanvasDarkNavbarLabel">Menu</h5>
            <button type="button" className="btn-close btn-close-black" data-bs-dismiss="offcanvas" aria-label="Close"></button>
          </div>
          <div className="offcanvas-body bg-white">
            <ul className="navbar-nav justify-content-end flex-grow-1 pe-3 bg-white">
              <li className="nav-item bg-white">
                <NavLink className="nav-link bg-white active text-warning-emphasis" aria-current="page" to="/">Inicio</NavLink>
              </li>
              <li className="nav-item bg-white">
                <NavLink className="nav-link bg-white text-warning-emphasis" to="/conocenos">Quiénes somos</NavLink>
              </li>
              <li className="nav-item bg-white">
                <NavLink className="nav-link bg-white text-warning-emphasis" to="/beneficios">Beneficios</NavLink>
              </li>
              <li className="nav-item bg-white">
                <NavLink className="nav-link bg-white text-warning-emphasis" to="/infoNutricional">Información Nutricional</NavLink>
              </li>
              <li className="nav-item bg-white">
                <NavLink className="nav-link bg-white text-warning-emphasis" to="#footer">Contacto</NavLink>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </nav>

 <section className='contenido-principal'>
      <Routes>
        <Route path="/" element={<Inicio />} />
        <Route path="/conocenos" element={<Conocenos />} />
        <Route path="/beneficios" element={<Beneficios />} />
        <Route path="/infoNutricional" element={<InfoNutricional />} />
        {/* Redireccionar a Inicio si la ruta no existe */}
        <Route path="*" element={<Navigate replace to="/" />} />
      </Routes>
      </section>
</BrowserRouter>

   
  )
}
